const User = require('../models/user');//mongoose编译后的模型movie

// 注册
exports.showSignup = (req, res) => {
  res.render('signup', {
    title: '注册页面'
  })
}
// 登录
exports.showSignin = (req, res) => {
  res.render('signin', {
    title: '登录页面'
  })
}

// 注册
exports.signup = (req, res) => {

  // 补充知识 ---
  // '/user/signup/:userid'
  // const _userid = req.params.userid;
  // '/user/signup/1111?userid=1112'
  // const _userid = req.query.userid;
  // 'user/signup/1111?userid=1113
  // {userid:1112} ---提交表单bodyParser
  // req.param('userid') userid优先级params(1111) > body(1112) > query(1113)

  const _user = req.body.user;
  // console.log('加盐前的用户信息', _user);
  User.findOne({ name: _user.name }, (err, user) => {
    if (err) {
      console.log(err);
    }
    if (user) {
      console.log('该用户已存在', user);
      return res.redirect('/signin');
    } else {
      const user = new User(_user);
      user.save(function (err, user) {
        if (err) {
          console.log(err);
        }
        res.redirect('/');
        // console.log('注册成功,加盐后的用户信息', user);
      })
    }
  })
}

// 登录
exports.signin = (req, res) => {
  const _user = req.body.user;
  const { name, password } = _user;
  console.log('提交的用户信息', _user)
  User.findOne({ name: name }, (err, user) => {
    if (err) {
      console.log(err);
    }
    // console.log('数据库查到的用户信息', user)

    if (!user) {
      return res.redirect('/signup');
    }
    user.comparePassword(password, (err, isMatch) => {
      if (err) {
        console.log(err);
      }
      if (isMatch) {
        req.session.user = user;
        console.log('密码匹配成功。。。');
        // console.log('req.session====', req.session);

        return res.redirect('/');
      } else {
        console.log('密码不匹配。。。');
        return res.redirect('/signin');

      }
    })
  })
}

// 注销
exports.logout = (req, res) => {
  delete req.session.user;
  // delete app.locals.user;
  res.redirect('/');
}

// 用户列表页
exports.list = (req, res) => {
  User.fetch((err, users) => {
    if (err) {
      console.log(err);
    }
    res.render('userlist', {
      title: '芒果电影 用户列表页',
      users: users
    })
  })
}

// 用户登录验证
exports.signinRequired = (req, res, next) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect('/signin')
  }
  next();
}

// 用户权限验证 
exports.adminRequired = (req, res, next) => {
  const user = req.session.user;
  if (user.role <= 10) {
    return res.redirect('/signin')
  }
  next();
}