import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';

import { NcAvatar, NcAvatarModule } from '@oceanstar/components/avatar';

const meta: Meta<NcAvatar> = {
  title: 'Components/Avatar',
  component: NcAvatar,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, NcAvatarModule],
    }),
    applicationConfig({
      providers: [provideAnimations()],
    }),
  ],
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '展示用户头像或品牌标识的组件，支持尺寸、形状和自定义样式扩展。',
      },
    },
  },
  argTypes: {
    src: { control: 'text', description: '图片地址' },
    alt: { control: 'text', description: '备用文本' },
    shape: {
      control: 'inline-radio',
      options: ['square', 'circle'],
      description: '头像形状，默认方形，可切换为圆形。',
    },
  },
};

export default meta;

type Story = StoryObj<NcAvatar>;

const SAMPLE_SRC = '/logo.png';

export const Basic: Story = {
  args: {
    src: SAMPLE_SRC,
    alt: 'OceanSTAR',
    shape: 'square',
  },
  parameters: {
    docs: {
      description: {
        story: '最基础用法，指定 `src` 和 `alt` 展示头像图片。',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => ({
    props: { src: SAMPLE_SRC },
    template: `
      <div class="flex items-end gap-6">
        <div class="space-y-2 text-center text-xs text-slate-600">
          <nc-avatar class="small" [src]="src" alt="Small" />
          <span>small</span>
        </div>
        <div class="space-y-2 text-center text-xs text-slate-600">
          <nc-avatar class="medium" [src]="src" alt="Medium" />
          <span>medium</span>
        </div>
        <div class="space-y-2 text-center text-xs text-slate-600">
          <nc-avatar class="large" [src]="src" alt="Large" />
          <span>large</span>
        </div>
        <div class="space-y-2 text-center text-xs text-slate-600">
          <nc-avatar class="large" style="width: 120px; height: 120px" [src]="src" alt="Custom" />
          <span>自定义尺寸</span>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: '通过添加 `small`、`medium`、`large` 类或自定义宽高来控制头像尺寸。',
      },
    },
  },
};

export const Shapes: Story = {
  render: () => ({
    props: { src: SAMPLE_SRC },
    template: `
      <div class="flex items-center gap-6 text-center text-xs text-slate-600">
        <div class="space-y-2">
          <nc-avatar class="large" [src]="src" alt="Square" shape="square" />
          <span>方形</span>
        </div>
        <div class="space-y-2">
          <nc-avatar class="large" [src]="src" alt="Circle" shape="circle" />
          <span>圆形</span>
        </div>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: '`shape` 属性可切换圆形头像，配合 CSS 类展示不同视觉效果。',
      },
    },
  },
};
