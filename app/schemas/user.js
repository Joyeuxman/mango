const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10; //计算强度 其值越大，破解密码时间越长
const UserSchema = new mongoose.Schema({
  name: {
    unique: true,
    type: String
  },
  password: String,
  // user|admin|super
  // role:String,
  // 0: nomal user
  // 1: verified user
  // 2: professonal user
  // >10:admin
  // >50:super admin 供开发使用
  role:{
    type:Number,
    default:0
  },
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

// UserSchema.pre 表示每次存储数据之前都先调用这个方法
// UserSchema.pre('save', next=>{  //???暂时没找到解决办法使用这种写法，this指向不对
UserSchema.pre('save', function (next) {
  console.log('注册的用户this===', this);
  var user = this;
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now();
  } else {
    this.meta.update = Date.now();
  }
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    // if (err) return next(err);
    if (err) {
      console.log(err);
      return next(err);
    }
    bcrypt.hash(user.password, salt, function (err, hash) {
      // if (err) return next(err);
      if (err) {
        console.log(err);
        return next(err);
      }
      user.password = hash;
      next();
    })
  })
})
// UserSchema 模式的实例方法 实例化后的对象可以调用 如new
UserSchema.methods = {
  comparePassword:function(_password,cb){
    bcrypt.compare(_password,this.password,function(err,isMatch){
      if(err) return cb(err);
      cb(null,isMatch);
    })
  }
}
// UserSchema 模式的静态方法 模型可以调用这里的方法
UserSchema.statics = {
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

// 导出UserSchema模式
module.exports = UserSchema;
