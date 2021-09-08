---
title: 'C 语言可变参数'
date: 2021-09-08T09:54:18+08:00
description:
tags:
  - c
  - variable arguments
  - 可变参数
series:
  -
categories:
  -
---

不懂原理的话一切都是玄学问题。今天，老李带你打破玄学，走近科学。

## 实验环境

```bash
$ uname -a
Linux lowb 5.11.0-27-generic #29~20.04.1-Ubuntu SMP Wed Aug 11 15:58:17 UTC 2021 x86_64 x86_64 x86_64 GNU/Linux

$ lsb_release -a
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 20.04.3 LTS
Release:        20.04
Codename:       focal

$ cc --version
cc (Ubuntu 9.3.0-17ubuntu1~20.04) 9.3.0
Copyright (C) 2019 Free Software Foundation, Inc.
This is free software; see the source for copying conditions.  There is NO
warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
```

在研究可变参数之前有一个必须要搞清楚的东西 -- 函数调用约定。没有约定，那可变参数的实现也就无从谈起。

## 函数调用约定

函数调用约定是函数调用者和被调函数之间关于参数传递、返回值传递、堆栈清除、寄存器使用的一种约定。

常见的调用约定：

- stdcall

- cdecl

- fastcall

- thiscall

- naked call

这里主要讲解一下`stdcall`和`cdecl`。

### stdcall 调用约定

1. 参数从右向左压入堆栈
2. 函数自身清理堆栈

举个例子，创建文件`main1_stdcall.c`，内容如下：

```c
#include <stdio.h>

__attribute__((stdcall)) int sum_stdcall(int x, int y, int z) {
  return x + y + z;
}

int main(void) {
  printf("1+2+3=%d(stdcall)\n", sum_stdcall(1, 2, 3));
  return 0;
}
```

我们通过`__attribute__((stdcall))`指定函数`sum_stdcall`使用`stdcall`调用约定。如果不指定，则默认为`cdecl`。

编译：

```bash
$ cc -Wall -g -m32    main1_stdcall.c   -o main1_stdcall
```

记得要加`-m32`参数，生成`32`位代码。因为`64`位参数传递的方式与`32`位不同，我们这里以`32`位为例。

查看汇编代码：

```bash
$ objdump -d -Msuffix main1_stdcall

main1_stdcall:     file format elf32-i386

...

000011cd <sum_stdcall>:
    11cd:       f3 0f 1e fb             endbr32
    11d1:       55                      pushl  %ebp
    11d2:       89 e5                   movl   %esp,%ebp
    11d4:       e8 61 00 00 00          calll  123a <__x86.get_pc_thunk.ax>
    11d9:       05 ff 2d 00 00          addl   $0x2dff,%eax
    11de:       8b 55 08                movl   0x8(%ebp),%edx
    11e1:       8b 45 0c                movl   0xc(%ebp),%eax
    11e4:       01 c2                   addl   %eax,%edx
    11e6:       8b 45 10                movl   0x10(%ebp),%eax
    11e9:       01 d0                   addl   %edx,%eax
    11eb:       5d                      popl   %ebp
    11ec:       c2 0c 00                retl   $0xc

000011ef <main>:
...
    120d:       6a 03                   pushl  $0x3
    120f:       6a 02                   pushl  $0x2
    1211:       6a 01                   pushl  $0x1
    1213:       e8 b5 ff ff ff          calll  11cd <sum_stdcall>
...
```

省略了无关代码，只保留和函数调用相关的。

可以看到在第`26`行调用`sum_stdcall`之前，按照从右至左的顺序依次将参数压栈。而在第`19`行，即`sum_stdcall`函数的最后一行，通过`retl $0xc`在被调函数中将栈指针 esp 向上移动`0xc`，即`12`个字节以清理堆栈。`int`占用`4`个字节，`12`正好是`3`个`int`型参数。

### cdecl 调用约定

1. 参数从右向左压入堆栈
2. 调用者负责清理堆栈
3. C 调用约定允许函数的参数个数是不固定的

举个例子，创建文件`main1.c`，内容如下：

```c
#include <stdio.h>

int sum(int x, int y, int z) { return x + y + z; }

int main(void) {
  printf("1+2+3=%d\n", sum(1, 2, 3));
  return 0;
}
```

编译：

```bash
$ cc -Wall -g -m32    main1.c   -o main1
```

查看汇编代码：

```bash
$ objdump -d -Msuffix main1

main1:     file format elf32-i386

...

000011cd <sum>:
    11cd:       f3 0f 1e fb             endbr32
    11d1:       55                      pushl  %ebp
    11d2:       89 e5                   movl   %esp,%ebp
    11d4:       e8 62 00 00 00          calll  123b <__x86.get_pc_thunk.ax>
    11d9:       05 ff 2d 00 00          addl   $0x2dff,%eax
    11de:       8b 55 08                movl   0x8(%ebp),%edx
    11e1:       8b 45 0c                movl   0xc(%ebp),%eax
    11e4:       01 c2                   addl   %eax,%edx
    11e6:       8b 45 10                movl   0x10(%ebp),%eax
    11e9:       01 d0                   addl   %edx,%eax
    11eb:       5d                      popl   %ebp
    11ec:       c3                      retl

000011ed <main>:
...
    120b:       6a 03                   pushl  $0x3
    120d:       6a 02                   pushl  $0x2
    120f:       6a 01                   pushl  $0x1
    1211:       e8 b7 ff ff ff          calll  11cd <sum>
    1216:       83 c4 0c                addl   $0xc,%esp
...
```

同样，在第`26`行调用`sum`之前按照从右至左的顺序依次将参数压栈。注意第`19`行，在`sum`函数中`ret`指令并没有参数。栈的清理工作在第`27`行，即`sum`函数调用返回之后，由`main`函数清理。通过`add`指令将栈指针 esp 向上移动`0xc`字节。

在了解了函数调用约定之后我们再来探究可变参数的实现。

## 可变参数

我们先稍稍修改一下之前的例子，打印出每个参数的地址。

```c
#include <stdio.h>

int sum(int x, int y, int z) {
  printf("x = %d, xp = %p\n", x, &x);
  printf("y = %d, yp = %p\n", y, &y);
  printf("z = %d, zp = %p\n", z, &z);
  return x + y + z;
}

int main(void) {
  printf("1+2+3=%d\n", sum(1, 2, 3));
  return 0;
}
```

```bash
$ cc -Wall -g -m32    main2.c   -o main2
$ ./main2
x = 1, xp = 0xff8e84c0
y = 2, yp = 0xff8e84c4
z = 3, zp = 0xff8e84c8
1+2+3=6
```

观察每个参数的地址，都是连续的，每个参数占`4`个字节。在上一节，我们知道了参数是由右至左依次压栈的，所以这里就很好理解了。

现在我们知道第一个参数，即`x`的地址，同时知道参数是连续的，还知道`int`型参数占`4`个字节。那我们就可以根据第一个参数的地址计算出其余参数的地址，知道了地址我们就可以取地址对应的值，继续改造我们的代码：

```c
#include <stdio.h>

int sum(int x, int y, int z) {
  int *bp = &x;
  printf("x = %d, xp = %p\n", *bp, bp);
  printf("y = %d, yp = %p\n", *(bp + 1), bp + 1);
  printf("z = %d, zp = %p\n", *(bp + 2), bp + 2);
  return x + y + z;
}

int main(void) {
  printf("1+2+3=%d\n", sum(1, 2, 3));
  return 0;
}
```

```bash
$ cc -Wall -g -m32    main3.c   -o main3
$ ./main3
x = 1, xp = 0xffed15c0
y = 2, yp = 0xffed15c4
z = 3, zp = 0xffed15c8
1+2+3=6
```

这次我们没有直接对`y`和`z`进行操作，依然得到了同样的结果。

有了这些基础知识，现在我们过渡到可变参数，代码如下。

```c
#include <stdio.h>

int sum(int n, ...) {
  int *bp = &n + 1;
  int sum = 0;

  for (int i = 0; i < n; i++) {
    printf("arg%d = %d, argp%d = %p\n", i + 1, *(bp + i), i + 1, bp + i);
    sum += *(bp + i);
  }
  return sum;
}

int main(void) {
  printf("1+2+3=%d\n\n", sum(3, 1, 2, 3));
  printf("3+4+5=%d\n\n", sum(3, 3, 4, 5));
  printf("1+2+3+4=%d\n", sum(4, 1, 2, 3, 4));
  return 0;
}
```

C 语言可变参数函数规定：

- 必须至少有一个固定参数
- 可选参数用`...`表示，且只能出现在参数列表的最后

于是我们的代码中有一个固定参数`int n`，用来表示可选参数的数量。

第`4`行，我们取固定参数`n`的地址，`+ 1`取到第一个可选参数的地址作为后续操作的基地址。

`for`循环中根据基地址依次计算出每个可选参数的地址进行相关操作。

查看运行结果：

```bash
$ cc -Wall -g -m32    main4.c   -o main4
$ ./main4
arg1 = 1, argp1 = 0xffebc9f4
arg2 = 2, argp2 = 0xffebc9f8
arg3 = 3, argp3 = 0xffebc9fc
1+2+3=6

arg1 = 3, argp1 = 0xffebc9f4
arg2 = 4, argp2 = 0xffebc9f8
arg3 = 5, argp3 = 0xffebc9fc
3+4+5=12

arg1 = 1, argp1 = 0xffebc9e4
arg2 = 2, argp2 = 0xffebc9e8
arg3 = 3, argp3 = 0xffebc9ec
arg4 = 4, argp4 = 0xffebc9f0
1+2+3+4=10
```

<img src="/posts/images/faces/不过如此这般罢了.jpg" alt="不过如此这般罢了" width="50%" />

再来看一个稍微复杂一点的例子，该函数来自 [xv6](https://github.com/mit-pdos/xv6-public/blob/master/console.c#L55)：

```c
void cprintf(const char *fmt, ...) {
  uint32_t *argp;
  char *s;
  int c;

  argp = (uint32_t *)(&fmt + 1);

  for (int i = 0; (c = fmt[i] & 0xff) != 0; i++) {
    if (c != '%') {
      consputc(c);
      continue;
    }

    c = fmt[++i] & 0xff;

    if (c == 0) break;

    switch (c) {
      case 'd':
        printint(*argp++, 10, 1);
        break;
      case 'x':
      case 'p':
        printint(*argp++, 16, 0);
        break;
      case 's':
        if ((s = (char *)*argp++) == 0) s = "(null)";
        for (; *s; s++) consputc(*s);
        break;
      case '%':
        consputc('%');
        break;
      default:
        consputc('%');
        consputc(c);
        break;
    }
  }
}
```

在`sum`函数中，我们通过第一个参数告知函数本次调用共有多少个可选参数。当然也可以通过别的方式告知可选参数个数，例如`printf`函数和这里的`cprintf`中第一个参数`fmt`中的占位符。有多少个占位符就有多少个可选参数。我们在函数体中依次解析每一个字符，遇到占位符时，根据不同的类型对可选参数进行不同的操作。

我讲完了，但是好像没有完全讲完。

如果你之前搜索过 C 语言可变参数相关的资料，一定见过这些东西：

- `stdarg.h`
- `va_list`
- `va_start`
- `va_arg`
- `va_end`

下面我们来说说这些东西。

## stdarg.h

其实在上面我们已经实现并使用了可变参数，`stdarg.h`只是给我们提供了一种更简便的方法使用可变参数。主要通过`va_start`、`va_arg`，`va_end`这三个宏和`va_list`类型来完成工作。

同样的代码，我们使用`stdarg`重新实现：

```c
#include <stdarg.h>
#include <stdio.h>

int sum(int n, ...) {
  va_list valist;
  int sum = 0;
  int cur;

  va_start(valist, n);

  for (int i = 0; i < n; i++) {
    cur = va_arg(valist, int);
    printf("arg%d = %d\n", i + 1, cur);
    sum += cur;
  }

  va_end(valist);
  return sum;
}

int main(void) {
  printf("1+2+3=%d\n\n", sum(3, 1, 2, 3));
  printf("3+4+5=%d\n\n", sum(3, 3, 4, 5));
  printf("1+2+3+4=%d\n", sum(4, 1, 2, 3, 4));
  return 0;
}
```

代码结构是一样的，只不过现在我们声明了一个`va_list`类型的变量来表示参数指针，等价于之前的`bp`指针。接着使用`va_start`初始化`va_list`，然后使用`va_arg`依次访问每一个可选参数，最后通过`va_end`释放`va_list`。

编译运行：

```bash
$ cc -Wall -g -m32    main5.c   -o main5
$ ./main5 
arg1 = 1
arg2 = 2
arg3 = 3
1+2+3=6

arg1 = 3
arg2 = 4
arg3 = 5
3+4+5=12

arg1 = 1
arg2 = 2
arg3 = 3
arg4 = 4
1+2+3+4=10
```

这些宏及类型的一种实现如下：

```c
typedef char* va_list;

#define _INTSIZEOF(n) ((sizeof(n) + sizeof(int) - 1) & ~(sizeof(int) - 1))

#define va_start(ap, v) (ap = (va_list)&v + _INTSIZEOF(v))
#define va_arg(ap, t) (*(t*)((ap += _INTSIZEOF(t)) - _INTSIZEOF(t)))
#define va_end(ap) (ap = (va_list)0)
```

当然，现代的编译器大概都会把这些实现为内置函数，在我的计算机上如下：

```c
typedef __builtin_va_list va_list;

#define va_start(ap, param) __builtin_va_start(ap, param)
#define va_end(ap)          __builtin_va_end(ap)
#define va_arg(ap, type)    __builtin_va_arg(ap, type)
```

这次我大概真的讲完了。

最后，在送给大家一段代码：

```c
#include <stdarg.h>
#include <stdio.h>
#include <string.h>

void va_demo(char *types[], ...) {
  va_list valist;
  va_start(valist, types);

  for (int i = 0; types[i] != NULL; i++) {
    if (strcmp(types[i], "int") == 0) {
      printf("%d ", va_arg(valist, int));
      continue;
    }

    if (strcmp(types[i], "char") == 0) {
      printf("%c ", va_arg(valist, int));
      continue;
    }

    if (strcmp(types[i], "char*") == 0) {
      printf("%s ", va_arg(valist, char *));
      continue;
    }
  }

  printf("\n");

  va_end(valist);
}

int main(void) {
  char *types[] = {"int", "char", "char*", NULL};
  va_demo(types, 5, 'c', "laoli!");
  return 0;
}
```

编译运行：

```bash
$ cc -Wall -g -m32    main6.c   -o main6
$ ./main6
5 c laoli!
```

之前我们说过，告知函数可选参数个数的方式不止一种。这里我们没有直接告诉函数有多少个可选参数，而是把`NULL`作为结束条件蕴含在第一个参数`types`中。
这里我想告诉大家一个字 -- `约定`。细细体会，计算机中，无处不约定。

完整代码戳[这里](https://github.com/kviccn/c-variable-arguments)。

（完）
