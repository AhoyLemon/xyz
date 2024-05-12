$('.conference .pic').click(function() {
  let f = $(this).attr('data-pic');
  let i = 'img/talks/'+f;

  if ($(this).hasClass('active')) {

    $(this).removeClass('active').removeClass('inactive');
    $(this).siblings().removeClass('active').removeClass('inactive');
    $(this).parent().parent().removeClass('photo-background');

  } else {

    $(this).parent().siblings('.cardpic').css('background-image', 'url('+i+')');
    $(this).parent().parent().addClass('photo-background');
    $(this).removeClass('inactive').addClass('active');
    $(this).siblings().removeClass('active').addClass('inactive');
    
  }

});

$('button.close-cardpic').click(function() {
  $(this).parent().parent().removeClass('photo-background');
  $(this).siblings().removeClass('active').removeClass('inactive');
});