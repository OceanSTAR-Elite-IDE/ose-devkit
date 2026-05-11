import type { Preview } from '@storybook/angular';
// import { setCompodocJson } from '@storybook/addon-docs/angular';
// import docJson from '../documentation.json';
// setCompodocJson(docJson);
import { INITIAL_VIEWPORTS } from 'storybook/viewport';

const preview: Preview = {
  parameters: {
     viewport: {
      options: INITIAL_VIEWPORTS,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Accessibility 默认配置：所有 story 都跑 axe-core 检查
    //   - 'todo'  仅报告违规，不让组件测试失败（渐进采纳，推荐起步使用）
    //   - 'error' 一旦发现违规即视为测试失败
    //   - 'off'   关闭检查
    // 单个 story / meta 可通过 `parameters.a11y.test` 覆盖。
    a11y: {
      test: 'todo',
    },
  },
  initialGlobals: {
    viewport: { value: 'ipad', isRotated: false },
  },
};

export default preview;
