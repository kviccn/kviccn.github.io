import{_ as c}from"./plugin-vue_export-helper-c27b6911.js";import{r as l,o as p,c as t,b as n,d as s,e,a as i}from"./app-0c3433bd.js";const o="/assets/qemu-monitor-1eaf9a1a.png",d={},u=n("p",null,"调试是软件开发过程中重要的一个环节。通常我们开发的软件是运行在操作系统之上的，调试器也运行在操作系统之上，加之大多数集成开发环境对调试器的集成非常完美，所以我们调试软件的时候非常轻松。但是如果是开发操作系统呢？操作系统该如何调试？今天老李结合代码教大家操作系统启动过程中的第一个步骤 -- 引导扇区的调试。",-1),r=n("p",null,"开发环境如下：",-1),b=n("li",null,[s("系统："),n("code",null,"Ubuntu 18.04.4 LTS")],-1),v=n("li",null,[s("汇编器："),n("code",null,"GNU as (GNU Binutils for Ubuntu) 2.30")],-1),m=n("li",null,[s("调试器："),n("code",null,"GNU gdb (Ubuntu 8.1-0ubuntu3.2) 8.1.0.20180409-git")],-1),k=n("li",null,[s("虚拟机："),n("code",null,"QEMU emulator version 2.11.1(Debian 1:2.11+dfsg-1ubuntu7.21)")],-1),x={href:"https://github.com/kviccn/asm-boooom/blob/master/0x02/boot.s",target:"_blank",rel:"noopener noreferrer"},g=i(`<p>在操作系统的开发过程中我们通常使用<code>QEMU</code>虚拟机来运行我们开发的操作系统，使用<code>GDB</code>作为调试工具。<code>GDB</code>支持<code>远程调试</code>，这是通过一个简单的协议来实现的。<code>QEMU</code>支持该协议，所以我们可以配合这两者来完成我们的调试工作。</p><p>先编译生成引导扇区文件：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ as <span class="token parameter variable">--32</span> boot.s <span class="token parameter variable">-o</span> boot.o
$ objcopy <span class="token parameter variable">-O</span> binary <span class="token parameter variable">-j</span> .text boot.o boot.bin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>通过如下命令启动虚拟机：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ qemu-system-i386 boot.bin <span class="token parameter variable">-S</span> <span class="token parameter variable">-s</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><code>-S</code>参数告诉虚拟机启动后先不运行。 <code>-s</code>参数告诉虚拟机开启一个<code>GDB</code>服务器等待客户端的连接，服务默认监听<code>TCP</code>端口<code>1234</code>。</p><p>启动<code>GDB</code>：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ gdb <span class="token parameter variable">-q</span>
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><code>-q</code>参数表示静默启动，不显示版本信息。</p><p>连接到目标服务器：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> target remote localhost:1234
Remote debugging using localhost:1234
warning: No executable has been specified and target does not support
determining executable automatically.  Try using the <span class="token string">&quot;file&quot;</span> command.
0x0000fff0 <span class="token keyword">in</span> ?? <span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>设置<code>CPU</code>架构为<code>i8086</code>，因为最开始的这段代码运行在<code>16</code>位实地址模式：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> <span class="token builtin class-name">set</span> architecture i8086
The target architecture is assumed to be i8086
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,13),h=n("code",null,"gdb",-1),f=n("code",null,"bug",-1),_=n("code",null,"bug",-1),$={href:"https://sourceware.org/bugzilla/show_bug.cgi?id=22869",target:"_blank",rel:"noopener noreferrer"},y={href:"https://github.com/kviccn/asm-boooom/blob/master/gdb/target.xml",target:"_blank",rel:"noopener noreferrer"},B=i(`<div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> <span class="token builtin class-name">set</span> tdesc filename target.xml
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>设置当程序停住或单步调试时自动显示指令：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> display/i <span class="token variable">$cs</span>*16+<span class="token variable">$pc</span>
<span class="token number">1</span>: x/i <span class="token variable">$cs</span>*16+<span class="token variable">$pc</span>
   0xffff0:     ljmp   <span class="token variable">$0xf000</span>,<span class="token variable">$0xe05b</span>
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><em><code>16</code>位实地址模式下物理地址计算方式为段寄存器左移<code>4</code>位，即乘以十进制的<code>16</code>，再加上偏移地址。</em></p><p>因为<code>BIOS</code>会将引导扇区加载到<code>0x7c00</code>处开始执行，所以我们在这里打个断点：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> b *0x7c00
Breakpoint <span class="token number">1</span> at 0x7c00
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输入<code>c</code>使虚拟机恢复运行：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> c
Continuing.

Breakpoint <span class="token number">1</span>, 0x00007c00 <span class="token keyword">in</span> ?? <span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token number">1</span>: x/i <span class="token variable">$cs</span>*16+<span class="token variable">$pc</span>
<span class="token operator">=</span><span class="token operator">&gt;</span> 0x7c00:      mov    <span class="token variable">$0x7c0</span>,%ax
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>观察第<code>6</code>行，正是我们的引导扇区的第一条指令。</p><p>查看寄存器内容：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> info registers
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时<code>eax</code>寄存器的内容为<code>0xaa55</code>。单步执行下一条指令再查看寄存器内容：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> si
0x00007c03 <span class="token keyword">in</span> ?? <span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token number">1</span>: x/i <span class="token variable">$cs</span>*16+<span class="token variable">$pc</span>
<span class="token operator">=</span><span class="token operator">&gt;</span> 0x7c03:      mov    %ax,%ds
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> info registers
eax            0x7c0    <span class="token number">1984</span>
ecx            0x0      <span class="token number">0</span>
edx            0x80     <span class="token number">128</span>
ebx            0x0      <span class="token number">0</span>
esp            0x6f04   0x6f04
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
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时<code>eax</code>寄存器的内容为<code>0x7c0</code>。继续调试：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> si
0x00007c05 <span class="token keyword">in</span> ?? <span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token number">1</span>: x/i <span class="token variable">$cs</span>*16+<span class="token variable">$pc</span>
<span class="token operator">=</span><span class="token operator">&gt;</span> 0x7c05:      mov    <span class="token variable">$0xb800</span>,%ax
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> info registers
eax            0x7c0    <span class="token number">1984</span>
ecx            0x0      <span class="token number">0</span>
edx            0x80     <span class="token number">128</span>
ebx            0x0      <span class="token number">0</span>
esp            0x6f04   0x6f04
ebp            0x0      0x0
esi            0x0      <span class="token number">0</span>
edi            0x0      <span class="token number">0</span>
eip            0x7c05   0x7c05
eflags         0x202    <span class="token punctuation">[</span> IF <span class="token punctuation">]</span>
cs             0x0      <span class="token number">0</span>
ss             0x0      <span class="token number">0</span>
ds             0x7c0    <span class="token number">1984</span>
es             0x0      <span class="token number">0</span>
fs             0x0      <span class="token number">0</span>
gs             0x0      <span class="token number">0</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时数据段寄存器<code>ds</code>的内容已经是<code>0x7c0</code>了。再向后执行两条指令并查看寄存器内容：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> si <span class="token number">2</span>
0x00007c0a <span class="token keyword">in</span> ?? <span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token number">1</span>: x/i <span class="token variable">$cs</span>*16+<span class="token variable">$pc</span>
<span class="token operator">=</span><span class="token operator">&gt;</span> 0x7c0a:      xor    %si,%si
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> info registers
eax            0xb800   <span class="token number">47104</span>
ecx            0x0      <span class="token number">0</span>
edx            0x80     <span class="token number">128</span>
ebx            0x0      <span class="token number">0</span>
esp            0x6f04   0x6f04
ebp            0x0      0x0
esi            0x0      <span class="token number">0</span>
edi            0x0      <span class="token number">0</span>
eip            0x7c0a   0x7c0a
eflags         0x202    <span class="token punctuation">[</span> IF <span class="token punctuation">]</span>
cs             0x0      <span class="token number">0</span>
ss             0x0      <span class="token number">0</span>
ds             0x7c0    <span class="token number">1984</span>
es             0xb800   <span class="token number">47104</span>
fs             0x0      <span class="token number">0</span>
gs             0x0      <span class="token number">0</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时附加数据段寄存器<code>es</code>的内容为<code>0xb800</code>。</p><p>引导扇区调试的基本过程就是这样了。在调试过程中可能会需要重启虚拟机，如果重新手动执行<code>qemu</code>和<code>gdb</code>，再重新走一遍上面的流程多少是有点麻烦的。下面教大家两种直接重启虚拟机的方法。</p><ol><li>切换到<code>QEMU</code>窗口并按<code>Ctrl-Alt-2</code>以获取<code>QEMU</code>监视器，键入命令<code>system_reset</code>并使用<code>Ctrl-Alt-1</code>切换回去。如下所示：</li></ol><figure><img src="`+o+`" alt="QEMU 监视器" tabindex="0" loading="lazy"><figcaption>QEMU 监视器</figcaption></figure><ol start="2"><li><p>跳转到<code>BIOS</code>重置指令的地址<code>0xf000:0xfff0</code>处。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> <span class="token builtin class-name">set</span> <span class="token variable">$cs</span> <span class="token operator">=</span> 0xf000
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> <span class="token builtin class-name">set</span> <span class="token variable">$pc</span> <span class="token operator">=</span> 0xfff0
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> c
Continuing.

Breakpoint <span class="token number">1</span>, 0x00007c00 <span class="token keyword">in</span> ?? <span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token number">1</span>: x/i <span class="token variable">$cs</span>*16+<span class="token variable">$pc</span>
<span class="token operator">=</span><span class="token operator">&gt;</span> 0x7c00:      mov    <span class="token variable">$0x7c0</span>,%ax
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ol><p>命令摘要（使用前删除提示和注释）：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ qemu-system-i386 boot.bin <span class="token parameter variable">-S</span> <span class="token parameter variable">-s</span>
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> target remote localhost:1234
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> <span class="token builtin class-name">set</span> architecture i8086  <span class="token comment"># 16-bit mode</span>
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> display/i <span class="token variable">$cs</span>*16+<span class="token variable">$pc</span>    <span class="token comment"># show next instruction</span>
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> b *0x7c00               <span class="token comment"># breakpoint at boot sector</span>
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> <span class="token builtin class-name">set</span> <span class="token variable">$cs</span> <span class="token operator">=</span> 0xf000
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> <span class="token builtin class-name">set</span> <span class="token variable">$pc</span> <span class="token operator">=</span> 0xfff0        <span class="token comment"># reboot</span>
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> c                       <span class="token comment"># continue execution</span>
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> si                      <span class="token comment"># step instruction</span>
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> x/5i <span class="token variable">$cs</span>*16+<span class="token variable">$pc</span>         <span class="token comment"># disassemble five instrs</span>
<span class="token punctuation">(</span>gdb<span class="token punctuation">)</span> info registers          <span class="token comment"># show all registers</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,24),U={href:"https://weinholt.se/articles/debugging-boot-sectors/",target:"_blank",rel:"noopener noreferrer"};function w(E,q){const a=l("ExternalLinkIcon");return p(),t("div",null,[u,r,n("ul",null,[b,v,m,k,n("li",null,[s("引导扇区代码："),n("a",x,[s("boot.s"),e(a)])])]),g,n("p",null,[n("em",null,[s("这个设置可能不会生效，这是"),h,s("新版本中的一个"),f,s("，之前的版本是没有这个问题的。关于这个"),_,s("的讨论在"),n("a",$,[s("这里"),e(a)]),s("。解决方案是手动设置一个"),n("a",y,[s("描述文件"),e(a)]),s("。")])]),B,n("blockquote",null,[n("p",null,[s("参考 "),n("a",U,[s("Debugging PC Boot Sectors"),e(a)])])])])}const N=c(d,[["render",w],["__file","调试引导扇区.html.vue"]]);export{N as default};
