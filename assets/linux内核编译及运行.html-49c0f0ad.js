import{_ as l}from"./plugin-vue_export-helper-c27b6911.js";import{r as d,o as c,c as o,b as n,d as s,e as a,a as i}from"./app-0c3433bd.js";const r={},t=i(`<p>今天在家没事干，编译一下<code>linux</code>内核。准备编译的内核版本是<code>2.6</code>，源码通过<code>git</code>获取，如下：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">git</span> clone git://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux-2.6.git
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>由于网络环境的原因，下载速度可能会非常慢。解决方案可以是开代理，或者你也可以使用我重新打包的版本。</p><p>原始仓库大小为<code>3.7GB</code>，经<code>gzip</code>压缩后大小是<code>2.54GB</code>。我比较暴力，直接删除了原始的<code>.git</code>目录，仓库大小缩减至<code>1.2GB</code>，经<code>gzip</code>压缩后的大小是<code>192MB</code>。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">ls</span> <span class="token parameter variable">-lh</span>
total 192M
drwxrwxr-x <span class="token number">24</span> laoli laoli <span class="token number">4</span>.0K <span class="token number">8</span>月   <span class="token number">8</span> <span class="token number">12</span>:16 linux-2.6
-rw-rw-r--  <span class="token number">1</span> laoli laoli 192M <span class="token number">8</span>月   <span class="token number">8</span> <span class="token number">12</span>:18 linux-2.6.tar.gz
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这一顿操作之后仓库大小得到了显著的优化，带来的结果就是你克隆代码的时候会快很多。</p><p>仓库地址：</p>`,7),p={href:"https://github.com/kviccn/linux-2.6.git",target:"_blank",rel:"noopener noreferrer"},u={href:"https://gitee.com/kviccn/linux-2.6.git",target:"_blank",rel:"noopener noreferrer"},v=i(`<h2 id="实验环境" tabindex="-1"><a class="header-anchor" href="#实验环境" aria-hidden="true">#</a> 实验环境</h2><p>我使用的环境如下：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">uname</span> <span class="token parameter variable">-a</span>
Linux lowb <span class="token number">5.11</span>.0-25-generic <span class="token comment">#27~20.04.1-Ubuntu SMP Tue Jul 13 17:41:23 UTC 2021 x86_64 x86_64 x86_64 GNU/Linux</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ lsb_release <span class="token parameter variable">-a</span>
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu <span class="token number">20.04</span>.2 LTS
Release:        <span class="token number">20.04</span>
Codename:       focal
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>安装如下依赖：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> build-essential qemu-system-x86 <span class="token parameter variable">-y</span>
$ <span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> flex bison <span class="token parameter variable">-y</span>
$ <span class="token function">sudo</span> <span class="token function">apt</span> <span class="token function">install</span> libssl-dev libelf-dev <span class="token parameter variable">-y</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第一组中的<code>build-essential</code>包含<code>gcc</code>编译器并自动安装<code>make</code>；<code>qemu-system-x86</code>是模拟器，用于启动和调试内核。</p><p>第二组<code>flex</code> <code>bison</code>在生成内核配置文件时会用到。</p><p>第三组<code>libssl-dev</code> <code>libelf-dev</code>是内核源码编译时需要的依赖。</p><h2 id="开始" tabindex="-1"><a class="header-anchor" href="#开始" aria-hidden="true">#</a> 开始</h2><p>创建工作目录并获取源码：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">mkdir</span> <span class="token parameter variable">-p</span> ~/projects/linux_kernel
$ <span class="token builtin class-name">cd</span> ~/projects/linux_kernel
$ <span class="token function">git</span> clone https://github.com/kviccn/linux-2.6.git
$ <span class="token builtin class-name">cd</span> linux-2.6
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>生成内核配置文件：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">make</span> defconfig
  YACC    scripts/kconfig/parser.tab.<span class="token punctuation">[</span>ch<span class="token punctuation">]</span>
  HOSTCC  scripts/kconfig/lexer.lex.o
  HOSTCC  scripts/kconfig/menu.o
  HOSTCC  scripts/kconfig/parser.tab.o
  HOSTCC  scripts/kconfig/preprocess.o
  HOSTCC  scripts/kconfig/symbol.o
  HOSTCC  scripts/kconfig/util.o
  HOSTLD  scripts/kconfig/conf
*** Default configuration is based on <span class="token string">&#39;x86_64_defconfig&#39;</span>
<span class="token comment">#</span>
<span class="token comment"># configuration written to .config</span>
<span class="token comment">#</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出信息中显示内核配置已经写入<code>.config</code>文件。</p><p>查看<code>.config</code>：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">more</span> .config
<span class="token comment">#</span>
<span class="token comment"># Automatically generated file; DO NOT EDIT.</span>
<span class="token comment"># Linux/x86 5.14.0-rc4 Kernel Configuration</span>
<span class="token comment">#</span>
<span class="token assign-left variable">CONFIG_CC_VERSION_TEXT</span><span class="token operator">=</span><span class="token string">&quot;gcc (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0&quot;</span>
<span class="token assign-left variable">CONFIG_CC_IS_GCC</span><span class="token operator">=</span>y
<span class="token assign-left variable">CONFIG_GCC_VERSION</span><span class="token operator">=</span><span class="token number">90300</span>
<span class="token assign-left variable">CONFIG_CLANG_VERSION</span><span class="token operator">=</span><span class="token number">0</span>
<span class="token assign-left variable">CONFIG_AS_IS_GNU</span><span class="token operator">=</span>y
<span class="token assign-left variable">CONFIG_AS_VERSION</span><span class="token operator">=</span><span class="token number">23400</span>
<span class="token assign-left variable">CONFIG_LD_IS_BFD</span><span class="token operator">=</span>y
<span class="token assign-left variable">CONFIG_LD_VERSION</span><span class="token operator">=</span><span class="token number">23400</span>
<span class="token assign-left variable">CONFIG_LLD_VERSION</span><span class="token operator">=</span><span class="token number">0</span>
<span class="token assign-left variable">CONFIG_CC_CAN_LINK</span><span class="token operator">=</span>y
<span class="token assign-left variable">CONFIG_CC_CAN_LINK_STATIC</span><span class="token operator">=</span>y
<span class="token assign-left variable">CONFIG_CC_HAS_ASM_GOTO</span><span class="token operator">=</span>y
<span class="token assign-left variable">CONFIG_CC_HAS_ASM_INLINE</span><span class="token operator">=</span>y
<span class="token assign-left variable">CONFIG_CC_HAS_NO_PROFILE_FN_ATTR</span><span class="token operator">=</span>y
<span class="token assign-left variable">CONFIG_IRQ_WORK</span><span class="token operator">=</span>y
<span class="token assign-left variable">CONFIG_BUILDTIME_TABLE_SORT</span><span class="token operator">=</span>y
<span class="token assign-left variable">CONFIG_THREAD_INFO_IN_TASK</span><span class="token operator">=</span>y

<span class="token comment">#</span>
<span class="token comment"># General setup</span>
<span class="token comment">#</span>
<span class="token assign-left variable">CONFIG_INIT_ENV_ARG_LIMIT</span><span class="token operator">=</span><span class="token number">32</span>
<span class="token comment"># CONFIG_COMPILE_TEST is not set</span>
<span class="token assign-left variable">CONFIG_LOCALVERSION</span><span class="token operator">=</span><span class="token string">&quot;&quot;</span>
<span class="token comment"># CONFIG_LOCALVERSION_AUTO is not set</span>
--More--<span class="token punctuation">(</span><span class="token number">0</span>%<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>配置信息非常多，但是我们现在不关心这个。</p><p>一旦<code>.config</code>文件成功生成，执行<code>make</code>就可以进行内核的编译了。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">make</span>
<span class="token punctuation">..</span>.
Kernel: arch/x86/boot/bzImage is ready  <span class="token punctuation">(</span><span class="token comment">#1)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果不做重定向的话输出信息非常多，我用<code>...</code>省略了，输出信息的最后一行是生成的内核所在的位置。 当前目录下的<code>arch/x86/boot/</code>目录下的<code>bzImage</code>文件就是最终生成的内核映像。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">ls</span> <span class="token parameter variable">-lh</span> arch/x86/boot/bzImage
-rw-rw-r-- <span class="token number">1</span> laoli laoli <span class="token number">9</span>.1M <span class="token number">8</span>月   <span class="token number">8</span> 09:37 arch/x86/boot/bzImage
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>该文件大小只有<code>9.1M</code>，这是经过<code>gzip</code>压缩之后的内核映像。原始的未经压缩的内核映像生成在源码根目录下：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">ls</span> <span class="token parameter variable">-lh</span> vmlinux
-rwxrwxr-x <span class="token number">1</span> laoli laoli 61M <span class="token number">8</span>月   <span class="token number">8</span> 09:37 vmlinux
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>大小为<code>61M</code>，所以压缩还是很有必要的。</p><p>查看文件类型：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">file</span> vmlinux
vmlinux: ELF <span class="token number">64</span>-bit LSB executable, x86-64, version <span class="token number">1</span> <span class="token punctuation">(</span>SYSV<span class="token punctuation">)</span>, statically linked, BuildID<span class="token punctuation">[</span>sha1<span class="token punctuation">]</span><span class="token operator">=</span>d713c99a0a437a2b4a0429eded699ebdc7452a8b, not stripped
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>是我们熟悉的<code>elf</code>格式的可执行文件。</p><p>内核已经编译完成，下一个主题<code>运行</code>。</p><h2 id="运行" tabindex="-1"><a class="header-anchor" href="#运行" aria-hidden="true">#</a> 运行</h2><p>运行可以在物理机器上，也可以在虚拟机上。我打算在虚拟机上运行，因为直接在物理机运行有点危险，稍有不慎，搞错什么配置或者误删什么文件那系统可能就起不起来了。虽说也可以修复，但是每次重新运行内核查看效果都要重启，这谁顶得住。</p><p>先将刚才生成的内核映像<code>bzImage</code>复制一份出来方便我们操作：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">mkdir</span> ~/projects/linux_kernel/demo
$ <span class="token builtin class-name">cd</span> ~/projects/linux_kernel/demo
$ <span class="token function">cp</span> <span class="token punctuation">..</span>/linux-2.6/arch/x86/boot/bzImage <span class="token builtin class-name">.</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第一次尝试：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ qemu-system-x86_64 <span class="token parameter variable">-kernel</span> bzImage
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><code>qemu</code>的窗口中最终输出如下信息然后卡住不动：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>[    2.385237] md: If you don&#39;t use raid, use raid=noautodetect
[    2.385489] md: Autodetecting RAID arrays.
[    2.385595] md: autorun ...
[    2.385746] md: ... autorun DONE.
[    2.387977] VFS: Cannot open root device &quot;(null)&quot; or unknown-block(0,0): err6
[    2.388398] Please append a correct &quot;root=&quot; boot option; here are the availa:
[    2.388852] 0b00         1048575 sr0
[    2.388890]  driver: sr
[    2.389203] Kernel panic - not syncing: VFS: Unable to mount root fs on unkn)
[    2.389531] CPU: 0 PID: 1 Comm: swapper/0 Not tainted 5.14.0-rc4+ #1
[    2.389754] Hardware name: QEMU Standard PC (i440FX + PIIX, 1996), BIOS 1.134
[    2.390145] Call Trace:
[    2.390929]  dump_stack_lvl+0x34/0x44
[    2.391191]  panic+0xf6/0x2b7
[    2.391292]  mount_block_root+0x196/0x21a
[    2.391442]  mount_root+0xec/0x10a
[    2.391532]  prepare_namespace+0x136/0x165
[    2.391628]  kernel_init_freeable+0x203/0x20e
[    2.391734]  ? rest_init+0xb0/0xb0
[    2.391819]  kernel_init+0x11/0x110
[    2.391902]  ret_from_fork+0x22/0x30
[    2.392488] Kernel Offset: 0x9600000 from 0xffffffff81000000 (relocation ran)
[    2.392972] ---[ end Kernel panic - not syncing: VFS: Unable to mount root f-
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实我们已经成功了。系统提示<code>VFS: Cannot open root device &quot;(null)&quot; or unknown-block(0,0)</code>，说无法打开<code>root device</code>。这很合理，因为我们并没有在虚拟机中设置<code>root device</code>。</p><p>这个好解决，我们直接从系统里复制个<code>initrd.img</code>过来就行了。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token function">cp</span> /boot/initrd.img <span class="token builtin class-name">.</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>第二次尝试：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ qemu-system-x86_64 <span class="token parameter variable">-m</span> 1G <span class="token parameter variable">-kernel</span> bzImage <span class="token parameter variable">-initrd</span> initrd.img
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>这次我们将虚拟机内存调整到了<code>1G</code>（内存太小会报<code>System is deadlocked on memory</code>的错），并且指定了<code>initrd</code>参数。</p><p><code>qemu</code>窗口输出如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>[    2.440277] cfg80211: failed to load regulatory.db
[    2.441549] ALSA device list:
[    2.441957]   No soundcards found.
[    2.519941] Freeing unused kernel image (initmem) memory: 1368K
[    2.522951] Write protecting the kernel read-only data: 20480k
[    2.525515] Freeing unused kernel image (text/rodata gap) memory: 2032K
[    2.526401] Freeing unused kernel image (rodata/data gap) memory: 536K
[    2.526846] Run /init as init process
Loading, please wait...
[    2.737525] input: ImExPS/2 Generic Explorer Mouse as /devices/platform/i8043
Starting version 245.4-4ubuntu3.11
[    4.676711] e1000 0000:00:03.0 enp0s3: renamed from eth0
[    4.862901] ata_id (100) used greatest stack depth: 13848 bytes left
Begin: Loading essential drivers ... done.
Begin: Running /scripts/init-premount ... done.
Begin: Mounting root file system ... Begin: Running /scripts/local-top ... done.
Begin: Running /scripts/local-premount ... done.
No root device specified. Boot arguments must include a root= parameter.


BusyBox v1.30.1 (Ubuntu 1:1.30.1-4ubuntu6.3) built-in shell (ash)
Enter &#39;help&#39; for a list of built-in commands.

(initramfs)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>最后一行出现了命令提示符，让我们来敲个熟悉的<code>ls</code>康康：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>(initramfs) ls
dev      bin      init     lib64    sbin     var      tmp
root     conf     lib      libx32   scripts  sys
kernel   etc      lib32    run      usr      proc
(initramfs)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>大功告成。</p><p>但事情肯定不能止步于此，我们连<code>Hello World!</code>都没打出来呢，让我们在加点料。</p><p>加料之前先解释一下<code>initrd</code>参数是干啥的，这个参数用于指定<code>initramfs</code>。那<code>initramfs</code>又是啥，这个东西把名字拆开各位就应该差不多能看懂了<code>init</code> <code>ram</code> <code>fs</code>。一种初始时加载到内存中的文件系统。</p><h2 id="制作-initramfs" tabindex="-1"><a class="header-anchor" href="#制作-initramfs" aria-hidden="true">#</a> 制作 initramfs</h2><p>写个经典的<code>Hello World</code>，用于在系统启动时执行</p><div class="language-c line-numbers-mode" data-ext="c"><pre class="language-c"><code><span class="token macro property"><span class="token directive-hash">#</span><span class="token directive keyword">include</span> <span class="token string">&lt;stdio.h&gt;</span></span>

<span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token function">printf</span><span class="token punctuation">(</span><span class="token string">&quot;Hello laoli!\\n&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token function">fflush</span><span class="token punctuation">(</span><span class="token constant">stdout</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token keyword">while</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>编译，静态连接：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ cc <span class="token parameter variable">-static</span> <span class="token parameter variable">-o</span> helloworld helloworld.c
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>生成<code>initramfs</code>：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ <span class="token builtin class-name">echo</span> helloworld <span class="token operator">|</span> cpio <span class="token parameter variable">-o</span> <span class="token parameter variable">--format</span><span class="token operator">=</span>newc <span class="token operator">&gt;</span> initrd-hw.img
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p><code>initramfs</code>需要打包成 <code>cpio</code> 档案。</p><p>运行：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>$ qemu-system-x86_64 <span class="token punctuation">\\</span>
    <span class="token parameter variable">-kernel</span> bzImage <span class="token punctuation">\\</span>
    <span class="token parameter variable">-initrd</span> initrd-hw.img <span class="token punctuation">\\</span>
    <span class="token parameter variable">-append</span> <span class="token string">&quot;root=/dev/ram rdinit=/helloworld&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>-kernel：提供内核镜像<code>bzImage</code></li><li>-initrd：提供<code>initramfs</code></li><li>-append：提供内核参数，指引<code>rootfs</code>所在分区，指引<code>init</code>命令路径</li></ul><p>这里通过<code>-initrd</code>指定<code>initramfs</code>为我们刚生成的<code>initrd-hw.img</code>。 通过<code>-append</code>进行额外配置，将根目录设置为内存，启动时的<code>init</code>程序设置为我们刚才编写的<code>helloworld</code>。</p><p><code>qemu</code>窗口的输出如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>[    1.722424] sched_clock: Marking stable (1693370913, 28776387)-&gt;(1810106690,)
[    1.723876] registered taskstats version 1
[    1.724012] Loading compiled-in X.509 certificates
[    1.728386] PM:   Magic number: 1:692:874
[    1.729844] printk: console [netcon0] enabled
[    1.729998] netconsole: network logging started
[    1.732385] cfg80211: Loading compiled-in X.509 certificates for regulatory e
[    1.742962] kworker/u2:0 (62) used greatest stack depth: 14840 bytes left
[    1.752414] cfg80211: Loaded X.509 cert &#39;sforshee: 00b28ddf47aef9cea7&#39;
[    1.754064] platform regulatory.0: Direct firmware load for regulatory.db fa2
[    1.754550] cfg80211: failed to load regulatory.db
[    1.755837] ALSA device list:
[    1.756077]   No soundcards found.
[    1.823450] Freeing unused kernel image (initmem) memory: 1368K
[    1.834264] Write protecting the kernel read-only data: 20480k
[    1.836722] Freeing unused kernel image (text/rodata gap) memory: 2032K
[    1.837592] Freeing unused kernel image (rodata/data gap) memory: 536K
[    1.837971] Run /helloworld as init process
Hello laoli!
[    2.023897] tsc: Refined TSC clocksource calibration: 1797.503 MHz
[    2.026978] clocksource: tsc: mask: 0xffffffffffffffff max_cycles: 0x19e8f2ds
[    2.035717] clocksource: Switched to clocksource tsc
[    2.321988] input: ImExPS/2 Generic Explorer Mouse as /devices/platform/i8043
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出信息中提示<code>Run /helloworld as init process</code>，并且输出<code>Hello laoli!</code></p><p>（完）</p>`,66);function m(b,k){const e=d("ExternalLinkIcon");return c(),o("div",null,[t,n("ul",null,[n("li",null,[n("a",p,[s("https://github.com/kviccn/linux-2.6.git"),a(e)])]),n("li",null,[n("a",u,[s("https://gitee.com/kviccn/linux-2.6.git"),a(e)])])]),v])}const h=l(r,[["render",m],["__file","linux内核编译及运行.html.vue"]]);export{h as default};
