import { sidebar } from 'vuepress-theme-hope';

export default sidebar({
  '/': [
    '',
    {
      text: '文章',
      icon: 'note',
      prefix: 'posts/',
      children: 'structure',
    },
    {
      text: '系列',
      icon: 'creative',
      prefix: 'series/',
      link: 'series/',
      children: 'structure',
    },
  ],
});
