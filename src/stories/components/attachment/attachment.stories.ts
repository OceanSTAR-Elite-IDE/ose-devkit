import { Observable } from 'rxjs';

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  NcAttachment,
  NcAttachmentModule,
  NcAttachmentRef,
  NtAttachmentError
} from '@oceanstar/components/attachment';
import {
  NcFileSizeError,
  NcFileTypeError,
  NcUploadError,
  NcUploadEvent,
  NcUploadHandler,
  NcUploadResponse,
  NcUploadStatus
} from '@oceanstar/components/core';
import { NcFormsModule } from '@oceanstar/components/forms';
import { applicationConfig, moduleMetadata } from '@storybook/angular';

import type { Meta, StoryObj } from '@storybook/angular';
type AttachmentValue = Array<{
  name: string;
  size: number;
  link?: string;
  error?: string;
}>;

const toErrorMessages = (errors: NtAttachmentError | NtAttachmentError[]) => {
  const list = Array.isArray(errors) ? errors : [errors];
  return list.map(error => {
    if (error instanceof NcFileSizeError) {
      const limit = error.limitSizeString ?? `${error.limitSize}MB`;
      return `文件不能超过 ${limit}`;
    }
    if (error instanceof NcFileTypeError) {
      return `不支持的文件类型：${error.type || error.file.type || '未知'}`;
    }
    if (error instanceof NcUploadError) {
      return `上传失败：${error.error}`;
    }
    return '发生未知错误';
  });
};

@Injectable()
class StoryAttachmentUploadHandler extends NcUploadHandler<{ url: string }, string> {
  constructor() {
    super({} as HttpClient);
  }

  override upload(url: string, uploadRef: NcAttachmentRef<{ url: string }>) {
    uploadRef.status = NcUploadStatus.BEGIN;
    uploadRef.progress = 0;

    return new Observable<NcUploadEvent<{ url: string }, string>>(subscriber => {
      const timers = [
        setTimeout(() => {
          uploadRef.status = NcUploadStatus.SENDING;
          uploadRef.progress = 25;
        }, 1500),
        setTimeout(() => {
          uploadRef.progress = 65;
        }, 3500),
        setTimeout(() => {
          uploadRef.progress = 100;
          uploadRef.status = NcUploadStatus.UPLOADED;
          uploadRef.link = `/uploads/${encodeURIComponent(uploadRef.name)}`;
          subscriber.next(new NcUploadResponse<{ url: string }>({ url: uploadRef.link }));
          subscriber.complete();
        }, 7000),
      ];

      return () => timers.forEach(timer => clearTimeout(timer));
    });
  }

  override getRequestData(file: File | Blob | null) {
    return file;
  }

  override getResponseData(body: any) {
    return body;
  }

  override getErrorMessage(error: any) {
    return error?.message ?? '上传失败';
  }
}

const meta: Meta<NcAttachment<any>> = {
  title: 'Components/Attachment',
  component: NcAttachment,
  decorators: [
    moduleMetadata({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NcAttachmentModule,
        NcFormsModule,
      ],
      providers: [{ provide: NcUploadHandler, useClass: StoryAttachmentUploadHandler }],
    }),
    applicationConfig({
      providers: [provideAnimations()],
    }),
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '用于在表单中上传文件的控件，支持多文件、文件类型与大小限制、自定义图标以及上传状态反馈。',
      },
    },
  },
  argTypes: {
    url: { description: '上传接口地址' },
    name: { description: '上传字段名' },
    accept: {
      control: 'text',
      description: '允许的文件类型列表，格式与 `<input type="file">` 一致',
    },
    multiple: {
      control: 'boolean',
      description: '是否支持多文件上传',
    },
    limitSize: {
      control: 'number',
      description: '单个文件大小限制（单位：MB）',
    },
    disabled: { control: 'boolean', description: '禁用选择与删除操作' },
    readonly: { control: 'boolean', description: '只读模式，只展示已上传文件' },
    notrigger: { control: 'boolean', description: '隐藏选择文件的触发器' },
  },
};

export default meta;

type Story = StoryObj<NcAttachment<any>>;

export const Playground: Story = {
  render: () => {
    const control = new FormControl<AttachmentValue>(
      [
        {
          name: '设计规范.pdf',
          size: 214532,
          link: '#',
        },
        {
          name: '需求文档.docx',
          size: 153824,
          link: '#',
        },
      ],
      {
        validators: [Validators.required, Validators.maxLength(3)],
        nonNullable: true,
      },
    );

    return {
      props: {
        control,
        status: 'normal',
        alerts: [] as string[],
        handleErrors(error: NtAttachmentError | NtAttachmentError[]) {
          // this.alerts = toErrorMessages(error);
          // setTimeout(() => (this.alerts = []), 3200);
        },
      },
      template: `
        <div class="space-y-4">
          <label class="flex items-center gap-2 text-sm text-slate-600">
            状态
            <select class="rounded-md border border-slate-300 bg-white px-3 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    [(ngModel)]="status">
              <option value="normal">正常</option>
              <option value="disabled">禁用</option>
              <option value="readonly">只读</option>
              <option value="notrigger">仅展示列表</option>
            </select>
          </label>

          <nc-form-field
            label="附件"
            [messages]="{ required: '请至少上传一个文件', maxlength: '最多保留 3 个文件' }">
            <nc-attachment
              url="/storybook/uploads"
              name="file"
              [formControl]="control"
              [disabled]="status === 'disabled'"
              [readonly]="status === 'readonly'"
              [notrigger]="status === 'notrigger'"
              (errors)="handleErrors($event)">
              <span class="inline-flex items-center gap-2 text-blue-600">
                <i class="far fa-paperclip"></i>
                选择文件
              </span>
            </nc-attachment>
          </nc-form-field>

          <div *ngIf="alerts.length"
               class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            <div *ngFor="let message of alerts">{{ message }}</div>
          </div>
        </div>
      `,
    };
  },
  parameters: {
    docs: {
      description: {
        story:
          '基础示例，展示表单校验、状态切换（禁用、只读、隐藏按钮）以及上传反馈。上传动作在文档中使用模拟处理。',
      },
    },
  },
};

export const AcceptFilter: Story = {
  render: () => {
    const control = new FormControl<AttachmentValue>(
      [
        {
          name: 'team-avatar.png',
          size: 84512,
          link: '#',
        },
      ],
      {
        validators: [Validators.required, Validators.maxLength(2)],
        nonNullable: true,
      },
    );

    return {
      props: {
        control,
        accept: 'image/png, text/css',
        alerts: [] as string[],
        handleErrors(error: NtAttachmentError | NtAttachmentError[]) {
          // this.alerts = toErrorMessages(error);
          // setTimeout(() => (this.alerts = []), 3200);
        },
      },
      template: `
        <div class="space-y-4">
          <nc-form-field
            label="仅允许 PNG 或 CSS 文件"
            [messages]="{ required: '请上传至少一个文件', maxlength: '最多保留 2 个文件' }">
            <nc-attachment
              url="/storybook/uploads"
              name="asset"
              [formControl]="control"
              [accept]="accept"
              (errors)="handleErrors($event)">
              <span class="inline-flex items-center gap-2 text-blue-600">
                <i class="far fa-paperclip"></i>
                选择文件
              </span>
            </nc-attachment>
          </nc-form-field>

          <div *ngIf="alerts.length"
               class="rounded-md border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-amber-700">
            <div *ngFor="let message of alerts">{{ message }}</div>
          </div>
        </div>
      `,
    };
  },
  parameters: {
    docs: {
      description: {
        story:
          '通过 `accept` 属性限制文件类型，组件会在选择不符合要求的文件时触发错误事件以提供提示。',
      },
    },
  },
};

export const LimitSize: Story = {
  render: () => {
    const control = new FormControl<AttachmentValue>(
      [
        {
          name: '产品方案.pptx',
          size: 512000,
          link: '#',
        },
      ],
      { nonNullable: true },
    );

    return {
      props: {
        control,
        limitSize: 0.5,
        alerts: [] as string[],
        handleErrors(error: NtAttachmentError | NtAttachmentError[]) {
          // this.alerts = toErrorMessages(error);
          // setTimeout(() => (this.alerts = []), 3200);
        },
      },
      template: `
        <div class="space-y-4">
          <nc-form-field label="限制 0.5 MB">
            <nc-attachment
              url="/storybook/uploads"
              name="file"
              [formControl]="control"
              [limitSize]="limitSize"
              (errors)="handleErrors($event)">
              <span class="inline-flex items-center gap-2 text-blue-600">
                <i class="far fa-paperclip"></i>
                选择文件
              </span>
            </nc-attachment>
          </nc-form-field>

          <div class="text-xs text-slate-500">
            上传大于 {{ limitSize }} MB 的文件会触发错误事件，并在列表中以红色状态展示。
          </div>

          <div *ngIf="alerts.length"
               class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            <div *ngFor="let message of alerts">{{ message }}</div>
          </div>
        </div>
      `,
    };
  },
  parameters: {
    docs: {
      description: {
        story:
          '设置 `limitSize` 后，超出大小的文件会被拦截并返回错误信息，可结合事件提示用户。',
      },
    },
  },
};
