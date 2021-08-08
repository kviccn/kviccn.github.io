---
title: 'Linux 内核编译及运行'
date: 2021-08-08T11:58:07+08:00
draft: false
description:
tags:
  - linux
  - qemu
  - 内核
series:
  -
categories:
  -
---

今天在家没事干，编译一下`linux`内核。准备编译的内核版本是`2.6`，源码通过`git`获取，如下：

```bash
$ git clone git://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux-2.6.git
```

由于网络环境的原因，下载速度可能会非常慢。解决方案可以是开代理，或者你也可以使用我重新打包的版本。

原始仓库大小为`3.7GB`，经`gzip`压缩后大小是`2.54GB`。我比较暴力，直接删除了原始的`.git`目录，仓库大小缩减至`1.2GB`，经`gzip`压缩后的大小是`192MB`。

```bash
$ ls -lh
total 192M
drwxrwxr-x 24 laoli laoli 4.0K 8月   8 12:16 linux-2.6
-rw-rw-r--  1 laoli laoli 192M 8月   8 12:18 linux-2.6.tar.gz
```

这一顿操作之后仓库大小得到了显著的优化，带来的结果就是你克隆代码的时候会快很多。

仓库地址：

- [https://github.com/kviccn/linux-2.6.git](https://github.com/kviccn/linux-2.6.git)
- [https://gitee.com/kviccn/linux-2.6.git](https://gitee.com/kviccn/linux-2.6.git)

## 实验环境

我使用的环境如下：

```bash
$ uname -a
Linux lowb 5.11.0-25-generic #27~20.04.1-Ubuntu SMP Tue Jul 13 17:41:23 UTC 2021 x86_64 x86_64 x86_64 GNU/Linux
```

```bash
$ lsb_release -a
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 20.04.2 LTS
Release:        20.04
Codename:       focal
```

安装如下依赖：

```bash
$ sudo apt install build-essential qemu-system-x86 -y
$ sudo apt install flex bison -y
$ sudo apt install libssl-dev libelf-dev -y
```

第一组中的`build-essential`包含`gcc`编译器并自动安装`make`；`qemu-system-x86`是模拟器，用于启动和调试内核。

第二组`flex` `bison`在生成内核配置文件时会用到。

第三组`libssl-dev` `libelf-dev`是内核源码编译时需要的依赖。

## 开始

创建工作目录并获取源码：

```bash
$ mkdir -p ~/projects/linux_kernel
$ cd ~/projects/linux_kernel
$ git clone https://github.com/kviccn/linux-2.6.git
$ cd linux-2.6
```

生成内核配置文件：

```bash
$ make defconfig
  YACC    scripts/kconfig/parser.tab.[ch]
  HOSTCC  scripts/kconfig/lexer.lex.o
  HOSTCC  scripts/kconfig/menu.o
  HOSTCC  scripts/kconfig/parser.tab.o
  HOSTCC  scripts/kconfig/preprocess.o
  HOSTCC  scripts/kconfig/symbol.o
  HOSTCC  scripts/kconfig/util.o
  HOSTLD  scripts/kconfig/conf
*** Default configuration is based on 'x86_64_defconfig'
#
# configuration written to .config
#
```

输出信息中显示内核配置已经写入`.config`文件。

查看`.config`：

```bash
$ more .config
#
# Automatically generated file; DO NOT EDIT.
# Linux/x86 5.14.0-rc4 Kernel Configuration
#
CONFIG_CC_VERSION_TEXT="gcc (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0"
CONFIG_CC_IS_GCC=y
CONFIG_GCC_VERSION=90300
CONFIG_CLANG_VERSION=0
CONFIG_AS_IS_GNU=y
CONFIG_AS_VERSION=23400
CONFIG_LD_IS_BFD=y
CONFIG_LD_VERSION=23400
CONFIG_LLD_VERSION=0
CONFIG_CC_CAN_LINK=y
CONFIG_CC_CAN_LINK_STATIC=y
CONFIG_CC_HAS_ASM_GOTO=y
CONFIG_CC_HAS_ASM_INLINE=y
CONFIG_CC_HAS_NO_PROFILE_FN_ATTR=y
CONFIG_IRQ_WORK=y
CONFIG_BUILDTIME_TABLE_SORT=y
CONFIG_THREAD_INFO_IN_TASK=y

#
# General setup
#
CONFIG_INIT_ENV_ARG_LIMIT=32
# CONFIG_COMPILE_TEST is not set
CONFIG_LOCALVERSION=""
# CONFIG_LOCALVERSION_AUTO is not set
--More--(0%)
```

配置信息非常多，但是我们现在不关心这个。

一旦`.config`文件成功生成，执行`make`就可以进行内核的编译了。

```bash
$ make
...
Kernel: arch/x86/boot/bzImage is ready  (#1)
```

如果不做重定向的话输出信息非常多，我用`...`省略了，输出信息的最后一行是生成的内核所在的位置。
当前目录下的`arch/x86/boot/`目录下的`bzImage`文件就是最终生成的内核映像。

```bash
$ ls -lh arch/x86/boot/bzImage
-rw-rw-r-- 1 laoli laoli 9.1M 8月   8 09:37 arch/x86/boot/bzImage
```

该文件大小只有`9.1M`，这是经过`gzip`压缩之后的内核映像。原始的未经压缩的内核映像生成在源码根目录下：

```bash
$ ls -lh vmlinux
-rwxrwxr-x 1 laoli laoli 61M 8月   8 09:37 vmlinux
```

大小为`61M`，所以压缩还是很有必要的。

查看文件类型：

```bash
$ file vmlinux
vmlinux: ELF 64-bit LSB executable, x86-64, version 1 (SYSV), statically linked, BuildID[sha1]=d713c99a0a437a2b4a0429eded699ebdc7452a8b, not stripped
```

是我们熟悉的`elf`格式的可执行文件。

内核已经编译完成，下一个主题`运行`。

## 运行

运行可以在物理机器上，也可以在虚拟机上。我打算在虚拟机上运行，因为直接在物理机运行有点危险，稍有不慎，搞错什么配置或者误删什么文件那系统可能就起不起来了。虽说也可以修复，但是每次重新运行内核查看效果都要重启，这谁顶得住。

先将刚才生成的内核映像`bzImage`复制一份出来方便我们操作：

```bash
$ mkdir ~/projects/linux_kernel/demo
$ cd ~/projects/linux_kernel/demo
$ cp ../linux-2.6/arch/x86/boot/bzImage .
```

第一次尝试：

```bash
$ qemu-system-x86_64 -kernel bzImage
```

`qemu`的窗口中最终输出如下信息然后卡住不动：

```
[    2.385237] md: If you don't use raid, use raid=noautodetect
[    2.385489] md: Autodetecting RAID arrays.
[    2.385595] md: autorun ...
[    2.385746] md: ... autorun DONE.
[    2.387977] VFS: Cannot open root device "(null)" or unknown-block(0,0): err6
[    2.388398] Please append a correct "root=" boot option; here are the availa:
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
```

其实我们已经成功了。系统提示`VFS: Cannot open root device "(null)" or unknown-block(0,0)`，说无法打开`root device`。这很合理，因为我们并没有在虚拟机中设置`root device`。

这个好解决，我们直接从系统里复制个`initrd.img`过来就行了。

```bash
$ cp /boot/initrd.img .
```

第二次尝试：

```bash
$ qemu-system-x86_64 -m 1G -kernel bzImage -initrd initrd.img
```

这次我们将虚拟机内存调整到了`1G`（内存太小会报`System is deadlocked on memory`的错），并且指定了`initrd`参数。

`qemu`窗口输出如下：

```
[    2.440277] cfg80211: failed to load regulatory.db
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
Enter 'help' for a list of built-in commands.

(initramfs)
```

最后一行出现了命令提示符，让我们来敲个熟悉的`ls`康康：

```
(initramfs) ls
dev      bin      init     lib64    sbin     var      tmp
root     conf     lib      libx32   scripts  sys
kernel   etc      lib32    run      usr      proc
(initramfs)
```

大功告成。

但事情肯定不能止步于此，我们连`Hello World!`都没打出来呢，让我们在加点料。

加料之前先解释一下`initrd`参数是干啥的，这个参数用于指定`initramfs`。那`initramfs`又是啥，这个东西把名字拆开各位就应该差不多能看懂了`init` `ram` `fs`。一种初始时加载到内存中的文件系统。

## 制作 initramfs

写个经典的`Hello World`，用于在系统启动时执行

```c
#include <stdio.h>

void main() {
  printf("Hello laoli!\n");
  fflush(stdout);
  while(1);
}
```

编译，静态连接：

```bash
$ cc -static -o helloworld helloworld.c
```

生成`initramfs`：

```bash
$ echo helloworld | cpio -o --format=newc > initrd-hw.img
```

`initramfs`需要打包成 `cpio` 档案。

运行：

```bash
$ qemu-system-x86_64 \
    -kernel bzImage \
    -initrd initrd-hw.img \
    -append "root=/dev/ram rdinit=/helloworld"
```

- -kernel：提供内核镜像`bzImage`
- -initrd：提供`initramfs`
- -append：提供内核参数，指引`rootfs`所在分区，指引`init`命令路径

这里通过`-initrd`指定`initramfs`为我们刚生成的`initrd-hw.img`。
通过`-append`进行额外配置，将根目录设置为内存，启动时的`init`程序设置为我们刚才编写的`helloworld`。

`qemu`窗口的输出如下：

```
[    1.722424] sched_clock: Marking stable (1693370913, 28776387)->(1810106690,)
[    1.723876] registered taskstats version 1
[    1.724012] Loading compiled-in X.509 certificates
[    1.728386] PM:   Magic number: 1:692:874
[    1.729844] printk: console [netcon0] enabled
[    1.729998] netconsole: network logging started
[    1.732385] cfg80211: Loading compiled-in X.509 certificates for regulatory e
[    1.742962] kworker/u2:0 (62) used greatest stack depth: 14840 bytes left
[    1.752414] cfg80211: Loaded X.509 cert 'sforshee: 00b28ddf47aef9cea7'
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
```

输出信息中提示`Run /helloworld as init process`，并且输出`Hello laoli!`

（完）
