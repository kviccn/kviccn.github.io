---
title: Spring 中的控制反转和依赖注入
date: 2021-08-26T16:19:37+08:00
tag:
  - spring
  - spring boot
  - IoC
  - DI
  - 控制反转
  - 依赖注入
category:
  - spring boot
---

说明：控制反转和依赖注入是很简单的两个概念，如果你看了很多文章还没有搞明白那说明写那些文章的人也是个半吊子。

## 概览

今天简单说一下 IoC (Inversion of Control) 和 DI (Dependency Injection)的概念，同时看看其在 Spring framework 中的实现。

## 啥是控制反转

`控制反转`（英语：Inversion of Control，缩写为 `IoC`），是面向对象编程中的一种设计原则，可以用来减低计算机代码之间的耦合度。其中最常见的方式叫做`依赖注入`（Dependency Injection，简称 DI），还有一种方式叫“依赖查找”（Dependency Lookup）。see [wikipedia](https://zh.wikipedia.org/wiki/%E6%8E%A7%E5%88%B6%E5%8F%8D%E8%BD%AC)。

看懂没？控制反转是设计原则，依赖注入是实现方式。

那到底是什么东西的控制被反转了？本来是谁控制的？反转到哪里去了？

[Martin Fowler](https://martinfowler.com/)给出的结论是`依赖对象的获得被反转了`。

举个例子，Class A 中用到了 Class B 的对象 b，一般情况下，需要在 A 的代码中显式地用 new 创建 B 的对象，例如：

```java
public class Store {
    private Item item;

    public Store() {
        item = new ItemImpl1();
    }
}
```

采用依赖注入技术之后，A 的代码只需要定义一个 private 的 B 对象，不需要直接 new 来获得这个对象，而是通过相关的容器控制程序来将 B 对象在外部 new 出来并注入到 A 类里的引用中，例如：

```java
public class Store {
    private Item item;

    public Store(Item item) {
        this.item = item;
    }
}
```

此例中`Store`依赖`Item`，常规做法是在`Store`的实现中显示的`new`了一个`Item`对象，使用`IoC`后，我们没有手动`new Item`，这里通过构造器注入的方式，`IoC`容器在创建`Store`对象的时候会自动把`Item`通过构造器注入进去。

要获得`依赖对象`的话之前需要自己手动`new`，现在这个过程反转了，由`IoC`容器或框架负责`依赖对象`的创建并注入给我们。

依赖注入有如下实现方式：

- 基于接口。实现特定接口以供外部容器注入所依赖类型的对象。
- 基于 set 方法。实现特定属性的 public set 方法，来让外部容器调用传入所依赖类型的对象。
- 基于构造函数。实现特定参数的构造函数，在新建对象时传入所依赖类型的对象。
- 基于注解。基于 Java 的注解功能，在私有变量前加`@Autowired`等注解，不需要显式的定义以上三种代码，便可以让外部容器传入对应的对象。`该方案相当于定义了 public 的 set 方法，但是因为没有真正的 set 方法，从而不会为了实现依赖注入导致暴露了不该暴露的接口`（因为 set 方法只想让容器访问来注入而并不希望其他依赖此类的对象访问）。

## Spring IoC Container

IoC 容器是实现 IoC 的框架的共同特征。

在 Spring 框架中，接口 `ApplicationContext` 表示 IoC 容器。Spring 容器负责实例化、配置和组装被称为 bean 的对象，以及管理它们的生命周期。

Spring 提供了多种 `ApplicationContext` 接口的实现，有 `ClassPathXmlApplicationContext`、`FileSystemXmlApplicationContext`、`AnnotationConfigApplicationContext` 和 `WebApplicationContext`。

为了装配 beans，容器需要使用配置元数据(configuration metadata)，通过`XML`配置或`注解`形式提供。

手动实例化容器的方式如下：

```java
var ctx = new AnnotationConfigApplicationContext(AppConfig.class);
```

要在上面的例子中设置 item 属性，我们可以使用元数据。然后容器将读取此元数据，并在运行时使用它来组装 bean。

**Spring 中的依赖项注入可以通过构造函数、setter 或字段来实现。**

## 基于构造函数的依赖注入

在基于构造函数的依赖项注入中，容器将调用一个构造函数，每个参数表示我们想要设置的依赖项。

Spring 解析每一个参数时按类型、属性名和索引的顺序来消除歧义。让我们看看使用注解的 bean 及其依赖项的配置:

```java
@Configuration
public class AppConfig {

    @Bean
    public Item item1() {
        return new ItemImpl1();
    }

    @Bean
    public Store store() {
        return new Store(item1());
    }
}
```

`@Configuration` 注解表明该类是 `bean 定义`的一个源，我们还可以将它添加到多个配置类中。

我们在方法上使用`@Bean`注解来定义 bean。如果我们不指定自定义名称，那么 bean 名称将默认为方法名称。

对于具有默认`单例作用域(singleton scope)`的 bean, Spring 首先检查该 bean 的缓存实例是否已经存在，如果不存在，则创建一个新实例。如果我们使用的是`原型作用域(prototype scope)`，容器会为每个方法调用返回一个新的 bean 实例。

## 基于 Setter 的依赖注入

对于基于 setter 的依赖注入，容器将在调用无参构造器或无参静态工厂方法实例化 bean 后调用类的 setter 方法。配置如下：

```java
@Bean
public Store store() {
    Store store = new Store();
    store.setItem(item1());
    return store;
}
```

对于同一个 bean， 可以组合使用基于构造器的依赖注入和基于 setter 的依赖注入。Spring 文档建议对强制性依赖项使用基于构造器的注入，对可选依赖项使用基于 setter 的注入。

## 基于字段的依赖注入

对于基于字段的依赖注入，我们可以通过使用`@Autowired`注解来注入依赖项。

```java
public class Store {
    @Autowired
    private Item item;
}
```

在构造 Store 对象时，如果没有构造函数或 setter 方法来注入 Item bean，容器将使用反射将 Item 注入 Store。

这种方法可能看起来更简单和干净，但我们不推荐使用它，因为它有一些缺点，如:

- 此方法使用反射来注入依赖项，这比基于构造函数或基于 setter 的注入成本更高
- 使用这种方法很容易不断添加多个依赖项。如果我们使用构造函数注入，有多个参数会让我们知道类做了不止一件事，这可能违反单一责任原则

## 自动装配依赖关系

[装配](https://www.baeldung.com/spring-annotations-resource-inject-autowire)允许 Spring 容器通过检查已定义的 bean 来自动解析协作 bean 之间的依赖关系。

使用 XML 配置自动装配 bean 有四种模式:

- no：默认 - 这意味着 bean 不使用自动装配，我们必须显式地命名依赖项
- byName：自动装配是基于属性的名称完成的，因此 Spring 将寻找与需要设置的属性同名的 bean
- byType：类似于 byName 自动装配，只是基于属性的类型。这意味着 Spring 将寻找与要设置的属性类型相同的 bean。如果该类型的 bean 不止一个，框架就会抛出异常
- constructor：自动装配是基于构造函数参数完成的，这意味着 Spring 将寻找与构造函数参数类型相同的 bean

示例，让我们将上面按类型定义的 _item1_ bean 自动装配到 _store_ bean 中：

```java
@Bean(autowire = Autowire.BY_TYPE)
public class Store {

    private Item item;

    public setItem(Item item){
        this.item = item;
    }
}
```

我们还可以使用`@Autowired`注解按类型自动装配来注入 bean：

```java
public class Store {

    @Autowired
    private Item item;
}
```

如果有多个相同类型的 bean，我们可以使用`@Qualifier`注解按名称引用 bean：

```java
public class Store {

    @Autowired
    @Qualifier("item1")
    private Item item;
}
```

## 延迟初始化 Beans

默认情况下，容器在初始化期间创建和配置所有单例 bean。为了避免这种情况，我们可以使用`@Lazy`注解：

```java
@Bean
@Lazy
public Store store() {
    return new Store(item1());
}
```

完整代码见 [ioc-and-di-in-spring](https://github.com/kviccn/ioc-and-di-in-spring)

参考：[Intro to Inversion of Control and Dependency Injection with Spring](https://www.baeldung.com/inversion-control-and-dependency-injection-in-spring)

（完）
