const _ = require('underscore');
const Movie = require('../models/movie');//mongoose编译后的模型movie
const Comment = require('../models/comment');//mongoose编译后的模型movie

// 电影详情页
exports.detail = (req, res) => {
  console.log('详情页***************');
  const id = req.params.id;
  Movie.findById(id, (err, movie) => {
    if (err) {
      console.log(err);
    }
    Comment
      .find({ movie: id })
      .populate('from', 'name')//???
      .populate('reply.from refly.to', 'name')//???
      .exec((err, comments) => {
        if (err) {
          console.log(err);
        }
        console.log('comments内容===', comments);
        res.render('detail', {
          title: '芒果电影 ' + movie.title,
          movie: movie,
          comments: comments
        })
      })
  })
}

// 电影后台录入页
exports.new = (req, res) => {
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
}

// 电影后台更新页
exports.update = (req, res) => {
  const id = req.params.id;
  if (id) {
    Movie.findById(id, (err, movie) => {
      res.render('admin', {
        title: '芒果电影 更新页',
        movie: movie
      })
    })
  }
}

// 将电影保存到mongoDB数据库
exports.save = function (req, res) {
  const id = req.body.movie._id;
  const movieObj = req.body.movie;
  let _movie = null;
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
};

// 后台电影列表页
exports.list = (req, res) => {
  Movie.fetch((err, movies) => {
    if (err) {
      console.log(err);
    }
    res.render('list', {
      title: '芒果电影 后台电影列表页',
      movies: movies
    })
  })
}

//  将电影从mongoDB数据库中删除
exports.del = (req, res) => {
  const id = req.query.id;
  if (id) {
    Movie.remove({ _id: id }, (err, movie) => {
      if (err) {
        console.log(err);
        res.json({ success: 0 })
      } else {
        res.json({ success: 1 })
      }
    })
  }
}
