// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
// //实现关联文档，ObjectId为mongoDB文档的主键，即_id属性
// const ObjectId = Schema.Types.ObjectId;

// const movieSchema = new Schema({
//   title: String,
//   doctor: String,
//   language: String,
//   country: String,
//   summary: String,
//   flash: String,
//   poster: String,
//   year: Number,
//   category:{type:ObjectId,ref:'Category'},
//   meta: {// meta 更新或录入数据的时间记录
//     createAt: {
//       type: Date,
//       default: Date.now()
//     },
//     updateAt: {
//       type: Date,
//       default: Date.now()
//     },
//   }
// })

// // movieSchema.pre 表示每次存储数据之前都先调用这个方法
// // movieSchema.pre('save', next=>{  //???暂时没找到解决办法使用这种写法，this指向不对
// movieSchema.pre('save', function(next){
//   if (this.isNew) {
//     this.meta.createAt = this.meta.updateAt = Date.now();
//   } else {
//     this.meta.update = Date.now();
//   }
//   next();
// })

// // movieSchema 模式的静态方法
// movieSchema.statics = {
//   fetch: function (cb) {
//     return this
//       .find({})
//       .sort('meta.updateAt')
//       .exec(cb)
//   },
//   findById: function (id, cb) {
//     return this
//       .findOne({ _id: id })
//       .exec(cb)
//   }
// }

// // 导出movieSchema模式
// module.exports = movieSchema;


var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var MovieSchema = new Schema({
  doctor: String,
  title: String,
  language: String,
  country: String,
  summary: String,
  flash: String,
  poster: String,
  year: Number,
  // pv: {
  //   type: Number,
  //   default: 0
  // },
  category: {
    type: ObjectId,
    ref: 'Category'
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

// var ObjectId = mongoose.Schema.Types.ObjectId
MovieSchema.pre('save', function(next) {
  console.log('this===========',this)
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }

  next()
})

MovieSchema.statics = {
  fetch: function(cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function(id, cb) {
    return this
      .findOne({_id: id})
      .exec(cb)
  }
}

module.exports = MovieSchema