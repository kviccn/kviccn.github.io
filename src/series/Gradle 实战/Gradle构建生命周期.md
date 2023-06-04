---
title: Gradle 构建生命周期
date: 2023-06-03 21:00:00
category:
  - Gradle 实战
tag:
  - gradle
---

Gradle 的构建过程基于一个个任务及其依赖关系形成的任务图。Gradle 在执行任务之前先根据配置构建任务图，根据配置 Gradle 可以跳过一些本次构建不需要执行的任务。如下是两个任务图的例子：

![Gradle 任务图](https://docs.gradle.org/current/userguide/img/task-dag-examples.png)

插件和用户自己编写的构建脚本均可以影响任务图。

## 构建阶段

Gradle 构建有三个不同的阶段。Gradle 按顺序运行这些阶段：1. 初始化，2. 配置，3. 执行。

**初始化**

- 检测 `settings` 文件。

- 评估 `settings` 文件以确定哪些项目和包含的构建参与本次构建。

- 为每一个项目创建一个 `Project` 实例。

**配置**

- 评估参与构建的每个项目的构建脚本。

- 为请求的任务创建任务图。

**执行**

- 按照依赖关系的顺序调度和执行每个选定的任务。

### 示例

下面的示例显示了 `settings` 文件和 `build` 文件的哪些部分对应于不同的构建阶段：

```kotlin
// settings.gradle.kts
rootProject.name = "basic"
println("This is executed during the initialization phase.")
```

```kotlin
// build.gradle.kts
println("This is executed during the configuration phase.")

tasks.register("configured") {
    println("This is also executed during the configuration phase, because :configured is used in the build.")
}

tasks.register("test") {
    doLast {
        println("This is executed during the execution phase.")
    }
}

tasks.register("testBoth") {
    doFirst {
        println("This is executed first during the execution phase.")
    }

    doLast {
        println("This is executed last during the execution phase.")
    }

    println("This is executed during the configuration phase as well, because :testBoth is used in the build.")
}
```

后面的命令用于执行上面注册的 `test` 和 `testBoth` 任务。因为 Gradle 只会配置被请求的任务及其依赖，所以 `configured` 任务永远不会被配置。

```sh
$ gradle test testBoth
This is executed during the initialization phase.
This is executed during the configuration phase as well, because :testBoth is used in the build.

> Task :test
This is executed during the execution phase.

> Task :testBoth
This is executed first during the execution phase.
This is executed last during the execution phase.

BUILD SUCCESSFUL in 1s
2 actionable tasks: 2 executed
```

## 初始化

在初始化阶段，Gradle 检测参与构建的项目集和包含的构建。Gradle 首先对 `settings` 文件求值。然后为每个项目实例化 `Project` 实例。

### 检测 Settings 文件

当你在一个包含 `settings.gradle(.kts)` 文件的目录中运行 Gradle 时，Gradle 使用 `settings.gradle(.kts)` 文件初始化本次构建。你可以在任何子项目中运行 Gradle，当你在一个不包含 `settings.gradle(.kts)` 文件的目录中运行 Gradle 时：

1. Gradle 在其父目录中查找 `settings.gradle(.kts)` 文件。

2. 如果找到了 `settings.gradle(.kts)` 文件，Gradle 会检查当前项目是不是多项目构建的一部分。如果是，则 Gradle 构建作为一个多项目构建运行。

3. 如果未找到 `settings.gradle(.kts)` 文件，Gradle 将作为一个单项目构建运行。

### 评估 Settings 文件

在对 settings 文件评估期间，Gradle 会：

- 向构建脚本的 classpath 中添加依赖库。

- 定义哪些被包含的构建参与组合构建。

- 定义哪些项目参与多项目构建。

在构建时，Gradle 会为每一个项目创建 `Project` 实例。默认情况下，每个 `Project` 的名字与其顶级目录名称相同。除了根项目外，每个项目都有一个父项目。任何项目都可以有子项目。

## 配置

在配置阶段，Gradle 将任务和其他属性添加到初始化阶段生成的项目中。在配置阶段结束时，Gradle 已经为被请求的任务提供了一个完整的任务执行图。

### 项目评估

在对项目进行评估期间，Gradle 会对构建脚本进行求值以构建项目的任务层级。这个层次结构包括所有任务的输入、操作和输出。

### 对项目评估作出反应

你可以在项目评估之前和之后立即收到通知。即使在项目评估失败时这些通知依然有效。你可以为所有项目或特定项目配置项目评估通知。例如，你可以将这些通知用于：

- 在所有定义应用于构建脚本之后添加额外配置

- 自定义日志

- 自定义分析

下面的示例使用 `gradle.beforeProject()` 为某些测试添加 `hasTests` 属性。稍后，该示例使用 `gradle.afterProject()` 向每个 `hasTests` 属性值为 `true` 的项目添加一个测试任务：

```kotlin
// build.gradle.kts
gradle.beforeProject {
    // Set a default value
    project.ext.set("hasTests", false)
}

gradle.afterProject {
    if (project.ext.has("hasTests") && project.ext.get("hasTests") as Boolean) {
        val projectString = project.toString()
        println("Adding test task to $projectString")
        tasks.register("test") {
            doLast {
                println("Running tests for $projectString")
            }
        }
    }
}
```

```kotlin
// project-a.gradle.kts
extra["hasTests"] = true
```

```sh
$ gradle -q test
Adding test task to project ':project-a'
Running tests for project ':project-a'
```

## 执行

在执行阶段，Gradle 运行任务。Gradle 使用配置阶段生成的任务执行图来决定执行哪些任务。

### 任务执行

任务执行通常包括与构建相关联的大部分工作:下载库、编译代码、读取输入和写入输出。

你可以在 Gradle 执行任何任务之前和之后立即收到通知。即使任务执行失败，这些通知也会起作用。下面的示例记录每个任务执行的开始和结束：

```kotlin
// build.gradle.kts
tasks.register("ok")

tasks.register("broken") {
    dependsOn("ok")
    doLast {
        throw RuntimeException("broken")
    }
}

gradle.taskGraph.beforeTask {
    println("executing $this ...")
}

gradle.taskGraph.afterTask {
    if (state.failure != null) {
        println("FAILED")
    } else {
        println("done")
    }
}
```

```sh
$ gradle -q broken
executing task ':ok' ...
done
executing task ':broken' ...
FAILED

FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':broken'.
> broken

* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.

* Get more help at https://help.gradle.org

BUILD FAILED in 0s
```
