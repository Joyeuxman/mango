const Movie = require('../models/movie');//mongoose编译后的模型movie
const Category = require('../models/category');//mongoose编译后的模型movie

// 首页
exports.index = (req, res) => {
  Category
    .find({})
    .populate({ path: 'movies', options: { limit: 5 } })
    .exec((err, categories) => {
      if (err) {
        console.log(err);
      }
      console.log('首页==============',categories);
      res.render('index', {
        title: '芒果电影 首页',
        categories: categories,
      })
    })
}