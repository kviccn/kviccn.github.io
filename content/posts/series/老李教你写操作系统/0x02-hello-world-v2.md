---
title: '老李教你写操作系统 0x02 - Hello World v2'
date: 2021-09-04T10:25:26+08:00
description:
tags:
  - 操作系统
  - QEMU
  - GRUB
  - multiboot
series:
  - 老李教你写操作系统
categories:
  - 操作系统
---

## 目标

今天的目标：规范化开发流程。

在[上一篇](/posts/2020/02/老李教你写操作系统-0x01-hello-world/)文章中，出于简洁的考虑只使用了一个`.c`文件来做说明。后续的开发中代码会越来越多，一个文件肯定是不够的，今天我们将代码做一下简单的拆分，以便更好的扩展。

## 代码拆分

先把之前的源文件`kernel.c`贴出来：

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

在第`1`行我们内联了一行汇编代码来说明我们的`kernel`是符合`multiboot`规范的，这部分需要提取出去，新建文件`boot.S`，内容如下：

```asm
#define MULTIBOOT_HEADER_MAGIC      0x1BADB002
#define MULTIBOOT_HEADER_FLAGS      0
#define MULTIBOOT_HEADER_CHECKSUM   -(MULTIBOOT_HEADER_MAGIC + MULTIBOOT_HEADER_FLAGS)

.section .text
.globl entry
.long MULTIBOOT_HEADER_MAGIC
.long MULTIBOOT_HEADER_FLAGS
.long MULTIBOOT_HEADER_CHECKSUM

entry:

hlt
```

因为我们将这部分内容和内核主要代码拆分开了，所以需要从这段代码中调用内核主函数，将控制权转移到内核。处理器进行函数调用需要栈的支持，所以我们还需要准备一个栈。添加相关代码如下：

```asm
#define MULTIBOOT_HEADER_MAGIC      0x1BADB002
#define MULTIBOOT_HEADER_FLAGS      0
#define MULTIBOOT_HEADER_CHECKSUM   -(MULTIBOOT_HEADER_MAGIC + MULTIBOOT_HEADER_FLAGS)

#define STACK_SIZE                  0x4000  // 16KB

.section .text
.globl entry
.long MULTIBOOT_HEADER_MAGIC
.long MULTIBOOT_HEADER_FLAGS
.long MULTIBOOT_HEADER_CHECKSUM

entry:
// 初始化栈指针
movl $(stack + STACK_SIZE), %esp

call kernel_main

hlt

.section .bss
.comm stack, STACK_SIZE
```

内核代码重构如下：

```c
typedef unsigned short uint16_t;

void cprintf(char *str)
{
  static uint16_t *video_buffer = (uint16_t *)0xb8000;

  for (int i = 0; str[i] != '\0'; i++)
  {
    video_buffer[i] = str[i] | 0x0f00; // 黑底白字
  }
}

void kernel_main()
{
  cprintf("Hello kernel!");
}
```

内核主函数为`kernel_main`，由`boot.S`调用。

## 构建过程

之前我们是手动编译、链接和启动虚拟机的，每次修改代码之后都这么操作一遍显然是不科学的。今天我们使用`make`来自动化构建过程，对应的`Makefile`如下：

```Makefile
objects = boot.o kernel.o

kernel.elf: $(objects)
	ld -m elf_i386 -e entry -Ttext 0x100000 $(objects) -o $@

%.o: %.c
	cc -m32 -c $<

%.o: %.S
	cc -m32 -c $<

run: kernel.elf
	qemu-system-i386 -kernel kernel.elf -monitor stdio

clean:
	rm -f *.elf *.o
```

现在，我们只需要敲个`make run`就可以完成代码的编译链接并启动虚拟机查看结果了。

完整的代码在[这里](https://github.com/kviccn/multiboot-in-action/tree/master/b)。

## 参考资料

> [Multiboot 文档](https://www.gnu.org/software/grub/manual/multiboot/multiboot.html)

> [跟我一起写 Makefile](https://wiki.ubuntu.org.cn/%E8%B7%9F%E6%88%91%E4%B8%80%E8%B5%B7%E5%86%99Makefile)
