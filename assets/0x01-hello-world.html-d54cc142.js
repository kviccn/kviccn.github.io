import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{o as s,c as a,a as e}from"./app-819cf889.js";const c="/assets/boot-6a3168af.png",o={},i=e(`<h2 id="前言" tabindex="-1"><a class="header-anchor" href="#前言" aria-hidden="true">#</a> 前言</h2><p><s>这还得从一只蝙蝠说起。</s></p><p>讲道理这篇文章的题目很不合理。作为一个计算机人，第一篇文章起码应该是<code>0x00</code>吧？这是对计算机最起码的尊重。原本打算在这篇文章之前写一篇关于汇编和硬件基础知识的介绍（以后补上）。虽然汇编和硬件很简单，但是一上来就讲这些简单的知识难免会让人觉得枯燥，因而影响学习的积极性是得不偿失的。索性先写个操作系统找找感觉，以此建立学习的兴趣，未尝不是一件好事。</p><p>搞计算机这一行，万事离不了个<code>Hello World</code>。现在开始就带领大家实现一个操作系统版的<code>Hello World</code>。</p><h2 id="环境" tabindex="-1"><a class="header-anchor" href="#环境" aria-hidden="true">#</a> 环境</h2><ul><li>系统：<code>Ubuntu 18.04.4 LTS</code></li><li>编译器：<code>gcc version 7.4.0 (Ubuntu 7.4.0-1ubuntu1~18.04.1)</code></li><li>链接器：<code>GNU ld (GNU Binutils for Ubuntu) 2.30</code></li><li>虚拟机：<code>QEMU emulator version 2.11.1(Debian 1:2.11+dfsg-1ubuntu7.21)</code></li></ul><h2 id="开发" tabindex="-1"><a class="header-anchor" href="#开发" aria-hidden="true">#</a> 开发</h2><p>新建文件<code>kernel.c</code>，代码如下</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">asm</span><span class="token punctuation">(</span><span class="token string">&quot;.long 0x1badb002, 0, (-(0x1badb002 + 0))&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>编译 <code>cc -c -m32 -ffreestanding kernel.c -o kernel.o</code></li><li>链接 <code>ld -m elf_i386 -e kernel_main -Ttext=0x100000 kernel.o -o kernel.elf</code></li><li>运行 <code>qemu-system-i386 -kernel kernel.elf</code></li></ul><p>一切顺利的话运行结果如下：</p><figure><img src="`+c+`" alt="运行结果" tabindex="0" loading="lazy"><figcaption>运行结果</figcaption></figure><h2 id="解释" tabindex="-1"><a class="header-anchor" href="#解释" aria-hidden="true">#</a> 解释</h2><h3 id="代码解释" tabindex="-1"><a class="header-anchor" href="#代码解释" aria-hidden="true">#</a> 代码解释</h3><p>第<code>1</code>行是内联汇编语句，用于定义三个32位的数据，共12字节。对于操作系统来说这不是必须的，但这是<code>multiboot</code>规范定义的<code>header</code>。符合这个规范的内核可以被<code>qemu</code>或<code>grub</code>所引导。</p><p><code>multiboot</code>规范规定<code>header</code>的第一个字段必须为十六进制的<code>0x1BADB002</code>，称之为<code>magic</code>。第二个字段为<code>flags</code>，用于告知<code>bootloader</code>需要为内核提供哪些信息（如内存布局、显示模式表），我们暂时不需要这些信息，所以填<code>0</code>。第三个字段是<code>checksum</code>，即校验和，根据规范<code>magic</code> <code>flags</code> <code>checksum</code>之和必须为<code>0</code>。<code>qemu</code>或<code>grub</code>会检查这个值来确认这是一个可引导的内核。</p><p>第<code>3</code>行定义了一个<code>unsigned short</code>类型的指针，指向内存的<code>0xb8000</code>处。BIOS引导系统时默认将显卡设置为<code>80列</code>x<code>25行</code>的文本模式，显存的起始地址被映射到内存地址的<code>0xb8000</code>处，所以可以通过直接向对应内存写入数据的方式来操作显存。</p><p>该模式下一屏幕的数据占据从<code>0xb8000</code>开始的<code>4000</code>个字节，即<code>80 * 25 * 2</code>。因为显示一个字符需要两个字节的数据，低字节为字符的<code>ASCII</code>码，高字节为字符的属性。这也是将显存对应指针定义为<code>unsigned short</code>类型的原因。</p><p>第<code>4</code>行定义了我们要在屏幕上显示的数据，需要注意的是<code>C</code>风格的字符串以空字符结尾，所以在稍后的循环中我们可以以此判断字符串是否显示完成。</p><p>第<code>6</code>行定义了内核的主函数，该函数作为内核的入口点会被引导程序调用。</p><p>第<code>8-11</code>行的代码用于清屏。如上所述，一屏可以显示<code>80 * 25</code>个<code>ASCII</code>字符。语句<code>video_buffer[i] = (video_buffer[i] &amp; 0xff00) | &#39; &#39;</code>将显存中的每一个字符及属性取出来，保留其高字节的显示属性，与空格组合在一起回填回去即可实现清屏。</p><p>第<code>13-16</code>行代码原理同上，不过将空格换成了第<code>4</code>行定义的数据。</p><p>第<code>18</code>行让我们的内核陷入死循环。</p><p>去除空行和花括号就短短的几行代码，理解起来也很容易，下面解释一下编译、链接及运行所用到的命令和参数的含义。</p><h3 id="命令解释" tabindex="-1"><a class="header-anchor" href="#命令解释" aria-hidden="true">#</a> 命令解释</h3><h4 id="cc" tabindex="-1"><a class="header-anchor" href="#cc" aria-hidden="true">#</a> cc</h4><ul><li><code>-c</code> 告知编译器只编译生成目标文件但不链接</li><li><code>-m32</code> 告知编译器生成32位代码</li><li><code>-ffreestanding</code> 告知编译器按独立环境编译，该环境可以没有标准库，且对<code>main()</code>函数没有要求。该选项隐含设置了<code>-fno-builtin</code>，且与<code>-fno-hosted</code>等价</li><li><code>-o</code> 指定输出文件名</li></ul><h4 id="ld" tabindex="-1"><a class="header-anchor" href="#ld" aria-hidden="true">#</a> ld</h4><ul><li><code>-m elf_i386</code> 指定链接生成的文件格式为<code>elf</code>且目标平台为<code>i386</code></li><li><code>-e kernel_main</code> 指定程序的入口点为<code>kernel_main</code></li><li><code>-Ttext=0x100000</code> 指定代码段的始起地址为<code>0x100000</code>。因为<code>bootloader</code>默认会把内核加载到<code>0x100000</code>处执行，所以代码段的地址也需要调整到这个位置</li><li><code>-o</code> 指定输出文件名</li></ul><p>对于没有编写过操作系统的人来说可能不太理解<code>-e</code>和<code>-T</code>参数到底做了什么，下面结合目标文件<code>kernel.o</code>和链接生成的内核文件<code>kernel.elf</code>来解释一下这两个参数具体的作用。</p><p>反汇编<code>kernel.o</code></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ objdump <span class="token parameter variable">-d</span> kernel.o

kernel.o：     文件格式 elf32-i386


Disassembly of section .text:

00000000 <span class="token operator">&lt;</span>kernel_main-0xc<span class="token operator">&gt;</span>:
   <span class="token number">0</span>:   02 b0 ad 1b 00 00       <span class="token function">add</span>    0x1bad<span class="token punctuation">(</span>%eax<span class="token punctuation">)</span>,%dh
   <span class="token number">6</span>:   00 00                   <span class="token function">add</span>    %al,<span class="token punctuation">(</span>%eax<span class="token punctuation">)</span>
   <span class="token number">8</span>:   fe 4f <span class="token number">52</span>                decb   0x52<span class="token punctuation">(</span>%edi<span class="token punctuation">)</span>
   b:   e4                      .byte 0xe4

0000000c <span class="token operator">&lt;</span>kernel_main<span class="token operator">&gt;</span>:
   c:   <span class="token number">55</span>                      push   %ebp
   d:   <span class="token number">89</span> e5                   mov    %esp,%ebp
   f:   <span class="token number">53</span>                      push   %ebx
  <span class="token number">10</span>:   <span class="token number">83</span> ec <span class="token number">10</span>                sub    <span class="token variable">$0x10</span>,%esp
<span class="token punctuation">..</span>.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>反汇编<code>kernel.elf</code></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ objdump <span class="token parameter variable">-d</span> kernel.elf

kernel.elf：     文件格式 elf32-i386


Disassembly of section .text:

00100000 <span class="token operator">&lt;</span>kernel_main-0xc<span class="token operator">&gt;</span>:
  <span class="token number">100000</span>:       02 b0 ad 1b 00 00       <span class="token function">add</span>    0x1bad<span class="token punctuation">(</span>%eax<span class="token punctuation">)</span>,%dh
  <span class="token number">100006</span>:       00 00                   <span class="token function">add</span>    %al,<span class="token punctuation">(</span>%eax<span class="token punctuation">)</span>
  <span class="token number">100008</span>:       fe 4f <span class="token number">52</span>                decb   0x52<span class="token punctuation">(</span>%edi<span class="token punctuation">)</span>
  10000b:       e4                      .byte 0xe4

0010000c <span class="token operator">&lt;</span>kernel_main<span class="token operator">&gt;</span>:
  10000c:       <span class="token number">55</span>                      push   %ebp
  10000d:       <span class="token number">89</span> e5                   mov    %esp,%ebp
  10000f:       <span class="token number">53</span>                      push   %ebx
  <span class="token number">100010</span>:       <span class="token number">83</span> ec <span class="token number">10</span>                sub    <span class="token variable">$0x10</span>,%esp
<span class="token punctuation">..</span>.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对比第<code>8</code>行可以发现在目标文件中代码段的始起地址为<code>0</code>，而链接后的内核文件中代码段起始地址为<code>0x100000</code>。并且代码段的前12个字节正好是我们定义的<code>multiboot header</code>。</p><p><code>kernel.o</code>文件的头部信息</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ readelf <span class="token parameter variable">-h</span> kernel.o
ELF 头：
  Magic：   7f <span class="token number">45</span> 4c <span class="token number">46</span> 01 01 01 00 00 00 00 00 00 00 00 00
  类别:                              ELF32
  数据:                              <span class="token number">2</span> 补码，小端序 <span class="token punctuation">(</span>little endian<span class="token punctuation">)</span>
  版本:                              <span class="token number">1</span> <span class="token punctuation">(</span>current<span class="token punctuation">)</span>
  OS/ABI:                            UNIX - System V
  ABI 版本:                          <span class="token number">0</span>
  类型:                              REL <span class="token punctuation">(</span>可重定位文件<span class="token punctuation">)</span>
  系统架构:                          Intel <span class="token number">80386</span>
  版本:                              0x1
  入口点地址：               0x0
  程序头起点：          <span class="token number">0</span> <span class="token punctuation">(</span>bytes into <span class="token function">file</span><span class="token punctuation">)</span>
  Start of section headers:          <span class="token number">988</span> <span class="token punctuation">(</span>bytes into <span class="token function">file</span><span class="token punctuation">)</span>
  标志：             0x0
  本头的大小：       <span class="token number">52</span> <span class="token punctuation">(</span>字节<span class="token punctuation">)</span>
  程序头大小：       <span class="token number">0</span> <span class="token punctuation">(</span>字节<span class="token punctuation">)</span>
  Number of program headers:         <span class="token number">0</span>
  节头大小：         <span class="token number">40</span> <span class="token punctuation">(</span>字节<span class="token punctuation">)</span>
  节头数量：         <span class="token number">17</span>
  字符串表索引节头： <span class="token number">16</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>kernel.elf</code>文件的头部信息</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ readelf <span class="token parameter variable">-h</span> kernel.elf
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
  Start of section headers:          <span class="token number">8716</span> <span class="token punctuation">(</span>bytes into <span class="token function">file</span><span class="token punctuation">)</span>
  标志：             0x0
  本头的大小：       <span class="token number">52</span> <span class="token punctuation">(</span>字节<span class="token punctuation">)</span>
  程序头大小：       <span class="token number">32</span> <span class="token punctuation">(</span>字节<span class="token punctuation">)</span>
  Number of program headers:         <span class="token number">3</span>
  节头大小：         <span class="token number">40</span> <span class="token punctuation">(</span>字节<span class="token punctuation">)</span>
  节头数量：         <span class="token number">10</span>
  字符串表索引节头： <span class="token number">9</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对比第<code>12</code>行可以发现在目标文件中入口点地址为<code>0x0</code>，而链接后的内核文件中入口点地址为<code>0x10000c</code>。结合<code>kernel.elf</code>反汇编的信息可以看到<code>0x10000c</code>正是<code>kernel_main</code>的起始地址。通过这些信息就能很好的理解<code>-e</code>和<code>-T</code>这两个参数的作用。</p><h4 id="qemu-system-i386" tabindex="-1"><a class="header-anchor" href="#qemu-system-i386" aria-hidden="true">#</a> qemu-system-i386</h4><ul><li><code>-kernel</code> 使用这个参数可以指定一个内核镜像。这个镜像可以是<code>linux</code>内核或符合<code>multiboot</code>规范的其它镜像。使用这个参数的好处是可以不用将内核安装到磁盘镜像中而直接启动，很方便测试。</li></ul><p>当屏幕上打印出<code>Hello World</code>这几个字母时就说明你已经进入了操作系统的大门。剩下的无非就是初始化硬件、设置中断、内存管理、进程管理、输入输出、文件系统这些基本操作了。</p><p>其实操作系统本就不是什么高深莫测的东西。当你深刻的理解了理论之后，在稍加一点相关的硬件知识就可以很轻松的开发操作系统了。</p>`,44),p=[i];function l(d,t){return s(),a("div",null,p)}const b=n(o,[["render",l],["__file","0x01-hello-world.html.vue"]]);export{b as default};
