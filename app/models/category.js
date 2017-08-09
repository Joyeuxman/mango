const mongoose = require('mongoose');
const catetorySchema = require('../schemas/category');

// 编译生成Catetory模型
const Catetory = mongoose.model('Catetory',catetorySchema);

module.exports = Catetory;