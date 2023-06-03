import{_ as l}from"./plugin-vue_export-helper-c27b6911.js";import{r as c,o as i,c as d,b as s,d as n,e as a,w as p,a as t}from"./app-9978a549.js";const r="/assets/elf-01-82544752.png",u="/assets/boot-7caabd17.png",k={},v=s("p",null,"今天开始，我们来学习操作系统的开发。",-1),m=s("h2",{id:"前置知识",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#前置知识","aria-hidden":"true"},"#"),n(" 前置知识")],-1),b=s("code",null,"bootloader",-1),f=s("code",null,"规范化",-1),h=t('<p>何为<code>规范化</code>？那篇文章中我们的<code>内核</code>最终是纯<code>二进制</code>的指令，我们并不知道内核的大小，只是假设它小于<code>512</code>字节，所以我们只从硬盘读取了一个扇区，加载到内存并执行。规范的做法是将内核组装成约定的格式，最终的内核映像符合这种格式。它有一个<code>header</code>，用于保存内核的<code>元信息</code>，内核的起始地址、加载到何处、由多少段组成等等。我们选择一种通用的格式<code>ELF</code>，下面我们简要介绍一下这种格式。</p><h2 id="elf" tabindex="-1"><a class="header-anchor" href="#elf" aria-hidden="true">#</a> ELF</h2><p>先贴一些资料，这些资料都介绍的非常详细，大家可以仔细研究。</p>',3),g={href:"https://wiki.osdev.org/ELF",target:"_blank",rel:"noopener noreferrer"},x={href:"https://en.wikipedia.org/wiki/Executable_and_Linkable_Format",target:"_blank",rel:"noopener noreferrer"},_={href:"https://refspecs.linuxbase.org/elf/elf.pdf",target:"_blank",rel:"noopener noreferrer"},E=t('<p>这里只介绍我们要用到的一些基础知识。</p><p><code>ELF</code>格式的文件看上去就像这样。</p><figure><img src="'+r+`" alt="elf-01" tabindex="0" loading="lazy"><figcaption>elf-01</figcaption></figure><p>左边的<code>Linking View</code>对应<code>目标文件</code>，通常来讲就是<code>编译</code>生成的<code>.o</code>文件；右边的<code>Execution View</code>对应<code>可执行文件</code>，通常来讲就是<code>链接</code>生成的文件格式。文件由<code>ELF Header</code>开始，后跟<code>Program Header Table</code>、<code>Sections</code>或<code>Segments</code>，最后是<code>Section Header Table</code>。下面我们看一下<code>ELF Header</code>和<code>Program Header</code>的结构。</p><h3 id="elf-header" tabindex="-1"><a class="header-anchor" href="#elf-header" aria-hidden="true">#</a> ELF Header</h3><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">EI_NIDENT</span> <span class="token expression"><span class="token number">16</span></span></span>

<span class="token keyword">typedef</span> <span class="token keyword">struct</span> <span class="token class-name">elf32_hdr</span>
<span class="token punctuation">{</span>
  <span class="token keyword">unsigned</span> <span class="token keyword">char</span> e_ident<span class="token punctuation">[</span>EI_NIDENT<span class="token punctuation">]</span><span class="token punctuation">;</span> <span class="token comment">/* 魔数和相关信息 */</span>
  Elf32_Half e_type<span class="token punctuation">;</span>                <span class="token comment">/* 目标文件类型 */</span>
  Elf32_Half e_machine<span class="token punctuation">;</span>             <span class="token comment">/* 硬件体系 */</span>
  Elf32_Word e_version<span class="token punctuation">;</span>             <span class="token comment">/* 目标文件版本 */</span>
  Elf32_Addr e_entry<span class="token punctuation">;</span>               <span class="token comment">/* 程序进入点 */</span>
  Elf32_Off e_phoff<span class="token punctuation">;</span>                <span class="token comment">/* 程序头部偏移量 */</span>
  Elf32_Off e_shoff<span class="token punctuation">;</span>                <span class="token comment">/* 节头部偏移量 */</span>
  Elf32_Word e_flags<span class="token punctuation">;</span>               <span class="token comment">/* 处理器特定标志 */</span>
  Elf32_Half e_ehsize<span class="token punctuation">;</span>              <span class="token comment">/* ELF头部长度 */</span>
  Elf32_Half e_phentsize<span class="token punctuation">;</span>           <span class="token comment">/* 程序头部中一个条目的长度 */</span>
  Elf32_Half e_phnum<span class="token punctuation">;</span>               <span class="token comment">/* 程序头部条目个数  */</span>
  Elf32_Half e_shentsize<span class="token punctuation">;</span>           <span class="token comment">/* 节头部中一个条目的长度 */</span>
  Elf32_Half e_shnum<span class="token punctuation">;</span>               <span class="token comment">/* 节头部条目个数 */</span>
  Elf32_Half e_shstrndx<span class="token punctuation">;</span>            <span class="token comment">/* 节头部字符表索引 */</span>
<span class="token punctuation">}</span> Elf32_Ehdr<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中各项数据的类型如下：</p><table><thead><tr><th>Name</th><th style="text-align:center;">Size</th><th style="text-align:center;">Alignment</th><th>Purpose</th></tr></thead><tbody><tr><td>Elf32_Addr</td><td style="text-align:center;">4</td><td style="text-align:center;">4</td><td>Unsigned program address</td></tr><tr><td>Elf32_Half</td><td style="text-align:center;">2</td><td style="text-align:center;">2</td><td>Unsigned medium integer</td></tr><tr><td>Elf32_Off</td><td style="text-align:center;">4</td><td style="text-align:center;">4</td><td>Unsigned file offset</td></tr><tr><td>Elf32_Sword</td><td style="text-align:center;">4</td><td style="text-align:center;">4</td><td>Signed large integer</td></tr><tr><td>Elf32_Word</td><td style="text-align:center;">4</td><td style="text-align:center;">4</td><td>Unsigned large integer</td></tr><tr><td>unsigned char</td><td style="text-align:center;">1</td><td style="text-align:center;">1</td><td>Unsigned small integer</td></tr></tbody></table><h3 id="program-header" tabindex="-1"><a class="header-anchor" href="#program-header" aria-hidden="true">#</a> Program Header</h3><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">typedef</span> <span class="token keyword">struct</span> <span class="token class-name">elf32_phdr</span>
<span class="token punctuation">{</span>
  Elf32_Word p_type<span class="token punctuation">;</span>   <span class="token comment">/* 段类型 */</span>
  Elf32_Off p_offset<span class="token punctuation">;</span>  <span class="token comment">/* 段位置相对于文件开始处的偏移量 */</span>
  Elf32_Addr p_vaddr<span class="token punctuation">;</span>  <span class="token comment">/* 段在内存中的地址 */</span>
  Elf32_Addr p_paddr<span class="token punctuation">;</span>  <span class="token comment">/* 段的物理地址 */</span>
  Elf32_Word p_filesz<span class="token punctuation">;</span> <span class="token comment">/* 段在文件中的长度 */</span>
  Elf32_Word p_memsz<span class="token punctuation">;</span>  <span class="token comment">/* 段在内存中的长度 */</span>
  Elf32_Word p_flags<span class="token punctuation">;</span>  <span class="token comment">/* 段的标记 */</span>
  Elf32_Word p_align<span class="token punctuation">;</span>  <span class="token comment">/* 段在内存中对齐标记 */</span>
<span class="token punctuation">}</span> Elf32_Phdr<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>有了这两个结构我们就可以很方便的操作<code>ELF</code>格式的<code>内核</code>了。</p><h2 id="实战" tabindex="-1"><a class="header-anchor" href="#实战" aria-hidden="true">#</a> 实战</h2><h3 id="准备内核" tabindex="-1"><a class="header-anchor" href="#准备内核" aria-hidden="true">#</a> 准备内核</h3><p>我们的内核代码如下：</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">asm</span><span class="token punctuation">(</span><span class="token string">&quot;.long 0x1badb002, 0, (-(0x1badb002 + 0))&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,15),y=t(`<h4 id="编译链接" tabindex="-1"><a class="header-anchor" href="#编译链接" aria-hidden="true">#</a> 编译链接</h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ cc <span class="token parameter variable">-g</span> <span class="token parameter variable">-c</span> <span class="token parameter variable">-m32</span> -fno-pic <span class="token parameter variable">-ffreestanding</span> kernel.c <span class="token parameter variable">-o</span> kernel.o
$ ld <span class="token parameter variable">-m</span> elf_i386 <span class="token parameter variable">-e</span> kernel_main <span class="token parameter variable">-Ttext</span><span class="token operator">=</span>0x100000 kernel.o <span class="token parameter variable">-o</span> kernel
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>接下来看看内核文件的信息。</p><p>查看<code>file header</code>。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ readelf <span class="token parameter variable">-h</span> kernel
ELF 头：
  Magic：   7f <span class="token number">45</span> 4c <span class="token number">46</span> 01 01 01 00 00 00 00 00 00 00 00 00
  类别:                              ELF32
  数据:                              <span class="token number">2</span> 补码，小端序 <span class="token punctuation">(</span>little endian<span class="token punctuation">)</span>
  版本:                              <span class="token number">1</span> <span class="token punctuation">(</span>current<span class="token punctuation">)</span>
  OS/ABI:                            UNIX - System V
  ABI 版本:                          <span class="token number">0</span>
  类型:                              EXEC <span class="token punctuation">(</span>可执行文件<span class="token punctuation">)</span>
  系统架构:                          Intel <span class="token number">80386</span>
  版本:                              0x1
  入口点地址：               0x10000c
  程序头起点：          <span class="token number">52</span> <span class="token punctuation">(</span>bytes into <span class="token function">file</span><span class="token punctuation">)</span>
  Start of section headers:          <span class="token number">9348</span> <span class="token punctuation">(</span>bytes into <span class="token function">file</span><span class="token punctuation">)</span>
  标志：             0x0
  本头的大小：       <span class="token number">52</span> <span class="token punctuation">(</span>字节<span class="token punctuation">)</span>
  程序头大小：       <span class="token number">32</span> <span class="token punctuation">(</span>字节<span class="token punctuation">)</span>
  Number of program headers:         <span class="token number">3</span>
  节头大小：         <span class="token number">40</span> <span class="token punctuation">(</span>字节<span class="token punctuation">)</span>
  节头数量：         <span class="token number">14</span>
  字符串表索引节头： <span class="token number">13</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>程序入口点地址为：<code>0x10000c</code>，程序头起点为<code>52</code>。</p><p>查看<code>program header</code>。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ readelf <span class="token parameter variable">-l</span> kernel

Elf 文件类型为 EXEC <span class="token punctuation">(</span>可执行文件<span class="token punctuation">)</span>
Entry point 0x10000c
There are <span class="token number">3</span> program headers, starting at offset <span class="token number">52</span>

程序头：
  Type           Offset   VirtAddr   PhysAddr   FileSiz MemSiz  Flg Align
  LOAD           0x001000 0x00100000 0x00100000 0x000e8 0x000e8 R E 0x1000
  LOAD           0x002000 0x00102000 0x00102000 0x00008 0x00008 RW  0x1000
  GNU_STACK      0x000000 0x00000000 0x00000000 0x00000 0x00000 RW  0x10

 Section to Segment mapping:
  段节<span class="token punctuation">..</span>.
   00     .text .rodata .eh_frame
   01     .data
   02
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其中可加载的段有两个，如第<code>9</code>行所示，该段相对于文件起始的偏移量为<code>0x1000</code>，虚拟地址为<code>0x100000</code>，物理地址为<code>0x100000</code>，在文件中的大小为<code>0xe8</code>，在内存中的大小为<code>0xe8</code>。这意味着如果我们知道内核文件在硬盘中的起始位置，那么用它加上<code>offset 0x1000</code>就可以得到该段在硬盘中的起始位置，然后从该位置开始，读取<code>FileSiz 0xe8</code>字节的数据到物理地址<code>PhysAddr 0x100000</code>，最后将<code>FileSiz</code>和<code>MemSiz</code>相差的地方填充成<code>0</code>即可。</p><p>下面给出<code>bootloader</code>的代码。</p><h3 id="bootloader" tabindex="-1"><a class="header-anchor" href="#bootloader" aria-hidden="true">#</a> bootloader</h3><p><code>bootloader</code>由准备<code>保护模式</code>环境的汇编语言源文件<code>bootasm.S</code>和读取硬盘加载内核的<code>bootmain.c</code>组成。</p><p><code>bootasm.S</code></p><div class="language-asm line-numbers-mode" data-ext="asm"><pre class="language-asm"><code>#include &quot;asm.h&quot;

.set PROT_MODE_CSEG, 0x08        # code segment selector
.set PROT_MODE_DSEG, 0x10        # data segment selector

.code16
.globl start
start:
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
  ljmp $PROT_MODE_CSEG, $start32

.code32
start32:
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
  SEG_NULLASM
  SEG_ASM(STA_X | STA_R, 0x0, 0xffffffff)
  SEG_ASM(STA_W, 0x0, 0xffffffff)

gdtdesc:
  .word gdtdesc - gdt - 1
  .long gdt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>bootmain.c</code></p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&quot;elf.h&quot;</span></span>
<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&quot;x86.h&quot;</span></span>

<span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">define</span> <span class="token macro-name">SECTSIZE</span> <span class="token expression"><span class="token number">512</span></span></span>

<span class="token keyword">void</span> <span class="token function">readseg</span><span class="token punctuation">(</span><span class="token class-name">uint8_t</span> <span class="token operator">*</span>pa<span class="token punctuation">,</span> <span class="token class-name">uint32_t</span> count<span class="token punctuation">,</span> <span class="token class-name">uint32_t</span> offset<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">void</span> <span class="token function">bootmain</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
  <span class="token keyword">struct</span> <span class="token class-name">elfhdr</span> <span class="token operator">*</span>elf<span class="token punctuation">;</span>
  <span class="token keyword">struct</span> <span class="token class-name">proghdr</span> <span class="token operator">*</span>ph<span class="token punctuation">,</span> <span class="token operator">*</span>eph<span class="token punctuation">;</span>
  <span class="token keyword">void</span> <span class="token punctuation">(</span><span class="token operator">*</span>entry<span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token class-name">uint8_t</span> <span class="token operator">*</span>pa<span class="token punctuation">;</span>

  elf <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token keyword">struct</span> <span class="token class-name">elfhdr</span> <span class="token operator">*</span><span class="token punctuation">)</span><span class="token number">0x10000</span><span class="token punctuation">;</span>

  <span class="token function">readseg</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token class-name">uint8_t</span> <span class="token operator">*</span><span class="token punctuation">)</span>elf<span class="token punctuation">,</span> <span class="token number">4096</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span>elf<span class="token operator">-&gt;</span>magic <span class="token operator">!=</span> ELF_MAGIC<span class="token punctuation">)</span>
    <span class="token keyword">return</span><span class="token punctuation">;</span>

  ph <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token keyword">struct</span> <span class="token class-name">proghdr</span> <span class="token operator">*</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token class-name">uint8_t</span> <span class="token operator">*</span><span class="token punctuation">)</span>elf <span class="token operator">+</span> elf<span class="token operator">-&gt;</span>phoff<span class="token punctuation">)</span><span class="token punctuation">;</span>
  eph <span class="token operator">=</span> ph <span class="token operator">+</span> elf<span class="token operator">-&gt;</span>phnum<span class="token punctuation">;</span>
  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token punctuation">;</span> ph <span class="token operator">&lt;</span> eph<span class="token punctuation">;</span> ph<span class="token operator">++</span><span class="token punctuation">)</span>
  <span class="token punctuation">{</span>
    pa <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">uint8_t</span> <span class="token operator">*</span><span class="token punctuation">)</span>ph<span class="token operator">-&gt;</span>paddr<span class="token punctuation">;</span>
    <span class="token function">readseg</span><span class="token punctuation">(</span>pa<span class="token punctuation">,</span> ph<span class="token operator">-&gt;</span>filesz<span class="token punctuation">,</span> ph<span class="token operator">-&gt;</span>off<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> ph<span class="token operator">-&gt;</span>memsz <span class="token operator">-</span> ph<span class="token operator">-&gt;</span>filesz<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span>
    <span class="token punctuation">{</span>
      <span class="token operator">*</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token keyword">char</span> <span class="token operator">*</span><span class="token punctuation">)</span>ph<span class="token operator">-&gt;</span>paddr <span class="token operator">+</span> ph<span class="token operator">-&gt;</span>filesz <span class="token operator">+</span> i<span class="token punctuation">)</span> <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  entry <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token keyword">void</span> <span class="token punctuation">(</span><span class="token operator">*</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">(</span>elf<span class="token operator">-&gt;</span>entry<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">entry</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">void</span> <span class="token function">waitdisk</span><span class="token punctuation">(</span><span class="token keyword">void</span><span class="token punctuation">)</span>
<span class="token punctuation">{</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token function">inb</span><span class="token punctuation">(</span><span class="token number">0x1F7</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> <span class="token number">0xC0</span><span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token number">0x40</span><span class="token punctuation">)</span>
    <span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">void</span> <span class="token function">readsect</span><span class="token punctuation">(</span><span class="token keyword">void</span> <span class="token operator">*</span>dst<span class="token punctuation">,</span> <span class="token class-name">uint32_t</span> offset<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
  <span class="token function">waitdisk</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">outb</span><span class="token punctuation">(</span><span class="token number">0x1F2</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">outb</span><span class="token punctuation">(</span><span class="token number">0x1F3</span><span class="token punctuation">,</span> offset<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">outb</span><span class="token punctuation">(</span><span class="token number">0x1F4</span><span class="token punctuation">,</span> offset <span class="token operator">&gt;&gt;</span> <span class="token number">8</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">outb</span><span class="token punctuation">(</span><span class="token number">0x1F5</span><span class="token punctuation">,</span> offset <span class="token operator">&gt;&gt;</span> <span class="token number">16</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">outb</span><span class="token punctuation">(</span><span class="token number">0x1F6</span><span class="token punctuation">,</span> <span class="token punctuation">(</span>offset <span class="token operator">&gt;&gt;</span> <span class="token number">24</span><span class="token punctuation">)</span> <span class="token operator">|</span> <span class="token number">0xE0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">outb</span><span class="token punctuation">(</span><span class="token number">0x1F7</span><span class="token punctuation">,</span> <span class="token number">0x20</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token function">waitdisk</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">insl</span><span class="token punctuation">(</span><span class="token number">0x1F0</span><span class="token punctuation">,</span> dst<span class="token punctuation">,</span> SECTSIZE <span class="token operator">/</span> <span class="token number">4</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">void</span> <span class="token function">readseg</span><span class="token punctuation">(</span><span class="token class-name">uint8_t</span> <span class="token operator">*</span>pa<span class="token punctuation">,</span> <span class="token class-name">uint32_t</span> count<span class="token punctuation">,</span> <span class="token class-name">uint32_t</span> offset<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
  <span class="token class-name">uint8_t</span> <span class="token operator">*</span>epa<span class="token punctuation">;</span>
  epa <span class="token operator">=</span> pa <span class="token operator">+</span> count<span class="token punctuation">;</span>

  pa <span class="token operator">-=</span> offset <span class="token operator">%</span> SECTSIZE<span class="token punctuation">;</span>
  offset <span class="token operator">=</span> <span class="token punctuation">(</span>offset <span class="token operator">/</span> SECTSIZE<span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">;</span>

  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token punctuation">;</span> pa <span class="token operator">&lt;</span> epa<span class="token punctuation">;</span> pa <span class="token operator">+=</span> SECTSIZE<span class="token punctuation">,</span> offset<span class="token operator">++</span><span class="token punctuation">)</span>
    <span class="token function">readsect</span><span class="token punctuation">(</span>pa<span class="token punctuation">,</span> offset<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,16),w=s("code",null,"ELF",-1),A=t(`<h4 id="解释" tabindex="-1"><a class="header-anchor" href="#解释" aria-hidden="true">#</a> 解释</h4><p>第<code>1</code>行包含了<code>elf.h</code>，其中包含<code>ELF Header</code>和<code>Program Header</code>的定义。</p><p>第<code>2</code>行包含了<code>x86.h</code>，其中包含了一些基础数据类型的定义。</p><p>第<code>4</code>行定义了<code>SECTSIZE</code>，表示一个扇区包含的字节数。</p><p>第<code>6</code>行声明了方法<code>readseg</code>，用于加载一个<code>段</code>到内存中，参数<code>pa</code>给出要加载的物理内存地址，参数<code>count</code>给出加载的字节大小，参数<code>offset</code>给出段相对于内核文件起始位置的偏移量，即从<code>offset</code>处加载<code>count</code>字节到内存<code>pa</code>处。实际读取的字节数可能多于需要读取的字节数，因为硬盘读取的最小单位是扇区，即一次至少读取<code>512</code>字节。</p><p>第<code>10</code>行声明了<code>struct elfhdr *</code>类型的变量<code>elf</code>，用于指向内核文件的<code>ELF Header</code>。</p><p>第<code>11</code>行声明了<code>struct proghdr *</code>类型的变量<code>ph</code>、<code>eph</code>，分别用于指向第一个程序头的起始和最后一个程序头的结尾。因为我们要遍历多个<code>Program Header</code>，需要用<code>eph</code>控制结束条件。</p><p>第<code>12</code>行声明了<code>void (*)(void)</code>类型的函数指针<code>entry</code>，用于指向内核的起始地址。</p><p>第<code>13</code>行声明了<code>uint8_t *</code>类型的变量<code>pa</code>，用于指向每一个段将要加载到的物理地址。</p><p>第<code>15</code>行，将<code>elf</code>指向内存<code>0x10000</code>处，我们的内核<code>ELF Header</code>将加载到这里。</p><p>第<code>17</code>行，调用<code>readseg</code>从内核映像起始处读取<code>4096</code>个字节到内存<code>0x10000</code>处。<code>4096</code>个字节对于我们的内核文件头来说时足够的，所以我们可以确保已经将<code>ELF Header</code>完整的读入了内存。</p><p>第<code>19</code>行，判断文件头的魔数是否正确，错误的话直接返回到<code>bootasm.S</code>中，陷入死循环。</p><p>第<code>22</code>行，将<code>ph</code>指向第一个<code>Program Header</code>。</p><p>第<code>23</code>行，将<code>eph</code>指向最后一个<code>Program Header</code>的结尾处。</p><p>第<code>24</code>行开始遍历所有的<code>Program Header</code>，并将对应的段加载到内存中。</p><p>第<code>28~31</code>行用于将段在内存中多于在文件中大小的位置填充为<code>0</code>。因为段在内存中实际占用的空间可能大于在文件中占用的空间。</p><p>第<code>34~35</code>行，将<code>entry</code>指向内核入口点并执行。</p><p>第<code>38~42</code>行，函数<code>waitdisk</code>用于等待磁盘准备好和处理器交互。</p><p>第<code>44~56</code>行，函数<code>readsect</code>用于从磁盘读取一个扇区到内存<code>dst</code>处。</p><p>第<code>58~68</code>行，定义函数<code>readseg</code>。参数依次为物理地址，要读取的字节数，段距离文件起始处的偏移量。</p><p>第<code>60、61</code>行声明读取的结束位置<code>epa</code>，读取<code>count</code>字节到<code>pa</code>，那么<code>pa + count</code>就应当是结束条件。</p><p>第<code>63</code>行用于将<code>pa</code>按一个扇区，即<code>512</code>字节向下对齐。可能不是很好理解，老李待会儿做个实验给诸位品品。</p><p>第<code>64</code>行用于<code>将偏移量从字节转换成扇区</code>。比如一个段相对于内核文件起始处的偏移量是<code>1024</code>，那么在磁盘上就相当于偏移两个扇区<code>(1024 / 512)</code>，因为内核文件从偏移量为<code>1</code>的扇区开始，即第二个扇区（我们制作镜像的时候会将内核文件放在从第二个扇区开始的地方），所以该段相对于整个磁盘的起始地址还要<code>+1</code>。</p><p>第<code>66~68</code>行，循环调用<code>readsect</code>，将段所在的扇区一个接一个读入内存。</p><h4 id="编译链接-1" tabindex="-1"><a class="header-anchor" href="#编译链接-1" aria-hidden="true">#</a> 编译链接</h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ cc <span class="token parameter variable">-m32</span> <span class="token parameter variable">-g</span> <span class="token parameter variable">-c</span> <span class="token parameter variable">-o</span> bootasm.o bootasm.S
$ cc <span class="token parameter variable">-m32</span> <span class="token parameter variable">-g</span> -fno-builtin -fno-pic -fno-stack-protector <span class="token parameter variable">-nostdinc</span> <span class="token parameter variable">-Os</span> <span class="token parameter variable">-c</span> <span class="token parameter variable">-o</span> bootmain.o bootmain.c
$ ld <span class="token parameter variable">-N</span> <span class="token parameter variable">-e</span> start <span class="token parameter variable">-Ttext</span><span class="token operator">=</span>0x7c00 <span class="token parameter variable">-m</span> elf_i386 <span class="token parameter variable">-o</span> bootblock.o bootasm.o bootmain.o
$ objcopy <span class="token parameter variable">-S</span> <span class="token parameter variable">-O</span> binary <span class="token parameter variable">-j</span> .text bootblock.o bootblock
$ ./sign bootblock
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="制作镜像" tabindex="-1"><a class="header-anchor" href="#制作镜像" aria-hidden="true">#</a> 制作镜像</h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">dd</span> <span class="token assign-left variable">if</span><span class="token operator">=</span>/dev/zero <span class="token assign-left variable">of</span><span class="token operator">=</span>kernel.img <span class="token assign-left variable">count</span><span class="token operator">=</span><span class="token number">10000</span>
$ <span class="token function">dd</span> <span class="token assign-left variable">if</span><span class="token operator">=</span>bootblock <span class="token assign-left variable">of</span><span class="token operator">=</span>kernel.img <span class="token assign-left variable">conv</span><span class="token operator">=</span>notrunc
$ <span class="token function">dd</span> <span class="token assign-left variable">if</span><span class="token operator">=</span>kernel <span class="token assign-left variable">of</span><span class="token operator">=</span>kernel.img <span class="token assign-left variable">seek</span><span class="token operator">=</span><span class="token number">1</span> <span class="token assign-left variable">conv</span><span class="token operator">=</span>notrunc
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="运行" tabindex="-1"><a class="header-anchor" href="#运行" aria-hidden="true">#</a> 运行</h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ qemu-system-i386 <span class="token parameter variable">-drive</span> <span class="token assign-left variable">file</span><span class="token operator">=</span>kernel.img,format<span class="token operator">=</span>raw <span class="token parameter variable">-monitor</span> stdio
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><figure><img src="`+u+'" alt="boot" tabindex="0" loading="lazy"><figcaption>boot</figcaption></figure>',31),S={href:"https://github.com/kviccn/lowbos/tree/master/src/0x00",target:"_blank",rel:"noopener noreferrer"},F=t(`<p>最后在解释一个刚才遗留问题，<code>pa -= offset % SECTSIZE</code>的作用是什么？</p><p>先来看看将<code>text</code>段起始地址设置成<code>0x100000</code>时的每个段的对应的情况。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ ld <span class="token parameter variable">-m</span> elf_i386 <span class="token parameter variable">-e</span> kernel_main <span class="token parameter variable">-Ttext</span><span class="token operator">=</span>0x100000 kernel.o <span class="token parameter variable">-o</span> kernel
$ readelf <span class="token parameter variable">-l</span> kernel

Elf 文件类型为 EXEC <span class="token punctuation">(</span>可执行文件<span class="token punctuation">)</span>
Entry point 0x10000c
There are <span class="token number">3</span> program headers, starting at offset <span class="token number">52</span>

程序头：
  Type           Offset   VirtAddr   PhysAddr   FileSiz MemSiz  Flg Align
  LOAD           0x001000 0x00100000 0x00100000 0x000e8 0x000e8 R E 0x1000
  LOAD           0x002000 0x00102000 0x00102000 0x00008 0x00008 RW  0x1000
  GNU_STACK      0x000000 0x00000000 0x00000000 0x00000 0x00000 RW  0x10

 Section to Segment mapping:
  段节<span class="token punctuation">..</span>.
   00     .text .rodata .eh_frame
   01     .data
   02
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意第<code>10</code>行，这是我们的<code>text</code>段。<code>pa=0x100000</code>，<code>offset=0x1000</code>，<code>pa -= offset % SECTSIZE</code>之后<code>pa</code>还是等于<code>0x100000</code>。</p><p>如果将<code>text</code>段起始地址设置成<code>0x100001</code>，情况如下：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ ld <span class="token parameter variable">-m</span> elf_i386 <span class="token parameter variable">-e</span> kernel_main <span class="token parameter variable">-Ttext</span><span class="token operator">=</span>0x100001 kernel.o <span class="token parameter variable">-o</span> kernel
$ readelf <span class="token parameter variable">-l</span> kernel

Elf 文件类型为 EXEC <span class="token punctuation">(</span>可执行文件<span class="token punctuation">)</span>
Entry point 0x10000d
There are <span class="token number">3</span> program headers, starting at offset <span class="token number">52</span>

程序头：
  Type           Offset   VirtAddr   PhysAddr   FileSiz MemSiz  Flg Align
  LOAD           0x001001 0x00100001 0x00100001 0x000eb 0x000eb R E 0x1000
  LOAD           0x002000 0x00102000 0x00102000 0x00008 0x00008 RW  0x1000
  GNU_STACK      0x000000 0x00000000 0x00000000 0x00000 0x00000 RW  0x10

 Section to Segment mapping:
  段节<span class="token punctuation">..</span>.
   00     .text .rodata .eh_frame
   01     .data
   02
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时<code>text</code>段<code>pa=0x100001</code>，<code>offset=0x1001</code>，<code>pa -= offset % SECTSIZE</code>之后<code>pa</code>向下取整到<code>0x100000</code>，和一个扇区大小对齐。</p>`,7),T={href:"https://pdos.csail.mit.edu/6.828/2018/index.html",target:"_blank",rel:"noopener noreferrer"};function B(L,D){const o=c("RouterLink"),e=c("ExternalLinkIcon");return i(),d("div",null,[v,m,s("p",null,[n("你需要一点汇编语言的知识，老李为此专门写了一个"),a(o,{to:"/series/%E6%B1%87%E7%BC%96%E8%AF%AD%E8%A8%80%E4%B8%80%E5%8F%91%E5%85%A5%E9%AD%82/"},{default:p(()=>[n("系列文章")]),_:1}),n("，算是要用到的基础知识。按逻辑上来讲，本文是接着汇编语言系列的"),a(o,{to:"/series/%E6%B1%87%E7%BC%96%E8%AF%AD%E8%A8%80%E4%B8%80%E5%8F%91%E5%85%A5%E9%AD%82/13-%E8%A7%A3%E6%94%BE%E7%94%9F%E4%BA%A7%E5%8A%9B.html#%E5%8A%A0%E8%BD%BD-%E5%86%85%E6%A0%B8"},{default:p(()=>[n("最后一篇文章")]),_:1}),n("来写的，那篇文章已经实现了一个操作系统的"),b,n("，本文只是对其做了"),f,n("。")]),h,s("ul",null,[s("li",null,[s("a",g,[n("https://wiki.osdev.org/ELF"),a(e)])]),s("li",null,[s("a",x,[n("https://en.wikipedia.org/wiki/Executable_and_Linkable_Format"),a(e)])]),s("li",null,[s("a",_,[n("https://refspecs.linuxbase.org/elf/elf.pdf"),a(e)])])]),E,s("p",null,[n("内核代码在"),a(o,{to:"/posts/2020/02/%E8%80%81%E6%9D%8E%E6%95%99%E4%BD%A0%E5%86%99%E6%93%8D%E4%BD%9C%E7%B3%BB%E7%BB%9F-0x01-hello-world/"},{default:p(()=>[n("下一篇文章")]),_:1}),n("中有详细解释。")]),y,s("p",null,[n("代码与"),a(o,{to:"/posts/2020/05/%E6%B1%87%E7%BC%96%E8%AF%AD%E8%A8%80%E4%B8%80%E5%8F%91%E5%85%A5%E9%AD%82-0x0c-%E8%A7%A3%E6%94%BE%E7%94%9F%E4%BA%A7%E5%8A%9B/#%E5%8A%A0%E8%BD%BD%E5%86%85%E6%A0%B8"},{default:p(()=>[n("之前的例子")]),_:1}),n("基本相同，只是多了对"),w,n("格式文件的处理。")]),A,s("p",null,[n("完整的代码戳"),s("a",S,[n("这里"),a(e)]),n("。")]),F,s("p",null,[n("参考"),s("a",T,[n("MIT 6.828: Operating System Engineering"),a(e)]),n("。")])])}const O=l(k,[["render",B],["__file","0x00-bootloader.html.vue"]]);export{O as default};
