const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//实现关联文档，ObjectId为mongoDB文档的主键，即_id属性
const ObjectId = Schema.Types.ObjectId;

const commonSchema = new Schema({
  movie: {type: ObjectId,ref: 'Movie'},
  from: { type: ObjectId, ref: 'User' },
  reply: [{
    from: { type: ObjectId, ref: 'User' },
    to: { type: ObjectId, ref: 'User' },
    content:String
  }],
  content:String,
  meta: {// meta 更新或录入数据的时间记录
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    },
  }
})

// commonSchema.pre 表示每次存储数据之前都先调用这个方法
// commonSchema.pre('save', next=>{  //???暂时没找到解决办法使用这种写法，this指向不对
commonSchema.pre('save', function (next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.update = Date.now();
  }
  next();
})

// commonSchema 模式的静态方法
commonSchema.statics = {
  fetch: function (cb) {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec(cb)
  },
  findById: function (id, cb) {
    return this
      .findOne({ _id: id })
      .exec(cb)
  }
}

// 导出commonSchema模式
module.exports = commonSchema;