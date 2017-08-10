const _ = require('underscore');
const Movie = require('../models/movie');//mongoose编译后的模型movie
const Comment = require('../models/comment');//mongoose编译后的模型movie
const Category = require('../models/category');//mongoose编译后的模型movie


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

  Category.find({}, (err, categories) => {
    res.render('admin', {
      title: '芒果电影 电影录入页',
      categories: categories,
      movie: {}
    })
  })

}

// 电影后台更新页
exports.update = (req, res) => {
  const id = req.params.id;
  if (id) {
    Movie.findById(id, (err, movie) => {
      Category.find({}, (err, categories) => {
        res.render('admin', {
          title: '芒果电影 更新页',
          movie: movie,
          categories: categories
        })
      })
    })
  }
}

// 将电影保存到mongoDB数据库
exports.save = function (req, res) {
  console.log('111哈哈哈哈哈哈开始保存=======================================', req.body)
  const id = req.body.movie._id;
  const movieObj = req.body.movie;
  console.log('111哈哈哈哈哈哈movieObj=======================================', movieObj)

  let _movie = null;
  if (id) { // 已经存在的电影数据
    console.log('222哈哈哈哈哈哈=======================================')
    Movie.findById(id, function (err, movie) {
      if (err) {
        console.log(err);
      }
      _movie = _.extend(movie, movieObj); // 用新对象里的字段替换老的字段
      _movie.save(function (err, movie) {
        if (err) {
          console.log(err);
        }
        res.redirect('/movie/' + movie._id);
      });
    });
  } else {  // 新加的电影
    _movie = new Movie(movieObj);
    const categoryId = movieObj.category;
    const categoryName = movieObj.categoryName;
    
    // const { categoryId, categoryName } = movieObj;
    // console.log('要保存的电影movieObj====', _movie)
    // console.log('要保存的电影categoryId, categoryName====', _movie)
    
    _movie.save(function (err, movie) {
      if (err) {
        console.log(err);
      }
      // console.log('保存后电影movie====', movie)
      console.log('哈哈哈哈哈哈=======================================')
      if (categoryId) {
        Category.findById(categoryId, (err, category) => {
          // console.log('category.movies==========', category.movies)
          // // ???此处有bug  后台录入电影时，如果没有选择电影分类的话，点击录入会报错
          category.movies.push(movie._id);
          category.save((err, category) => {
            if (err) {
              console.log(err);
            }
            res.redirect('/movie/' + movie._id);
          })
        })
      }
      else if (categoryName) {
        const category = new Category({
          name: categoryName,
          movies: [movie._id]
        })

        category.save((err, category) => {
          movie.category = category._id
          movie.save((err, movie) => {
            res.redirect('/movie/' + movie._id)
          })
        })
      }

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
