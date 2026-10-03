import qmlPreset from '@qomicex/plugin-ui/tailwind-preset';

/** @type {import('tailwindcss').Config} */
export default {
  // 官方设计系统 preset：colors/borderRadius/keyframes/animations 全部来自 plugin-ui
  presets: [qmlPreset],
  content: [
    './src/**/*.{astro,html,js,ts,tsx}',
    // 扫描组件库产出的类名，保证 Button/Card/Badge 等样式被编译
    './node_modules/@qomicex/plugin-ui/dist/**/*.{js,cjs,mjs}',
  ],
  theme: {},
  plugins: [],
};
