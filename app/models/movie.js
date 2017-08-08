const mongoose = require('mongoose');
const movieSchema = require('../schemas/movie');

// 编译生成movie模型
const Movie = mongoose.model('Movie',movieSchema);

module.exports = Movie;