import type { Meta, StoryObj } from '@storybook/angular';
import { expect, fn, userEvent, within } from 'storybook/test';

import { NcButton } from '@oceanstar/components/button';

// 仅在参数有值时输出对应的 Angular 属性绑定，避免 show code 中出现 [xxx]="undefined"
const bindings = (args: Partial<NcButton>) => {
  const parts: string[] = [];
  if (args.expanded !== undefined) parts.push(`[expanded]="${ args.expanded }"`);
  if (args.reverse !== undefined) parts.push(`[reverse]="${ args.reverse }"`);
  return parts.length ? ' ' + parts.join(' ') : '';
};

// NC Button组件文档 - 基于@oceanstar/components按钮组件
const meta: Meta<NcButton> = {
  title: 'Components/Button',
  component: NcButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '按钮组件需要在 `button` 和 `a` 标签上使用，`<button nc-button></button>`, 支持多种样式变体、尺寸和状态，。'
      }
    },
    // Button 已具备足够可访问性基线，违规直接视为测试失败（覆盖 preview 中的 'todo'）
    a11y: {
      test: 'error',
      // 可选：自定义 axe-core 运行参数 —— 详见 https://github.com/dequelabs/axe-core/blob/HEAD/doc/API.md#options-parameter
      // options: {
      //   runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa'] },
      // },
    },
  },
  argTypes: {
    expanded: {
      control: 'boolean',
      description: '是否占满容器宽度',
    },
    reverse: {
      control: 'boolean',
      description: '是否反向背景',
    },
  },
};

export default meta;
type Story = StoryObj<NcButton>;


export const Primary: Story = {
  render: (args) => ({
    template: `
      <div class="space-x-2 space-y-2">
        <button nc-button${ bindings(args) }>Normal</button>
        <button nc-button disabled${ bindings(args) }>Disabled</button>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: '默认按钮样式，适用于主要操作'
      }
    }
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const [normal, disabled] = canvas.getAllByRole('button') as HTMLButtonElement[];

    await step('Normal 按钮可点击并应用 nc-button 样式', async () => {
      const onClick = fn();
      normal.addEventListener('click', onClick);
      await userEvent.click(normal);
      await expect(normal).toHaveClass('nc-button');
      await expect(onClick).toHaveBeenCalledTimes(1);
    });

    await step('Disabled 按钮被禁用且不触发点击', async () => {
      const onClick = fn();
      disabled.addEventListener('click', onClick);
      await userEvent.click(disabled);
      await expect(disabled).toBeDisabled();
      await expect(onClick).not.toHaveBeenCalled();
    });

    await step('键盘可聚焦并通过 Enter / Space 触发', async () => {
      const onClick = fn();
      normal.addEventListener('click', onClick);
      normal.focus();
      await expect(normal).toHaveFocus();
      await userEvent.keyboard('{Enter}');
      await userEvent.keyboard(' ');
      await expect(onClick).toHaveBeenCalledTimes(2);
    });
  },
};

export const Size: Story = {
  render: (args) => ({
    template: `
      <div class="space-x-2 space-y-2">
        <button nc-button class="[--nc-button-font-size:0.75rem]"${ bindings(args) }>Tiny</button>
        <button nc-button${ bindings(args) }>Small</button>
        <button nc-button class="[--nc-button-font-size:1rem]"${ bindings(args) }>Medium</button>
        <button nc-button class="[--nc-button-font-size:1.25rem]"${ bindings(args) }>Large</button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: '组件中没有内置的尺寸参数，但是可以通过修改CSS变量 `--nc-button-font-size` 来调整按钮尺寸。'
      }
    }
  }
};


export const Colored: Story = {
  render: (args) => ({
    template: `
      <div class="space-x-2 space-y-2">
        <button nc-button class="nc-button-primary"${ bindings(args) }>Primary</button>
        <button nc-button class="nc-button-secondary"${ bindings(args) }>Secondary</button>
        <button nc-button class="nc-button-warning"${ bindings(args) }>Warning</button>
        <button nc-button class="nc-button-danger"${ bindings(args) }>Danger</button>
        <button nc-button class="nc-button-success"${ bindings(args) }>Success</button>
        <button nc-button class="[--nc-button-current-color:purple]"${ bindings(args) }>Custom</button>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: '展示不同颜色变体的按钮，组件库中内置了5个常用颜色，除此之外也可以通过CSS变量自定义颜色 `--nc-button-current-color`。'
      }
    },
    // 'Custom' 按钮用任意 CSS 变量着色，无法保证对比度符合 WCAG AA，
    // 因此关闭 color-contrast 规则，避免示例产生噪音。其他规则仍然失败即失败。
    a11y: {
      test: 'error',
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button') as HTMLButtonElement[];
    const expectedColorClasses = [
      'nc-button-primary',
      'nc-button-secondary',
      'nc-button-warning',
      'nc-button-danger',
      'nc-button-success',
    ];

    expectedColorClasses.forEach((cls, i) => {
      expect(buttons[i]).toHaveClass('nc-button');
      expect(buttons[i]).toHaveClass(cls);
    });

    // 自定义颜色按钮通过 CSS 变量生效
    const custom = buttons[5];
    await expect(custom).toHaveClass('nc-button');
    await expect(custom.getAttribute('class')).toContain('--nc-button-current-color:purple');
  },
}

// 特殊状态
export const Expanded: Story = {
  render: (args) => ({
    template: `
      <div class="space-x-2 space-y-2">
        <button nc-button class="nc-button-primary"${ bindings(args) }>Primary</button>
        <button nc-button class="nc-button-secondary"${ bindings(args) }>Secondary</button>
        <button nc-button class="nc-button-danger"${ bindings(args) }>Danger</button>
        <button nc-button class="nc-button-success"${ bindings(args) }>Success</button>
        <button nc-button class="nc-button-warning"${ bindings(args) }>Warning</button>
      </div>
    `,
  }),
  args: {
    expanded: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button') as HTMLButtonElement[];
    for (const button of buttons) {
      await expect(button).toHaveClass('nc-button-expanded');
      await expect(button).not.toHaveClass('nc-button-reverse');
    }
  },
};

// 特殊状态
export const Reverse: Story = {
  render: (args) => ({
    template: `
      <div class="space-x-2 space-y-2">
        <button nc-button class="nc-button-primary"${ bindings(args) }>Primary</button>
        <button nc-button class="nc-button-secondary"${ bindings(args) }>Secondary</button>
        <button nc-button class="nc-button-danger"${ bindings(args) }>Danger</button>
        <button nc-button class="nc-button-success"${ bindings(args) }>Success</button>
        <button nc-button class="nc-button-warning"${ bindings(args) }>Warning</button>
      </div>
    `,
  }),
  args: {
    reverse: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button') as HTMLButtonElement[];
    for (const button of buttons) {
      await expect(button).toHaveClass('nc-button-reverse');
      await expect(button).not.toHaveClass('nc-button-expanded');
    }
  },
};


// Loading状态
export const Loading: Story = {
  render: (args) => ({
    template: `
      <div class="space-x-2 space-y-2">
        <button class="space-x-2" nc-button aria-busy="true"${ bindings(args) }>
          <i class="fas fa-spinner fa-spin" aria-hidden="true"></i>
          <span>Loading...</span>
        </button>
      </div>
    `,
  }),
  args: {
    reverse: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button') as HTMLButtonElement;
    await expect(button).toHaveClass('nc-button-reverse');
    await expect(button).toHaveAttribute('aria-busy', 'true');
    await expect(button.querySelector('.fa-spinner')).toHaveAttribute('aria-hidden', 'true');
    await expect(canvas.getByText('Loading...')).toBeInTheDocument();
  },
};
