// 处理删除电影数据的逻辑
$(function () {
  $('.del').click(e => {
    const target = $(e.target);
    const id = target.data('id');
    const tr = $('.item-id-' + id);

    $.ajax({
      type: 'DELETE',//异步请求类型，删除
      url: '/admin/movie/list?id=' + id,
    })
      .done(results => {
        if (results.success === 1) {
          if (tr.length > 0) {
            tr.remove();
          }
        }
      })
  })
})