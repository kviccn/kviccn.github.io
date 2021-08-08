---
title: '如何将 Qemu 输出设置到终端'
date: 2021-08-08T20:30:34+08:00
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

原文：[How to Setup QEMU Output to Console and Automate Using Shell Script](https://fadeevab.com/how-to-setup-qemu-output-to-console-and-automate-using-shell-script/)

有时我们需要在没有桌面环境的系统上进行内核的开发及调试，但是`qemu`默认会弹出来一个窗口，这就有点尴尬了。今天我们来看看如何解决这个问题。

## 准备工作

新建工作目录：

```bash
$ mkdir -p ~/projects/qemu_setup
$ cd ~/projects/qemu_setup
```

准备需要用到的文件：

1. wheezy.qcow2 (i386)：可引导的 Debian "Wheezy" 映像，QEMU copy-on-write 格式。用户名/密码："root"/"root"，"user"/"user"

```bash
$ wget https://people.debian.org/~aurel32/qemu/i386/debian_wheezy_i386_standard.qcow2 -O wheezy.qcow2
```

2. wheezy.img (i386)：不可引导的 Debian "Wheezy" 映像（没有内核），使用自定义内核（-kernel vmlinuz）

```bash
$ wget https://storage.googleapis.com/syzkaller/wheezy.img
```

3. vmlinuz (i386)：压缩过的可引导 Linux 内核。可选项：

   - 自己构建：[Build Android Kernel and Run on QEMU with Minimal Environment: Step by Step](https://fadeevab.com/build-android-kernel-and-run-on-qemu-minimal-step-by-step)

   - 从 Ubuntu 仓库下载（注意！端口转发将不可用）：

   ```bash
   wget http://security.ubuntu.com/ubuntu/pool/main/l/linux-signed-azure/linux-image-4.15.0-1036-azure_4.15.0-1036.38~14.04.2_amd64.deb
   ar x linux-image-4.15.0-1036-azure_4.15.0-1036.38~14.04.2_amd64.deb
   tar xf data.tar.xz ./boot/vmlinuz-4.15.0-1036-azure
   cp ./boot/vmlinuz-4.15.0-1036-azure ./vmlinuz
   ```

   - 你也可以使用你自己主机上的 Linux 内核（注意！端口转发和块设备可能会遇到问题）

   ```bash
   sudo cp /boot/vmlinuz-$(uname -r) .
   ```

注意！Ubuntu's vmlinuz 不包含 QEMU emulated network card devices (NIC)的驱动。 Debian's vmlinuz 不包含从`/dev/sda`设备加载原始映像的预构建驱动。

这里我们选择从 Ubuntu 仓库下载的内核做说明。

此时我们拥有如下文件：

```bash
$ ls -lh
total 1.3G
drwxrwxr-x 2 laoli laoli 4.0K 8月   8 22:05 boot
-rw-r--r-- 1 laoli laoli 2.3K 8月   8 22:05 control.tar.gz
-rw-r--r-- 1 laoli laoli 7.4M 8月   8 22:05 data.tar.xz
-rw-r--r-- 1 laoli laoli    4 8月   8 22:05 debian-binary
-rw-rw-r-- 1 laoli laoli 7.4M 12月  7  2018 linux-image-4.15.0-1036-azure_4.15.0-1036.38~14.04.2_amd64.deb
-rw------- 1 laoli laoli 7.6M 8月   8 22:06 vmlinuz
-rw-rw-r-- 1 laoli laoli 1.0G 8月  14  2017 wheezy.img
-rw-rw-r-- 1 laoli laoli 264M 8月   8 22:02 wheezy.qcow2
```

## 开始实验

### 将输入/输出设置到宿主机终端

`-serial stdio`

```bash
$ qemu-system-x86_64 -serial stdio wheezy.qcow2
```

![-serial_stdio.png](/posts/images/qemu_setup/-serial_stdio.png)

`-serial stdio`将虚拟机的串口重定向到宿主机终端的输入/输出。启动成功后你将看到一条欢迎信息。

`-nographic`

```bash
$ qemu-system-x86_64 -nographic wheezy.qcow2
```

![-nographic.png](/posts/images/qemu_setup/-nographic.png)

`-nographic`所作的和`-serial stdio`一样，同时还会隐藏`Qemu`的图形化窗口。

注意：

1. 在宿主机的终端中你将不会看到内核启动的早期信息。为了获取这些信息，请继续往下看。
2. 在非`GUI`模式下，如果要退出虚拟机，请在经过`qemu`重定向输入输出的终端中以`root`用户登录，密码也是`root`，输入`shutdown -h now`关机（需要等待一会儿）。

### 在宿主机终端中查看内核启动早期信息

`console=ttyS0`

如果想查看内核启动早期信息，你需要将`console=ttyS0`传递给 Linux kernel command line：

```bash
$ qemu-system-x86_64 -nographic -kernel vmlinuz -hda wheezy.img -append "root=/dev/sda console=ttyS0"
```

或者

```bash
$ qemu-system-x86_64 -serial stdio -kernel vmlinuz -hda wheezy.img -append "root=/dev/sda console=ttyS0"
```

或者

```bash
$ qemu-system-x86_64 -serial stdio wheezy.qcow2
  # 1. Wait for a GRUB menu to show.
  # 2. Press `e`.
  # 3. Find the line starting with "linux".
  # 4. Add "console=ttyS0".
```

`qemu-system-x86_64 -serial stdio -kernel vmlinuz -hda wheezy.img -append "root=/dev/sda console=ttyS0"`：

![early-boot-messages.png](/posts/images/qemu_setup/early-boot-messages.png)

- `-serial stdio` 或 `-nographic`将虚拟机的输入输出重定向到当前终端

- `-append "root=/dev/sda console=ttyS0"`：`console=ttyS0`强制 guest kernel 将输出发送到第一个 UART 串口 ttyS0，即通过`-serial stdio`选项重定向的宿主机终端；`root=/dev/sda`告诉内核从`/dev/sda`设备加载`wheezy.img`

其他选项：

- `-kernel vmlinuz` 从 `vmlinuz`文件加载内核
- `-hda wheezy.img` 适配 `vmlinuz` 的原始映像（wheezy.qcow2 无法在块设备中识别）

### 通过命名管道（文件）进行输入输出

#### 创建命名管道

```bash
$ mkfifo /tmp/guest.in /tmp/guest.out
```

#### 启动 QEMU

```bash
$ qemu-system-x86_64 -serial pipe:/tmp/guest -kernel vmlinuz -hda wheezy.img -append "root=/dev/sda console=ttyS0"
```

`-serial pipe:/tmp/guest` 将输出重定向到`/tmp/guest.out`，输入重定向到`/tmp/guest.in`

#### 从命名管道中获取输出

```bash
$ cat /tmp/guest.out
[    0.000000] Linux version 4.15.0-1036-azure (buildd@lgw01-amd64-047) (gcc version 4.8.4 (Ubuntu 4.8.4-2ubuntu1~14.04.4)) #38~14.04.2-Ubuntu SMP Fri Dec 7 04:07:34 UTC 2018 (Ubuntu 4.15.0-1036.38~14.04.2-azure 4.15.18)
[    0.000000] Command line: root=/dev/sda console=ttyS0
[    0.000000] KERNEL supported cpus:
[    0.000000]   Intel GenuineIntel
[    0.000000]   AMD AuthenticAMD
[    0.000000]   Centaur CentaurHauls
[    0.000000] x86/fpu: x87 FPU will use FXSAVE
[    0.000000] e820: BIOS-provided physical RAM map:
[    0.000000] BIOS-e820: [mem 0x0000000000000000-0x000000000009fbff] usable
[    0.000000] BIOS-e820: [mem 0x000000000009fc00-0x000000000009ffff] reserved
[    0.000000] BIOS-e820: [mem 0x00000000000f0000-0x00000000000fffff] reserved
[    0.000000] BIOS-e820: [mem 0x0000000000100000-0x0000000007fdffff] usable
[    0.000000] BIOS-e820: [mem 0x0000000007fe0000-0x0000000007ffffff] reserved
[    0.000000] BIOS-e820: [mem 0x00000000fffc0000-0x00000000ffffffff] reserved
...
[ ok ] Starting periodic command scheduler: cron.
[ ok ] Starting OpenBSD Secure Shell server: sshd.

Debian GNU/Linux 7 syzkaller ttyS0

syzkaller login:
```

#### 通过命名管道发送信息

当出现登录界面时，发送登录信息：

```bash
$ printf "root\n" > /tmp/guest.in
```

（完）
