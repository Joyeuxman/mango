const mongoose = require('mongoose');
const commonSchema = require('../schemas/comment');

// 编译生成Common模型
const Common = mongoose.model('Common',commonSchema);

module.exports = Common;