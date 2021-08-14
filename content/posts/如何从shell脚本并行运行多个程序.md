---
title: '如何从 Shell 脚本并行运行多个程序'
date: 2021-08-14T20:05:29+08:00
draft: false
description:
tags:
  - shell
  - bash
  - linux
series:
  -
categories:
  -
---

## 太长不看

> 想要并行的程序调用时加`&`放在后台执行，`shell`中直接加`wait`等待子进程执行完成完事儿。

```shell
#!/bin/bash

command1 &
command2 &

wait
```

## 正文

本文探讨如何在`shell`脚本中并行运行多个程序，先从`Hello laoli`开始，脚本内容如下：

```shell
#!/bin/bash

echo "Hello laoli!"
```

运行结果如下：

```bash
$ ./demo.sh
Hello laoli!
```

下面我们定义一个函数：

```shell
#!/bin/bash

run_task() {
  echo "task is running..."
}

run_task
```

执行结果如下：

```bash
$ ./demo.sh
task is running...
```

脚本瞬间执行完毕，我们让它睡一下，慢一点退出：

```shell
#!/bin/bash

run_task() {
  echo "`date +%s` task is running..."
  sleep 3
  echo "`date +%s` task is finished."
}

run_task
```

执行结果如下：

```bash
$ ./demo.sh
1628945358 task is running...
1628945361 task is finished.
```

我们打出了时间戳，确认是 3 秒钟后退出。

修改代码，调用函数两次：

```shell
#!/bin/bash

run_task() {
  echo "`date +%s` task$1 is running..."
  sleep 3
  echo "`date +%s` task$1 is finished."
}

run_task 1
run_task 2
```

`$1` 表示函数的第一个参数，执行结果如下：

```bash
$ ./demo.sh
1628945510 task1 is running...
1628945513 task1 is finished.
1628945513 task2 is running...
1628945516 task2 is finished.
```

可以看到两次函数调用串行执行，总共执行了 6 秒。

修改代码，使函数休眠参数指定的时间，并且使函数后台执行，达到并行目的：

```shell
#!/bin/bash

run_task() {
  echo "`date +%s` task$1 is running..."
  sleep $1
  echo "`date +%s` task$1 is finished."
}

run_task 1 &
run_task 2 &

echo "Finished"
```

我们知道`shell`中可以通过`command &`的方式使`command`后台执行。同样，`shell`脚本中也可通过此方式执行函数，其实现方式是`shell`创建了一个新的进程在后台运行函数。

执行结果如下：

```bash
$ ./demo.sh
Finished
$ 1628945846 task1 is running...
1628945846 task2 is running...
1628945847 task1 is finished.
1628945848 task2 is finished.
```

此时两个函数调用以子进程的方式在后台运行，所以`shell`直接打印`Finished`并退出。之后终端中依次打印出函数中的信息。

那么如何使主进程等待子进程执行完成后在退出呢？答案是使用`wait`命令。

`wait`命令可以使当前`shell`进程挂起，等待所指定的由当前`shell`产生的子进程退出后，`wait`命令才返回。`wait`命令的参数可以是`进程ID`或`job specification`。

代码如下：

```shell
#!/bin/bash

run_task() {
  echo "`date +%s` task$1 is running..."
  sleep $1
  echo "`date +%s` task$1 is finished."
}

run_task 1 &
run_task 2 &

wait
echo "Finished"
```

`wait`不加参数指等待所有后台进程都运行完毕，执行结果如下：

```bash
$ ./demo.sh
1628946797 task1 is running...
1628946797 task2 is running...
1628946798 task1 is finished.
1628946799 task2 is finished.
Finished
```

也可以指定参数，等待指定的进程或任务，代码如下：

```shell
#!/bin/bash

run_task() {
  echo "`date +%s` task$1 is running..."
  sleep $1
  echo "`date +%s` task$1 is finished."
}

run_task 1 &
p1=$!
echo "task1's pid is $p1"

run_task 2 &
p2=$!
echo "task2's pid is $p2"

wait $p1 $p2
echo "Finished"
```

内置变量`$!`记录最后一个被创建的后台进程的`pid`，执行结果如下：

```bash
$ ./demo.sh
task1's pid is 28303
task2's pid is 28304
1628947244 task1 is running...
1628947244 task2 is running...
1628947245 task1 is finished.
1628947246 task2 is finished.
Finished
```

（完）
