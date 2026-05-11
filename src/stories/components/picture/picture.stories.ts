import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs';

import { withModalService } from '@oceanstar/components/modal';
import { NcPicture, NcPictureModule, NcPictureRef } from '@oceanstar/components/picture';
import { NcButtonModule } from '@oceanstar/components/button';
import {
  NcUploadHandler,
  NcUploadResponse,
  NcUploadStatus,
  NcUploadRef,
  NcUploadEvent,
} from '@oceanstar/components/core';

type PictureValue = NcPictureRef<{ url: string }, string>;

@Injectable()
class StoryPictureUploadHandler extends NcUploadHandler<{ url: string }, string> {
  constructor() {
    super({} as HttpClient);
  }

  override upload(url: string, uploadRef: NcUploadRef<{ url: string }, string>): Observable<NcUploadEvent<{ url: string }, string>> {
    uploadRef.status = NcUploadStatus.BEGIN;
    uploadRef.progress = 0;

    return new Observable(subscriber => {
      const timers = [
        setTimeout(() => {
          uploadRef.status = NcUploadStatus.SENDING;
          uploadRef.progress = 40;
        }, 150),
        setTimeout(() => {
          uploadRef.progress = 75;
        }, 350),
        setTimeout(() => {
          uploadRef.status = NcUploadStatus.UPLOADED;
          uploadRef.progress = 100;
          const urlValue = URL.createObjectURL(uploadRef.file as Blob);
          subscriber.next(new NcUploadResponse<{ url: string }>({ url: urlValue }));
          subscriber.complete();
        }, 700),
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

@Component({
  selector: 'storybook-picture-host',
  template: `
    <div class="space-y-4">
      <div class="flex gap-3">
        <button nc-button (click)="setMax(1)">单张</button>
        <button nc-button (click)="setMax(5)">最多 5 张</button>
        <button nc-button class="nc-button-secondary" (click)="clear()">清空</button>
      </div>

      <nc-picture
        [formControl]="control"
        url="/upload"
        name="picture"
        [maxFiles]="maxFiles"
        [limitSize]="2"
        shape="square"
        (errors)="handleErrors($event)">
      </nc-picture>

      <div *ngIf="messages.length" class="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-600 space-y-1">
        <div *ngFor="let msg of messages">{{ msg }}</div>
      </div>

      <div class="text-xs text-slate-500">
        当前共 {{ control.value?.length || 0 }} 张图片，最大 {{ maxFiles }} 张。
      </div>
    </div>
  `,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NcPictureModule, NcButtonModule],
})
class PictureStoryHostComponent {
  control = new FormControl<PictureValue[]>([]);
  maxFiles = 3;
  messages: string[] = [];

  constructor() {
    const file = new File([], 'logo.svg', { type: 'image/svg+xml' });
    const ref = new NcPictureRef<{ url: string }, string>(file);
    ref.thumbnail = '/logo.svg';
    ref.link = '/logo.svg';
    ref.status = NcUploadStatus.UPLOADED;
    this.control.setValue([ref]);
  }

  setMax(count: number) {
    this.maxFiles = count;
  }

  clear() {
    this.control.setValue([]);
  }

  handleErrors(error: any) {
    const list = Array.isArray(error) ? error : [error];
    this.messages = list.map(item => (typeof item === 'string' ? item : '上传失败'));
    setTimeout(() => (this.messages = []), 3000);
  }
}

const meta: Meta<NcPicture<any>> = {
  title: 'Components/Picture',
  component: NcPicture,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormsModule, ReactiveFormsModule, NcPictureModule, NcButtonModule],
      providers: [{ provide: NcUploadHandler, useClass: StoryPictureUploadHandler }],
    }),
    applicationConfig({
      providers: [provideAnimations(), withModalService()],
    }),
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '图片上传组件，支持缩略图预览、进度展示、最大数量与大小限制，并可通过模态框查看大图。',
      },
    },
  },
};

export default meta;

type Story = StoryObj<NcPicture<any>>;

// export const Playground: Story = {
//   render: () => ({
//     component: PictureStoryHostComponent,
//   }),
// };
