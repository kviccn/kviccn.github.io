import { hopeTheme } from 'vuepress-theme-hope';
import navbar from './navbar';
import sidebar from './sidebar';

export default hopeTheme({
  hostname: 'https://kviccn.github.io',

  author: {
    name: '未央',
    url: 'https://kviccn.github.io',
  },

  iconAssets: 'iconfont',

  logo: '/logo.jpg',

  repo: 'kviccn/kviccn.github.io',

  docsDir: 'docs',

  blog: {
    roundAvatar: true,
    medias: {},
  },

  locales: {
    /**
     * Chinese locale config
     */
    '/': {
      // navbar
      navbar,

      // sidebar
      sidebar,

      footer:
        '<a href="https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh" target="_blank">署名-非商业性使用-禁止演绎 4.0 国际</a>',

      displayFooter: true,

      blog: {
        // description: '',
        // intro: '/intro.html',
      },

      // page meta
      metaLocales: {
        editLink: '在 GitHub 上编辑此页',
      },
    },
  },

  sidebarSorter: ['readme', 'date', 'order', 'title', 'filename'],

  plugins: {
    blog: true,

    comment: {
      // provider: 'Giscus',
    },

    // all features are enabled for demo, only preserve features you need here
    mdEnhance: {
      align: true,
      attrs: true,
      chart: true,
      codetabs: true,
      demo: true,
      echarts: true,
      figure: true,
      flowchart: true,
      gfm: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      katex: true,
      mark: true,
      mermaid: true,
      playground: {
        presets: ['ts', 'vue'],
      },
      presentation: {
        plugins: ['highlight', 'math', 'search', 'notes', 'zoom'],
      },
      stylize: [
        {
          matcher: 'Recommended',
          replacer: ({ tag }) => {
            if (tag === 'em')
              return {
                tag: 'Badge',
                attrs: { type: 'tip' },
                content: 'Recommended',
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,
      vuePlayground: true,
    },
  },
});
