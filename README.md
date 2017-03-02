# WeChat Menu Manager

颜值最高的微信公众号菜单编辑器

~~其实是 TypeScript React 的练手项目~~

![preview](http://i.imgur.com/MD7D5r6.png)

如果微信公众号开启了开发者模式，则后台的菜单编辑器不可用，需要用接口的方式来管理。不堪运营打扰的我开发了这个后台，让运营的工作重回运营的手中，顺带解救一下其他公司的工程师。

[**DEMO**](https://handsomeone.github.io/WeChatMenuManager/#WyJodHRwczovL2hhbmRzb21lb25lLmdpdGh1Yi5pby9XZUNoYXRNZW51TWFuYWdlci9zYW1wbGUuanNvbiIsIiJd)

### 原理与使用方法

看到 Demo URL 的那长串 hash 了没？那里存着两个接口。

一个是**用来获取菜单的 URL**，需要满足如下条件：

- 可跨域
- 返回格式参见 [`sample.json`](https://handsomeone.github.io/WeChatMenuManager/sample.json)

其实，仅仅是对微信官方获取菜单接口的转发。一个简单的例子是：

```php
<?php
$token = file_get_contents("http://你存放token的接口");

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
echo file_get_contents("https://api.weixin.qq.com/cgi-bin/menu/get?access_token=$token");
```

另一个是**用来创建菜单的 URL**，也是对微信官方接口的转发，不细表，具体请参阅[微信开发文档](https://mp.weixin.qq.com/wiki)。

保存好之后，将生成的带 hash 的 URL 交给运营，就 OK 啦！
