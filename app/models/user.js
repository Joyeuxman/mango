const mongoose = require('mongoose');
const userSchema = require('../schemas/user');

// 编译生成User模型
const User = mongoose.model('User',userSchema);

module.exports = User;