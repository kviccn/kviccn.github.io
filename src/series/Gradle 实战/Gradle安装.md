---
title: Gradle 安装
date: 2023-06-03 20:00:00
category:
  - Gradle 实战
tag:
  - gradle
---

Gradle 可以运行在 Linux，macOS 和 Windows 之上，通过包管理工具可以很方便的安装，同样也可以手动安装。

## 前置条件

Gradle 运行需要 `JDK 8 及以上版本` 的支持。运行 `java -version` 命令检查 `JDK` 是否已正确安装。

```sh
$ java -version
java version "1.8.0_361"
Java(TM) SE Runtime Environment (build 1.8.0_361-b09)
Java HotSpot(TM) 64-Bit Server VM (build 25.361-b09, mixed mode)
```

## 使用包管理工具安装

类 Unix 操作系统可以使用 [SDKMAN](https://sdkman.io/)（macOS, Linux, Cygwin, Solaris 和 FreeBSD） 安装：

```sh
$ sdk install gradle
```

macOS 还可以使用 [Homebrew](http://brew.sh/) 或 [MacPorts](https://www.macports.org/)安装：

- Homebrew

```sh
$ brew install gradle
```

- MacPorts
  
```sh
$ sudo port install gradle
```

Windows 下可以使用 [Scoop](https://scoop.sh/) 进行安装。执行如下命令即可：

```sh
$ scoop install gradle
```

## 手动安装

1. [下载](https://gradle.org/releases)最新的 Gradle

2. 解压

**Linux & MacOS 用户**

将下载的 zip 文件解压到你选择的目录：

```sh
$ mkdir /opt/gradle
$ unzip -d /opt/gradle gradle-8.1.1-bin.zip
$ ls /opt/gradle/gradle-8.1.1
LICENSE  NOTICE  bin  README  init.d  lib  media
```

**Windows 用户**

创建一个新目录，例如：`C:\Gradle`，将 zip 文件中的内容解压到刚创建的目录。

3. 配置系统环境

**Linux & MacOS 用户**

配置 `PATH` 环境变量使其包含刚解压的目录中的 `bin` 目录，例如：

```sh
$ export PATH=$PATH:/opt/gradle/gradle-8.1.1/bin
```

或者你也可以创建 `GRADLE_HOME` 环境变量指向 Gradle 安装目录，然后将 `$GRADLE_HOME/bin`添加到 `PATH` 环境变量中。当更新或使用其他版本的 Gradle 时只需改变 `GRADLE_HOME` 环境变量的指向。

**Windows 用户**

在**文件管理器**中右击 `此电脑` 图标，接着点击 `属性` -> `高级系统设置` -> `环境变量`。

在 `系统变量` 下选择 `Path`，点击 `编辑`，然后新增一项 `C:\Gradle\gradle-8.1.1\bin`，点击 `确定` 以保存。

同样你也可以新建环境变量 `GRADLE_HOME` 指向 Gradle 的安装目录，并将 `%GRADLE_HOME%/bin` 添加在 `Path` 中，更新 Gradle 时只需修改 `GRADLE_HOME` 的指向。

## 验证安装结果

在控制台执行 `gradle -v`：

```sh
$ gradle -v

------------------------------------------------------------
Gradle 8.1.1
------------------------------------------------------------
...
```

输出 gradle 版本信息即表示安装成功。
