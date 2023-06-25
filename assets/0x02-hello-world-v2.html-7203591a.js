import{_ as o}from"./plugin-vue_export-helper-c27b6911.js";import{r as i,o as l,c,b as n,d as s,e as a,w as p,a as d}from"./app-0c3433bd.js";const r={},u=n("h2",{id:"目标",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#目标","aria-hidden":"true"},"#"),s(" 目标")],-1),v=n("p",null,"今天的目标：规范化开发流程。",-1),k=n("code",null,".c",-1),m=d(`<h2 id="代码拆分" tabindex="-1"><a class="header-anchor" href="#代码拆分" aria-hidden="true">#</a> 代码拆分</h2><p>先把之前的源文件<code>kernel.c</code>贴出来：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">asm</span><span class="token punctuation">(</span><span class="token string">&quot;.long 0x1badb002, 0, (-(0x1badb002 + 0))&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">unsigned</span> <span class="token keyword">short</span> <span class="token operator">*</span>video_buffer <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token keyword">unsigned</span> <span class="token keyword">short</span> <span class="token operator">*</span><span class="token punctuation">)</span><span class="token number">0xb8000</span><span class="token punctuation">;</span>
<span class="token keyword">char</span> <span class="token operator">*</span>message <span class="token operator">=</span> <span class="token string">&quot;Hello, world!&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">void</span> <span class="token function">kernel_main</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">80</span> <span class="token operator">*</span> <span class="token number">25</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span>
  <span class="token punctuation">{</span>
    video_buffer<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">(</span>video_buffer<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">&amp;</span> <span class="token number">0xff00</span><span class="token punctuation">)</span> <span class="token operator">|</span> <span class="token char">&#39; &#39;</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> message<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">!=</span> <span class="token char">&#39;\\0&#39;</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span>
  <span class="token punctuation">{</span>
    video_buffer<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">(</span>video_buffer<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">&amp;</span> <span class="token number">0xff00</span><span class="token punctuation">)</span> <span class="token operator">|</span> message<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
    <span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在第<code>1</code>行我们内联了一行汇编代码来说明我们的<code>kernel</code>是符合<code>multiboot</code>规范的，这部分需要提取出去，新建文件<code>boot.S</code>，内容如下：</p><div class="language-asm line-numbers-mode" data-ext="asm"><pre class="language-asm"><code>#define MULTIBOOT_HEADER_MAGIC      0x1BADB002
#define MULTIBOOT_HEADER_FLAGS      0
#define MULTIBOOT_HEADER_CHECKSUM   -(MULTIBOOT_HEADER_MAGIC + MULTIBOOT_HEADER_FLAGS)

.section .text
.globl entry
.long MULTIBOOT_HEADER_MAGIC
.long MULTIBOOT_HEADER_FLAGS
.long MULTIBOOT_HEADER_CHECKSUM

entry:

hlt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>因为我们将这部分内容和内核主要代码拆分开了，所以需要从这段代码中调用内核主函数，将控制权转移到内核。处理器进行函数调用需要栈的支持，所以我们还需要准备一个栈。添加相关代码如下：</p><div class="language-asm line-numbers-mode" data-ext="asm"><pre class="language-asm"><code>#define MULTIBOOT_HEADER_MAGIC      0x1BADB002
#define MULTIBOOT_HEADER_FLAGS      0
#define MULTIBOOT_HEADER_CHECKSUM   -(MULTIBOOT_HEADER_MAGIC + MULTIBOOT_HEADER_FLAGS)

#define STACK_SIZE                  0x4000  // 16KB

.section .text
.globl entry
.long MULTIBOOT_HEADER_MAGIC
.long MULTIBOOT_HEADER_FLAGS
.long MULTIBOOT_HEADER_CHECKSUM

entry:
// 初始化栈指针
movl $(stack + STACK_SIZE), %esp

call kernel_main

hlt

.section .bss
.comm stack, STACK_SIZE
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>内核代码重构如下：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">typedef</span> <span class="token keyword">unsigned</span> <span class="token keyword">short</span> <span class="token class-name">uint16_t</span><span class="token punctuation">;</span>

<span class="token keyword">void</span> <span class="token function">cprintf</span><span class="token punctuation">(</span><span class="token keyword">char</span> <span class="token operator">*</span>str<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
  <span class="token keyword">static</span> <span class="token class-name">uint16_t</span> <span class="token operator">*</span>video_buffer <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">uint16_t</span> <span class="token operator">*</span><span class="token punctuation">)</span><span class="token number">0xb8000</span><span class="token punctuation">;</span>

  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> str<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">!=</span> <span class="token char">&#39;\\0&#39;</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span>
  <span class="token punctuation">{</span>
    video_buffer<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> str<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">|</span> <span class="token number">0x0f00</span><span class="token punctuation">;</span> <span class="token comment">// 黑底白字</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">void</span> <span class="token function">kernel_main</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
  <span class="token function">cprintf</span><span class="token punctuation">(</span><span class="token string">&quot;Hello kernel!&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>内核主函数为<code>kernel_main</code>，由<code>boot.S</code>调用。</p><h2 id="构建过程" tabindex="-1"><a class="header-anchor" href="#构建过程" aria-hidden="true">#</a> 构建过程</h2><p>之前我们是手动编译、链接和启动虚拟机的，每次修改代码之后都这么操作一遍显然是不科学的。今天我们使用<code>make</code>来自动化构建过程，对应的<code>Makefile</code>如下：</p><div class="language-Makefile line-numbers-mode" data-ext="Makefile"><pre class="language-Makefile"><code>objects = boot.o kernel.o

kernel.elf: $(objects)
	ld -m elf_i386 -e entry -Ttext 0x100000 $(objects) -o $@

%.o: %.c
	cc -m32 -c $&lt;

%.o: %.S
	cc -m32 -c $&lt;

run: kernel.elf
	qemu-system-i386 -kernel kernel.elf -monitor stdio

clean:
	rm -f *.elf *.o
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>现在，我们只需要敲个<code>make run</code>就可以完成代码的编译链接并启动虚拟机查看结果了。</p>`,14),b={href:"https://github.com/kviccn/multiboot-in-action/tree/master/b",target:"_blank",rel:"noopener noreferrer"},_=n("h2",{id:"参考资料",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#参考资料","aria-hidden":"true"},"#"),s(" 参考资料")],-1),f={href:"https://www.gnu.org/software/grub/manual/multiboot/multiboot.html",target:"_blank",rel:"noopener noreferrer"},h={href:"https://wiki.ubuntu.org.cn/%E8%B7%9F%E6%88%91%E4%B8%80%E8%B5%B7%E5%86%99Makefile",target:"_blank",rel:"noopener noreferrer"};function E(g,T){const t=i("RouterLink"),e=i("ExternalLinkIcon");return l(),c("div",null,[u,v,n("p",null,[s("在"),a(t,{to:"/series/%E8%80%81%E6%9D%8E%E6%95%99%E4%BD%A0%E5%86%99%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F/0x01-hello-world.html"},{default:p(()=>[s("上一篇")]),_:1}),s("文章中，出于简洁的考虑只使用了一个"),k,s("文件来做说明。后续的开发中代码会越来越多，一个文件肯定是不够的，今天我们将代码做一下简单的拆分，以便更好的扩展。")]),m,n("p",null,[s("完整的代码在"),n("a",b,[s("这里"),a(e)]),s("。")]),_,n("blockquote",null,[n("p",null,[n("a",f,[s("Multiboot 文档"),a(e)])])]),n("blockquote",null,[n("p",null,[n("a",h,[s("跟我一起写 Makefile"),a(e)])])])])}const w=o(r,[["render",E],["__file","0x02-hello-world-v2.html.vue"]]);export{w as default};
