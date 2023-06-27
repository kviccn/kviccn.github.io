import{_ as l}from"./plugin-vue_export-helper-c27b6911.js";import{r as s,o as r,c as v,b as d,d as e,e as o,w as n,a as c}from"./app-a3b1dd03.js";const t="/assets/boot_qemu-310c14c0.png",m="/assets/boot1_qemu-2ce00014.png",b={},u=c(`<h2 id="串操作指令" tabindex="-1"><a class="header-anchor" href="#串操作指令" aria-hidden="true">#</a> 串操作指令</h2><p>含义：通过执行一条字符串操作指令，对存储器中某一个连续的内存中存放的一串字或字节均进行同样的操作，称为串操作。字符串操作指令简称为串操作指令。</p><p>所有的基本串操作指令都用寄存器<code>si</code>间接寻址源操作数，且假定源操作数在当前的数据段中，即源操作数首地址的物理地址由<code>ds:si</code>提供；而用寄存器<code>di</code>间接寻址目的操作数，且假定目的操作数在当前的附加段中，即目的操作数首地址的物理地址由<code>es:di</code>提供。显然，串操作指令的源操作数和目的操作数都在存储器中。</p><p>这两个地址的指针在每一个操作以后要自动修改，但按增量还是减量修改，取决于方向标志<code>DF</code>（位于标志寄存器内）：若<code>DF=0</code>，则在每次操作后<code>si</code>和<code>di</code>作增量操作：字节操作加<code>1</code>，字符操作加<code>2</code>；若<code>DF=1</code>，则在每次操作后<code>si</code>和<code>di</code>作减量操作：字节操作减<code>1</code>，字符操作减<code>2</code>。因此对于串操作，需要预先设置<code>DF</code>的值。可以用<code>std</code>或<code>cld</code>指令分别置<code>DF</code>为<code>1</code>或<code>0</code>。</p><p>若源串和目的串在同一段中，可使<code>ds</code>和<code>es</code>指向相同数据段，即<code>ds=es</code>。</p><p>还可以在任一串操作指令前加一个指令前缀，构成重复前级指令，通过此指令来控制串操作指令的重复执行操作。下面结合代码来讲解一下。</p><h3 id="代码" tabindex="-1"><a class="header-anchor" href="#代码" aria-hidden="true">#</a> 代码</h3><div class="language-asm line-numbers-mode" data-ext="asm"><pre class="language-asm"><code>.code16

movw $0x07c0, %ax
movw %ax, %ds

movw $0xb800, %ax
movw %ax, %es

cld
movw $message, %si
xorw %di, %di
movw message_length, %cx
rep movsb

jmp .

message:
  .byte &#39;H&#39;, 0xa, &#39;e&#39;, 0xa, &#39;l&#39;, 0xa, &#39;l&#39;, 0xa, &#39;o&#39;, 0xa, &#39; &#39;, 0xa, &#39;W&#39;, 0xa, &#39;o&#39;, 0xa, &#39;r&#39;, 0xa, &#39;l&#39;, 0xa, &#39;d&#39;, 0xa
message_length:
  .word . - message

.org 510
.word 0xAA55
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="解释" tabindex="-1"><a class="header-anchor" href="#解释" aria-hidden="true">#</a> 解释</h3>`,9),p={href:"https://github.com/kviccn/asm-boooom/blob/master/0x02/boot.s",target:"_blank",rel:"noopener noreferrer"},x=d("code",null,"9~13",-1),h=c(`<p>第<code>9</code>行，使用<code>cld</code>指令将<code>DF</code>标志位置为<code>0</code>，表示每次操作后对<code>si</code>和<code>di</code>做增量操作。</p><p>第<code>10</code>行，将<code>message</code>的地址赋值给<code>si</code>。此时引导扇区整体被<code>BIOS</code>加载到<code>0x7c00</code>处，并且我们已经将数据段设置成了<code>0x07c0</code>。<code>message</code>代表数据的偏移量，该指令执行后<code>ds:si</code>就指向了我们的数据首地址。</p><p>第<code>11</code>行，将<code>di</code>置<code>0</code>。此时<code>es</code>内容为<code>0xb800</code>，<code>es:di</code>表示的物理地址为<code>0xb8000</code>，即显存映射在内存中的首地址。</p><p>第<code>12</code>行，设置循环次数，循环的次数为数据串的长度。</p><p>第<code>13</code>行使用串传送指令<code>movs</code>来完成数据传送的工作。该指令具体分为两条<code>movsb</code>和<code>movsw</code>，分别为把由<code>si</code>作为指针的源操作数串中的一个字节或字，传送至由<code>di</code>作为指针的目的操作数串中，且根据<code>DF</code>修改各自的指针，使其指向各串中的下一单元。这里是把<code>ds:si</code>处的一个字节传送到<code>es:di</code>，并且把<code>si</code>和<code>di</code>分别加一。指令前缀<code>rep</code>是重复前缀，其功能是重复执行<code>rep</code>后紧跟着的一个串操作指令，直到<code>cx</code>寄存器中的值为<code>0</code>。执行时先检查<code>cx</code>的值，若为<code>0</code>则退出重复操作，执行以下其他指令；若不为<code>0</code>，则将<code>cx</code>的值减一；然后执行<code>rep</code>右侧的串指令；重复上述操作。</p><p>通过组合<code>rep</code>和<code>movs</code>我们就可以批量的把数据从内存的一个区域转移到另一个区域。</p><h3 id="运行" tabindex="-1"><a class="header-anchor" href="#运行" aria-hidden="true">#</a> 运行</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ as <span class="token parameter variable">--32</span> boot.s <span class="token parameter variable">-o</span> boot.o
$ objcopy <span class="token parameter variable">-O</span> binary <span class="token parameter variable">-j</span> .text boot.o boot.bin
$ qemu-system-i386 boot.bin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="`+t+`" alt="boot_qemu" tabindex="0" loading="lazy"><figcaption>boot_qemu</figcaption></figure><p>下面继续学习算术运算指令。</p><h2 id="算数运算指令" tabindex="-1"><a class="header-anchor" href="#算数运算指令" aria-hidden="true">#</a> 算数运算指令</h2><p>之前我们学习过<code>inc</code>指令，该指令用于对操作数加一，并把结果放回到目的操作数中。此指令可以进行字节操作或字操作，其操作数可以是寄存器操作数或内存操作数。下面我们结合一个在屏幕上打印数字的程序来学习一下其他的算术运算指令。在该示例中，我们会将数字<code>9527</code>的每一位分解出来，并打印在屏幕上。</p><h3 id="代码-1" tabindex="-1"><a class="header-anchor" href="#代码-1" aria-hidden="true">#</a> 代码</h3><div class="language-asm line-numbers-mode" data-ext="asm"><pre class="language-asm"><code>.code16

.set DIVIDEND, 9527         # 被除数
.set DIVISOR, 10            # 除数
.set COUNT_OF_DIGITS, 4     # 位数 -- 分解需要的循环次数

movw $0x07c0, %ax
movw %ax, %ds

movw $0xb800, %ax
movw %ax, %es

# 设置 32位 被除数
# 高 16位 在 %dx 中, 低 16位 在 %ax 中
# 因为 %ax 足够保存 9527, 所以将高 16位(%dx) 清空
xorw %dx, %dx
movw $DIVIDEND, %ax
movw $DIVISOR, %cx
movw $store, %bx

# 初始化索引寄存器 (倒序保存各个数位)
movw $COUNT_OF_DIGITS - 1, %si
split:
  divw %cx
  # 除法指令执行后 商保存在 %ax 中, 余数保存在 %dx 中
  # 因为除数是 10, 所以余数小于 10, 即 %dl 中就是余数
  movb %dl, (%bx, %si)
  xorw %dx, %dx
  decw %si
  jns split

movw $COUNT_OF_DIGITS, %cx
xorw %si, %si
xorw %di, %di
putc:
  movb store(%si), %al
  orw $0x0a30, %ax
  movw %ax, %es:(%di)
  incw %si
  addw $2, %di
  loop putc

jmp .

store:
  .byte 0, 0, 0, 0

.org 510
.word 0xAA55
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="解释-1" tabindex="-1"><a class="header-anchor" href="#解释-1" aria-hidden="true">#</a> 解释</h3><p>第<code>3、4、5</code>行使用<code>.set</code>伪指令定义了三个符号。符号在编译时会被编译器替换成实际的值，类似于<code>c</code>语言中的<code>#define</code>指令。</p><p>第<code>16、17、18</code>行初始化被除数和除数。当对字执行<code>div</code>操作时，需要将被除数放在<code>dx:ax</code>中，高字节在<code>dx</code>中，低字节在<code>ax</code>中。我们的被除数是<code>9527</code>，<code>ax</code>能够容纳，所以直接将<code>dx</code>置<code>0</code>，并将<code>9527</code>移动到<code>ax</code>中就完成了对被除数的准备工作。<code>div</code>指令的源操作数，即除数，可以是除立即数之外的任何类型的操作数。这里我们使用寄存器<code>cx</code>存储<code>div</code>指令的源操作数。</p><p>第<code>19</code>行将<code>store</code>的地址移动到<code>bx</code>基址寄存器中，因为我们打算展示一下<code>基址加变址寻址</code>的应用。<code>store</code>开始的<code>4</code>个字节空间是为分解<code>9524</code>的四个位而保留的。</p><p>第<code>22</code>行我们将索引寄存器<code>si</code>的值设置为<code>COUNT_OF_DIGITS - 1</code>，即<code>3</code>。此时<code>bx + si</code>的值为<code>store + 3</code>，即相对于<code>store</code>处<code>3</code>个字节。因为依次分解出来的是个、十、百、千位，如果顺序保存在<code>store</code>处的话稍后打印就需要倒序打印，所以我们在保存的时候就倒序保存在内存中，方便稍后打印。</p><p>第<code>24</code>行执行<code>divw</code>除法指令，除法指令完成后会将商保存在<code>ax</code>中，余数保存在<code>dx</code>中。</p><p>第<code>27</code>行将<code>dl</code>中的数据保存到内存数据段<code>bx + si</code>处。因为除数是<code>10</code>，所以余数是小于<code>10</code>的，<code>dl</code>就足够保存我们需要的数据。根据上面的分析，此时<code>bx + si</code>等于<code>store + 3</code>，即我们会将分解出来的数据保存在<code>store</code>开始的第<code>3</code>个字节处（从<code>0</code>开始计数）。</p><p>第<code>28</code>行将<code>dx</code>置<code>0</code>，为下一次分解做准备。</p><p>第<code>29</code>行使用<code>dec</code>指令将索引寄存器<code>si</code>减一，此时<code>bx + si</code>等于<code>store + 2</code>，即表示从<code>store</code>开始的第<code>2</code>个字节处。下一个数位保存在这里。</p><p>第<code>30</code>行使用条件转移指令<code>jns</code>来实现循环分解各位。<code>jns</code>是一个条件转移指令，当结果为正时<code>(SF=0)</code>转移。<code>SF</code>是状态标志寄存器<code>FLAGS</code>中的符号标志位<code>(Sign Flag)</code>。用于表示符号数的正负。如果运算结果的最高位为<code>1</code>，则<code>SF=1</code>，否则为<code>0</code>。因为上一条指令<code>dec</code>可以影响到符号标志位，当<code>si</code>为负数的时候我们就可以知道分解已经完成，从而跳出分解数位的过程，执行后续指令。</p><p>第<code>32</code>行设置循环次数，我们将通过循环将分解好的每一位打印在屏幕上。</p><p>第<code>33、34</code>行将索引寄存器<code>si</code>和<code>di</code>置<code>0</code>，我们将使用这两个寄存器分别访问分解好的位和显存对应的内存地址。</p><p>第<code>36</code>行将分解好的位移动到<code>al</code>中。这里有一个隐含的条件，当被除数被分解完的时候，<code>ax</code>寄存器保存的是除法操作的商，此时商为<code>0</code>，即<code>ax</code>寄存器的值为<code>0</code>。</p>`,27),_=d("code",null,"37",-1),g=d("code",null,"or",-1),w=d("code",null,"ax",-1),f=d("code",null,"0x0a",-1),E=d("code",null,"ax",-1),D=d("code",null,"0x30",-1),F=d("code",null,"ASCII",-1),I=d("code",null,"ASCII",-1),A=d("code",null,"ASCII",-1),S=d("code",null,"0x30",-1),$=c(`<p>第<code>38</code>行将要打印的字符连同显示属性一起转移到显存对应的内存处。</p><p>第<code>39</code>行将<code>si</code>加<code>1</code>，指向下一个位数。</p><p>第<code>40</code>行将<code>di</code>加<code>2</code>，因为我们在第<code>38</code>行中一次操作了两个字节的数据。</p><p>第<code>46</code>行为分解的结果保留了<code>4</code>个字节的空间，每个字节用于保存一个位。</p><h3 id="运行-1" tabindex="-1"><a class="header-anchor" href="#运行-1" aria-hidden="true">#</a> 运行</h3><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ as <span class="token parameter variable">--32</span> boot1.s <span class="token parameter variable">-o</span> boot1.o
$ objcopy <span class="token parameter variable">-O</span> binary <span class="token parameter variable">-j</span> .text boot1.o boot1.bin
$ qemu-system-i386 boot1.bin
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="`+m+'" alt="boot1_qemu" tabindex="0" loading="lazy"><figcaption>boot1_qemu</figcaption></figure><h2 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> 总结</h2><h3 id="伪指令" tabindex="-1"><a class="header-anchor" href="#伪指令" aria-hidden="true">#</a> 伪指令</h3><ul><li><code>.set</code> 用于定义一个符号，类似于<code>c</code>语言中的<code>#define</code>指令。</li></ul><h3 id="指令" tabindex="-1"><a class="header-anchor" href="#指令" aria-hidden="true">#</a> 指令</h3><ul><li><code>cld</code> 用于将标志寄存器<code>FLAGS</code>的<code>DF</code>标志位置为<code>0</code>。</li><li><code>movs</code> 串传送指令，用于将数据从<code>ds:si</code>处移动到<code>es:di</code>处，一次可移动一个字节或一个字；根据<code>DF</code>决定移动完成之后<code>si</code>和<code>di</code>加/减<code>1</code>或<code>2</code>。配合<code>rep</code>重复前缀和<code>cx</code>完成批量传送。</li><li><code>div</code> 无符号除法指令。当源操作数（除数）为字节时，除法指令的功能是<code>ax 除以 源操作数</code>，商存入<code>al</code>，余数存入<code>ah</code>；当源操作数为字时，除法指令的功能是<code>dx:ax 除以 源操作数</code>，商存入<code>ax</code>，余数存入<code>dx</code>。<code>dx:ax</code>表示由这两个寄存器共同组成的数据，<code>dx</code>保存其高位，<code>ax</code>保存低位。</li><li><code>or</code> 按位逻辑或指令。</li><li><code>add</code> 普通加法指令，无进位。</li><li><code>dec</code> 减一指令。</li><li><code>jns</code> 条件转移指令。当标志寄存器符号标志位<code>SF</code>为<code>0</code>时转移。</li></ul>',12);function k(B,C){const i=s("RouterLink"),a=s("ExternalLinkIcon");return r(),v("div",null,[d("p",null,[e("上一篇文章中我们学习了"),o(i,{to:"/series/%E6%B1%87%E7%BC%96%E8%AF%AD%E8%A8%80%E4%B8%80%E5%8F%91%E5%85%A5%E9%AD%82/02-%E6%8C%87%E4%BB%A4%E7%9A%84%E5%AF%BB%E5%9D%80%E6%96%B9%E5%BC%8F.html"},{default:n(()=>[e("指令的寻址方式")]),_:1}),e("，实际上是借具体的代码总结了一下寻址方式。这篇文章我们将学习更多的指令，通过实际代码的讲解，找到写汇编语言代码的感觉。下面先来讲一下串操作指令。")]),u,d("p",null,[e("与上一篇给出的"),d("a",p,[e("代码"),o(a)]),e("的主要区别在第"),x,e("行。")]),h,d("p",null,[e("第"),_,e("行"),g,e("按位逻辑或指令的功能有两个，一是将"),w,e("寄存器的高字节设置为"),f,e("，表示打印的字符的显示属性，浅绿色；二是将"),E,e("寄存器的低字节加上"),D,e("，因为分解好的数字并不能直接打印在屏幕上，屏幕上打印的数字实则是数字对应的"),F,e("码。观察"),o(i,{to:"/posts/2020/03/%E6%B1%87%E7%BC%96%E8%AF%AD%E8%A8%80%E4%B8%80%E5%8F%91%E5%85%A5%E9%AD%82-0x01-hello-world/"},{default:n(()=>[e("这里")]),_:1}),e("给出的"),I,e("码表，我们可以发现，数字对应的"),A,e("码为数字本身加上十六进制的"),S,e("。")]),$])}const y=l(b,[["render",k],["__file","03-更多的指令.html.vue"]]);export{y as default};
