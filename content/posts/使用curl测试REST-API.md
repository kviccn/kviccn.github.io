---
title: '使用 curl 测试 REST API'
date: 2021-09-03T10:22:16+08:00
draft: false
description:
tags:
  - curl
series:
  -
categories:
  -
---

原文：[Test a REST API with curl](https://www.baeldung.com/curl-rest)

## 概览

本教程简要概述了如何使用 _curl_ 测试 REST API。

**_curl_ 是一种用于传输数据的命令行工具，它支持大约 22 种协议，包括 HTTP。** 这种组合使它成为了一个非常好的用于测试 REST 服务的临时工具。

## 命令行选项

**_curl_ 支持超过 200 个命令行选项。** 我们可以在命令中包含零个或多个与 URL 进行组合。

在开始之前，让我们先看两个小技巧。

### Verbose

当我们在做测试时，打开 verbose mode 通常是一个比较好的做法：

```bash
$ curl -v http://www.example.com/
```

这会使命令提供很多有用的信息，例如解析的 IP 地址，尝试连接的端口和 headers。

### Output

默认情况下，_curl_ 将响应体输出到标准输出。此外，我们可以提供输出选项来保存到文件:

```bash
$ curl -o out.json http://www.example.com/index.html
```

当响应规模较大时，这非常有用。

## HTTP Methods

每个 HTTP 请求都包含一个方法。最常用的方法是 GET、POST、PUT 和 DELETE。

### GET

这是使用 _curl_ 进行 HTTP 调用时的默认方法。事实上，前面展示的示例都是简单的 GET 调用。

当在 8082 端口上运行一个本地服务时，我们会使用如下命令进行 GET 调用:

```bash
$ curl -v http://localhost:8082/spring-rest/foos/9
```

由于开启了 verbose 模式，我们可以随着响应体获得更多的信息:

```bash
*   Trying ::1...
* TCP_NODELAY set
* Connected to localhost (::1) port 8082 (#0)
> GET /spring-rest/foos/9 HTTP/1.1
> Host: localhost:8082
> User-Agent: curl/7.60.0
> Accept: */*
>
< HTTP/1.1 200
< X-Application-Context: application:8082
< Content-Type: application/json;charset=UTF-8
< Transfer-Encoding: chunked
< Date: Sun, 15 Jul 2018 11:55:26 GMT
<
{
  "id" : 9,
  "name" : "TuwJ"
}* Connection #0 to host localhost left intact
```

### POST

我们使用这种方法将数据发送给接收数据的服务，这意味着我们需要使用 `data` 选项。

最简单的方法是将数据嵌入到命令中:

```bash
$ curl -d 'id=9&name=baeldung' http://localhost:8082/spring-rest/foos/new
```

或者，我们可以像这样传递一个包含请求体的文件给 `data` 选项:

```bash
$ curl -d @request.json -H "Content-Type: application/json" \
    http://localhost:8082/spring-rest/foos/new
```

在使用第一条命令时我们可能会遇到一个错误，如下：

```
{
  "timestamp": "15-07-2018 05:57",
  "status": 415,
  "error": "Unsupported Media Type",
  "exception": "org.springframework.web.HttpMediaTypeNotSupportedException",
  "message": "Content type 'application/x-www-form-urlencoded;charset=UTF-8' not supported",
  "path": "/spring-rest/foos/new"
}
```

这是因为 _curl_ 默认会向所有 POST 请求添加以下请求头:

```
Content-Type: application/x-www-form-urlencoded
```

这也是浏览器在普通 POST 中所使用的方式。在我们的使用中，通常需要根据需求自定义请求头。

例如，如果我们的接口需要 JSON 类型的请求体，那么我们可以使用`-H` 选项来修改原始的 POST 请求:

```bash
$ curl -d '{"id":9,"name":"baeldung"}' -H 'Content-Type: application/json' \
    http://localhost:8082/spring-rest/foos/new
```

Windows 命令行不支持类 unix 系统 shell 中那样的单引号。

因此，我们需要用双引号替换单引号，并且在必要的地方转义它们:

```
curl -d "{\"id\":9,\"name\":\"baeldung\"}" -H "Content-Type: application/json"
  http://localhost:8082/spring-rest/foos/new
```

此外，当我们想要发送较大数量的数据时，使用数据文件（data file）通常是一个好主意。

### PUT

此方法与 POST 非常相似，当我们想要更新资源时使用此方法。通过 `-X` 选项使用此方法。

未指明请求方法时，_curl_ 默认使用 GET 方法，因此，在使用 PUT 方法时，我们需要显式指明：

```bash
$ curl -d @request.json -H 'Content-Type: application/json' \
    -X PUT http://localhost:8082/spring-rest/foos/9
```

### DELETE

同样，我们通过使用 `-X` 选项来指定要使用 DELETE 方法:

```bash
$ curl -X DELETE http://localhost:8082/spring-rest/foos/9
```

## 自定义请求头

我们可以替换默认请求头或者添加我们自己的请求头。

例如，要更改 Host 头，我们可以这样做:

```bash
$ curl -H "Host: com.baeldung" http://example.com/
```

为了关闭 User-Agent 头，我们可以输入一个空值:

```bash
$ curl -H "User-Agent:" http://example.com/
```

测试时最常见的场景是更改 Content-Type 和 Accept。我们只需在每个请求头前加上 `-H` 选项:

```bash
$ curl -d @request.json \
       -H "Content-Type: application/json" \
       -H "Accept: application/json" \
       http://localhost:8082/spring-rest/foos/new
```

## 身份验证

[需要身份验证的服务](https://www.baeldung.com/spring-security-basic-authentication)可能会返回 `401 – Unauthorized` HTTP 响应码和相关的 `WWW-Authenticate` 头。

对于基本身份验证（basic authentication），我们可以简单地使用 `user` 选项将用户名和密码组合嵌入到请求中:

```bash
$ curl --user baeldung:secretPassword http://example.com/
```

但是，如果我们想[使用 OAuth2 进行身份验证](https://www.baeldung.com/rest-api-spring-oauth2-angularjs)，那就需要先从授权服务获取 `access_token`。

授权服务的响应中会包含`access_token`：

```
{
  "access_token": "b1094abc0-54a4-3eab-7213-877142c33fh3",
  "token_type": "bearer",
  "refresh_token": "253begef-868c-5d48-92e8-448c2ec4bd91",
  "expires_in": 31234
}
```

现在我们可以在`Authorization header`中使用这个`token`：

```bash
$ curl -H "Authorization: Bearer b1094abc0-54a4-3eab-7213-877142c33fh3" http://example.com/
```

## 总结

在本文中，我们演示了使用 _curl_ 的最小功能来测试 REST 服务。虽然它可以做的比这里讨论的更多，但对于我们的目的来说，这就足够了。

可以在命令行上输入 `curl -h`，查看所有可用选项。用于演示的 REST 服务可以[在 GitHub 上](https://github.com/eugenp/tutorials/tree/master/spring-web-modules/spring-rest-simple)找到。
