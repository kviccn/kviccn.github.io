const e=JSON.parse(`{"key":"v-19628b7f","path":"/series/%E6%B1%87%E7%BC%96%E8%AF%AD%E8%A8%80%E4%B8%80%E5%8F%91%E5%85%A5%E9%AD%82/02-%E6%8C%87%E4%BB%A4%E7%9A%84%E5%AF%BB%E5%9D%80%E6%96%B9%E5%BC%8F.html","title":"汇编语言一发入魂 0x02 - 指令的寻址方式","lang":"zh-CN","frontmatter":{"title":"汇编语言一发入魂 0x02 - 指令的寻址方式","shortTitle":"指令的寻址方式","date":"2020-03-07T07:12:50.000Z","tag":["寻址方式"],"category":["汇编语言"],"description":"上篇文章中老李给大家教了怎么在屏幕上打印一个字符，还留了个课后作业，打印完整的Hello World。最简单的方法是按照打印H的方式依次打印其它字符就好了。当然，这种重复的工作还是交给计算机去做吧，毕竟我们的时间是很宝贵的。 这篇文章中我们用循环的方式让计算机自己把所有的字符都打印出来。并结合代码给大家讲解一下指令的寻址方式。下面给出代码： 代码 .code16 movw $0x07c0, %ax movw %ax, %ds movw $0xb800, %ax movw %ax, %es xorw %si, %si movw message_length, %cx l1: movb message(%si), %bl movb %bl, %es:(%si) incw %si loop l1 jmp . message: .byte 'H', 0xa, 'e', 0xa, 'l', 0xa, 'l', 0xa, 'o', 0xa, ' ', 0xa, 'W', 0xa, 'o', 0xa, 'r', 0xa, 'l', 0xa, 'd', 0xa message_length: .word . - message .org 510 .word 0xAA55","head":[["meta",{"property":"og:url","content":"https://kviccn.github.io/series/%E6%B1%87%E7%BC%96%E8%AF%AD%E8%A8%80%E4%B8%80%E5%8F%91%E5%85%A5%E9%AD%82/02-%E6%8C%87%E4%BB%A4%E7%9A%84%E5%AF%BB%E5%9D%80%E6%96%B9%E5%BC%8F.html"}],["meta",{"property":"og:site_name","content":"未央"}],["meta",{"property":"og:title","content":"汇编语言一发入魂 0x02 - 指令的寻址方式"}],["meta",{"property":"og:description","content":"上篇文章中老李给大家教了怎么在屏幕上打印一个字符，还留了个课后作业，打印完整的Hello World。最简单的方法是按照打印H的方式依次打印其它字符就好了。当然，这种重复的工作还是交给计算机去做吧，毕竟我们的时间是很宝贵的。 这篇文章中我们用循环的方式让计算机自己把所有的字符都打印出来。并结合代码给大家讲解一下指令的寻址方式。下面给出代码： 代码 .code16 movw $0x07c0, %ax movw %ax, %ds movw $0xb800, %ax movw %ax, %es xorw %si, %si movw message_length, %cx l1: movb message(%si), %bl movb %bl, %es:(%si) incw %si loop l1 jmp . message: .byte 'H', 0xa, 'e', 0xa, 'l', 0xa, 'l', 0xa, 'o', 0xa, ' ', 0xa, 'W', 0xa, 'o', 0xa, 'r', 0xa, 'l', 0xa, 'd', 0xa message_length: .word . - message .org 510 .word 0xAA55"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://kviccn.github.io/"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-06-03T14:00:42.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:alt","content":"汇编语言一发入魂 0x02 - 指令的寻址方式"}],["meta",{"property":"article:author","content":"未央"}],["meta",{"property":"article:tag","content":"寻址方式"}],["meta",{"property":"article:published_time","content":"2020-03-07T07:12:50.000Z"}],["meta",{"property":"article:modified_time","content":"2023-06-03T14:00:42.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"汇编语言一发入魂 0x02 - 指令的寻址方式\\",\\"image\\":[\\"https://kviccn.github.io/\\"],\\"datePublished\\":\\"2020-03-07T07:12:50.000Z\\",\\"dateModified\\":\\"2023-06-03T14:00:42.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"未央\\",\\"url\\":\\"https://kviccn.github.io\\"}]}"]]},"headers":[{"level":2,"title":"代码","slug":"代码","link":"#代码","children":[]},{"level":2,"title":"解释","slug":"解释","link":"#解释","children":[{"level":3,"title":"代码解释","slug":"代码解释","link":"#代码解释","children":[]},{"level":3,"title":"编译、反编译","slug":"编译、反编译","link":"#编译、反编译","children":[]}]},{"level":2,"title":"运行","slug":"运行","link":"#运行","children":[]},{"level":2,"title":"总结","slug":"总结","link":"#总结","children":[{"level":3,"title":"代码总结","slug":"代码总结","link":"#代码总结","children":[]},{"level":3,"title":"寻址方式总结","slug":"寻址方式总结","link":"#寻址方式总结","children":[]}]}],"git":{"createdTime":1685800842000,"updatedTime":1685800842000,"contributors":[{"name":"kviccn","email":"kviccn@outlook.com","commits":1}]},"readingTime":{"minutes":14,"words":4199},"filePathRelative":"series/汇编语言一发入魂/02-指令的寻址方式.md","localizedDate":"2020年3月7日","excerpt":"<p>上篇文章中老李给大家教了怎么在屏幕上打印一个字符，还留了个课后作业，打印完整的<code>Hello World</code>。最简单的方法是按照打印<code>H</code>的方式依次打印其它字符就好了。当然，这种重复的工作还是交给计算机去做吧，毕竟我们的时间是很宝贵的。</p>\\n<p>这篇文章中我们用循环的方式让计算机自己把所有的字符都打印出来。并结合代码给大家讲解一下指令的寻址方式。下面给出代码：</p>\\n<h2> 代码</h2>\\n<div class=\\"language-asm line-numbers-mode\\" data-ext=\\"asm\\"><pre class=\\"language-asm\\"><code>.code16\\n\\nmovw $0x07c0, %ax\\nmovw %ax, %ds\\n\\nmovw $0xb800, %ax\\nmovw %ax, %es\\n\\nxorw %si, %si\\nmovw message_length, %cx\\n\\nl1:\\n  movb message(%si), %bl\\n  movb %bl, %es:(%si)\\n  incw %si\\n  loop l1\\n\\njmp .\\n\\nmessage:\\n  .byte 'H', 0xa, 'e', 0xa, 'l', 0xa, 'l', 0xa, 'o', 0xa, ' ', 0xa, 'W', 0xa, 'o', 0xa, 'r', 0xa, 'l', 0xa, 'd', 0xa\\nmessage_length:\\n  .word . - message\\n\\n.org 510\\n.word 0xAA55\\n</code></pre><div class=\\"line-numbers\\" aria-hidden=\\"true\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}`);export{e as data};
