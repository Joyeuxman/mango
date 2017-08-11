## body-parser Node.js(express)HTTP请求体解析中间件
以大多数人的努力程度之低，根本轮不到拼天赋 2017/8/11 Joyeux 

在HTTP中，`POST`、`PUT`、`PATCH`三种请求方法中包含请求体，**Node.js**原生HTTP模块中，请求体要基于流的方式接收和解析。`body-parser`是一个HTTP请求体解析中间件，使用这个模块可以解析JSON、Raw、text、URLencoded格式的请求体，__Express__框架就是使用这个模块作为请求体解析中间件。

### 1. 请求体解析
#### 1.1 原生环境中的解析
**Node.js** 原生HTTP模块中，是将用户请求数据封装到了请求对象`req`中，该对象是一个`IncomingMessage`,该对象同时也是一个**可读流**对象。在原生HTTP服务器中，或不依赖第三方解析模块时，可以像下面这样接收并解析请求体：

    const http = require('http');

    //用http模块创建一个http服务器
    http.createServer((req,res) => {
      if(req.method.toLowerCase() === 'post'){
        const body = '';
        req.on('data',chunk => {
          body += chunk;
        });

        req.on('end',() => {
          if(req.headers['content-type'].indexOf('application/json') !===-1){
            //JSON 格式请求体解析
            JSON.parse(body);
          }else if(req.headers['content-type'].indexOf('application/octet-stream') !== -1){
            //Raw 格式请求体解析
            //...
          }else if(req.headers['content-type'].indexOf('text/plain') !== -1){
            //text 文本格式请求体解析
            //...
          }
          else if(req.headers['content-type'].indexOf('application/x-www-urlencoded') !== -1){
            //URL-encoded 格式请求体解析
            //...
          }else{
            //其他格式解析
          }
        })
      }else{
        res.end('其它请求方式');
      }
      }).listen(3000);

#### 1.2 使用body-parser解析请求体
`body-parser`模块是一个`Express/Connect`中间件，它使用非常简单，可以像下面这样用这个模块解析请求体：

### Express/Connect顶层处理

**Express**框架默认使用`body-parser`作为请求体解析中间件，创建**Express**项目后，可以在`app.js`文件中看到如下代码：

    /* 引入依赖项 */
    var express = require('express');
    // ……
    var bodyParser = require('body-parser');

    var routes = require('./routes/index');
    var users = require('./routes/users');

    var app = express();

    // ……

    // 解析 application/json
    app.use(bodyParser.json());	
    // 解析 application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded());

这样就在项目的**Application**级别，引入了`body-parser`模块处理请求体。在上述代码中，模块会处理`application/x-www-urlencoded、application/json`两种内容格式的请求体。经过这个请求体处理后，就可以在所有的路由处理的`req.body`中访问请求参数。

### 解析Express具体路由

在实际应用中，不同路径(路由)可能会要求用户使用不同的内容类型，`body-parser`还支持为单个**Express路由**添加请求体解析：

    const express = require('express');
    const bodyParser = require('body-parser');
    const app = express();

    //创建application/json 解析
    const jsonParser = bodyParser.json();

    //创建application/x-www-urlencoded 解析
    const urlencodedParser = bodyParser.urlencoded({extended:false});

    //POST / login获取URL编码的请求体
    app.post('/login',urlencodedParser,(req,res) =>{
      if(!req.body) return res.status(400);
      res.send('welcome, ' + req.body.username);
    })

    //POST /api/users 获取JSON编码的请求体
    app.post('/api/users',jsonParser,(req,res) =>{
      if(!req.body) return res.sendStatus(400);

    })

#### 指定请求类型

`body-parser`还支持为某一种或者一类内容类型的请求体指定解析方式，指定时可以在解析方法中添加`type`参数修改指定`Content-type`的解析方式。

如，可以对`text/plain`内容类型使用JSON解析

    app.use(bodyParser.json({type:'text/plain}));
    
这一选项更多是用在非标准请求头的解析中，如下：

    //解析自定义的JSON
    app.use(bodyParser.json({type:'application/*+json'}));

    //解析自定义的Buffer
    app.use(bodyParser.raw({type:'application/vnd.custom-type'}));

    //将HTML请求头作为字符串处理
    app.use(bodyParser.text({type:'text/html'}));

### 2.body-parser模块的API

通过`npm install body-parser`命令安装模块后，可以通过以下方式获取模块引用：
    const bodyParser = require('body-parser');
`bodyParser`变量是对中间件的引用。请求头解析后，解析值都会被放到`req.body`属性，内容为空时是一个{}空对象。

#### 2.1 bodyParser.json() -解析JSON格式
    bodyparser.json(options);
返回一个仅解析json格式数据的中间件。这个方法支持任意Unicode编码的请求体，且支持gzip和deflate编码的数据压缩。

**Option**是一个包含以下可选值的对象
* `inflate` - 设置为true是，deflate压缩数据会被压缩；设置为false时，deflate压缩数据会被拒绝。默认true。
* `limit` -设置请求的最大数据量。默认是`100kb`
* `reviver` -传递给JSON.parse()方法的第二个参数，详见[JSON.parse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#Example.3A_Using_the_reviver_parameter)
* `strict` -设置为true时，仅会解析`Array`和`Object`两种格式；设置为false时会解析所有`JSON.parse`支持的格式。默认为true.
* `type` -该选项用于设置指定MIME类型的数据使用当前解析中间件。这个选项可以是一个函数或者字符串，当是字符串是会使用**type-is**来查找MIMI类型；当为函数时，中间件会通过`fn(req)`来获取实际值。默认为`application/json`.
* `verify` -这个选项仅在`verify(req,res,buf,encoding)`时受支持。

#### 2.2 bodyParser.raw() - 解析二进制格式

    bodyParser.raw(options)

返回一个将所有数据做为**Buffer**格式处理的中间件。这个方法支持gzip和deflate编码的数据压缩。解析后，其后的所有的`req.body`中将会是一个Buffer数据。

**Option**是一个包含以下可选值的对象

* `inflate` - 设置为true时，deflate压缩数据会被解压缩；设置为true时，deflate压缩数据会被拒绝。默认为true。
* `limit` - 设置请求的最大数据量。默认为'100kb'
* `type` - 该选项用于设置为指定MIME类型的数据使用当前解析中间件。这个选项可以是一个函数或是字符串，当是字符串是会使用type-is来查找MIMI类型；当为函数是，中间件会通过fn(req)来获取实际值。默认为`application/octet-stream`。
* `verify` - 这个选项仅在`verify(req, res, buf, encoding)`时受支持

#### 2.3 bodyParser.text() - 解析文本格式

    bodyParser.text(options)

返回一个仅处理字符串格式处理的中间件。这个方法支持gzip和deflate编码的数据压缩。解析后，其后的所有的`req.body`中将会是一个字符串值。

**Option**是一个包含以下可选值的对象

* `defaultCharset` - 如果`Content-Type`后没有指定编码时，使用此编码。默认为'utf-8'
* `inflate` - 设置为true时，deflate压缩数据会被解压缩；设置为false时，deflate压缩数据会被拒绝。默认为true。
* `limit` - 设置请求的最大数据量。默认为'100kb'
* `type` - 该选项用于设置为指定MIME类型的数据使用当前解析中间件。这个选项可以是一个函数或是字符串,当是字符串是会使用type-is来查找MIMI类型；当为函数是，中间件会通过fn(req)来获取实际值。默认`application/octet-stream`。
* `verify` - 这个选项仅在`verify(req, res, buf, encoding)`时受支持

#### 2.4 bodyParser.urlencoded() - 解析文本格式

    bodyParser.urlencoded(options)

返回一个处理urlencoded数据的中间件。这个方法默认使用UTF-8编码，且支持gzip和deflate编码的数据压缩。解析后，其后的所有的`req.body`中将会是一个键值对对象。

**Option**是一个包含以下可选值的对象

* `extended` - 当设置为false时，会使用querystring库解析URL编码的数据；当设置为true时，会使用qs库解析URL编码的数据。后没有指定编码时，使用此编码。默认为true
* `inflate` - 设置为true时，deflate压缩数据会被解压缩；设置为true时，deflate压缩数据会被拒绝。默任为true。
* `limit` - 设置请求的最大数据量。默认为'100kb'
* `parameterLimit` - 用于设置URL编码值的最大数据。默认为1000
* `type` - 该选项用于设置为指定MIME类型的数据使用当前解析中间件。这个选项可以是一个函数或是字符串,当是字符串是会使用type-is来查找MIMI类型；当为函数是，中间件会通过fn(req)来获取实际值。默认`application/octet-stream`。
* `verify` - 这个选项仅在`verify(req, res, buf, encoding)`时受支持