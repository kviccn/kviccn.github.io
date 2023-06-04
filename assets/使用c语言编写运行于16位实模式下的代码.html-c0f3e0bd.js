import{_ as o}from"./plugin-vue_export-helper-c27b6911.js";import{r as d,o as p,c as r,b as s,d as n,e as a,w as l,a as e}from"./app-819cf889.js";const t="/assets/16bit_c_1-63e3f5e3.jpg",u={},b=e('<p>通常<code>16</code>位实模式下的代码都是用汇编语言写的，但是为什么要用<code>c</code>语言写呢？因为爽啊！今天老李就教大家怎么用<code>c</code>语言写出来可以运行在实模式下的代码。话不多说，开干！</p><h2 id="环境准备" tabindex="-1"><a class="header-anchor" href="#环境准备" aria-hidden="true">#</a> 环境准备</h2><ul><li>系统：<code>Ubuntu 18.04.4 LTS</code></li><li>编译器：<code>gcc version 7.4.0 (Ubuntu 7.4.0-1ubuntu1~18.04.1)</code></li><li>汇编器：<code>GNU as (GNU Binutils for Ubuntu) 2.30</code></li><li>链接器：<code>GNU ld (GNU Binutils for Ubuntu) 2.30</code></li><li>虚拟机：<code>QEMU emulator version 2.11.1(Debian 1:2.11+dfsg-1ubuntu7.21)</code></li></ul><h2 id="实战" tabindex="-1"><a class="header-anchor" href="#实战" aria-hidden="true">#</a> 实战</h2>',4),v=e(`<h3 id="常规操作" tabindex="-1"><a class="header-anchor" href="#常规操作" aria-hidden="true">#</a> 常规操作</h3><h4 id="代码" tabindex="-1"><a class="header-anchor" href="#代码" aria-hidden="true">#</a> 代码</h4><div class="language-asm line-numbers-mode" data-ext="asm"><pre class="language-asm"><code>.section .text

.globl start
start:
  .code16
  movw $0xb800, %ax
  movw %ax, %es

  xorw %ax, %ax
  movw %ax, %ss

  movw $0x7c00, %sp

  pushw $1
  pushw $2
  callw sum
  addw $4, %sp

  orw $0x0a30, %ax
  movw %ax, %es:0

  jmp .

sum:
  pushw %bp
  movw %sp, %bp

  movw 4(%bp), %ax
  addw 6(%bp), %ax

  popw %bp
  retw

.org 510
.word 0xAA55
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="解释" tabindex="-1"><a class="header-anchor" href="#解释" aria-hidden="true">#</a> 解释</h4><p>第<code>6、7</code>行设置显存。</p><p>第<code>9、10、12</code>行设置堆栈段及栈顶指针。</p><p>第<code>14、15</code>行将<code>sum</code>函数要用到的两个参数压栈。我们使用的是<code>pushw</code>指定了数据宽度为<code>16</code>位。注意这里只能选择相加之后结果是个位数的参数，因为作为示例，我们这里只处理了个位数的显示。</p><p>第<code>16</code>行调用<code>sum</code>函数。</p><p>第<code>17</code>行恢复栈顶指针。</p><p>第<code>19</code>行将数字转化为对应的<code>ascii</code>码<code>(+0x30)</code>并附加显示属性<code>(0x0a)</code>。</p><p>第<code>20</code>行将要显示的数据送入显存对应的内存。</p><p>第<code>22</code>行陷入死循环。</p><p>第<code>24</code>行开始定义<code>sum</code>函数。</p><p>第<code>25</code>行将<code>bp</code>压栈保护。</p><p>第<code>26</code>行将<code>sp</code>赋值给<code>bp</code>，下面通过<code>bp</code>读取压入栈中的参数。</p><p>第<code>28</code>行将第二个压入的参数，即立即数<code>2</code>从栈中移动到<code>ax</code>中。因为<code>call</code>指令隐式压入了<code>ip</code>、<code>pushw %bp</code>压入了<code>bp</code>，占用了<code>4</code>个字节，所以第二个压入的参数距离栈顶的偏移量是<code>4</code>，第一个参数偏移量是<code>6</code>。</p><p>第<code>29</code>行取出第一个参数和第二个参数相加，结果保存在<code>ax</code>中。</p><p>第<code>31</code>行恢复<code>bp</code>。</p><p>第<code>32</code>行退出函数。</p><h4 id="编译运行" tabindex="-1"><a class="header-anchor" href="#编译运行" aria-hidden="true">#</a> 编译运行</h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ as <span class="token parameter variable">--32</span> boot.s <span class="token parameter variable">-o</span> boot.o
$ objcopy <span class="token parameter variable">-O</span> binary <span class="token parameter variable">-j</span> .text boot.o boot.bin
$ qemu-system-i386 boot.bin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="`+t+`" alt="16bit_c_1" tabindex="0" loading="lazy"><figcaption>16bit_c_1</figcaption></figure><h4 id="反编译" tabindex="-1"><a class="header-anchor" href="#反编译" aria-hidden="true">#</a> 反编译</h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ objdump <span class="token parameter variable">-D</span> <span class="token parameter variable">-b</span> binary <span class="token parameter variable">-m</span> i386 -Mi8086,suffix boot.bin

boot.bin：     文件格式 binary


Disassembly of section .data:

00000000 <span class="token operator">&lt;</span>.data<span class="token operator">&gt;</span>:
   <span class="token number">0</span>:   b8 00 b8                movw   <span class="token variable">$0xb800</span>,%ax
   <span class="token number">3</span>:   8e c0                   movw   %ax,%es
   <span class="token number">5</span>:   <span class="token number">31</span> c0                   xorw   %ax,%ax
   <span class="token number">7</span>:   8e d0                   movw   %ax,%ss
   <span class="token number">9</span>:   <span class="token function">bc</span> 00 7c                movw   <span class="token variable">$0x7c00</span>,%sp
   c:   6a 01                   pushw  <span class="token variable">$0x1</span>
   e:   6a 02                   pushw  <span class="token variable">$0x2</span>
  <span class="token number">10</span>:   e8 0c 00                callw  0x1f
  <span class="token number">13</span>:   <span class="token number">83</span> c4 04                addw   <span class="token variable">$0x4</span>,%sp
  <span class="token number">16</span>:   0d <span class="token number">30</span> 0a                orw    <span class="token variable">$0xa30</span>,%ax
  <span class="token number">19</span>:   <span class="token number">26</span> a3 00 00             movw   %ax,%es:0x0
  1d:   eb fe                   jmp    0x1d
  1f:   <span class="token number">55</span>                      pushw  %bp
  <span class="token number">20</span>:   <span class="token number">89</span> e5                   movw   %sp,%bp
  <span class="token number">22</span>:   8b <span class="token number">46</span> 04                movw   0x4<span class="token punctuation">(</span>%bp<span class="token punctuation">)</span>,%ax
  <span class="token number">25</span>:   03 <span class="token number">46</span> 06                addw   0x6<span class="token punctuation">(</span>%bp<span class="token punctuation">)</span>,%ax
  <span class="token number">28</span>:   5d                      popw   %bp
  <span class="token number">29</span>:   c3                      retw
        <span class="token punctuation">..</span>.
 1fe:   <span class="token number">55</span>                      pushw  %bp
 1ff:   aa                      stosb  %al,%es:<span class="token punctuation">(</span>%di<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>先把结果放在这里，稍后过来对比。</p><p>下面我们尝试一下<code>32</code>位指令和寄存器。</p><h3 id="使用-32-位指令和寄存器" tabindex="-1"><a class="header-anchor" href="#使用-32-位指令和寄存器" aria-hidden="true">#</a> 使用 32 位指令和寄存器</h3><h4 id="代码-1" tabindex="-1"><a class="header-anchor" href="#代码-1" aria-hidden="true">#</a> 代码</h4><div class="language-asm line-numbers-mode" data-ext="asm"><pre class="language-asm"><code>.section .text

.globl start
start:
  .code16
  movw $0xb800, %ax
  movw %ax, %es

  xorw %ax, %ax
  movw %ax, %ss

  movw $0x7c00, %sp

  pushl $1
  pushl $2
  calll sum
  addl $8, %esp

  orw $0x0a30, %ax
  movw %ax, %es:0

  jmp .

sum:
  pushl %ebp
  movl %esp, %ebp

  movl 0x8(%ebp), %eax
  addl 0xc(%ebp), %eax

  popl %ebp
  retl

.org 510
.word 0xAA55
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="解释-1" tabindex="-1"><a class="header-anchor" href="#解释-1" aria-hidden="true">#</a> 解释</h4><p>与常规操作中的主要区别在第<code>14~17</code>行和<code>sum</code>函数中。我们指定了指令的长度为<code>32</code>位，加了<code>l</code>后缀。</p><p>第<code>17</code>行因为指定数据的长度是<code>32</code>位，所以一个操作数的长度是<code>4</code>个字节，压入了两个，这里加<code>8</code>恢复栈顶指针。</p><p>第<code>28、29</code>行因为数据都是<code>32</code>位的，<code>eip</code>、<code>ebp</code>也都是<code>32</code>位的，所以这里参数的偏移量是<code>2*4 = 8</code>、<code>2*4+4 = 0xc</code>。</p><h4 id="编译运行-1" tabindex="-1"><a class="header-anchor" href="#编译运行-1" aria-hidden="true">#</a> 编译运行</h4><p>结果同上，不贴图了。我们主要反编译一下，看一下同样的效果，底层的区别在哪里。</p><h4 id="反编译-1" tabindex="-1"><a class="header-anchor" href="#反编译-1" aria-hidden="true">#</a> 反编译</h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ objdump <span class="token parameter variable">-D</span> <span class="token parameter variable">-b</span> binary <span class="token parameter variable">-m</span> i386 -Mi8086,suffix boot.bin

boot.bin：     文件格式 binary


Disassembly of section .data:

00000000 <span class="token operator">&lt;</span>.data<span class="token operator">&gt;</span>:
   <span class="token number">0</span>:   b8 00 b8                movw   <span class="token variable">$0xb800</span>,%ax
   <span class="token number">3</span>:   8e c0                   movw   %ax,%es
   <span class="token number">5</span>:   <span class="token number">31</span> c0                   xorw   %ax,%ax
   <span class="token number">7</span>:   8e d0                   movw   %ax,%ss
   <span class="token number">9</span>:   <span class="token function">bc</span> 00 7c                movw   <span class="token variable">$0x7c00</span>,%sp
   c:   <span class="token number">66</span> 6a 01                pushl  <span class="token variable">$0x1</span>
   f:   <span class="token number">66</span> 6a 02                pushl  <span class="token variable">$0x2</span>
  <span class="token number">12</span>:   <span class="token number">66</span> e8 0d 00 00 00       calll  0x25
  <span class="token number">18</span>:   <span class="token number">66</span> <span class="token number">83</span> c4 08             addl   <span class="token variable">$0x8</span>,%esp
  1c:   0d <span class="token number">30</span> 0a                orw    <span class="token variable">$0xa30</span>,%ax
  1f:   <span class="token number">26</span> a3 00 00             movw   %ax,%es:0x0
  <span class="token number">23</span>:   eb fe                   jmp    0x23
  <span class="token number">25</span>:   <span class="token number">66</span> <span class="token number">55</span>                   pushl  %ebp
  <span class="token number">27</span>:   <span class="token number">66</span> <span class="token number">89</span> e5                movl   %esp,%ebp
  2a:   <span class="token number">67</span> <span class="token number">66</span> 8b <span class="token number">45</span> 08          movl   0x8<span class="token punctuation">(</span>%ebp<span class="token punctuation">)</span>,%eax
  2f:   <span class="token number">67</span> <span class="token number">66</span> 03 <span class="token number">45</span> 0c          addl   0xc<span class="token punctuation">(</span>%ebp<span class="token punctuation">)</span>,%eax
  <span class="token number">34</span>:   <span class="token number">66</span> 5d                   popl   %ebp
  <span class="token number">36</span>:   <span class="token number">66</span> c3                   retl
        <span class="token punctuation">..</span>.
 1fc:   00 00                   addb   %al,<span class="token punctuation">(</span>%bx,%si<span class="token punctuation">)</span>
 1fe:   <span class="token number">55</span>                      pushw  %bp
 1ff:   aa                      stosb  %al,%es:<span class="token punctuation">(</span>%di<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对比第<code>14~17</code>行，这<code>4</code>行指令前都多了前缀<code>0x66</code>。<code>0x66</code>指令前缀用于反转当前默认操作数大小，处理器当前运行在<code>16</code>位实模式下，操作数大小反转后成为<code>32</code>位。</p><p>第<code>23、24</code>行多了前缀<code>0x67</code>。<code>0x67</code>指令前缀用于反转当前默认地址大小，因为这两行涉及内存寻址。</p><p>有了上面两个示例作为基础，下面我们将<code>sum</code>改造为<code>c</code>语言函数。</p><h3 id="使用-c-语言" tabindex="-1"><a class="header-anchor" href="#使用-c-语言" aria-hidden="true">#</a> 使用 C 语言</h3><h4 id="代码-2" tabindex="-1"><a class="header-anchor" href="#代码-2" aria-hidden="true">#</a> 代码</h4><h5 id="汇编代码" tabindex="-1"><a class="header-anchor" href="#汇编代码" aria-hidden="true">#</a> 汇编代码</h5><div class="language-asm line-numbers-mode" data-ext="asm"><pre class="language-asm"><code>.section .text

.globl start
start:
  .code16
  movw $0xb800, %ax
  movw %ax, %es

  xorw %ax, %ax
  movw %ax, %ss

  movw $0x7c00, %sp

  pushl $1
  pushl $2
  calll sum
  addl $8, %esp

  orw $0x0a30, %ax
  movw %ax, %es:0

  jmp .
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>汇编部分我们从上面的示例中删掉了<code>jmp</code>指令之后的内容。<code>sum</code>函数我们放在<code>c</code>语言的代码中，引导标识<code>0xAA55</code>我们稍后手动写入。</p><h5 id="c-语言代码" tabindex="-1"><a class="header-anchor" href="#c-语言代码" aria-hidden="true">#</a> c 语言代码</h5><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token keyword">int</span> <span class="token function">sum</span><span class="token punctuation">(</span><span class="token keyword">int</span> x<span class="token punctuation">,</span> <span class="token keyword">int</span> y<span class="token punctuation">)</span>
<span class="token punctuation">{</span>
  <span class="token keyword">return</span> x <span class="token operator">+</span> y<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>和通常的代码没有区别，只是编译、链接稍有不同。</p><h4 id="编译链接" tabindex="-1"><a class="header-anchor" href="#编译链接" aria-hidden="true">#</a> 编译链接</h4><h5 id="编译" tabindex="-1"><a class="header-anchor" href="#编译" aria-hidden="true">#</a> 编译</h5><p>先来编译汇编语言的部分。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ as <span class="token parameter variable">--32</span> boot.s <span class="token parameter variable">-o</span> boot.o
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>编译<code>c</code>语言部分。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ cc <span class="token parameter variable">-m16</span> <span class="token parameter variable">-ffreestanding</span> -fno-pic <span class="token parameter variable">-c</span> sum.c <span class="token parameter variable">-o</span> sum.o
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul><li><p><code>-m16</code> 告知编译器生成 16 位指令</p></li><li><p><code>-ffreestanding</code> 告知编译器按独立环境编译，该环境可以没有标准库，且对<code>main()</code>函数没有要求。该选项隐含设置了<code>-fno-builtin</code>，且与<code>-fno-hosted</code>等价</p></li><li><p><code>-fno-pic</code> 告知编译器禁止生成位置无关的代码</p></li></ul><h5 id="链接" tabindex="-1"><a class="header-anchor" href="#链接" aria-hidden="true">#</a> 链接</h5><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ ld <span class="token parameter variable">-m</span> elf_i386 boot.o sum.o <span class="token parameter variable">-o</span> boot.elf
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这里会有一个警告，因为我们没有指定入口点，而默认的入口点是<code>_start</code>。我们并没有用到，不理他就行了。</p><p>接下来从<code>elf</code>文件中复制出纯二进制的代码段内容。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ objcopy <span class="token parameter variable">-O</span> binary <span class="token parameter variable">-j</span> .text boot.elf boot.bin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,60),m=s("code",null,"0xAA55",-1),k={href:"https://github.com/kviccn/asm-boooom/blob/master/0x00/sign.c",target:"_blank",rel:"noopener noreferrer"},h=e(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ ./sign boot.bin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>运行结果还是同上，不贴图了。</p><h4 id="反编译-2" tabindex="-1"><a class="header-anchor" href="#反编译-2" aria-hidden="true">#</a> 反编译</h4><p>来看看包含<code>c</code>语言代码的程序和之前纯汇编的有什么不同。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ objdump <span class="token parameter variable">-D</span> <span class="token parameter variable">-b</span> binary <span class="token parameter variable">-m</span> i386 -Mi8086,suffix boot.bin

boot.bin：     文件格式 binary


Disassembly of section .data:

00000000 <span class="token operator">&lt;</span>.data<span class="token operator">&gt;</span>:
   <span class="token number">0</span>:   b8 00 b8                movw   <span class="token variable">$0xb800</span>,%ax
   <span class="token number">3</span>:   8e c0                   movw   %ax,%es
   <span class="token number">5</span>:   <span class="token number">31</span> c0                   xorw   %ax,%ax
   <span class="token number">7</span>:   8e d0                   movw   %ax,%ss
   <span class="token number">9</span>:   <span class="token function">bc</span> 00 7c                movw   <span class="token variable">$0x7c00</span>,%sp
   c:   <span class="token number">66</span> 6a 01                pushl  <span class="token variable">$0x1</span>
   f:   <span class="token number">66</span> 6a 02                pushl  <span class="token variable">$0x2</span>
  <span class="token number">12</span>:   <span class="token number">66</span> e8 0d 00 00 00       calll  0x25
  <span class="token number">18</span>:   <span class="token number">66</span> <span class="token number">83</span> c4 08             addl   <span class="token variable">$0x8</span>,%esp
  1c:   0d <span class="token number">30</span> 0a                orw    <span class="token variable">$0xa30</span>,%ax
  1f:   <span class="token number">26</span> a3 00 00             movw   %ax,%es:0x0
  <span class="token number">23</span>:   eb fe                   jmp    0x23
  <span class="token number">25</span>:   <span class="token number">66</span> <span class="token number">55</span>                   pushl  %ebp
  <span class="token number">27</span>:   <span class="token number">66</span> <span class="token number">89</span> e5                movl   %esp,%ebp
  2a:   <span class="token number">67</span> <span class="token number">66</span> 8b <span class="token number">55</span> 08          movl   0x8<span class="token punctuation">(</span>%ebp<span class="token punctuation">)</span>,%edx
  2f:   <span class="token number">67</span> <span class="token number">66</span> 8b <span class="token number">45</span> 0c          movl   0xc<span class="token punctuation">(</span>%ebp<span class="token punctuation">)</span>,%eax
  <span class="token number">34</span>:   <span class="token number">66</span> 01 d0                addl   %edx,%eax
  <span class="token number">37</span>:   <span class="token number">66</span> 5d                   popl   %ebp
  <span class="token number">39</span>:   <span class="token number">66</span> c3                   retl
        <span class="token punctuation">..</span>.
 1fb:   00 00                   addb   %al,<span class="token punctuation">(</span>%bx,%si<span class="token punctuation">)</span>
 1fd:   00 <span class="token number">55</span> aa                addb   %dl,-0x56<span class="token punctuation">(</span>%di<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token number">23</span>,26c23,27
<span class="token operator">&lt;</span>   2a:   <span class="token number">67</span> <span class="token number">66</span> 8b <span class="token number">45</span> 08          movl   0x8<span class="token punctuation">(</span>%ebp<span class="token punctuation">)</span>,%eax
<span class="token operator">&lt;</span>   2f:   <span class="token number">67</span> <span class="token number">66</span> 03 <span class="token number">45</span> 0c          addl   0xc<span class="token punctuation">(</span>%ebp<span class="token punctuation">)</span>,%eax
<span class="token operator">&lt;</span>   <span class="token number">34</span>:   <span class="token number">66</span> 5d                   popl   %ebp
<span class="token operator">&lt;</span>   <span class="token number">36</span>:   <span class="token number">66</span> c3                   retl
---
<span class="token operator">&gt;</span>   2a:   <span class="token number">67</span> <span class="token number">66</span> 8b <span class="token number">55</span> 08          movl   0x8<span class="token punctuation">(</span>%ebp<span class="token punctuation">)</span>,%edx
<span class="token operator">&gt;</span>   2f:   <span class="token number">67</span> <span class="token number">66</span> 8b <span class="token number">45</span> 0c          movl   0xc<span class="token punctuation">(</span>%ebp<span class="token punctuation">)</span>,%eax
<span class="token operator">&gt;</span>   <span class="token number">34</span>:   <span class="token number">66</span> 01 d0                addl   %edx,%eax
<span class="token operator">&gt;</span>   <span class="token number">37</span>:   <span class="token number">66</span> 5d                   popl   %ebp
<span class="token operator">&gt;</span>   <span class="token number">39</span>:   <span class="token number">66</span> c3                   retl
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>对比一下，我们发现在<code>c</code>语言的版本中，编译后的指令中多了一个步骤，上面的第<code>7</code>行，将一个参数放入<code>edx</code>中。比我们的纯汇编代码多了一条指令，换句话说，<code>c</code>语言生成的代码没有我们手写的汇编语言代码效率高。因为完成同样的任务，我们用了更少的指令。</p><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h2><p>首先要意识到虽然是在实模式下，但是我们的处理器是<code>32</code>位处理器，所以我们能够使用<code>32</code>位寄存器。在汇编代码中是通过给指令加<code>l</code>后缀指定操作数或地址的大小，对应生成的机器码中会加上<code>0x66</code>、<code>0x67</code>前缀反转当前默认操作数或地址大小。其次是<code>C</code>语言部分，虽然代码的写法和平常一样，但是编译的时候需要指定生成<code>16</code>位代码。</p>`,9);function x(f,g){const i=d("RouterLink"),c=d("ExternalLinkIcon");return p(),r("div",null,[b,s("p",null,[n("我们还是按照讲解代码的套路来。先来看看实模式下的常规操作，涉及"),a(i,{to:"/series/%E6%B1%87%E7%BC%96%E8%AF%AD%E8%A8%80%E4%B8%80%E5%8F%91%E5%85%A5%E9%AD%82/07-%E8%BF%87%E7%A8%8B%E8%B0%83%E7%94%A8.html"},{default:l(()=>[n("过程调用")]),_:1}),n("和"),a(i,{to:"/series/%E6%B1%87%E7%BC%96%E8%AF%AD%E8%A8%80%E4%B8%80%E5%8F%91%E5%85%A5%E9%AD%82/01-hello-world.html"},{default:l(()=>[n("显存的操作")]),_:1}),n("。")]),v,s("p",null,[n("手动添加可引导标志"),m,n("，这里我们通过之前写的一个"),s("a",k,[n("小工具"),a(c)]),n("来完成这项工作。")]),h])}const $=o(u,[["render",x],["__file","使用c语言编写运行于16位实模式下的代码.html.vue"]]);export{$ as default};
