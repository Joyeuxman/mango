const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const catetorySchema = new Schema({
  name:String,
  movies:[{type:ObjectId,ref:'Movie'}],
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

// catetorySchema.pre 表示每次存储数据之前都先调用这个方法
// catetorySchema.pre('save', next=>{  //???暂时没找到解决办法使用这种写法，this指向不对
catetorySchema.pre('save', function(next){
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.update = Date.now();
  }
  next();
})

// catetorySchema 模式的静态方法
catetorySchema.statics = {
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

// 导出catetorySchema模式
module.exports = catetorySchema;