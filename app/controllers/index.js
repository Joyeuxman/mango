const Movie = require('../models/movie');//mongoose编译后的模型movie

// 首页
exports.index = (req, res) => {
  Movie.fetch((err, movies) => {
    if (err) {
      console.log(err);
    }
    res.render('index', {
      title: '芒果电影 首页',
      movies: movies,
    })
  })
}