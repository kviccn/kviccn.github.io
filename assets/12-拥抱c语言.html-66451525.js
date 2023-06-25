import{_ as t}from"./plugin-vue_export-helper-c27b6911.js";import{r as o,o as i,c as l,b as s,d as n,e as a,w as d,a as p}from"./app-0c3433bd.js";const r="/assets/boot1-b6ec2776.jpg",u={},v=s("code",null,"数据结构",-1),m=s("code",null,"全局描述符表",-1),b=s("code",null,"段描述符",-1),k=s("code",null,"GDTR",-1),f=s("code",null,"C 语言",-1),x=s("code",null,"struct",-1),h=s("code",null,"汇编语言",-1),g=s("code",null,"C 语言",-1),_=p(`<h2 id="预处理" tabindex="-1"><a class="header-anchor" href="#预处理" aria-hidden="true">#</a> 预处理</h2><p>先来教大家一个技巧，在<code>汇编语言</code>中使用<code>预处理</code>。改造上一篇文章中的示例代码。</p><h3 id="代码" tabindex="-1"><a class="header-anchor" href="#代码" aria-hidden="true">#</a> 代码</h3><div class="language-asm line-numbers-mode" data-ext="asm"><pre class="language-asm"><code># filename - boot.S

#include &quot;mmu.h&quot;

.set PROT_MODE_CSEG, 0x08        # code segment selector
.set PROT_MODE_DSEG, 0x10        # data segment selector

.globl start
start:
  .code16
  cli

  # Enable A20
  inb $0x92, %al
  orb $0x2, %al
  outb %al, $0x92

  # Load GDT
  lgdt gdtdesc

  # Switch from real to protected mode
  movl %cr0, %eax
  orl $0x1, %eax
  movl %eax, %cr0

  # Jump into 32-bit protected mode
  ljmp $PROT_MODE_CSEG, $protcseg

  .code32
protcseg:
  movw $PROT_MODE_DSEG, %ax
  movw %ax, %ds

  movb $&#39;L&#39;, 0xb8000
  movb $0x0a,0xb8001

  movb $&#39;a&#39;, 0xb8002
  movb $0x0a,0xb8003

  movb $&#39;o&#39;, 0xb8004
  movb $0x0a,0xb8005

  movb $&#39;l&#39;, 0xb8006
  movb $0x0a,0xb8007

  movb $&#39;i&#39;, 0xb8008
  movb $0x0a,0xb8009

hlt

.p2align 2
gdt:
  SEG_NULL
  SEG(STA_X | STA_R, 0x0, 0xffffffff)
  SEG(STA_W, 0x0, 0xffffffff)

gdtdesc:
  .word gdtdesc - gdt - 1
  .long gdt

.org 510
.word 0xAA55
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="解释" tabindex="-1"><a class="header-anchor" href="#解释" aria-hidden="true">#</a> 解释</h3><p>第<code>1</code>行是注释，我们将文件保存为<code>boot.S</code>，注意，以大写<code>S</code>结尾。当<code>gcc</code>遇到大写<code>S</code>结尾的汇编语言源代码时将进行预处理。</p><p>第<code>3</code>行我们使用<code>include</code>引入外部文件<code>mmu.h</code>，我们在这个文件中做了一些宏定义，方面我们构造段描述符。</p><p>第<code>34~47</code>行有一些变化，内存单元的地址都加上了<code>0xb8000</code>，因为我们这次将数据段设置成了整个<code>4GB</code>的空间。</p><p>第<code>53~55</code>行我们使用了宏定义<code>SEG_NULL</code>，<code>SEG</code>。这两个宏定义在<code>mmu.h</code>中。先来看看它们是如何定义的。</p><h3 id="代码-1" tabindex="-1"><a class="header-anchor" href="#代码-1" aria-hidden="true">#</a> 代码</h3><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token comment">/* filename - mmu.h */</span>

<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">ifndef</span> <span class="token expression">__MMU_H_</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">__MMU_H_</span></span>

<span class="token comment">/*
 * Macros to build GDT entries in assembly.
 */</span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">SEG_NULL</span> <span class="token punctuation">\\</span>
  <span class="token expression"><span class="token punctuation">.</span>word <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">;</span>    </span><span class="token punctuation">\\</span>
  <span class="token expression"><span class="token punctuation">.</span>byte <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token number">0</span></span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name function">SEG</span><span class="token expression"><span class="token punctuation">(</span>type<span class="token punctuation">,</span> base<span class="token punctuation">,</span> lim<span class="token punctuation">)</span>                      </span><span class="token punctuation">\\</span>
  <span class="token expression"><span class="token punctuation">.</span><span class="token function">word</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">(</span>lim<span class="token punctuation">)</span> <span class="token operator">&gt;&gt;</span> <span class="token number">12</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> <span class="token number">0xffff</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>base<span class="token punctuation">)</span><span class="token operator">&amp;</span><span class="token number">0xffff</span><span class="token punctuation">)</span><span class="token punctuation">;</span> </span><span class="token punctuation">\\</span>
  <span class="token expression"><span class="token punctuation">.</span><span class="token function">byte</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">(</span>base<span class="token punctuation">)</span> <span class="token operator">&gt;&gt;</span> <span class="token number">16</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> <span class="token number">0xff</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token number">0x90</span> <span class="token operator">|</span> <span class="token punctuation">(</span>type<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>  </span><span class="token punctuation">\\</span>
      <span class="token expression"><span class="token punctuation">(</span><span class="token number">0xC0</span> <span class="token operator">|</span> <span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">(</span>lim<span class="token punctuation">)</span> <span class="token operator">&gt;&gt;</span> <span class="token number">28</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> <span class="token number">0xf</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">(</span>base<span class="token punctuation">)</span> <span class="token operator">&gt;&gt;</span> <span class="token number">24</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> <span class="token number">0xff</span><span class="token punctuation">)</span></span></span>

<span class="token comment">// Application segment type bits</span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">STA_X</span> <span class="token expression"><span class="token number">0x8</span> </span><span class="token comment">// Executable segment</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">STA_E</span> <span class="token expression"><span class="token number">0x4</span> </span><span class="token comment">// Expand down (non-executable segments)</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">STA_C</span> <span class="token expression"><span class="token number">0x4</span> </span><span class="token comment">// Conforming code segment (executable only)</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">STA_W</span> <span class="token expression"><span class="token number">0x2</span> </span><span class="token comment">// Writeable (non-executable segments)</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">STA_R</span> <span class="token expression"><span class="token number">0x2</span> </span><span class="token comment">// Readable (executable segments)</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">STA_A</span> <span class="token expression"><span class="token number">0x1</span> </span><span class="token comment">// Accessed</span></span>

<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">endif</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="解释-1" tabindex="-1"><a class="header-anchor" href="#解释-1" aria-hidden="true">#</a> 解释</h3><p>第<code>9~11</code>行用于定义空描述符，可以看到<code>64</code>位全为<code>0</code>。</p><p>第<code>12~15</code>行接收段类型<code>(type)</code>、段基址<code>(base)</code>、段界限<code>(lim)</code>，经过位运算计算出段描述符。都是很简单的运算，大家动手写一写，画一画就明白了。</p><p>第<code>18~23</code>行定义了数据段和代码段段类型中的每一位，通过组合这些位来构造段描述符的<code>type</code>位。</p><p>下面我们看一下预处理后的代码：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ cc <span class="token parameter variable">-E</span> boot.S
<span class="token comment"># 1 &quot;boot.S&quot;</span>
<span class="token comment"># 1 &quot;&lt;built-in&gt;&quot;</span>
<span class="token comment"># 1 &quot;&lt;command-line&gt;&quot;</span>
<span class="token comment"># 31 &quot;&lt;command-line&gt;&quot;</span>
<span class="token comment"># 1 &quot;/usr/include/stdc-predef.h&quot; 1 3 4</span>
<span class="token comment"># 32 &quot;&lt;command-line&gt;&quot; 2</span>
<span class="token comment"># 1 &quot;boot.S&quot;</span>
<span class="token comment"># filename - boot.S</span>

<span class="token comment"># 1 &quot;mmu.h&quot; 1</span>
<span class="token comment"># 4 &quot;boot.S&quot; 2</span>

.set PROT_MODE_CSEG, 0x08 <span class="token comment"># code segment selector</span>
.set PROT_MODE_DSEG, 0x10 <span class="token comment"># data segment selector</span>

.globl start
start:
  .code16
  cli

  <span class="token comment"># Enable A20</span>
  inb <span class="token variable">$0x92</span>, %al
  orb <span class="token variable">$0x2</span>, %al
  outb %al, <span class="token variable">$0x92</span>

  <span class="token comment"># Load GDT</span>
  lgdt gdtdesc

  <span class="token comment"># Switch from real to protected mode</span>
  movl %cr0, %eax
  orl <span class="token variable">$0x1</span>, %eax
  movl %eax, %cr0

  <span class="token comment"># Jump into 32-bit protected mode</span>
  ljmp <span class="token variable">$PROT_MODE_CSEG</span>, <span class="token variable">$protcseg</span>

  .code32
protcseg:
  movw <span class="token variable">$PROT_MODE_DSEG</span>, %ax
  movw %ax, %ds

  movb <span class="token string">$&#39;L&#39;</span>, 0xb8000
  movb <span class="token variable">$0x0a</span>,0xb8001

  movb <span class="token string">$&#39;a&#39;</span>, 0xb8002
  movb <span class="token variable">$0x0a</span>,0xb8003

  movb <span class="token string">$&#39;o&#39;</span>, 0xb8004
  movb <span class="token variable">$0x0a</span>,0xb8005

  movb <span class="token string">$&#39;l&#39;</span>, 0xb8006
  movb <span class="token variable">$0x0a</span>,0xb8007

  movb <span class="token string">$&#39;i&#39;</span>, 0xb8008
  movb <span class="token variable">$0x0a</span>,0xb8009

hlt

.p2align <span class="token number">2</span>
gdt:
  .word <span class="token number">0</span>, <span class="token number">0</span><span class="token punctuation">;</span> .byte <span class="token number">0</span>, <span class="token number">0</span>, <span class="token number">0</span>, <span class="token number">0</span>
  .word<span class="token variable"><span class="token punctuation">((</span><span class="token punctuation">(</span><span class="token number">0xffffffff</span><span class="token punctuation">)</span> <span class="token operator">&gt;&gt;</span> <span class="token number">12</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> <span class="token number">0xffff</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">((</span><span class="token number">0x0</span><span class="token punctuation">)</span><span class="token operator">&amp;</span><span class="token number">0xffff</span><span class="token punctuation">)</span><span class="token punctuation">;</span> .byte<span class="token punctuation">((</span><span class="token punctuation">(</span><span class="token number">0x0</span><span class="token punctuation">)</span> <span class="token operator">&gt;&gt;</span> <span class="token number">16</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> <span class="token number">0xff</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token number">0x90</span> <span class="token operator">|</span> <span class="token punctuation">(</span><span class="token number">0x8</span> <span class="token operator">|</span> <span class="token number">0x2</span><span class="token punctuation">))</span></span>, <span class="token punctuation">(</span>0xC0 <span class="token operator">|</span> <span class="token variable"><span class="token punctuation">((</span><span class="token punctuation">(</span><span class="token number">0xffffffff</span><span class="token punctuation">)</span> <span class="token operator">&gt;&gt;</span> <span class="token number">28</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> <span class="token number">0xf</span><span class="token punctuation">))</span></span>, <span class="token variable"><span class="token punctuation">((</span><span class="token punctuation">(</span><span class="token number">0x0</span><span class="token punctuation">)</span> <span class="token operator">&gt;&gt;</span> <span class="token number">24</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> <span class="token number">0xff</span><span class="token punctuation">)</span>
  .word<span class="token punctuation">((</span><span class="token punctuation">(</span><span class="token number">0xffffffff</span><span class="token punctuation">)</span> <span class="token operator">&gt;&gt;</span> <span class="token number">12</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> <span class="token number">0xffff</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">((</span><span class="token number">0x0</span><span class="token punctuation">)</span><span class="token operator">&amp;</span><span class="token number">0xffff</span><span class="token punctuation">)</span><span class="token punctuation">;</span> .byte<span class="token punctuation">((</span><span class="token punctuation">(</span><span class="token number">0x0</span><span class="token punctuation">)</span> <span class="token operator">&gt;&gt;</span> <span class="token number">16</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> <span class="token number">0xff</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token number">0x90</span> <span class="token operator">|</span> <span class="token punctuation">(</span><span class="token number">0x2</span><span class="token punctuation">))</span></span>, <span class="token punctuation">(</span>0xC0 <span class="token operator">|</span> <span class="token variable"><span class="token punctuation">((</span><span class="token punctuation">(</span><span class="token number">0xffffffff</span><span class="token punctuation">)</span> <span class="token operator">&gt;&gt;</span> <span class="token number">28</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> <span class="token number">0xf</span><span class="token punctuation">))</span></span>, <span class="token punctuation">((</span><span class="token punctuation">(</span>0x0<span class="token punctuation">)</span> <span class="token operator">&gt;&gt;</span> <span class="token number">24</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> 0xff<span class="token punctuation">)</span>

gdtdesc:
  .word gdtdesc - gdt - <span class="token number">1</span>
  .long gdt

.org <span class="token number">510</span>
.word 0xAA55
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>观察第<code>62~64</code>行，宏定义已经被展开。</p><p>编译运行：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ cc <span class="token parameter variable">-m32</span> <span class="token parameter variable">-c</span> <span class="token parameter variable">-o</span> boot.o boot.S
$ ld <span class="token parameter variable">-e</span> start <span class="token parameter variable">-Ttext</span><span class="token operator">=</span>0x7c00 <span class="token parameter variable">-m</span> elf_i386 <span class="token parameter variable">--oformat</span> binary boot.o <span class="token parameter variable">-o</span> boot.bin
$ qemu-system-i386 <span class="token parameter variable">-drive</span> <span class="token assign-left variable">file</span><span class="token operator">=</span>boot.bin,format<span class="token operator">=</span>raw <span class="token parameter variable">-monitor</span> stdio
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>结果与之前相同，就不贴图了。</p><h2 id="真正的使用-c-语言" tabindex="-1"><a class="header-anchor" href="#真正的使用-c-语言" aria-hidden="true">#</a> 真正的使用 C 语言</h2><p>继续改造我们的<code>boot.S</code>。</p><h3 id="代码-2" tabindex="-1"><a class="header-anchor" href="#代码-2" aria-hidden="true">#</a> 代码</h3><div class="language-asm line-numbers-mode" data-ext="asm"><pre class="language-asm"><code># filename - boot.S

#include &quot;mmu.h&quot;

.set PROT_MODE_CSEG, 0x08        # code segment selector
.set PROT_MODE_DSEG, 0x10        # data segment selector

.globl start
start:
  .code16
  cli

  # Enable A20
  inb $0x92, %al
  orb $0x2, %al
  outb %al, $0x92

  # Load GDT
  lgdt gdtdesc

  # Switch from real to protected mode
  movl %cr0, %eax
  orl $0x1, %eax
  movl %eax, %cr0

  # Jump into 32-bit protected mode
  ljmp $PROT_MODE_CSEG, $protcseg

  .code32
protcseg:
  movw $PROT_MODE_DSEG, %ax
  movw %ax, %ds
  movw %ax, %es
  movw %ax, %fs
  movw %ax, %gs
  movw %ax, %ss

  movl $start, %esp
  call bootmain

spin:
  jmp spin

.p2align 2
gdt:
  SEG_NULL
  SEG(STA_X | STA_R, 0x0, 0xffffffff)
  SEG(STA_W, 0x0, 0xffffffff)

gdtdesc:
  .word gdtdesc - gdt - 1
  .long gdt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="解释-2" tabindex="-1"><a class="header-anchor" href="#解释-2" aria-hidden="true">#</a> 解释</h3><p>第<code>31~36</code>行，我们将<code>ds, es, fs, gs, ss</code>全部指向了<code>4GB</code>的数据段选择子。</p><p>第<code>38</code>行设置堆栈指针<code>esp</code>指向<code>start</code>，这个标号在链接完成后对应的地址是<code>0x7c00</code>。</p><p>第<code>39</code>行调用我们定义的<code>C 语言</code>代码的入口点。</p><p>第<code>41~42</code>行，死循环。</p><p>还有代码的结尾，没有加可启动标志。这是为了方便链接，可启动标志将在链接完成之后手动加入。</p><p>下面给出<code>C 语言</code>部分的代码。</p><h3 id="代码-3" tabindex="-1"><a class="header-anchor" href="#代码-3" aria-hidden="true">#</a> 代码</h3><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token comment">/* filename - main.c */</span>

<span class="token keyword">void</span> <span class="token function">printf</span><span class="token punctuation">(</span><span class="token keyword">const</span> <span class="token keyword">char</span> <span class="token operator">*</span>message<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">void</span> <span class="token function">bootmain</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
  <span class="token keyword">char</span> <span class="token operator">*</span>message <span class="token operator">=</span> <span class="token string">&quot;Hello, laoli!&quot;</span><span class="token punctuation">;</span>
  <span class="token function">printf</span><span class="token punctuation">(</span>message<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span>
    <span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">void</span> <span class="token function">printf</span><span class="token punctuation">(</span><span class="token keyword">const</span> <span class="token keyword">char</span> <span class="token operator">*</span>message<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
  <span class="token keyword">unsigned</span> <span class="token keyword">short</span> <span class="token operator">*</span>video_buffer <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token keyword">unsigned</span> <span class="token keyword">short</span> <span class="token operator">*</span><span class="token punctuation">)</span><span class="token number">0xb8000</span><span class="token punctuation">;</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">80</span> <span class="token operator">*</span> <span class="token number">25</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span>
  <span class="token punctuation">{</span>
    video_buffer<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">(</span>video_buffer<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">&amp;</span> <span class="token number">0xff00</span><span class="token punctuation">)</span> <span class="token operator">|</span> <span class="token char">&#39; &#39;</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> message<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">!=</span> <span class="token char">&#39;\\0&#39;</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span>
  <span class="token punctuation">{</span>
    video_buffer<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">(</span>video_buffer<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">&amp;</span> <span class="token number">0xff00</span><span class="token punctuation">)</span> <span class="token operator">|</span> message<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>代码很简单，但是有些地方你可能不明白，我们来讲一讲。</p><h3 id="解释-3" tabindex="-1"><a class="header-anchor" href="#解释-3" aria-hidden="true">#</a> 解释</h3><p>第<code>16</code>行，我们定义了一个<code>unsigned short *</code>类型的指针变量<code>video_buffer</code>，指向内存<code>0xb8000</code>处，即显存对应的内存处。</p><p>第<code>17~20</code>行，清屏。因为一屏可以显示<code>80 * 25</code>个字符，每个字符占用两个字节。第<code>19</code>行，将每一个字符处的显示属性取出<code>(video_buffer[i] &amp; 0xff00)</code>，将低字节替换成<code>&#39; &#39;</code>，即实现了清屏。</p><p>第<code>22~25</code>行，实现打印字符串的功能。与清屏大致相同，只不过写入的字符由<code>&#39; &#39;</code>变成了参数提供的字符。</p><h3 id="编译链接" tabindex="-1"><a class="header-anchor" href="#编译链接" aria-hidden="true">#</a> 编译链接</h3><p>代码本身并没有什么难懂的地方，只是在编译链接的时候需要一些技巧，才能让代码成功的运行起来。下面讲解编译链接的过程。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ cc <span class="token parameter variable">-m32</span> <span class="token parameter variable">-c</span> <span class="token parameter variable">-o</span> boot.o boot.S
$ cc <span class="token parameter variable">-m32</span> -fno-builtin -fno-pic <span class="token parameter variable">-nostdinc</span> <span class="token parameter variable">-c</span> <span class="token parameter variable">-o</span> main.o main.c
$ ld <span class="token parameter variable">-N</span> <span class="token parameter variable">-e</span> start <span class="token parameter variable">-Ttext</span><span class="token operator">=</span>0x7c00 <span class="token parameter variable">-m</span> elf_i386 <span class="token parameter variable">-o</span> boot.elf boot.o main.o
$ objcopy <span class="token parameter variable">-S</span> <span class="token parameter variable">-O</span> binary <span class="token parameter variable">-j</span> .text <span class="token parameter variable">-j</span> .rodata boot.elf boot.bin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第<code>1</code>行，编译<code>boot.S</code>。这次使用<code>gcc</code>编译，因为要用到预处理。</p><p>第<code>2</code>行，编译<code>main.c</code>。注意三个选项即可。</p><ul><li><code>-fno-builtin</code> 不接受不是两个下划线开头的内建函数。</li><li><code>-fno-pic</code> 禁止生成位置无关的代码。</li><li><code>-nostdinc</code> 不要在标准系统目录中寻找头文件。</li></ul><p>第<code>3</code>行，将汇编语言编译的结果和 C 语言编译的结果链接起来。</p><ul><li><code>-N</code> 不将数据对齐至页边界，不将<code>text</code>节只读。</li><li><code>-e</code> 设置起始地址。</li><li><code>-Ttext</code> 设置<code>.text</code>节的地址。</li><li><code>-m</code> 设置目标平台。</li></ul><p>第<code>4</code>行，从<code>elf</code>格式的文件中复制出纯二进制的机器码。<code>elf</code>格式的文件并不能由处理器直接运行，所以我们要提取出其中的纯二进制机器码。</p><ul><li><code>-S</code> 移除所有符号和重定位信息。</li><li><code>-O</code> 指定输出文件的格式。</li><li><code>-j</code> 指定从源文件中复制的<em>section</em>。这里指定了两个<em>section</em><code>.text</code>和<code>.rodata</code>，因为有一部分数据在编译的时候被放在了<code>.rodata</code>中了，具体是哪些数据可以通过反编译查看，这里就不演示了。</li></ul><p>此时我们的输出文件<code>boot.bin</code>中就包含了全部的汇编语言代码生成的指令和 C 语言代码生成的指令。</p><p>最后一步是为<code>boot.bin</code>加入可引导标记。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">cp</span> boot.bin boot
$ ./sign boot
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div>`,52),y=s("code",null,"boot.bin",-1),E={href:"https://github.com/kviccn/asm-boooom/blob/master/0x00/sign.c",target:"_blank",rel:"noopener noreferrer"},w=s("code",null,"boot",-1),S=p(`<h3 id="运行" tabindex="-1"><a class="header-anchor" href="#运行" aria-hidden="true">#</a> 运行</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ qemu-system-i386 <span class="token parameter variable">-drive</span> <span class="token assign-left variable">file</span><span class="token operator">=</span>boot,format<span class="token operator">=</span>raw <span class="token parameter variable">-monitor</span> stdio
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>结果如下：</p><figure><img src="`+r+'" alt="boot1.jpg" tabindex="0" loading="lazy"><figcaption>boot1.jpg</figcaption></figure><p>这是一个里程碑，我们终于从<code>汇编语言</code>走向了<code>C 语言</code>，通过<code>C 语言</code>在裸机上打印出了<code>Hello, laoli!</code>。</p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h2><p>简要总结一下。最开始我们学习了如何在<code>汇编语言</code>中使用<code>预处理</code>帮助我们简化<code>GDT</code>的构造，然后通过<code>汇编语言</code>准备好<code>32位保护模式</code>的环境，进入<code>32位保护模式</code>后我们通过<code>call</code>指令，将控制权转移到<code>C 语言</code>代码，完成交接。</p>',7),$={href:"https://github.com/kviccn/asm-boooom/tree/master/0x0C",target:"_blank",rel:"noopener noreferrer"},T={href:"https://pdos.csail.mit.edu/6.828/2018/index.html",target:"_blank",rel:"noopener noreferrer"};function A(G,D){const c=o("RouterLink"),e=o("ExternalLinkIcon");return i(),l("div",null,[s("p",null,[n("汇编语言的基础已经讲了很多，也带领大家进入了保护模式。想必大家在学习"),a(c,{to:"/series/%E6%B1%87%E7%BC%96%E8%AF%AD%E8%A8%80%E4%B8%80%E5%8F%91%E5%85%A5%E9%AD%82/10-%E8%BF%9B%E5%85%A5%E4%BF%9D%E6%8A%A4%E6%A8%A1%E5%BC%8F.html"},{default:d(()=>[n("进入保护模式")]),_:1}),n("这一章时就发现我们已经涉及了很多"),v,n("，"),m,n("、"),b,n("、"),k,n("等。如果可以使用"),f,n("，将他们和"),x,n("对应起来那将会减少很多的工作量。今天老李就教大家如何从"),h,n("过渡到"),g,n("。")]),_,s("p",null,[n("我们将"),y,n("复制了一份，并且通过之前介绍过的一个小工具"),s("a",E,[n("sign"),a(e)]),n("为"),w,n("添加可引导标志。")]),S,s("p",null,[n("完整的代码戳"),s("a",$,[n("这里"),a(e)]),n("。")]),s("p",null,[n("参考"),s("a",T,[n("MIT 6.828: Operating System Engineering"),a(e)]),n("。")])])}const C=t(u,[["render",A],["__file","12-拥抱c语言.html.vue"]]);export{C as default};
