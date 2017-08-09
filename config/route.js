const _ = require('underscore');
const Index = require('../app/controllers/index');
const User = require('../app/controllers/user');
const Movie = require('../app/controllers/movie');
const Comment = require('../app/controllers/Comment');
const Category = require('../app/controllers/Category');



module.exports = function (app) {

  // 保持会话持久
  app.use(function (req, res, next) {
    console.log('预处理req.session.user====', req.session.user);

    const _user = req.session.user;
    app.locals.user = _user;
    return next();
  })

  // 编写主要路由
  // ******************* 首页 start ***********************
  // 首页
  app.get('/', Index.index);
  // ******************* 首页 end ***********************


  // ******************* 用户 start ***********************
  // 注册
  app.post('/user/signup', User.signup);
  // 登录
  app.post('/user/signin', User.signin);
  // 注册
  app.get('/signup', User.showSignup);
  // 登录
  app.get('/signin', User.showSignin);
  // 注销
  app.get('/logout', User.logout);
  // 用户列表页
  app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list);
  // ******************* 用户 end ***********************


  // ******************* 电影 start ***********************
  // 电影详情页
  app.get('/movie/:id', Movie.detail);
  // 电影录入页
  app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new);
  // 电影更新页
  app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);
  // 保存电影
  app.post('/admin/movie', User.signinRequired, User.adminRequired, Movie.save);
  // 后台电影列表页
  app.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list)
  // 删除电影
  app.delete('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.del);
  // ******************* 电影  end ***********************


  // ******************* 评论  start ***********************
  app.post('/user/comment', User.signinRequired, Comment.save)
  // ******************* 评论  end ***********************


  // ******************* 评论  start ***********************
  app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
  // 保存电影
  app.post('/admin/category', User.signinRequired, User.adminRequired, Category.save);
  // 后台电影列表页
  app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list)
  // ******************* 评论  end ***********************

}


