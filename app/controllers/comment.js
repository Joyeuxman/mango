const _ = require('underscore');
const Comment = require('../models/comment');//mongoose编译后的模型movie


// 将评论保存到mongoDB数据库
exports.save = (req, res) => {
  const _comment = req.body.comment
  const movieId = _comment.movie

  if (_comment.cid) {
    Comment.findById(_comment.cid, (err, comment) => {
      const reply = {
        from: _comment.from,
        to: _comment.tid,
        content: _comment.content
      }
      comment.reply.push(reply)
      comment.save((err, comment) => {
        if (err) {
          console.log(err)
        }
        res.redirect('/movie/' + movieId)
      })
    })
  }
  else {
    const comment = new Comment(_comment)
    comment.save((err, comment) => {
      if (err) {
        console.log(err)
      }

      res.redirect('/movie/' + movieId)
    })
  }
}


