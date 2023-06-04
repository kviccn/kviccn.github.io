import { defineUserConfig } from 'vuepress';
import theme from './theme';

export default defineUserConfig({
  base: '/',

  locales: {
    '/': {
      lang: 'zh-CN',
      title: '未央',
      description: '未央的博客',
    },
  },

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
