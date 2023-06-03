import{_ as i}from"./plugin-vue_export-helper-c27b6911.js";import{r as d,o as l,c as o,b as s,d as n,e as a,a as c}from"./app-9978a549.js";const p={},r=c(`<p>前两篇文章中我们学习了如何控制屏幕光标，如何从硬盘读取数据。这种常用的功能我们希望将它封装成过程调用，类似于高级语言中的函数，这样当我们控制光标或者从硬盘读取数据时就不需要每次都写大段的重复代码了。</p><p>在<code>CPU</code>中，执行的指令通过<code>cs:ip</code>来确定。过程调用实际上就是通过<code>call</code>或<code>lcall</code>指令来修改<code>ip</code>或<code>cs:ip</code>来达到跳转到另一段指令中执行的目的。</p><p><code>call</code>指令通过修改<code>ip</code>来实现过程调用，因为只修改<code>ip</code>，所以被调例程与原例程在同一个代码段内，也称为近调用。处理器在执行<code>call</code>指令时先将<code>call</code>后面的第一条指令的偏移地址压栈，再通过操作数计算出新的<code>ip</code>替换当前<code>ip</code>。</p><p><code>lcall</code>指令通过修改<code>cs:ip</code>来实现过程调用，因为同时修改<code>cs</code>和<code>ip</code>，所以被调例程与原例程不在同一个代码段内，也称为远调用。处理器在执行<code>lcall</code>指令时先将<code>cs、ip</code>依次压栈，再用指令中给出的段地址代替<code>cs</code>原有的内容，用指令中给出的偏移地址代替<code>ip</code>原有的内容。</p><p>从子例程返回到原例程使用<code>ret</code>或<code>lret</code>指令。<code>ret</code>指令用栈中的数据修改<code>ip</code>的内容，实现近转移；<code>lret</code>用栈中的数据修改<code>cs:ip</code>，实现远转移。<code>CPU</code>执行<code>ret</code>指令时相当于执行<code>pop ip</code>，执行<code>lret</code>指令时相当于执行<code>pop ip</code>、<code>pop cs</code>。</p><p>下面我们通过一些简单的例子来学习一下如何使用这些指令。</p><h2 id="示例一" tabindex="-1"><a class="header-anchor" href="#示例一" aria-hidden="true">#</a> 示例一</h2><h3 id="代码" tabindex="-1"><a class="header-anchor" href="#代码" aria-hidden="true">#</a> 代码</h3><div class="language-asm line-numbers-mode" data-ext="asm"><pre class="language-asm"><code>.code16

movw $0x7c00, %sp

callw put_char_A

jmp .

put_char_A:
  movw $0xb800, %ax
  movw %ax, %es
  movw $&#39;A&#39; | 0x0a00, %es:0
  retw

.org 510
.word 0xAA55
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="解释" tabindex="-1"><a class="header-anchor" href="#解释" aria-hidden="true">#</a> 解释</h3><p>第<code>3</code>行设置堆栈栈顶指针。因为<code>call</code>指令和<code>ret</code>指令的执行依赖于堆栈。</p><p>第<code>5</code>行调用了我们在第<code>9</code>行定义的子例程。</p><p>第<code>13</code>行使用<code>ret</code>指令跳回原来的执行流程。</p><h3 id="编译、反编译" tabindex="-1"><a class="header-anchor" href="#编译、反编译" aria-hidden="true">#</a> 编译、反编译</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ as <span class="token parameter variable">--32</span> boota.s <span class="token parameter variable">-o</span> boota.o
$ objcopy <span class="token parameter variable">-O</span> binary <span class="token parameter variable">-j</span> .text boota.o boota.bin
$ objdump <span class="token parameter variable">-D</span> <span class="token parameter variable">-b</span> binary <span class="token parameter variable">-m</span> i386 -Mi8086,suffix boota.bin

boota.bin：     文件格式 binary


Disassembly of section .data:

00000000 <span class="token operator">&lt;</span>.data<span class="token operator">&gt;</span>:
   <span class="token number">0</span>:   <span class="token function">bc</span> 00 7c                movw   <span class="token variable">$0x7c00</span>,%sp
   <span class="token number">3</span>:   e8 02 00                callw  0x8
   <span class="token number">6</span>:   eb fe                   jmp    0x6
   <span class="token number">8</span>:   b8 00 b8                movw   <span class="token variable">$0xb800</span>,%ax
   b:   8e c0                   movw   %ax,%es
   d:   <span class="token number">26</span> c7 06 00 00 <span class="token number">41</span> 0a    movw   <span class="token variable">$0xa41</span>,%es:0x0
  <span class="token number">14</span>:   c3                      retw
        <span class="token punctuation">..</span>.
 1fd:   00 <span class="token number">55</span> aa                addb   %dl,-0x56<span class="token punctuation">(</span>%di<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第<code>12</code>行编译后的指令是<code>e8 02 00</code>，其中<code>e8</code>是操作码，<code>02 00</code>是操作数，转换成正常顺序即<code>00 02</code>。编译器在计算这个操作数的时候先使用标号的汇编地址<code>（该例中为8）</code>减去本指令的汇编地址<code>（该例中为3）</code>，再减去<code>3</code>，作为机器指令的操作数。即<code>8 - 3 - 3 = 2</code>。同样，指令在执行时，<code>CPU</code>先用<code>ip</code>当前的值加上指令中的操作数，再加上<code>3</code>，得到偏移地址。然后将<code>call</code>指令之后的第一条指令的地址压入栈中，再使用刚才计算得到的<code>ip</code>替换当前<code>ip</code>，从而完成跳转。因为此时栈中压入的是<code>call</code>后的第一条指令的偏移地址，所以当子例程通过<code>ret</code>返回时，会使用这个地址替换<code>ip</code>。从而使调用例程继续执行后续指令。</p><h3 id="调试" tabindex="-1"><a class="header-anchor" href="#调试" aria-hidden="true">#</a> 调试</h3><p>启动虚拟机：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ qemu-system-i386 boota.bin <span class="token parameter variable">-S</span> <span class="token parameter variable">-s</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div>`,19),t=s("code",null,"gdb",-1),u={href:"https://github.com/kviccn/asm-boooom/blob/master/gdb/.gdbinit",target:"_blank",rel:"noopener noreferrer"},v=c(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ gdb <span class="token parameter variable">-q</span>
Breakpoint <span class="token number">1</span>, 0x00007c00 <span class="token keyword">in</span> ?? <span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token number">1</span>: x/i <span class="token variable">$cs</span>*16+<span class="token variable">$pc</span>
<span class="token operator">=</span><span class="token operator">&gt;</span> 0x7c00:      mov    <span class="token variable">$0x7c00</span>,%sp
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>向后执行一条指令：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> si
0x00007c03 <span class="token keyword">in</span> ?? <span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token number">1</span>: x/i <span class="token variable">$cs</span>*16+<span class="token variable">$pc</span>
<span class="token operator">=</span><span class="token operator">&gt;</span> 0x7c03:      call   0x7c08
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到这里计算出来的地址是<code>0x7c08</code>，当前指令的地址<code>0x7c03</code>，加操作数<code>2</code>，再加<code>3</code>，得到<code>0x7c08</code>。继续执行并查看寄存器内容：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> si
0x00007c08 <span class="token keyword">in</span> ?? <span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token number">1</span>: x/i <span class="token variable">$cs</span>*16+<span class="token variable">$pc</span>
<span class="token operator">=</span><span class="token operator">&gt;</span> 0x7c08:      mov    <span class="token variable">$0xb800</span>,%ax
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> info registers
eax            0xaa55   <span class="token number">43605</span>
ecx            0x0      <span class="token number">0</span>
edx            0x80     <span class="token number">128</span>
ebx            0x0      <span class="token number">0</span>
esp            0x7bfe   0x7bfe
ebp            0x0      0x0
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时<code>ip</code>的内容为<code>0x7c08</code>，<code>sp</code>的内容为<code>0x7bfe</code>。<code>sp</code>初始时我们设置成了<code>0x7c00</code>，在执行<code>call</code>指令时处理器会将<code>call</code>后面一条指令的偏移地址压栈，所以<code>sp</code>的值变成了<code>0x7bfe</code>。我们来查看一下栈中的内容：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> x/1xh 0x7bfe
0x7bfe: 0x7c06
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>0x7c06</code>正好是后面<code>jmp</code>指令的偏移地址。稍后<code>ret</code>指令执行时会将这个偏移地址从栈中弹出到<code>ip</code>，来跳回到原来的执行流程。</p><p>向后执行<code>3</code>条指令：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> si <span class="token number">3</span>
0x00007c14 <span class="token keyword">in</span> ?? <span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token number">1</span>: x/i <span class="token variable">$cs</span>*16+<span class="token variable">$pc</span>
<span class="token operator">=</span><span class="token operator">&gt;</span> 0x7c14:      ret
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时屏幕左上角会打印出字符<code>&#39;A&#39;</code>，常规操作就不贴图了。观察上面的输出，下一条要执行的便是<code>ret</code>指令，查看一下此时的寄存器内容：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> info registers
eax            0xb800   <span class="token number">47104</span>
ecx            0x0      <span class="token number">0</span>
edx            0x80     <span class="token number">128</span>
ebx            0x0      <span class="token number">0</span>
esp            0x7bfe   0x7bfe
ebp            0x0      0x0
esi            0x0      <span class="token number">0</span>
edi            0x0      <span class="token number">0</span>
eip            0x7c14   0x7c14
eflags         0x202    <span class="token punctuation">[</span> IF <span class="token punctuation">]</span>
cs             0x0      <span class="token number">0</span>
ss             0x0      <span class="token number">0</span>
ds             0x0      <span class="token number">0</span>
es             0xb800   <span class="token number">47104</span>
fs             0x0      <span class="token number">0</span>
gs             0x0      <span class="token number">0</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>ip</code>是<code>0x7c14</code>，要跳转到的偏移地址还保存在<code>0x7bfe</code>处。执行<code>ret</code>指令，观察结果：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> si
0x00007c06 <span class="token keyword">in</span> ?? <span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token number">1</span>: x/i <span class="token variable">$cs</span>*16+<span class="token variable">$pc</span>
<span class="token operator">=</span><span class="token operator">&gt;</span> 0x7c06:      jmp    0x7c06
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> info registers
eax            0xb800   <span class="token number">47104</span>
ecx            0x0      <span class="token number">0</span>
edx            0x80     <span class="token number">128</span>
ebx            0x0      <span class="token number">0</span>
esp            0x7c00   0x7c00
ebp            0x0      0x0
esi            0x0      <span class="token number">0</span>
edi            0x0      <span class="token number">0</span>
eip            0x7c06   0x7c06
eflags         0x202    <span class="token punctuation">[</span> IF <span class="token punctuation">]</span>
cs             0x0      <span class="token number">0</span>
ss             0x0      <span class="token number">0</span>
ds             0x0      <span class="token number">0</span>
es             0xb800   <span class="token number">47104</span>
fs             0x0      <span class="token number">0</span>
gs             0x0      <span class="token number">0</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>看到了吗？<code>ip</code>的值已经是<code>0x7c06</code>了，下一条要执行的指令也如我们所愿是<code>jmp</code>了。</p>`,15),b=s("code",null,"call",-1),m=s("code",null,"callw *%cx",-1),x=s("code",null,"callw *procedure_address",-1),k=s("code",null,"*",-1),h={href:"https://github.com/kviccn/asm-boooom/blob/master/0x07/bootb.s",target:"_blank",rel:"noopener noreferrer"},g=c(`<p>下面来看一个<code>lcall</code>的例子。</p><h2 id="示例二" tabindex="-1"><a class="header-anchor" href="#示例二" aria-hidden="true">#</a> 示例二</h2><h3 id="代码-1" tabindex="-1"><a class="header-anchor" href="#代码-1" aria-hidden="true">#</a> 代码</h3><div class="language-asm line-numbers-mode" data-ext="asm"><pre class="language-asm"><code>.code16

movw $0x7c00, %sp

lcallw $0x07d0, $0

jmp .

.org 0x100
put_char_A:
  movw $0xb800, %ax
  movw %ax, %es
  movw $&#39;A&#39; | 0x0a00, %es:0
  lretw

.org 510
.word 0xAA55
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="解释-1" tabindex="-1"><a class="header-anchor" href="#解释-1" aria-hidden="true">#</a> 解释</h3><p>第<code>5</code>行<code>lcall</code>指令的格式为<code>lcall $section, $offset</code>。<code>0x07d0</code>是远调用的代码段地址，<code>0</code>是段内偏移。</p><p>第<code>9</code>行使用伪指令<code>.org</code>将位置计数器移动到了<code>0x100</code>处。因为主引导记录是被加载到<code>0x7c00</code>处的，所以标号<code>put_char_A</code>在程序执行时的实际物理地址是<code>0x7c00 + 0x100 = 0x7d00</code>，对应段地址<code>0x07d0</code>，段内偏移<code>0</code>。</p><p>第<code>14</code>行使用<code>lret</code>指令将栈中保存的段内偏移和段地址依次弹出到<code>ip、cs</code>，恢复原来的执行流程。</p><h3 id="调试-1" tabindex="-1"><a class="header-anchor" href="#调试-1" aria-hidden="true">#</a> 调试</h3><p>启动虚拟机：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ qemu-system-i386 bootla.bin <span class="token parameter variable">-S</span> <span class="token parameter variable">-s</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>启动<code>gdb</code>:</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ gdb <span class="token parameter variable">-q</span>
Breakpoint <span class="token number">1</span>, 0x00007c00 <span class="token keyword">in</span> ?? <span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token number">1</span>: x/i <span class="token variable">$cs</span>*16+<span class="token variable">$pc</span>
<span class="token operator">=</span><span class="token operator">&gt;</span> 0x7c00:      mov    <span class="token variable">$0x7c00</span>,%sp
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>向后执行两条指令，此时已经进入到了子例程，查看寄存器状态：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> si <span class="token number">2</span>
0x00000000 <span class="token keyword">in</span> ?? <span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token number">1</span>: x/i <span class="token variable">$cs</span>*16+<span class="token variable">$pc</span>
   0x7d00:      mov    <span class="token variable">$0xb800</span>,%ax
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> info registers
eax            0xaa55   <span class="token number">43605</span>
ecx            0x0      <span class="token number">0</span>
edx            0x80     <span class="token number">128</span>
ebx            0x0      <span class="token number">0</span>
esp            0x7bfc   0x7bfc
ebp            0x0      0x0
esi            0x0      <span class="token number">0</span>
edi            0x0      <span class="token number">0</span>
eip            0x0      0x0
eflags         0x202    <span class="token punctuation">[</span> IF <span class="token punctuation">]</span>
cs             0x7d0    <span class="token number">2000</span>
ss             0x0      <span class="token number">0</span>
ds             0x0      <span class="token number">0</span>
es             0x0      <span class="token number">0</span>
fs             0x0      <span class="token number">0</span>
gs             0x0      <span class="token number">0</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时已经跳转到了段<code>0x7d0</code>，段内偏移<code>0x0</code>处了。<code>sp</code>也因为<code>cs:ip</code>压入栈中变成了<code>0x7bfc</code>，查看栈中的内容：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> x/2xh 0x7bfc
0x7bfc: 0x7c08  0x0000
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>低地址处是<code>ip 0x7c08</code>，高地址处是<code>cs 0x0000</code>。向后执行<code>4</code>条指令并查看寄存器内容：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> si <span class="token number">4</span>
0x00007c08 <span class="token keyword">in</span> ?? <span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token number">1</span>: x/i <span class="token variable">$cs</span>*16+<span class="token variable">$pc</span>
<span class="token operator">=</span><span class="token operator">&gt;</span> 0x7c08:      jmp    0x7c08
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> info registers
eax            0xb800   <span class="token number">47104</span>
ecx            0x0      <span class="token number">0</span>
edx            0x80     <span class="token number">128</span>
ebx            0x0      <span class="token number">0</span>
esp            0x7c00   0x7c00
ebp            0x0      0x0
esi            0x0      <span class="token number">0</span>
edi            0x0      <span class="token number">0</span>
eip            0x7c08   0x7c08
eflags         0x202    <span class="token punctuation">[</span> IF <span class="token punctuation">]</span>
cs             0x0      <span class="token number">0</span>
ss             0x0      <span class="token number">0</span>
ds             0x0      <span class="token number">0</span>
es             0xb800   <span class="token number">47104</span>
fs             0x0      <span class="token number">0</span>
gs             0x0      <span class="token number">0</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以看到在<code>lret</code>指令执行后，<code>cs</code>恢复成了<code>0x0</code>，<code>ip</code>恢复成了<code>0x7c08</code>。<code>sp</code>因为<code>ip</code>和<code>cs</code>的出栈恢复了初始值<code>0x7c00</code>。</p>`,20),f=s("code",null,"lcall",-1),_=s("code",null,"lcallw *procedure_address",-1),$={href:"https://github.com/kviccn/asm-boooom/blob/master/0x07/bootlb.s",target:"_blank",rel:"noopener noreferrer"};function w(y,A){const e=d("ExternalLinkIcon");return l(),o("div",null,[r,s("p",null,[n("在另一个终端启动"),t,n("（配合"),s("a",u,[n(".gdbinit"),a(e)]),n("）：")]),v,s("p",null,[b,n("指令的操作数还可以在寄存器或内存中，例如"),m,n("或"),x,n("。需要注意的是正如你看到的，寄存器或内存地址前需要加一个"),k,n("，就好像指针一样。具体的代码戳"),s("a",h,[n("这里"),a(e)]),n("。")]),g,s("p",null,[f,n("的操作数也可以在内存中，例如"),_,n("。具体的代码戳"),s("a",$,[n("这里"),a(e)])])])}const B=i(p,[["render",w],["__file","07-过程调用.html.vue"]]);export{B as default};
