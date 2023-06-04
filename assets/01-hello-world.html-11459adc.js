import{_ as e}from"./plugin-vue_export-helper-c27b6911.js";import{o as d,c as n,a as c}from"./app-819cf889.js";const o="/assets/char_attribute-95ad73b5.png",s="/assets/qemu_H-d2ee2958.jpg",a={},i=c(`<p>目标：在屏幕上打印出<code>Hello World</code>。</p><p>要在屏幕上打印字符就需要对显存进行操作。那么如何操作显存呢？对于汇编语言来说，这个问题的答案是很简单的。如上一篇文章所讲，在计算机启动时，显卡被初始化为文本模式，对应的显存也已经映射到了<code>0xb8000</code>到<code>0xbffff</code>这段物理地址空间。所以直接向这段内存写入数据，屏幕上就能够打印出对应的字符了。那么如何向内存写入数据呢？</p><p>向内存写入数据，首先需要知道内存对应的地址。对于<code>8086</code>处理器来说，内存地址是以<code>段基址</code>:<code>段内偏移</code>的形式给出的。物理内存被划分为逻辑上的段，每个段最长为<code>64KB</code>。这是有历史原因的，<code>8086</code>具有<code>20</code>位的地址线，寻址范围是<code>1MB</code>，但是<code>8086</code>的内部寄存器都是<code>16</code>位的，最多只能访问<code>64KB</code>的内存空间，无法完全利用这巨大的内存，真是太可惜了。天无绝人之路，<code>Intel</code>的那帮巨佬们就想出了一个巧（鸡）妙（贼）的办法。<code>16</code>位的寄存器左移<code>4</code>位不就是<code>20</code>位了吗？理想很丰满，但是这里有一个问题。因为采用了左移<code>4</code>位的方法，所以无论地址是多少，最终计算得到的地址都是<code>16</code>字节对齐的。举个栗子，<code>0x1234</code>这个地址，左移<code>4</code>位之后就变成了<code>0x12340</code>，同理，<code>0x1235</code>对应<code>0x12350</code>，<code>0x12340</code>到<code>0x12350</code>之间的<code>16</code>个字节是没法访问到的。这个就很好解决了，把<code>0x1234</code>看作一个段，这样的话再加一个偏移量就可以访问到刚才无法访问到的空间了。栗如要访问<code>0x1234f</code>这个位置，那么给个<code>0xf</code>的偏移量就可以了。说干就干，于是他们马上设计了一个计算物理地址的电路，做的运算就是从段寄存器里取出来段地址，左移<code>4</code>位，然后在加上一个<code>16</code>位的偏移地址，形成<code>20</code>位的物理地址。这个电路俗称地址加法器。</p><p>上面我们提到计算机启动时，显卡被初始化为文本模式。这个文本模式默认是<code>80</code>行、<code>25</code>列，可以显示<code>2000</code>个字符。在该模式下，每个字符的显示占据两个字节的空间，低字节保存字符的<code>ASCII</code>码，高字节保存字符的显示属性。下面给出<code>ASCII</code>码表。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>Oct   Dec   Hex   Char                        Oct   Dec   Hex   Char
────────────────────────────────────────────────────────────────────────
000   0     00    NUL &#39;\\0&#39; (null character)   100   64    40    @
001   1     01    SOH (start of heading)      101   65    41    A
002   2     02    STX (start of text)         102   66    42    B
003   3     03    ETX (end of text)           103   67    43    C
004   4     04    EOT (end of transmission)   104   68    44    D
005   5     05    ENQ (enquiry)               105   69    45    E
006   6     06    ACK (acknowledge)           106   70    46    F
007   7     07    BEL &#39;\\a&#39; (bell)             107   71    47    G
010   8     08    BS  &#39;\\b&#39; (backspace)        110   72    48    H
011   9     09    HT  &#39;\\t&#39; (horizontal tab)   111   73    49    I
012   10    0A    LF  &#39;\\n&#39; (new line)         112   74    4A    J
013   11    0B    VT  &#39;\\v&#39; (vertical tab)     113   75    4B    K
014   12    0C    FF  &#39;\\f&#39; (form feed)        114   76    4C    L
015   13    0D    CR  &#39;\\r&#39; (carriage ret)     115   77    4D    M
016   14    0E    SO  (shift out)             116   78    4E    N
017   15    0F    SI  (shift in)              117   79    4F    O
020   16    10    DLE (data link escape)      120   80    50    P
021   17    11    DC1 (device control 1)      121   81    51    Q
022   18    12    DC2 (device control 2)      122   82    52    R
023   19    13    DC3 (device control 3)      123   83    53    S
024   20    14    DC4 (device control 4)      124   84    54    T
025   21    15    NAK (negative ack.)         125   85    55    U
026   22    16    SYN (synchronous idle)      126   86    56    V
027   23    17    ETB (end of trans. blk)     127   87    57    W
030   24    18    CAN (cancel)                130   88    58    X
031   25    19    EM  (end of medium)         131   89    59    Y
032   26    1A    SUB (substitute)            132   90    5A    Z
033   27    1B    ESC (escape)                133   91    5B    [
034   28    1C    FS  (file separator)        134   92    5C    \\  &#39;\\\\&#39;
035   29    1D    GS  (group separator)       135   93    5D    ]
036   30    1E    RS  (record separator)      136   94    5E    ^
037   31    1F    US  (unit separator)        137   95    5F    _
040   32    20    SPACE                       140   96    60    \`
041   33    21    !                           141   97    61    a
042   34    22    &quot;                           142   98    62    b
043   35    23    #                           143   99    63    c
044   36    24    $                           144   100   64    d
045   37    25    %                           145   101   65    e
046   38    26    &amp;                           146   102   66    f
047   39    27    &#39;                           147   103   67    g
050   40    28    (                           150   104   68    h
051   41    29    )                           151   105   69    i
052   42    2A    *                           152   106   6A    j
053   43    2B    +                           153   107   6B    k
054   44    2C    ,                           154   108   6C    l
055   45    2D    -                           155   109   6D    m
056   46    2E    .                           156   110   6E    n

057   47    2F    /                           157   111   6F    o
060   48    30    0                           160   112   70    p
061   49    31    1                           161   113   71    q
062   50    32    2                           162   114   72    r
063   51    33    3                           163   115   73    s
064   52    34    4                           164   116   74    t
065   53    35    5                           165   117   75    u
066   54    36    6                           166   118   76    v
067   55    37    7                           167   119   77    w
070   56    38    8                           170   120   78    x
071   57    39    9                           171   121   79    y
072   58    3A    :                           172   122   7A    z
073   59    3B    ;                           173   123   7B    {
074   60    3C    &lt;                           174   124   7C    |
075   61    3D    =                           175   125   7D    }
076   62    3E    &gt;                           176   126   7E    ~
077   63    3F    ?                           177   127   7F    DEL
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>字符可以使用一个字节的数字来表示，那字符的显示属性又是如何表示的呢？</p><p>用于控制字符显示属性的字节中的每一位含义如下，其中<code>RGB</code>代表红绿蓝，<code>K</code>代表是否闪烁、<code>I</code>代表是否高亮。</p><figure><img src="`+o+`" alt="字符属性" tabindex="0" loading="lazy"><figcaption>字符属性</figcaption></figure><p>例如：<code>0x0a</code>二进制为<code>00001010</code>，我们翻译翻译，就是黑色背景，不闪烁，绿色前景，高亮显示，高亮的效果是最终显示的是浅绿色。</p><p>有了上面的这些基础知识，那在屏幕上打印字符就是手到擒来。具体来说，就是把字符的<code>ASCII</code>码和字符的属性依次送入显存对应的内存即可。</p><p>下面给出我们的第一个汇编程序：</p><div class="language-asm line-numbers-mode" data-ext="asm"><pre class="language-asm"><code>.code16

movw $0xb800, %ax
movw %ax, %es

movb $&#39;H&#39;, %es:0
movb $0xa, %es:1

jmp .

.org 510
.word 0xAA55
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>依次解释一下每一行的含义。</p><p>第<code>1</code>行告诉编译器以<code>16</code>位模式编译，因为<code>BIOS</code>在加载并运行我们的代码时是处于<code>16</code>位实地址模式的。</p><p>第<code>3、4</code>行将附加数据段寄存器<code>es</code>的内容设置为<code>0xb800</code>。<code>mov</code>是数据转移指令，<code>mov</code>后面的<code>w</code>表示操作数的宽度为一个<code>word</code>，即<code>16</code>位的数据。<code>movw $0xb800, %ax</code>表示把立即数<code>0xb800</code>转移到寄存器<code>ax</code>中。其中<code>0xb800</code>是源操作数，<code>ax</code>是目的操作数。根据<code>at&amp;t</code>的规范，立即数前需要加<code>$</code>符，用来和内存地址区分。寄存器前需要加<code>%</code>。这条指令执行完成之后<code>ax</code>寄存器的内容为<code>0xb800</code>，下一条指令又把<code>ax</code>寄存器中的数据转移到<code>es</code>中，完成段寄存器的设置。乍一看这不是多了块鱼吗？为啥不直接把<code>0xb800</code>放到<code>es</code>里？答案是段寄存器在程序运行中的职责比较重要，所以<code>Intel</code>没有提供直接把立即数转移到段寄存器的指令。通过强制多加一个步骤，可以使操作者明白自己到底在做什么，是否真的需要修改段寄存器的值。</p><p>第<code>6</code>行我们先来分析一下目的操作数<code>%es:0</code>，根据之前的内容我们知道这是以<code>段基址</code>:<code>段内偏移</code>的形式来给出内存地址。此时<code>es</code>的内容为<code>0xb800</code>，左移<code>4</code>位再加上偏移地址<code>0</code>，得到的物理地址为<code>0xb8000</code>。再来康康源操作数<code>&#39;H&#39;</code>，为啥这样写呢？得益于<code>GNU as</code>编译器的支持，我们能够以这种方式表示一个<code>ASCII</code>字符，编译器会帮我们把<code>&#39;H&#39;</code>转换为<code>0x48</code>。接下来康康<code>mov</code>后面的<code>b</code>，<code>b</code>表示<code>byte</code>，因为这次我们只操作一个字节的数据。</p><p>第<code>7</code>行和第<code>6</code>行基本一致，只不过偏移地址为<code>1</code>，最终的物理地址为<code>0xb8001</code>，<code>0x0a</code>表示浅绿色。</p><p>第<code>9</code>行是一条跳转指令，<code>.</code>单独使用时是一个特殊的符号，作为位置计数器，表示当前所在行的位置。那么这条指令就表示跳转到当前位置，实现的效果就是<strong>死循环</strong>。</p><p>第<code>11、12</code>行用了两条伪指令，伪指令是给编译器看的，并不是处理器最终会执行的指令。<code>.org</code>伪指令指示编译器把位置计数器移动到操作数所指定的位置，这里是将位置计数器移动到<code>510</code>处。<code>.word</code>伪指令指示编译器在当前位置写入一个字大小的数据，当然，操作数也可以用逗号隔开，表示写入一组一个字大小的数据。这里要写入的数据是<code>0xAA55</code>，何以是<code>0xAA55</code>？上次不是才说过第一个扇区的最后两个字节要是<code>0x55</code>、<code>0xAA</code>才能被引导吗？怎么反过来了？这是因为<code>Intel</code>处理器使用的是小端序，即数据的低字节存放在内存的低地址处，高字节存放在内存的高地址处。所以<code>0xAA55</code>在内存中仍然是按照<code>0x55</code>，<code>0xAA</code>的顺序存放的。</p><p>接下来我们编译然后反编译，康康上面这段代码对应的二进制的指令究竟是什么。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ as <span class="token parameter variable">--32</span> boot.s <span class="token parameter variable">-o</span> boot.o
$ objdump <span class="token parameter variable">-D</span> -Mi8086,suffix boot.o 

boot.o：     文件格式 elf32-i386


Disassembly of section .text:

00000000 <span class="token operator">&lt;</span>.text<span class="token operator">&gt;</span>:
   <span class="token number">0</span>:   b8 00 b8                movw   <span class="token variable">$0xb800</span>,%ax
   <span class="token number">3</span>:   8e c0                   movw   %ax,%es
   <span class="token number">5</span>:   <span class="token number">26</span> c6 06 00 00 <span class="token number">48</span>       movb   <span class="token variable">$0x48</span>,%es:0x0
   b:   <span class="token number">26</span> c6 06 01 00 0a       movb   <span class="token variable">$0xa</span>,%es:0x1
  <span class="token number">11</span>:   eb fe                   jmp    0x11
        <span class="token punctuation">..</span>.
 1fb:   00 00                   addb   %al,<span class="token punctuation">(</span>%bx,%si<span class="token punctuation">)</span>
 1fd:   00 <span class="token number">55</span> aa                addb   %dl,-0x56<span class="token punctuation">(</span>%di<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第<code>1</code>行使用<code>as</code>编译生成目标文件。</p><p>第<code>2</code>行使用<code>objdump</code>反编译目标文件。<code>-D</code>参数说明我们要反编译所有的<code>section</code>。根据反编译的结果可以看出来，其实整个程序都被编译到<code>.text</code>段中了。因为我们的源文件中并没有明确的指定代码或者数据所在的段，默认情况下<code>as</code>会把这些代码、数据都放在<code>.text</code>段里。<code>-M</code>参数中指定了以<code>16</code>位模式<code>(i8086)</code>反汇编，同时指定在<code>at&amp;t</code>语法中显示指令后缀<code>(suffix)</code>，这些选项以逗号分隔开。</p><p>第<code>10</code>行第一个<code>b8</code>是将<code>16</code>位立即数转移到<code>ax</code>寄存器的指令的二进制码，后面的<code>00 b8</code>因为是小端序，所以它表示的数据实际上是<code>b800</code>，很熟悉，对不对？</p><p>第<code>12、13</code>行，仔细观察可以发现这两条指令前三个字节是相同的，对，它们就是将<code>8</code>位立即数转移到以<code>es</code>为段地址的内存中的指令的二进制码。还是因为是小端序，所以第<code>12</code>行的<code>00 00</code>实际是<code>00 00</code><s>跟没说一样</s>，第<code>13</code>行的<code>01 00</code>实际是<code>00 01</code>，也就是我们在代码里指定的偏移地址。第<code>12</code>行最后一个字节<code>48</code>，就是<code>&#39;H&#39;</code>的<code>ASCII</code>码对应的<code>16</code>进制表示，<code>as</code>已经帮我们翻译过了，所以我们也就不需要花时间去记每一个字符的<code>ASCII</code>码是多少了。</p><p>第<code>14</code>行，我们在代码中写的明明是<code>.</code>，到这里却变成了<code>0x11</code>。还记得我们说过<code>.</code>是位置计数器吗？代表了当前行所在的位置，看冒号前面的<code>11</code>，它告诉了我们当前这条指令的位置，<code>jmp 0x11</code>就是反复跳到自己这里执行喽。</p><p>中间<s>的代码</s>压根没有代码，因为我们是用<code>.org</code>直接跳到<code>510</code>这个位置的，所以从<code>jmp</code>之后到<code>510</code>都是<code>0</code>，<code>objdump</code>很贴心的没有给我们显示。<code>0x1fb</code>处的这个<code>00 00</code>不用管他，毕竟我们把所有东西都放在了代码<code>(.text)</code>段里，<code>objdump</code>也没那么聪明，这不，把我们可引导的标记<code>0x55 0xaa</code>也翻译成了指令。</p><p>好了，代码也写好了，也编译成二进制的文件了。那么，放在虚拟机里启动康康效果吧。</p><p>且慢，让我们先康康<code>boot.o</code>的大小，康康它是不是符合我们<code>512</code>字节的要求。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">ls</span> <span class="token parameter variable">-l</span> boot.o 
-rw-rw-r-- <span class="token number">1</span> laoli laoli <span class="token number">956</span> <span class="token number">3</span>月   <span class="token number">6</span> <span class="token number">21</span>:19 boot.o
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p><code>956</code>字节，显然胖了。出现这种结果的原因是<code>as</code>生成的目标文件默认是<code>elf</code>格式的，<code>elf</code>格式的文件中除了二进制代码，还会附加一些头信息、段信息、链接信息、调试信息等等。对与我们这个程序来说，是用不到这些信息的，甚至连链接都不需要，直接把目标文件中的二进制代码复制出来就行了。这个操作我们使用<code>objcopy</code>这个工具来完成。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ objcopy <span class="token parameter variable">-O</span> binary <span class="token parameter variable">-j</span> .text boot.o boot.bin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><code>-O binary</code>指定输出文件的格式为纯二进制格式，<code>-j .text</code>指定只复制<code>.text</code>段，输出的文件名为<code>boot.bin</code>。我们再来看看<code>boot.bin</code>文件的大小。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">ls</span> <span class="token parameter variable">-l</span> boot.bin 
-rw-rw-r-- <span class="token number">1</span> laoli laoli <span class="token number">512</span> <span class="token number">3</span>月   <span class="token number">6</span> <span class="token number">21</span>:19 boot.bin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>刚刚好，<code>512</code>字节。再来看看其中的内容。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ xxd <span class="token parameter variable">-a</span> boot.bin 
00000000: b800 b88e c026 c606 0000 <span class="token number">4826</span> c606 0100  <span class="token punctuation">..</span><span class="token punctuation">..</span>.<span class="token operator">&amp;</span><span class="token punctuation">..</span><span class="token punctuation">..</span>H<span class="token operator">&amp;</span><span class="token punctuation">..</span><span class="token punctuation">..</span>
00000010: 0aeb fe00 0000 0000 0000 0000 0000 0000  <span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>
00000020: 0000 0000 0000 0000 0000 0000 0000 0000  <span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>
*
000001f0: 0000 0000 0000 0000 0000 0000 0000 55aa  <span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>U.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>有兴趣的小朋友可以和上面反编译的结果对比一下，分毫不差。</p><p>好了，现在可以开机、启动了。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ qemu-system-i386 boot.bin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><figure><img src="`+s+'" alt="启动 H" tabindex="0" loading="lazy"><figcaption>启动 H</figcaption></figure><p>这就完事儿了？不是说打印<code>Hello World</code>吗？怎么打了个<code>H</code>就完事儿了？</p><p>其实对于一个初学者来说，这章的内容还是蛮多的，需要消化消化。另外，<code>H</code>都打印出来了，<code>ello World</code>还是事儿吗？这个可以留个课后作业，小伙伴们自己试一试。在下一篇文章中老李会教大家一些其它的指令来完成<code>Hello World</code>的打印。</p><p>最后我们来对学到的知识点做一个总结：</p><ul><li><code>8086</code> 处理器采用分段的模型来操作内存，由 <code>段基址</code>:<code>段内偏移</code> 组合给出物理地址，计算方式为 <code>段基址</code> 左移 <code>4</code> 位，与 <code>段内偏移</code> 相加形成 <code>20</code> 位的物理地址。</li><li>计算机启动后，显卡默认初始化为 <code>80 x 25</code> 的文本模式，显存映射到内存的 <code>0xb8000</code> 到 <code>0xbffff</code> 这段物理地址空间。</li><li>文本模式下每个字符的显示由两个字节控制，低字节为该字符的 <code>ASCII</code> 码，高字节控制字符显示的颜色。</li><li><code>.code16</code> 告诉编译器将代码编译成符合 <code>16</code> 位处理器的格式。</li><li><code>mov</code> 指令用于转移数据。</li><li><code>jmp</code> 指令用于程序的跳转。</li><li><code>.</code> 位置计数器，表示当前位置，当然也可以通过给它赋值来改变当前位置。</li><li><code>.org</code> 伪指令，告诉编译器移动到操作数所指定的位置。</li><li><code>.word</code> 伪指令，用于写入一个字的数据，也可以写入多个一个字长的数据，用逗号分隔。</li><li>剩下的就是我们用到的那些工具<code>as</code>、<code>objdump</code>、<code>objcopy</code>，回过头去结合工具执行后的结果，理解理解每一个参数的含义就<code>ok</code>了。</li></ul>',44),l=[i];function p(t,r){return d(),n("div",null,l)}const b=e(a,[["render",p],["__file","01-hello-world.html.vue"]]);export{b as default};
