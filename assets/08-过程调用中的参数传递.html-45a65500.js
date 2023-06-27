import{_ as i}from"./plugin-vue_export-helper-c27b6911.js";import{r as d,o as l,c,b as s,d as n,e as a,a as v}from"./app-a3b1dd03.js";const r="/assets/boote-aaf7ad27.png",o={},p=v(`<p>通常我们封装过程是为了方便调用，避免写重复的代码。过程调用时通常需要通过传递参数来控制过程的执行，今天我们来讲一讲参数传递时的一些规范和需要注意的地方。</p><p>先来看一个例子：</p><h2 id="示例一" tabindex="-1"><a class="header-anchor" href="#示例一" aria-hidden="true">#</a> 示例一</h2><div class="language-asm line-numbers-mode" data-ext="asm"><pre class="language-asm"><code>.code16

movw $0x7c00, %sp

callw set_cursor

jmp .

# 目的: 设置光标位置为 0
#
# 输入: 无
#
# 输出: 无
set_cursor:
  movw $0x3d4, %dx
  movb $0xe, %al
  outb %al, %dx

  movw $0x3d5, %dx
  movb $0, %al
  outb %al, %dx

  movw $0x3d4, %dx
  movb $0xf, %al
  outb %al, %dx

  movw $0x3d5, %dx
  movb $0, %al
  outb %al, %dx

  retw

.org 510
.word 0xAA55
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个例子中的过程<code>set_cursor</code>，或者称为函数，没有输入，也没有输出。这个函数实际上是没有什么实际用处的，因为它只能将光标位置设置为<code>0</code>，即屏幕左上角。想要这个函数有实际的用处的话就需要给它传递参数，将想要设置的位置作为参数传递给它。传递参数的方式大体上来说有三种：</p><ol><li>通过寄存器传递。即将参数预先放入寄存器中，被调用的函数执行时去这个寄存器中获取参数。</li><li>通过堆栈传递。即调用函数前，先将参数压入栈中，被调函数通过<code>bp</code>寄存器间接寻址，获取堆栈上放置的参数。</li><li>通过寄存器和堆栈传递。即一部分参数放在寄存器中，一部分放在堆栈上。</li></ol><p>通过寄存器传递参数很简单，所以我们主要讲解一下通过堆栈传递参数时需要注意的地方。下面看一下改造后的可以接收参数的<code>set_cursor</code>：</p><h2 id="示例二" tabindex="-1"><a class="header-anchor" href="#示例二" aria-hidden="true">#</a> 示例二</h2><h3 id="代码" tabindex="-1"><a class="header-anchor" href="#代码" aria-hidden="true">#</a> 代码</h3><div class="language-asm line-numbers-mode" data-ext="asm"><pre class="language-asm"><code>.code16

movw $0x7c00, %sp

pushw $79
callw set_cursor
addw $2, %sp

jmp .

# 目的: 设置光标位置
#
# 输入:
#   参数1 光标所在位置
#
# 输出: 无
set_cursor:
  movw %sp, %bp

  movw $0x3d4, %dx
  movb $0xe, %al
  outb %al, %dx

  movw $0x3d5, %dx
  movb 3(%bp), %al
  outb %al, %dx

  movw $0x3d4, %dx
  movb $0xf, %al
  outb %al, %dx

  movw $0x3d5, %dx
  movb 2(%bp), %al
  outb %al, %dx

  retw

.org 510
.word 0xAA55
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="解释" tabindex="-1"><a class="header-anchor" href="#解释" aria-hidden="true">#</a> 解释</h3><p>第<code>5</code>行将参数<code>79</code>压入栈中，因为一行是<code>80</code>列，从<code>0</code>开始计数，<code>79</code>是第一行的最后一列。</p><p>第<code>6</code>行调用<code>set_cursor</code>，注意这里有一个隐含的将<code>ip</code>压栈的操作。</p><p>第<code>7</code>行用于恢复栈顶指针。</p><p>第<code>18</code>行将当前栈顶指针复制给<code>bp</code>，因为要通过<code>bp</code>间接访问堆栈中的参数。</p><p>第<code>25、33</code>行分别通过<code>3(%bp)、2(%bp)</code>访问参数的高<code>8</code>位和低<code>8</code>位。此时<code>bp</code>指向栈顶，从栈顶向上的两个字节保存的是<code>ip</code>，即偏移量为<code>0, 1</code>的两个内存单元，<code>2, 3</code>这两个单元保存的是我们压入栈中的参数。</p><p>第<code>36</code>行通过<code>ret</code>从函数返回，同时将<code>ip</code>出栈，此时堆栈中只剩调用函数之前压入的参数了。</p><h3 id="调试" tabindex="-1"><a class="header-anchor" href="#调试" aria-hidden="true">#</a> 调试</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ as <span class="token parameter variable">--32</span> bootb.s <span class="token parameter variable">-o</span> bootb.o
$ objcopy <span class="token parameter variable">-O</span> binary <span class="token parameter variable">-j</span> .text bootb.o bootb.bin
$ qemu-system-i386 bootb.bin <span class="token parameter variable">-S</span> <span class="token parameter variable">-s</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ gdb <span class="token parameter variable">-q</span>
Breakpoint <span class="token number">1</span>, 0x00007c00 <span class="token keyword">in</span> ?? <span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token number">1</span>: x/i <span class="token variable">$cs</span>*16+<span class="token variable">$pc</span>
<span class="token operator">=</span><span class="token operator">&gt;</span> 0x7c00:      mov    <span class="token variable">$0x7c00</span>,%sp
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>设置<code>sp</code>并查看寄存器内容：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> si
0x00007c03 <span class="token keyword">in</span> ?? <span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token number">1</span>: x/i <span class="token variable">$cs</span>*16+<span class="token variable">$pc</span>
<span class="token operator">=</span><span class="token operator">&gt;</span> 0x7c03:      push   <span class="token variable">$0x4f</span>
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> info registers
eax            0xaa55   <span class="token number">43605</span>
ecx            0x0      <span class="token number">0</span>
edx            0x80     <span class="token number">128</span>
ebx            0x0      <span class="token number">0</span>
esp            0x7c00   0x7c00
ebp            0x0      0x0
esi            0x0      <span class="token number">0</span>
edi            0x0      <span class="token number">0</span>
eip            0x7c03   0x7c03
eflags         0x202    <span class="token punctuation">[</span> IF <span class="token punctuation">]</span>
cs             0x0      <span class="token number">0</span>
ss             0x0      <span class="token number">0</span>
ds             0x0      <span class="token number">0</span>
es             0x0      <span class="token number">0</span>
fs             0x0      <span class="token number">0</span>
gs             0x0      <span class="token number">0</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时<code>sp</code>指向<code>0x7c00</code>，将参数压栈并查看寄存器和堆栈内容：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> si
0x00007c05 <span class="token keyword">in</span> ?? <span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token number">1</span>: x/i <span class="token variable">$cs</span>*16+<span class="token variable">$pc</span>
<span class="token operator">=</span><span class="token operator">&gt;</span> 0x7c05:      call   0x7c0d
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> info registers
eax            0xaa55   <span class="token number">43605</span>
ecx            0x0      <span class="token number">0</span>
edx            0x80     <span class="token number">128</span>
ebx            0x0      <span class="token number">0</span>
esp            0x7bfe   0x7bfe
ebp            0x0      0x0
esi            0x0      <span class="token number">0</span>
edi            0x0      <span class="token number">0</span>
eip            0x7c05   0x7c05
eflags         0x202    <span class="token punctuation">[</span> IF <span class="token punctuation">]</span>
cs             0x0      <span class="token number">0</span>
ss             0x0      <span class="token number">0</span>
ds             0x0      <span class="token number">0</span>
es             0x0      <span class="token number">0</span>
fs             0x0      <span class="token number">0</span>
gs             0x0      <span class="token number">0</span>
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> x/1dh 0x7bfe
0x7bfe: <span class="token number">79</span>
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时栈中压入一个参数，<code>sp</code>减<code>2</code>，指向<code>0x7bfe</code>。调用函数并查看寄存器中的值：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> si
0x00007c0d <span class="token keyword">in</span> ?? <span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token number">1</span>: x/i <span class="token variable">$cs</span>*16+<span class="token variable">$pc</span>
<span class="token operator">=</span><span class="token operator">&gt;</span> 0x7c0d:      mov    %sp,%bp
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> info registers
eax            0xaa55   <span class="token number">43605</span>
ecx            0x0      <span class="token number">0</span>
edx            0x80     <span class="token number">128</span>
ebx            0x0      <span class="token number">0</span>
esp            0x7bfc   0x7bfc
ebp            0x0      0x0
esi            0x0      <span class="token number">0</span>
edi            0x0      <span class="token number">0</span>
eip            0x7c0d   0x7c0d
eflags         0x202    <span class="token punctuation">[</span> IF <span class="token punctuation">]</span>
cs             0x0      <span class="token number">0</span>
ss             0x0      <span class="token number">0</span>
ds             0x0      <span class="token number">0</span>
es             0x0      <span class="token number">0</span>
fs             0x0      <span class="token number">0</span>
gs             0x0      <span class="token number">0</span>
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> x/2xh 0x7bfc
0x7bfc: 0x7c08  0x004f
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>call</code>指令隐式的将<code>ip</code>压栈，<code>sp</code>减<code>2</code>，指向<code>0x7bfc</code>。执行到函数返回，查看寄存器内容：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> si <span class="token number">14</span>
0x00007c08 <span class="token keyword">in</span> ?? <span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token number">1</span>: x/i <span class="token variable">$cs</span>*16+<span class="token variable">$pc</span>
<span class="token operator">=</span><span class="token operator">&gt;</span> 0x7c08:      <span class="token function">add</span>    <span class="token variable">$0x2</span>,%sp
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> info registers
eax            0xaa4f   <span class="token number">43599</span>
ecx            0x0      <span class="token number">0</span>
edx            0x3d5    <span class="token number">981</span>
ebx            0x0      <span class="token number">0</span>
esp            0x7bfe   0x7bfe
ebp            0x7bfc   0x7bfc
esi            0x0      <span class="token number">0</span>
edi            0x0      <span class="token number">0</span>
eip            0x7c08   0x7c08
eflags         0x202    <span class="token punctuation">[</span> IF <span class="token punctuation">]</span>
cs             0x0      <span class="token number">0</span>
ss             0x0      <span class="token number">0</span>
ds             0x0      <span class="token number">0</span>
es             0x0      <span class="token number">0</span>
fs             0x0      <span class="token number">0</span>
gs             0x0      <span class="token number">0</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时函数已通过<code>ret</code>指令返回，<code>ip</code>被弹出，<code>sp</code>加<code>2</code>，恢复到压入参数后的状态。继续执行，将<code>sp</code>恢复到参数压栈前：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> si
0x00007c0b <span class="token keyword">in</span> ?? <span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token number">1</span>: x/i <span class="token variable">$cs</span>*16+<span class="token variable">$pc</span>
<span class="token operator">=</span><span class="token operator">&gt;</span> 0x7c0b:      jmp    0x7c0b
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> info registers
eax            0xaa4f   <span class="token number">43599</span>
ecx            0x0      <span class="token number">0</span>
edx            0x3d5    <span class="token number">981</span>
ebx            0x0      <span class="token number">0</span>
esp            0x7c00   0x7c00
ebp            0x7bfc   0x7bfc
esi            0x0      <span class="token number">0</span>
edi            0x0      <span class="token number">0</span>
eip            0x7c0b   0x7c0b
eflags         0x216    <span class="token punctuation">[</span> PF AF IF <span class="token punctuation">]</span>
cs             0x0      <span class="token number">0</span>
ss             0x0      <span class="token number">0</span>
ds             0x0      <span class="token number">0</span>
es             0x0      <span class="token number">0</span>
fs             0x0      <span class="token number">0</span>
gs             0x0      <span class="token number">0</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>虽然我们初步实现了功能，但是可以看到有些寄存器的内容也被我们的函数更改了，例如<code>bp</code>。想想一下，如果我们有多个函数需要嵌套调用，每一个函数都需要通过<code>bp</code>访问堆栈中的参数，每一个函数执行完成之后都会修改<code>bp</code>，那么调用函数的过程就无法再使用<code>bp</code>访问自己的参数了。为了解决这个问题，我们需要将函数中被修改的寄存器先保存在堆栈中，函数返回时再恢复被修改过的寄存器。</p><p>来看看完整的示例：</p><h2 id="示例三" tabindex="-1"><a class="header-anchor" href="#示例三" aria-hidden="true">#</a> 示例三</h2><h3 id="代码-1" tabindex="-1"><a class="header-anchor" href="#代码-1" aria-hidden="true">#</a> 代码</h3><div class="language-asm line-numbers-mode" data-ext="asm"><pre class="language-asm"><code>.code16

movw $0x7c00, %sp

pushw $79
callw set_cursor
addw $2, %sp

jmp .

# 目的: 设置光标位置
#
# 输入:
#   参数1 光标所在位置
#
# 输出: 无
set_cursor:
  pushw %bp
  movw %sp, %bp

  movw $0x3d4, %dx
  movb $0xe, %al
  outb %al, %dx

  movw $0x3d5, %dx
  movb 5(%bp), %al
  outb %al, %dx

  movw $0x3d4, %dx
  movb $0xf, %al
  outb %al, %dx

  movw $0x3d5, %dx
  movb 4(%bp), %al
  outb %al, %dx

  movw %bp, %sp
  popw %bp

  retw

.org 510
.word 0xAA55
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="解释-1" tabindex="-1"><a class="header-anchor" href="#解释-1" aria-hidden="true">#</a> 解释</h3><p>第<code>18、19</code>行先将<code>bp</code>保存在栈中，然后将当前栈顶指针复制到<code>bp</code>。</p><p>第<code>26、34</code>行的偏移量分别比上一个示例中增加了<code>2</code>，因为多压了<code>bp</code>在栈中。</p><p>第<code>37、38</code>行恢复<code>bp</code>。</p><p>通常在进入函数和离开函数时都需要保存和恢复<code>bp</code>，即执行下面的指令：</p><div class="language-asm line-numbers-mode" data-ext="asm"><pre class="language-asm"><code>pushw %bp
movw %sp, %bp

movw %bp, %sp
popw %bp
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>所以处理器也为我们提供了简化的指令分别对应上面的两组指令：</p><div class="language-asm line-numbers-mode" data-ext="asm"><pre class="language-asm"><code>enterw

leavew
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,43),u={href:"https://github.com/kviccn/asm-boooom/blob/master/0x08/bootb2.s",target:"_blank",rel:"noopener noreferrer"},b=s("code",null,"sp",-1),t=s("code",null,"add",-1),m=s("code",null,"ret",-1),x={href:"https://github.com/kviccn/asm-boooom/blob/master/0x08/bootc.s",target:"_blank",rel:"noopener noreferrer"},k={href:"https://github.com/kviccn/asm-boooom/blob/master/0x08/boote.s",target:"_blank",rel:"noopener noreferrer"},h=s("figure",null,[s("img",{src:r,alt:"boote",tabindex:"0",loading:"lazy"}),s("figcaption",null,"boote")],-1);function g(f,_){const e=d("ExternalLinkIcon");return l(),c("div",null,[p,s("p",null,[n("完整的示例戳"),s("a",u,[n("这里"),a(e)]),n("。")]),s("p",null,[n("关于函数调用之后的"),b,n("的恢复除了在调用函数中通过"),t,n("指令恢复外还可以在被调函数中通过"),m,n("指令的操作数来恢复。戳"),s("a",x,[n("这里"),a(e)]),n("。")]),s("p",null,[n("最后再给大家一个功能多一点的"),s("a",k,[n("例子"),a(e)]),n("。实现了清屏，设置光标位置，获取光标位置，打印字符，打印字符串等功能。比较完整的演示了函数调用中的参数传递，返回值，嵌套调用等情况。示例的输出如下，有兴趣的小朋友可以自己研究研究。")]),h])}const y=i(o,[["render",g],["__file","08-过程调用中的参数传递.html.vue"]]);export{y as default};
