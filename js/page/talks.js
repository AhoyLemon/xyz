$('.conference a.pic').click(function() {
  let f = $(this).attr('data-pic');
  let i = 'img/talks/'+f;
  $(this).parent().siblings('.cardpic').css('background-image', 'url('+i+')');
  $(this).parent().parent().addClass('photo-background');
  $(this).removeClass('inactive').addClass('active');
  $(this).siblings().removeClass('active').addClass('inactive');
});

$('a.close-cardpic').click(function() {
  $(this).parent().parent().removeClass('photo-background');
  $(this).siblings().removeClass('active').removeClass('inactive');
});