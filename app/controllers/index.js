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

// 查询 page
exports.search = function(req, res) {
  var catId = req.query.cat
  var q = req.query.q
  var page = parseInt(req.query.p, 10) || 0
  var count = 2
  var index = page * count

  if (catId) {
    Category
      .find({_id: catId})
      .populate({
        path: 'movies',
        select: 'title poster'
      })
      .exec(function(err, categories) {
        if (err) {
          console.log(err)
        }
        var category = categories[0] || {}
        var movies = category.movies || []
        var results = movies.slice(index, index + count)

        res.render('results', {
          title: 'imooc 结果列表页面',
          keyword: category.name,
          currentPage: (page + 1),
          query: 'cat=' + catId,
          totalPage: Math.ceil(movies.length / count),
          movies: results
        })
      })
  }
  else {
    Movie
      .find({title: new RegExp(q + '.*', 'i')})
      .exec(function(err, movies) {
        if (err) {
          console.log(err)
        }
        var results = movies.slice(index, index + count)

        res.render('results', {
          title: 'imooc 结果列表页面',
          keyword: q,
          currentPage: (page + 1),
          query: 'q=' + q,
          totalPage: Math.ceil(movies.length / count),
          movies: results
        })
      })
  }
}