---
title: "老李教你写操作系统 0x01 - Hello World"
date: 2020-02-15T17:55:36+08:00
tags: ["操作系统", "QEMU", "GRUB", "multiboot"]
categories: ["操作系统"]
series: ["老李教你写操作系统"]
---

# 前言

~~这还得从一只蝙蝠说起。~~

讲道理这篇文章的题目很不合理。作为一个计算机人，第一篇文章起码应该是`0x00`吧？这是对计算机最起码的尊重。原本打算在这篇文章之前写一篇关于汇编和硬件基础知识的介绍（以后补上）。虽然汇编和硬件很简单，但是一上来就讲这些简单的知识难免会让人觉得枯燥，因而影响学习的积极性是得不偿失的。索性先写个操作系统找找感觉，以此建立学习的兴趣，未尝不是一件好事。

搞计算机这一行，万事离不了个`Hello World`。现在开始就带领大家实现一个操作系统版的`Hello World`。

# 环境

+ 系统：`Ubuntu 18.04.4 LTS`
+ 编译器：`gcc version 7.4.0 (Ubuntu 7.4.0-1ubuntu1~18.04.1)`
+ 链接器：`GNU ld (GNU Binutils for Ubuntu) 2.30`
+ 虚拟机：`QEMU emulator version 2.11.1(Debian 1:2.11+dfsg-1ubuntu7.21)`

# 开发

新建文件`kernel.c`，代码如下

```c
asm(".long 0x1badb002, 0, (-(0x1badb002 + 0))");

unsigned short *video_buffer = (unsigned short *)0xb8000;
char *message = "Hello, world!";

void kernel_main(void)
{
  for (int i = 0; i < 80 * 25; i++)
  {
    video_buffer[i] = (video_buffer[i] & 0xff00) | ' ';
  }

  for (int i = 0; message[i] != '\0'; i++)
  {
    video_buffer[i] = (video_buffer[i] & 0xff00) | message[i];
  }

  while (1)
    ;
}
```

+ 编译 `cc -c -m32 -ffreestanding kernel.c -o kernel.o`
+ 链接 `ld -m elf_i386 -e kernel_main -Ttext=0x100000 kernel.o -o kernel.elf`
+ 运行 `qemu-system-i386 -kernel kernel.elf`

一切顺利的话运行结果如下：

![运行结果](/posts/老李教你写操作系统/images/0x01/VirtualBox_xubuntu_15_02_2020_21_23_43.png)

# 解释

## 代码解释

第`1`行是内联汇编语句，用于定义三个32位的数据，共12字节。对于操作系统来说这不是必须的，但这是`multiboot`规范定义的`header`。符合这个规范的内核可以被`qemu`或`grub`所引导。

`multiboot`规范规定`header`的第一个字段必须为十六进制的`0x1BADB002`，称之为`magic`。第二个字段为`flags`，用于告知`bootloader`需要为内核提供哪些信息（如内存布局、显示模式表），我们暂时不需要这些信息，所以填`0`。第三个字段是`checksum`，即校验和，根据规范`magic` `flags` `checksum`之和必须为`0`。`qemu`或`grub`会检查这个值来确认这是一个可引导的内核。

第`3`行定义了一个`unsigned short`类型的指针，指向内存的`0xb8000`处。BIOS引导系统时默认将显卡设置为`80列`x`25行`的文本模式，显存的起始地址被映射到内存地址的`0xb8000`处，所以可以通过直接向对应内存写入数据的方式来操作显存。

该模式下一屏幕的数据占据从`0xb8000`开始的`4000`个字节，即`80 * 25 * 2`。因为显示一个字符需要两个字节的数据，低字节为字符的`ASCII`码，高字节为字符的属性。这也是将显存对应指针定义为`unsigned short`类型的原因。

第`4`行定义了我们要在屏幕上显示的数据，需要注意的是`C`风格的字符串以空字符结尾，所以在稍后的循环中我们可以以此判断字符串是否显示完成。

第`6`行定义了内核的主函数，该函数作为内核的入口点会被引导程序调用。

第`8-11`行的代码用于清屏。如上所述，一屏可以显示`80 * 25`个`ASCII`字符。语句`video_buffer[i] = (video_buffer[i] & 0xff00) | ' '`将显存中的每一个字符及属性取出来，保留其高字节的显示属性，与空格组合在一起回填回去即可实现清屏。

第`13-16`行代码原理同上，不过将空格换成了第`4`行定义的数据。

第`18`行让我们的内核陷入死循环。

去除空行和花括号就短短的几行代码，理解起来也很容易，下面解释一下编译、链接及运行所用到的命令和参数的含义。

## 命令解释

### cc

+ `-c` 告知编译器只编译生成目标文件但不链接
+ `-m32` 告知编译器生成32位代码
+ `-ffreestanding` 告知编译器按独立环境编译，该环境可以没有标准库，且对`main()`函数没有要求。该选项隐含设置了`-fno-builtin`，且与`-fno-hosted`等价
+ `-o` 指定输出文件名

### ld

+ `-m elf_i386` 指定链接生成的文件格式为`elf`且目标平台为`i386`
+ `-e kernel_main` 指定程序的入口点为`kernel_main`
+ `-Ttext=0x100000` 指定代码段的始起地址为`0x100000`。因为`bootloader`默认会把内核加载到`0x100000`处执行，所以代码段的地址也需要调整到这个位置
+ `-o` 指定输出文件名

对于没有编写过操作系统的人来说可能不太理解`-e`和`-T`参数到底做了什么，下面结合目标文件`kernel.o`和链接生成的内核文件`kernel.elf`来解释一下这两个参数具体的作用。

反汇编`kernel.o`

```bash
$ objdump -d kernel.o

kernel.o：     文件格式 elf32-i386


Disassembly of section .text:

00000000 <kernel_main-0xc>:
   0:   02 b0 ad 1b 00 00       add    0x1bad(%eax),%dh
   6:   00 00                   add    %al,(%eax)
   8:   fe 4f 52                decb   0x52(%edi)
   b:   e4                      .byte 0xe4

0000000c <kernel_main>:
   c:   55                      push   %ebp
   d:   89 e5                   mov    %esp,%ebp
   f:   53                      push   %ebx
  10:   83 ec 10                sub    $0x10,%esp
...
```

反汇编`kernel.elf`

```bash
$ objdump -d kernel.elf

kernel.elf：     文件格式 elf32-i386


Disassembly of section .text:

00100000 <kernel_main-0xc>:
  100000:       02 b0 ad 1b 00 00       add    0x1bad(%eax),%dh
  100006:       00 00                   add    %al,(%eax)
  100008:       fe 4f 52                decb   0x52(%edi)
  10000b:       e4                      .byte 0xe4

0010000c <kernel_main>:
  10000c:       55                      push   %ebp
  10000d:       89 e5                   mov    %esp,%ebp
  10000f:       53                      push   %ebx
  100010:       83 ec 10                sub    $0x10,%esp
...
```

对比第`8`行可以发现在目标文件中代码段的始起地址为`0`，而链接后的内核文件中代码段起始地址为`0x100000`。并且代码段的前12个字节正好是我们定义的`multiboot header`。

`kernel.o`文件的头部信息

```bash
$ readelf -h kernel.o
ELF 头：
  Magic：   7f 45 4c 46 01 01 01 00 00 00 00 00 00 00 00 00
  类别:                              ELF32
  数据:                              2 补码，小端序 (little endian)
  版本:                              1 (current)
  OS/ABI:                            UNIX - System V
  ABI 版本:                          0
  类型:                              REL (可重定位文件)
  系统架构:                          Intel 80386
  版本:                              0x1
  入口点地址：               0x0
  程序头起点：          0 (bytes into file)
  Start of section headers:          988 (bytes into file)
  标志：             0x0
  本头的大小：       52 (字节)
  程序头大小：       0 (字节)
  Number of program headers:         0
  节头大小：         40 (字节)
  节头数量：         17
  字符串表索引节头： 16
```

`kernel.elf`文件的头部信息

```bash
$ readelf -h kernel.elf
ELF 头：
  Magic：   7f 45 4c 46 01 01 01 00 00 00 00 00 00 00 00 00
  类别:                              ELF32
  数据:                              2 补码，小端序 (little endian)
  版本:                              1 (current)
  OS/ABI:                            UNIX - System V
  ABI 版本:                          0
  类型:                              EXEC (可执行文件)
  系统架构:                          Intel 80386
  版本:                              0x1
  入口点地址：               0x10000c
  程序头起点：          52 (bytes into file)
  Start of section headers:          8716 (bytes into file)
  标志：             0x0
  本头的大小：       52 (字节)
  程序头大小：       32 (字节)
  Number of program headers:         3
  节头大小：         40 (字节)
  节头数量：         10
  字符串表索引节头： 9
```

对比第`12`行可以发现在目标文件中入口点地址为`0x0`，而链接后的内核文件中入口点地址为`0x10000c`。结合`kernel.elf`反汇编的信息可以看到`0x10000c`正是`kernel_main`的起始地址。通过这些信息就能很好的理解`-e`和`-T`这两个参数的作用。

### qemu-system-i386

+ `-kernel` 使用这个参数可以指定一个内核镜像。这个镜像可以是`linux`内核或符合`multiboot`规范的其它镜像。使用这个参数的好处是可以不用将内核安装到磁盘镜像中而直接启动，很方便测试。

当屏幕上打印出`Hello World`这几个字母时就说明你已经进入了操作系统的大门。剩下的无非就是初始化硬件、设置中断、内存管理、进程管理、输入输出、文件系统这些基本操作了。

其实操作系统本就不是什么高深莫测的东西。当你深刻的理解了理论之后，在稍加一点相关的硬件知识就可以很轻松的开发操作系统了。
