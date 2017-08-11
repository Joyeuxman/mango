const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');//日志打印
const session = require('express-session');//会话---用来保存用户信息
const mongoStore = require('connect-mongo')(session);//将session保存到MongoDB中

const cookieParser = require('cookie-parser');
const serveStatic = require('serve-static');//静态文件处理
//因为后台录入页有提交表单的步骤，故加载此模块用来文件解析，将表单里的数据进行格式化
const bodyParser = require('body-parser');

const dbUrl = 'mongodb://localhost:27017/mango';//mongoDB数据库的连接地址
const port = process.env.PORT || 3008;//设置端口号——3008

const app = express();
// app.locals的各属性值将贯穿程序app的整个生命周期，相当于声明了一个全局变量
app.locals.moment = require('moment');

//监听 port[3008]端口 
app.listen(port);
console.log('芒果电影正在运行...');
console.log('请打开localhost:3008,敬请期待...');
console.log('***********************************');


//连接mongodb本地数据库mango
mongoose.connect('mongodb://localhost:27017/mango');
console.log('mango数据库连接成功');
/* mongoose 简要知识点补充
mongoose模块构建在mongodb之上，提供了Schema[模式]、Model[模型]、Document[文档]对象，用起来更为方便。
Schema对象定义文档的结构(类似表结构),可以定义字段、类型、唯一性、索引、验证。
Model对象表示集合中的所有文档。
Document对象作为集合中的每个文档。
mongoose还有Query和Aggregate对象，Query实现查询，Aggregate实现聚合。
*/



app.use(serveStatic('public'));//静态文件路径——public
app.use(bodyParser.urlencoded({ extend: true }));//将表单数据提取到req.body中
app.use(cookieParser());//将cookie数据提取到
// 将在mongoDB数据库中创建session集合
app.use(session({
  // name: 设置 cookie 中保存 session id 的字段名称，默认为connect.sid
  // secret: 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  // resave: 如果为true，则每次请求都重新设置sessio的 cookie，假设你的cookie是10分钟过期，每次请求都会再设置10分钟
  // saveUninitialized: 如果为true, 则无论有没有session的cookie，每次请求都设置个session cookie
  secret: 'mango',
  store: new mongoStore({
    url: dbUrl,
    collection: 'sessions'
  })
}))
app.set('views', './app/views/pages');//设置试图默认的文件路径
app.set('view engine', 'jade');//设置视图引擎——jade

// 开发环境 ---具体配置
if ('development' === app.get('env')) {
  app.set('showStackError', true);//在屏幕上可以将错误信息打印出来
  app.use(logger('dev'))
  // app.use(logger(':method :url :status'));
  app.locals.pretty = true;//将压缩后的代码格式化
  mongoose.set('debug', true);//???
}

// 路由配置
require('./config/route')(app);



