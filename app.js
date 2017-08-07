const path = require('path');
const _ = require('underscore');
const express = require('express');
const app = express();

const port = process.env.PORT || 3008;//设置端口号——3008
app.listen(port);//监听 port[3008]端口
console.log('芒果电影正在运行...');
console.log('请打开localhost:3008,敬请期待...');
console.log('***********************************');


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mango');//连接mongodb本地数据库mango
console.log('mango数据库连接成功');
/* mongoose 简要知识点补充
mongoose模块构建在mongodb之上，提供了Schema[模式]、Model[模型]、Document[文档]对象，用起来更为方便。
Schema对象定义文档的结构(类似表结构),可以定义字段、类型、唯一性、索引、验证。
Model对象表示集合中的所有文档。
Document对象作为集合中的每个文档。
mongoose还有Query和Aggregate对象，Query实现查询，Aggregate实现聚合。
*/

app.locals.moment = require('moment');//???locals

const serveStatic = require('serve-static');//静态文件处理
app.use(serveStatic('public'));//静态文件路径——public

const bodyParser = require('body-parser');//因为后台录入页有提交表单的步骤，故加载此模块用来文件解析，将表单里的数据进行格式化
app.use(bodyParser.urlencoded({ extend: true }));

app.set('views', './views/pages');//设置试图默认的文件路径
app.set('view engine', 'jade');//设置视图引擎——jade

const Movie = require('./models/movie');//mongoose编译后的模型movie

// 编写主要路由
// 首页
app.get('/', (req, res) => {
  Movie.fetch((err, movies) => {
    if (err) {
      console.log(err);
    }
    res.render('index', {
      title: '芒果电影 首页',
      movies: movies
    })
  })
})

// 电影详情页
app.get('/movie/:id', (req, res) => {
  console.log('详情页***************');
  const id = req.params.id;
  Movie.findById(id, (err, movie) => {
    if(err){
      console.log(err);
    }
    res.render('detail', {
      title: '芒果电影 ' + movie.title,
      movie: movie
    })
  })
})


// 电影录入页
app.get('/admin/movie', (req, res) => {
  res.render('admin', {
    title: '芒果电影 电影录入页',
    movie: {
      title: '',
      doctor: '',
      country: '',
      year: '',
      poster: '',
      flash: '',
      summary: '',
      language: ''
    }
  })
})

// 电影更新页
app.get('/admin/update/:id', (req, res) => {
  const id = req.params.id;
  if (id) {
    Movie.findById(id, (err, movie) => {
      res.render('admin', {
        title: '芒果电影 更新页',
        movie: movie
      })
    })
  }
})
app.post('/admin/movie/new', function (req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var _movie = null;
    if (id !== 'undefined') { // 已经存在的电影数据
        Movie.findById(id, function (err, movie) {
            if (err) {
                console.log(err);
            }
            _movie = _underscore.extend(movie, movieObj); // 用新对象里的字段替换老的字段
            _movie.save(function (err, movie) {
                if (err) {
                    console.log(err);
                }
                res.redirect('/movie/' + movie._id);
            });
        });
    } else {  // 新加的电影
        _movie = new Movie({
            doctor: movieObj.doctor,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
        });
        _movie.save(function (err, movie) {
            if (err) {
                console.log(err);
            }
            res.redirect('/movie/' + movie._id);
        });
    }
});


