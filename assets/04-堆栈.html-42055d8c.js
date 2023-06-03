import{_ as d}from"./plugin-vue_export-helper-c27b6911.js";import{r as i,o as c,c as l,b as e,d as n,e as o,a as s}from"./app-9978a549.js";const p="/assets/stack_op-8a115d46.png",r={},v=s(`<p>上一篇文章中我们实现了数字各个位的分解并打印在屏幕上。他需要我们知道数字有多少个位，并且提前预留出内存空间保存每个位，这显然不是一个完美的解决方案。现在我们来学习一下堆栈，并使用堆栈来保存分解出的每个位，实现可以分解任意位的数字。</p><p>先解释一下<code>堆栈</code>。实际上这个<code>堆栈</code>和<code>堆(heap)</code>并没有关系，只是一个纯粹的<code>栈(stack)</code>，可能是<code>堆栈</code>这样叫起来更上口一点吧。</p><p><code>堆栈段</code>和其他段一样，只是一段普通的内存空间，只是我们限制了对这部分内存空间操作的行为。我们只允许通过<code>push（压栈）</code>和<code>pop（出栈）</code>这两个指令来操作堆栈段的内存空间，以此来实现一些算法。使用<code>堆栈段</code>之前需要先初始化<code>段基址(ss)</code>和<code>栈顶指针(sp)</code>，例如将<code>ss</code>初始化为<code>0x0000</code>，<code>sp</code>初始化为<code>0x7c00</code>。此时堆栈段的逻辑地址为<code>0x0000:0x0000</code>到<code>0x0000:0x7c00</code>，对应的物理地址为<code>0x00000</code>到<code>0x07c00</code>。</p><p><code>push</code>指令用于将操作数压入栈中。在<code>16</code>位的处理器上，<code>push</code>指令的操作数可以是<code>16</code>位的寄存器或者内存单元。对于<code>8086</code>处理器来说，压栈的数据长度必须是一个字。处理器在执行<code>push</code>指令时，首先将堆栈指针寄存器<code>sp</code>的内容减去操作数的字长（以字节为单位的长度，在<code>16</code>位处理器上是<code>2</code>），然后，把要压入堆栈的数据存放到逻辑地址<code>ss:sp</code>所指向的内存位置。当<code>ss</code>和<code>sp</code>初始化为上述状态时，第一次执行<code>push</code>指令，<code>sp</code>先减去<code>2</code>，得到<code>0x7bfe</code>，然后将数据压入<code>0x0000:0x7bfe</code>对应的物理地址处。</p><p><code>pop</code>指令用于将操作数从栈中弹出。在<code>16</code>位的处理器上，<code>pop</code>指令的操作数可以是<code>16</code>位的寄存器或者内存单元。<code>pop</code>指令执行时，处理器先取得<code>ss:sp</code>对应的物理地址处的数据。然后，将<code>sp</code>的内容加上操作数的字长，以指向下一个堆栈位置。</p><p>下面我们通过一小段代码来熟悉一下<code>堆栈段</code>的操作。</p><h2 id="代码" tabindex="-1"><a class="header-anchor" href="#代码" aria-hidden="true">#</a> 代码</h2><div class="language-asm line-numbers-mode" data-ext="asm"><pre class="language-asm"><code>.code16

movw $0xb800, %ax
movw %ax, %ds

xorw %ax, %ax
movw %ax, %ss

movw $0x7c00, %sp

pushw $&#39;c&#39; | 0x0a00
pushw $&#39;b&#39; | 0x0a00
pushw $&#39;a&#39; | 0x0a00

popw 0
popw 2
popw 4

jmp .

.org 510
.word 0xAA55
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="解释" tabindex="-1"><a class="header-anchor" href="#解释" aria-hidden="true">#</a> 解释</h2><p>第<code>3、4</code>行我们让<code>ds</code>指向显存缓冲区，这样我们在后续将数据弹出到显存缓冲区时就不需要加段前缀了。</p><p>第<code>6、7</code>行将<code>ss</code>设置为<code>0x0000</code>，实际上这不是必须的，因为<code>ss</code>在启动时就会被初始化为<code>0x0000</code>。</p><p>第<code>9</code>行将堆栈指针寄存器<code>sp</code>设置为<code>0x7c00</code>。</p><p>第<code>11~13</code>行将字符<code>c、b、a</code>及其显示属性<code>0x0a</code>一起压入栈中。因为<code>栈</code>是<code>后进先出</code>的，所以出栈的顺序是<code>a、b、c</code>。</p><p>第<code>15~17</code>行将<code>a、b、c</code>依次出栈。因为我们直接指定了偏移地址<code>0、2、4</code>，这默认会使用数据段寄存器<code>ds</code>作为基地址，所以实际上表示将三个字符及其显示属性依次弹出到内存<code>0xb800:0x0000</code>、<code>0xb800:0x0002</code>、<code>0xb800:0x0004</code>处，实现字符的打印。</p><h2 id="运行" tabindex="-1"><a class="header-anchor" href="#运行" aria-hidden="true">#</a> 运行</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ as <span class="token parameter variable">--32</span> stack_op.s <span class="token parameter variable">-o</span> stack_op.o
$ objcopy <span class="token parameter variable">-O</span> binary <span class="token parameter variable">-j</span> .text stack_op.o stack_op.bin
$ qemu-system-i386 stack_op.bin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="`+p+`" alt="stack_op" tabindex="0" loading="lazy"><figcaption>stack_op</figcaption></figure><h2 id="调试" tabindex="-1"><a class="header-anchor" href="#调试" aria-hidden="true">#</a> 调试</h2><p>启动虚拟机：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ qemu-system-i386 stack_op.bin <span class="token parameter variable">-S</span> <span class="token parameter variable">-s</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,20),u={href:"https://github.com/kviccn/asm-boooom/blob/master/gdb/.gdbinit",target:"_blank",rel:"noopener noreferrer"},t=s(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ gdb <span class="token parameter variable">-q</span>
warning: No executable has been specified and target does not support
determining executable automatically.  Try using the <span class="token string">&quot;file&quot;</span> command.
0x0000fff0 <span class="token keyword">in</span> ?? <span class="token punctuation">(</span><span class="token punctuation">)</span>
The target architecture is assumed to be i8086
warning: A handler <span class="token keyword">for</span> the OS ABI <span class="token string">&quot;GNU/Linux&quot;</span> is not built into this configuration
of GDB.  Attempting to <span class="token builtin class-name">continue</span> with the default i8086 settings.

warning: A handler <span class="token keyword">for</span> the OS ABI <span class="token string">&quot;GNU/Linux&quot;</span> is not built into this configuration
of GDB.  Attempting to <span class="token builtin class-name">continue</span> with the default i8086 settings.

Breakpoint <span class="token number">1</span> at 0x7c00

Breakpoint <span class="token number">1</span>, 0x00007c00 <span class="token keyword">in</span> ?? <span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token number">1</span>: x/i <span class="token variable">$cs</span>*16+<span class="token variable">$pc</span>
<span class="token operator">=</span><span class="token operator">&gt;</span> 0x7c00:      mov    <span class="token variable">$0xb800</span>,%ax
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第<code>12</code>行提示我们已经在<code>0x7c00</code>处打好了断点，让我们看一下此时寄存器的状态。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> info registers
eax            0xaa55   <span class="token number">43605</span>
ecx            0x0      <span class="token number">0</span>
edx            0x80     <span class="token number">128</span>
ebx            0x0      <span class="token number">0</span>
esp            0x6f04   0x6f04
ebp            0x0      0x0
esi            0x0      <span class="token number">0</span>
edi            0x0      <span class="token number">0</span>
eip            0x7c00   0x7c00
eflags         0x202    <span class="token punctuation">[</span> IF <span class="token punctuation">]</span>
cs             0x0      <span class="token number">0</span>
ss             0x0      <span class="token number">0</span>
ds             0x0      <span class="token number">0</span>
es             0x0      <span class="token number">0</span>
fs             0x0      <span class="token number">0</span>
gs             0x0      <span class="token number">0</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>ds</code>是<code>0</code>，<code>ss</code>是<code>0</code>，<code>sp</code>是<code>0x6f04</code>。向后执行<code>5</code>条指令再次查看寄存器内容。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> si <span class="token number">5</span>
0x00007c0c <span class="token keyword">in</span> ?? <span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token number">1</span>: x/i <span class="token variable">$cs</span>*16+<span class="token variable">$pc</span>
<span class="token operator">=</span><span class="token operator">&gt;</span> 0x7c0c:      push   <span class="token variable">$0xa63</span>
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> info registers
eax            0x0      <span class="token number">0</span>
ecx            0x0      <span class="token number">0</span>
edx            0x80     <span class="token number">128</span>
ebx            0x0      <span class="token number">0</span>
esp            0x7c00   0x7c00
ebp            0x0      0x0
esi            0x0      <span class="token number">0</span>
edi            0x0      <span class="token number">0</span>
eip            0x7c0c   0x7c0c
eflags         0x246    <span class="token punctuation">[</span> PF ZF IF <span class="token punctuation">]</span>
cs             0x0      <span class="token number">0</span>
ss             0x0      <span class="token number">0</span>
ds             0xb800   <span class="token number">47104</span>
es             0x0      <span class="token number">0</span>
fs             0x0      <span class="token number">0</span>
gs             0x0      <span class="token number">0</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时<code>ds</code>是<code>0xb800</code>，<code>ss</code>是<code>0</code>，<code>sp</code>是<code>0x7c00</code>。再向后执行<code>3</code>条指令并查看寄存器内容。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> si <span class="token number">3</span>
0x00007c15 <span class="token keyword">in</span> ?? <span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token number">1</span>: x/i <span class="token variable">$cs</span>*16+<span class="token variable">$pc</span>
<span class="token operator">=</span><span class="token operator">&gt;</span> 0x7c15:      popw   0x0
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> info registers
eax            0x0      <span class="token number">0</span>
ecx            0x0      <span class="token number">0</span>
edx            0x80     <span class="token number">128</span>
ebx            0x0      <span class="token number">0</span>
esp            0x7bfa   0x7bfa
ebp            0x0      0x0
esi            0x0      <span class="token number">0</span>
edi            0x0      <span class="token number">0</span>
eip            0x7c15   0x7c15
eflags         0x246    <span class="token punctuation">[</span> PF ZF IF <span class="token punctuation">]</span>
cs             0x0      <span class="token number">0</span>
ss             0x0      <span class="token number">0</span>
ds             0xb800   <span class="token number">47104</span>
es             0x0      <span class="token number">0</span>
fs             0x0      <span class="token number">0</span>
gs             0x0      <span class="token number">0</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时因为执行了<code>3</code>次<code>push</code>指令，所以<code>sp</code>的值已经从<code>0x7c00</code>减到了<code>0x7bfa</code>，正好<code>3</code>个字，<code>6</code>个字节。我们来查看一下从<code>0x7bfa</code>开始的三个字的内容。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> x/3xh 0x7bfa
0x7bfa: 0x0a61  0x0a62  0x0a63
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>其中高字节是显示属性<code>0x0a</code>，低字节依次是<code>0x61、0x62、0x63</code>，对应字符<code>a、b、c</code>。</p><p>下面给出分解并打印数字各位程序基于栈的实现。</p><div class="language-asm line-numbers-mode" data-ext="asm"><pre class="language-asm"><code>.code16

.set DIVIDEND, 9527         # 被除数
.set DIVISOR, 10            # 除数

movw $0x07c0, %ax
movw %ax, %ds

movw $0xb800, %ax
movw %ax, %es

xorw %ax, %ax
movw %ax, %ss

movw $0x7c00, %sp

# 设置 32位 被除数
# 高 16位 在 %dx 中, 低 16位 在 %ax 中
# 因为 %ax 足够保存 9527, 所以将高 16位(%dx) 清空
xorw %dx, %dx
movw $DIVIDEND, %ax
movw $DIVISOR, %bx

# 分解位数的同时统计一共有多少位
# 显示的时候需要用位数控制循环次数
xorw %cx, %cx
split:
  incw %cx
  divw %bx
  orw $0xa30, %dx
  pushw %dx
  xorw %dx, %dx
  cmpw $0, %ax      # 商为零则分解完毕, 不为零则继续分解
  jne split

xorw %si, %si
putc:
  popw %es:(%si)
  addw $2, %si
  loop putc

jmp .

.org 510
.word 0xAA55
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>与上一篇中的方法不同的是，我们现在不需要预先知道数字有多少位并为每一位预留存储空间。取而代之，我们使用了<code>栈</code>，每计算出一位便将其与显示属性一同压入栈中，当计算完毕时，依次出栈即可。</p><p>第<code>26</code>行，因为我们不知道数字的位数，所以需要在分解数字的时候做一下统计，每分解一位便将<code>cx</code>加一。使用<code>cx</code>保存统计数字的原因是稍后显示的时候需要用到循环，此时就将统计数字放在<code>cx</code>中的话到时就不需要再做一次数据转移操作。</p><p>另一个不同之处是这次我们判断分解结束的依据为<code>ax</code>等于<code>0</code>，即商为<code>0</code>时分解完成。使用<code>jne</code>条件转移指令配合比较指令<code>cmp</code>实现对程序的控制。<code>cmp</code>指令的功能类似减法指令，但不会将计算结果写入目的操作数，只是将比较结果反应在标志寄存器的标志位上。条件转移指令<code>jne</code>当结果不为<code>0</code>时转移。</p>`,15);function b(m,x){const a=i("ExternalLinkIcon");return c(),l("div",null,[v,e("p",null,[n("调试过程中有一些经常需要输入的指令，为了避免每次调试都要重复输入这些指令，老李已经将他们写到了"),e("a",u,[n(".gdbinit"),o(a)]),n("中了，大家直接使用就可以了。")]),t])}const g=d(r,[["render",b],["__file","04-堆栈.html.vue"]]);export{g as default};
