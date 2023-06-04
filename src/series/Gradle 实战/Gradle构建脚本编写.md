---
title: Gradle 构建脚本编写
date: 2023-06-03 22:00:00
category:
  - Gradle 实战
tag:
  - gradle
---

Gradle 目前支持两种格式的构建脚本，分别基于 Groovy 和 Kotlin，对应的脚本文件名称为 `build.gradle` 和 `build.gradle.kts`。以基于 Kotlin 的脚本为例，当 `gradle` 命令启动时，
`gradle` 会在当前目录下查找 `build.gradle.kts` 文件。尽管这个文件被称作 *构建脚本*，但严格意义上来说，它应该叫做 *构建配置脚本*，这个构建脚本定义了一个项目（project）和它的任务。

## 基础内容

### 项目，插件和任务

每个 Gradle 构建都由一个或多个项目组成。项目代表什么取决于你用 Gradle 做什么。例如，项目可能代表一个 JAR 库或一个 web 应用程序。它可能表示从其他项目生成的 jar 中组装的发行版 ZIP。
项目不一定代表要构建的东西。它可能表示要做的事情，例如将应用程序部署到 staging 环境或生产环境。如果目前还不是很明白的话也不需要担心。Gradle 的按约定构建为项目添加了更具体的定义。

Gradle 在项目中可以做的工作是由一个或多个任务定义的。任务表示构建执行的一些原子工作。可能是编译一些类、创建 JAR、生成 Javadoc 或将一些 archive 发布到仓库。

通常，任务是通过应用插件提供的，因此你不必自己定义它们。尽管如此，为了让你对任务有一个概念，我们将在本文定义一些简单的任务。

### Hello world

下面我们创建一个任务并执行它。创建一个空目录并在其中新建构建脚本 `build.gradle.kts`，内容如下：

```kotlin
tasks.register("hello") {
    doLast {
        println("Hello world!")
    }
}
```

在命令行进入该目录并运行 `gradle -q hello`，输出如下：

```shell
$ gradle -q hello
Hello world!
```

`-q` 参数会抑制 Gradle 的日志信息，只输入任务输出的内容，保持输出信息简洁。

上述构建脚本中定义了一个名叫 `hello` 的任务，并且在任务中加入了一个动作（action）。当运行 `gradle hello` 时，Gradle 会执行 `hello` 任务并执行你提供的 action，
action 就是一个可执行的代码块。

### 构建脚本即代码

在 Gradle 构建脚本中，你可以使用 Groovy 或 Kotlin 的全部能力。下面我们看一个例子：

```kotlin
tasks.register("upper") {
    doLast {
        val someString = "mY_nAmE"
        println("Original: $someString")
        println("Upper case: ${someString.toUpperCase()}")
    }
}
```

输出如下：

```sh
$ gradle -q upper
Original: mY_nAmE  
Upper case: MY_NAME
```

另一个例子：

```kotlin
tasks.register("count") {
    doLast {
        repeat(4) { print("$it ") }
    }
}
```

输出如下：

```sh
$ gradle -q count
0 1 2 3
```

### 任务依赖

你可以在任务中声明它们的依赖关系。

依赖于另一个任务的任务：

```kotlin
tasks.register("hello") {
    doLast {
        println("Hello world!")
    }
}

tasks.register("intro") {
    dependsOn("hello")
    doLast {
        println("I'm Gradle")
    }
}
```

输出如下：

```sh
$  gradle -q intro
Hello world!
I'm Gradle
```

### 灵活的任务注册

Groovy 和 Kotlin 强大的能力让你不只可以定义任务的功能。例如，还可以使用循环定义一组相同类型的任务。

```kotlin
repeat(4) { counter ->
    tasks.register("task$counter") {
        doLast {
            println("I'm task number $counter")
        }
    }
}
```

输出如下：

```sh
$ gradle -q task1
I'm task number 1
```

### 操作已存在的任务

任务在注册之后可以使用 `named` API 来访问。例如，可以在运行时动态的向任务添加依赖。

使用 `named` API 访问任务并且添加依赖的例子：

```kotlin
repeat(4) { counter ->
    tasks.register("task$counter") {
        doLast {
            println("I'm task number $counter")
        }
    }
}

tasks.named("task0") { dependsOn("task2", "task3") }
```

输出如下：

```sh
$ gradle -q task0
I'm task number 2
I'm task number 3
I'm task number 0
```

也可以向已存在的任务添加行为：

```kotlin
tasks.register("hello") {
    doLast {
        println("Hello Earth")
    }
}

tasks.named("hello") {
    doFirst {
        println("Hello Venus")
    }
}

tasks.named("hello") {
    doLast {
        println("Hello Mars")
    }
}

tasks.named("hello") {
    doLast {
        println("Hello Jupiter")
    }
}
```

输出如下：

```sh
$ gradle -q hello
Hello Venus
Hello Earth
Hello Mars
Hello Jupiter
```

`doFirst` 和 `doLast` 可以多次执行。它们会向任务的动作列表（actions list）的起始或结尾添加一个动作。当任务执行时，动作列表中的动作将按顺序执行。

### 默认任务

Gradle 允许你定义一个或多个默认任务，如果未指定任务时将会执行默认任务。

```kotlin
defaultTasks("clean", "run")

tasks.register("clean") {
    doLast {
        println("Default Cleaning!")
    }
}

tasks.register("run") {
    doLast {
        println("Default Running!")
    }
}

tasks.register("other") {
    doLast {
        println("I'm not a default task!")
    }
}
```

输出如下：

```sh
$ gradle -q
Default Cleaning!
Default Running!
```

这等价于执行 `gradle clean run`。在多项目构建中每个子项目都可以有自己的默认任务。如果子任务未指定默认任务，则其会使用父项目的默认任务（如果父项目定义了默认任务的话）。

### 构建脚本的外部依赖

::: tip
建议不要直接操作脚本类路径，而是使用自带类路径的插件。对于自定义构建逻辑，建议使用自定义插件。
:::

如果要在构建脚本中使用外部库，你可以通过构建脚本自身将它们添加到脚本的类路径中。通过使用 `buildscript()` 方法并且向其传递一个声明构建脚本类路径的代码块来实现。

```kotlin
buildscript {
    repositories {
        mavenCentral()
    }
 
    dependencies {
        "classpath"(group = "commons-codec", name = "commons-codec", version = "1.2")
    }
}
```

通过向类路径（classpath）配置中添加依赖项来声明构建脚本的类路径。这与声明 Java 编译时类路径的方式相同。除了项目（project）依赖项，你可以使用任何依赖项类型。

在声明构建脚本的类路径之后就可以在构建脚本中使用类路径中的类了。

```kotlin{1,14}
import org.apache.commons.codec.binary.Base64

buildscript {
    repositories {
        mavenCentral()
    }
    dependencies {
        "classpath"(group = "commons-codec", name = "commons-codec", version = "1.2")
    }
}

tasks.register("encode") {
    doLast {
        val encodedString = Base64().encode("hello world\n".toByteArray())
        println(String(encodedString))
    }
}
```

输出如下：

```sh
$ gradle -q encode
aGVsbG8gd29ybGQK
```

对于多项目构建，在项目的 `buildscript()` 方法中声明的依赖项同样可用于其子项目。

## 更多内容

使用构建脚本配置项目。每个 Gradle 项目对应一个需要构建的软件组件，比如一个库或一个应用程序。每个构建脚本都与一个 `Project` 类型的对象相关联。当构建脚本执行时，它会配置这个 `Project`。

:::tip 构建脚本，设置脚本和初始化脚本
构建脚本 `build.gradle.kts` 用于定义 `Project` 对象

设置脚本 `settings.gradle.kts` 用于定义 `Settings` 对象

初始化脚本 `init.gradle.kts` 用于定义 `Gradle` 对象
:::

### 属性（Properties）

构建脚本中的许多顶级属性都是 `Project` API 的一部分。下面的构建脚本使用 `Project.name` 属性来打印项目的名字：

```kotlin
// build.gradle.kts
println(name)
println(project.name)
```

```sh
$ gradle -q check
project-api
project-api
```

两条 `println` 语句打印出了相同的属性。第一个使用对 `Project` 对象的 `name` 属性的顶级引用。另一条语句使用了任何构建脚本都可用的 `project` 属性，该属性返回关联的 `project` 对象。

#### 项目的标准属性

`Project` 对象在构建脚本中暴露了一组标准属性。下表列出了一些常用的属性：

|名称|类型|默认值|
|:-|:-|:-|
|project|Project|Project 实例|
|name|String|项目目录名称|
|path|String|项目绝对路径|
|description|String|项目描述|
|projectDir|File|包含构建脚本的目录|
|buildDir|File|*projectDir*/build|
|group|Object|未指明|
|version|Object|未指明|
|ant|AntBuilder|AntBuilder 实例|

### Script API

当 Gradle 执行 Groovy 构建脚本 (`.gradle`) 时，它将脚本编译成一个实现 [Script](https://docs.gradle.org/current/dsl/org.gradle.api.Script.html) 的类。因此，构建脚本可以访问 `Script` 接口声明的所有属性和方法。

当 Gradle 执行 Kotlin 构建脚本(`.gradle.kts`)时，它会将该脚本编译为 [KotlinBuildScript](https://gradle.github.io/kotlin-dsl-docs/api/org.gradle.kotlin.dsl/-kotlin-build-script/index.html) 的子类。因此，构建脚本可以访问 `KotlinBuildScript` 类型声明的所有可见属性和函数。

### 声明变量

构建脚本可以声明两种变量：局部变量（local variables）和额外属性（extra properties）。

#### 局部变量

用 `val` 关键字声明局部变量。局部变量只在声明它们的作用域中可见。它们是底层 Kotlin 语言的一个特性。

例：声明局部变量

```kotlin
// build.gradle.kts
val dest = "dest"

tasks.register<Copy>("copy") {
    from("source")
    into(dest)
}
```

#### 额外属性

Gradle 的所有增强对象，包括 projects、tasks 和 source sets，都可以包含用户定义的属性。

通过所属对象的 `extra` 属性添加，访问和获取额外属性。另外，你也可以通过使用 `by extra` 来访问 Kotlin 委托属性。

例：使用额外属性

```kotlin
// build.gradle.kts
plugins {
    id("java-library")
}

val springVersion by extra("3.1.0.RELEASE")
val emailNotification by extra { "build@master.org" }

sourceSets.all { extra["purpose"] = null }

sourceSets {
    main {
        extra["purpose"] = "production"
    }

    test {
        extra["purpose"] = "test"
    }

    create("plugin") {
        extra["purpose"] = "production"
    }
}

tasks.register("printProperties") {
    val springVersion = springVersion
    val emailNotification = emailNotification
    val productionSourceSets = provider {
        sourceSets.matching { it.extra["purpose"] == "production" }.map { it.name }
    }

    doLast {
        println(springVersion)
        println(emailNotification)
        productionSourceSets.get().forEach { println(it) }
    }
}
```

```sh
$ gradle -q printProperties
3.1.0.RELEASE
build@master.org
main
plugin
```

本例通过 `by extra` 向项目对象添加两个额外属性。此外，本例通过将 `extra["purpose"]` 设置为 `null`，向每个 source set 添加了一个名为 `purpose` 的属性。添加后，你可以通过 `extra` 读取和设置所有这些属性。

Gradle 需要特殊的语法来添加属性，这样它就可以快速失败。例如，这允许 Gradle 在脚本试图设置一个不存在的属性时识别出来。你可以在任何可以访问其所属对象的地方访问额外的属性。这使得额外属性的作用域比局部变量更广。子项目可以访问父项目上的额外属性。
