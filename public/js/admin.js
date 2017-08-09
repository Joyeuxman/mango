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

  // 豆瓣同步处理
  $('#douban').blur(function(){
    const douban = $(this);
    const id = douban.val();

    if(id){
      $.ajax({
        url: 'https://api.douban.com/v2/movie/subject/' + id,
        cache: true,
        type: 'get',
        dataType: 'jsonp',
        crossDomain: true,
        jsonp: 'callback',
        success: function(data) {
          console.log('请求成功data===',data)
          $('#inputTitle').val(data.title)
          $('#inputDoctor').val(data.directors[0].name)
          $('#inputCountry').val(data.countries[0])
          $('#inputPoster').val(data.images.large)
          $('#inputYear').val(data.year)
          $('#inputSummary').val(data.summary)
        }
      })
    }
  })
})