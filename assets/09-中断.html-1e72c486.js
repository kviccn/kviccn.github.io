import{_ as e}from"./plugin-vue_export-helper-c27b6911.js";import{o as d,c as i,a as n}from"./app-819cf889.js";const a="/assets/boot-7214a13d.png",c="/assets/boota-053dd472.jpg",s={},l=n(`<h2 id="中断" tabindex="-1"><a class="header-anchor" href="#中断" aria-hidden="true">#</a> 中断</h2><p>中断就是打断<code>CPU</code>当前的执行流程，让<code>CPU</code>去处理一下别的事情。当然，<code>CPU</code>也可以选择拒绝。</p><h3 id="中断的分类" tabindex="-1"><a class="header-anchor" href="#中断的分类" aria-hidden="true">#</a> 中断的分类</h3><p>中断按中断源可以分为<code>内部中断</code>和<code>外部中断</code>。</p><h4 id="内部中断" tabindex="-1"><a class="header-anchor" href="#内部中断" aria-hidden="true">#</a> 内部中断</h4><p>内部中断可以由中断指令<code>int</code>来触发，也可以是因为指令执行中出现了错误而触发，例如运算结果溢出会触发溢出中断；除法指令的除数为<code>0</code>会触发除法出错中断。</p><h4 id="外部中断" tabindex="-1"><a class="header-anchor" href="#外部中断" aria-hidden="true">#</a> 外部中断</h4><p>外部中断通过<code>NMI</code>和<code>INTR</code>这两条中断信号线接入<code>CPU</code>。</p><ul><li><p>由<code>NMI</code>接入的是非屏蔽中断<code>(Non Maskable Interrupt)</code>，来自这个引脚的中断请求信号是不受中断允许标志<code>IF</code>限制的，<code>CPU</code>接收到非屏蔽中断请求后，无论当前正在做什么事情，都必须在执行完当前指令后响应中断。因此非屏蔽中断常用于系统掉电处理，紧急停机等重大故障时。<code>NMI</code>统一被赋予中断号<code>2</code>。</p></li><li><p>由<code>INTR</code>接入的是可屏蔽中断。在<code>IBM PC/AT</code>机中，这个信号由两片<code>8259A</code>级联组成，接入<code>CPU</code>的中断控制逻辑电路，可管理<code>15</code>级中断。</p></li></ul><h3 id="中断向量表" tabindex="-1"><a class="header-anchor" href="#中断向量表" aria-hidden="true">#</a> 中断向量表</h3><p><code>8086</code>的中断系统可以识别<code>256</code>个不同类型的中断，每个中断对应一个<code>0~255</code>的编号，这个编号即中断类型码。每个中断类型码对应一个中断服务程序的入口地址，<code>256</code>个中断，理论上就需要<code>256</code>段中断处理程序。在实模式下，处理器要求将它们的入口点集中存放到内存中从物理地址 <code>0x00000</code>开始，到<code>0x003ff</code>结束，共<code>1KB</code>的空间内，这就是所谓的中断向量表<code>(Interrupt Vector Table, IVT)</code>。</p><p>每个中断在中断向量表中占<code>2</code>个字，分别是中断处理程序的偏移地址和段地址。中断<code>0</code>的入口点位于物理地址<code>0x00000</code>处，也就是逻辑地址<code>0x0000:0x0000</code>；中断<code>1</code>的入口点位于物理地址<code>0x00004</code>处，即逻辑地址<code>0x0000:0x0004</code>，其他中断依次类推。</p><h3 id="中断处理过程" tabindex="-1"><a class="header-anchor" href="#中断处理过程" aria-hidden="true">#</a> 中断处理过程</h3><ol><li><p>保护断点的现场。先将标志寄存器<code>FLAGS</code>压栈，然后清除<code>IF</code>位和<code>TF</code>位。将当前的代码段寄存器<code>cs</code>和指令指针寄存器<code>ip</code>压栈。</p></li><li><p>执行中断处理程序。将中断类型码乘以<code>4</code>（每个中断在中断向量表中占<code>4</code>个字节），得到了该中断入口点在中断向量表中的偏移地址。从中断向量表中依次取出中断程序的偏移地址和段地址，分别替换<code>ip</code>和<code>cs</code>以转入中断处理程序执行。</p></li><li><p>返回到断点接着执行。中断处理程序的最后一条指令必须是中断返回指令<code>iret</code>。<code>iret</code>执行时处理器依次从堆栈中弹出<code>ip、cs、flags</code>，于是处理器转到主程序继续执行。</p></li></ol><p>下面我们通过几个例子感受一下。</p><h2 id="实战" tabindex="-1"><a class="header-anchor" href="#实战" aria-hidden="true">#</a> 实战</h2><h3 id="示例一" tabindex="-1"><a class="header-anchor" href="#示例一" aria-hidden="true">#</a> 示例一</h3><p>该示例演示内部中断。</p><h4 id="代码" tabindex="-1"><a class="header-anchor" href="#代码" aria-hidden="true">#</a> 代码</h4><div class="language-asm line-numbers-mode" data-ext="asm"><pre class="language-asm"><code>.code16

.set INT_TYPE_CODE, 0x70
.set INT_HANDLER_BASE, 0x07c0

movw $0xb800, %ax
movw %ax, %es

movw $0x7c00, %sp

# 安装中断向量表
call install_ivt

# 触发中断
int $INT_TYPE_CODE

jmp .

install_ivt:
  movw $INT_TYPE_CODE, %bx
  shlw $2, %bx

  movw $handler, (%bx)
  movw $INT_HANDLER_BASE, 2(%bx)

  ret

# 中断处理程序
handler:
  movw $&#39;8&#39; | 0x0a00, %es:0
  iret

.org 510
.word 0xAA55
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="解释" tabindex="-1"><a class="header-anchor" href="#解释" aria-hidden="true">#</a> 解释</h4><p>第<code>3、4</code>行设置了两个符号常量，类似于<code>c</code>语言中的<code>#define</code>。<code>INT_TYPE_CODE</code>表示我们要使用的中断类型码，这个示例中我们打算手动触发<code>0x70</code>号中断。<code>INT_HANDLER_BASE</code>表示中断处理程序所在的段地址。</p><p>第<code>12</code>行调用安装中断向量表的例程。</p><p>第<code>15</code>行手动触发中断。</p><p>第<code>20、21</code>行根据中断号计算中断向量在中断向量表中的偏移地址。计算方法是左移<code>2</code>位，即乘<code>4</code>。</p><p>第<code>23</code>行将中断处理程序的段内偏移写入中断向量对应的偏移地址的前两个字节。</p><p>第<code>24</code>行将中断处理程序所在的段地址写入中断向量对应的偏移地址的后两个字节。</p><p>第<code>30、31</code>行是我们的中断处理程序。只打印了一个字符，然后通过<code>iret</code>返回。</p><h4 id="运行" tabindex="-1"><a class="header-anchor" href="#运行" aria-hidden="true">#</a> 运行</h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ as <span class="token parameter variable">--32</span> boot.s <span class="token parameter variable">-o</span> boot.o
$ objcopy <span class="token parameter variable">-O</span> binary <span class="token parameter variable">-j</span> .text boot.o boot.bin
$ qemu-system-i386 boot.bin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="`+a+`" alt="boot" tabindex="0" loading="lazy"><figcaption>boot</figcaption></figure><h3 id="示例二" tabindex="-1"><a class="header-anchor" href="#示例二" aria-hidden="true">#</a> 示例二</h3><p>该示例演示外部中断。</p><h4 id="代码-1" tabindex="-1"><a class="header-anchor" href="#代码-1" aria-hidden="true">#</a> 代码</h4><div class="language-asm line-numbers-mode" data-ext="asm"><pre class="language-asm"><code>.code16

.set INT_TYPE_CODE, 0x08
.set INT_HANDLER_BASE, 0x07c0
.set _8259A_MASTER, 0x20

movw $0xb800, %ax
movw %ax, %es

movw $0x7c00, %sp

xorw %si, %si

# 安装中断向量表
call install_ivt

# 初始化 8259a
# 使用默认配置

sleep:
  hlt
  jmp sleep

install_ivt:
  movw $INT_TYPE_CODE, %bx
  shlw $2, %bx

  movw $handler, (%bx)
  movw $INT_HANDLER_BASE, 2(%bx)

  ret

handler:
  movw $&#39;8&#39; | 0x0a00, %es:(%si)
  addw $2, %si

  # send eoi
  movb $0x20, %al
  outb %al, $_8259A_MASTER

  iret

.org 510
.word 0xAA55
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="解释-1" tabindex="-1"><a class="header-anchor" href="#解释-1" aria-hidden="true">#</a> 解释</h4><p>第<code>3</code>行我们将中断类型码改成了<code>0x08</code>。这个中断号在<code>BIOS</code>对<code>8259a</code>做过初始化之后是分配给主片的<code>0</code>级中断的，这个引脚用于连接<code>8254</code>可编程定时/计数器。<code>8254</code>在被<code>BIOS</code>初始化后会每隔<code>54.925 ms</code>向这个引脚输出<code>1</code>个信号。</p><p>第<code>5</code>行<code>_8259A_MASTER</code>是<code>8259a</code>的主片<code>0x20</code>端口。分配给<code>8259a</code>主片的端口是<code>0x20、0x21</code>，从片的端口是<code>0xa0, 0xa1</code>。这个示例中我们不对<code>8259a</code>进行编程，但是在中断处理完成之后需要通过<code>0x20</code>告诉主片这个中断已经处理完了。如果中断来自从片的话那就需要同时向主片，从片发送处理完成的信号。</p><p>第<code>12</code>行将<code>si</code>置<code>0</code>，我们打算每触发一次中断就在屏幕上打印一个字符，通过<code>si</code>控制打印位置。</p><p>第<code>20~22</code>行通过<code>hlt</code>指令使处理器停止执行指令，并处于停机状态。停机状态可以被中断唤醒，继续执行。</p><p>第<code>35</code>行将索引移动到下一个位置。</p><p>第<code>38、39</code>行向<code>8259a</code>主片发送中断结束命令<code>0x20</code>，使<code>8259a</code>可以继续接收中断信号。</p><h4 id="运行-1" tabindex="-1"><a class="header-anchor" href="#运行-1" aria-hidden="true">#</a> 运行</h4><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ as <span class="token parameter variable">--32</span> boota.s <span class="token parameter variable">-o</span> boota.o
$ objcopy <span class="token parameter variable">-O</span> binary <span class="token parameter variable">-j</span> .text boota.o boota.bin
$ qemu-system-i386 boota.bin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="`+c+`" alt="boota" tabindex="0" loading="lazy"><figcaption>boota</figcaption></figure><p>中断每隔<code>54.925 ms</code>触发一次，屏幕上也会每隔<code>54.925 ms</code>打印一次字符。这个示例程序中我们没有控制<code>si</code>的大小，在运行的时候要注意这一点。</p><h3 id="示例三" tabindex="-1"><a class="header-anchor" href="#示例三" aria-hidden="true">#</a> 示例三</h3><p>该示例演示外部中断，并且重新设置了<code>8259a</code>。</p><h4 id="代码-2" tabindex="-1"><a class="header-anchor" href="#代码-2" aria-hidden="true">#</a> 代码</h4><div class="language-asm line-numbers-mode" data-ext="asm"><pre class="language-asm"><code>.code16

.set INT_TYPE_CODE, 0x20
.set INT_HANDLER_BASE, 0x07c0
.set _8259A_MASTER, 0x20
.set _8259A_SLAVE, 0xa0

movw $0xb800, %ax
movw %ax, %es

movw $0x7c00, %sp

xorw %si, %si

# 安装中断向量表
call install_ivt

# 初始化 8259a
call init_8259a

sleep:
  hlt
  jmp sleep

install_ivt:
  movw $INT_TYPE_CODE, %bx
  shlw $2, %bx

  movw $handler, (%bx)
  movw $INT_HANDLER_BASE, 2(%bx)

  ret

init_8259a:
  movb 0x11, %al
  outb %al, $_8259A_MASTER
  outb %al, $_8259A_SLAVE

  movb $0x20, %al
  outb %al, $_8259A_MASTER + 1
  movb $0x28, %al
  outb %al, $_8259A_SLAVE + 1

  movb $0x04, %al
  outb %al, $_8259A_MASTER + 1
  movb $0x02, %al
  outb %al, $_8259A_SLAVE + 1

  movb $0x01, %al
  outb %al, $_8259A_MASTER + 1
  outb %al, $_8259A_SLAVE + 1

  movb $0x0, %al
  outb %al, $_8259A_MASTER + 1
  outb %al, $_8259A_SLAVE + 1

  ret

handler:
  movw $&#39;8&#39; | 0x0a00, %es:(%si)
  addw $2, %si

  # send eoi
  movb $0x20, %al
  outb %al, $_8259A_MASTER

  iret

.org 510
.word 0xAA55
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="解释-2" tabindex="-1"><a class="header-anchor" href="#解释-2" aria-hidden="true">#</a> 解释</h4><p>第<code>3</code>行我们将<code>INT_TYPE_CODE</code>修改成了<code>0x20</code>。这次我们会重新设置<code>8259a</code>，将他的主片中断号设置为从<code>0x20</code>开始。</p><p>第<code>34</code>行开始的子例程用于初始化<code>8259a</code>。<code>8259a</code>的初始化方式是依次写入初始化命令字<code>ICW1-4</code>，这个顺序是固定的。其中<code>ICW1</code>通过<code>0x20</code>端口写入（从片通过<code>0xa0</code>），<code>ICW2-4</code>通过<code>0x21</code>端口写入（从片通过<code>0xa1</code>）。</p><p>第<code>35~37</code>行通过向主片、从片写入<code>0x11</code>来开始初始化的过程。基本上在<code>IBM PC/AT</code>机中是固定写入<code>0x11</code>的，表示中断请求是边沿触发、多片<code>8259a</code>级联并且需要发送 <code>ICW4</code>。</p><p>第<code>39、40</code>行设置主片中断号从<code>0x20(32)</code>开始。</p><p>第<code>41、42</code>行设置从片中断号从<code>0x28(40)</code>开始。</p><p>第<code>44、45</code>行设置主片<code>IR2</code>引脚连接从片。</p><p>第<code>46、47</code>行告诉从片输出引脚和主片<code>IR2</code>号相连。</p><p>第<code>49~51</code>行设置主片和从片按照<code>8086</code>的方式工作。</p><p>第<code>53~55</code>行设置主从片允许中断。</p><h4 id="运行-2" tabindex="-1"><a class="header-anchor" href="#运行-2" aria-hidden="true">#</a> 运行</h4><p>运行结果和上一个示例一样，就不贴图了。</p><p>文中涉及了<code>8259a</code>，但是并没有详细介绍相关的知识。因为网上的资料太丰富了，大家打开搜索引擎直接搜索就可以了。另外，现代的处理器一般使用<code>APIC</code>来处理中断，即<code>高级可编程中断控制器</code>。</p>`,63),o=[l];function v(r,b){return d(),i("div",null,o)}const t=e(s,[["render",v],["__file","09-中断.html.vue"]]);export{t as default};
