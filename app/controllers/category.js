const _ = require('underscore');
const Category = require('../models/category');//mongoose编译后的模型movie

// 电影后台录入页
exports.new = (req, res) => {
  res.render('category_admin', {
    title: '芒果电影 后台分类录入页',
    category: {}
  })
}


// 将电影保存到mongoDB数据库
exports.save = function (req, res) {
  const _category = req.body.category;
  console.log('表单category============', req.body.category)

  const category = new Category(_category);
  console.log('实例化category============', category)

  category.save(function (err, category1) {
    if (err) {
      console.log(err);
    }
    console.log('保存成功category============', category1)

    res.redirect('/admin/category/list');
  });
};

// 后台电影列表页
exports.list = (req, res) => {
  Category.fetch((err, categories) => {

    if (err) {
      console.log(err);
    }
    console.log('数据库categories============', categories)
    res.render('categorylist', {
      title: '芒果电影 后台分类列表页',
      categories: categories
    })
  })
}

// //  将电影从mongoDB数据库中删除
// exports.del = (req, res) => {
//   const id = req.query.id;
//   if (id) {
//     Movie.remove({ _id: id }, (err, movie) => {
//       if (err) {
//         console.log(err);
//         res.json({ success: 0 })
//       } else {
//         res.json({ success: 1 })
//       }
//     })
//   }
// }
