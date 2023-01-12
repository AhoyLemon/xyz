$('.upcoming-conference-carousel').slick({
  prevArrow: '<button type="button" class="slick-prev slick-arrow">&lt;</button>',
  nextArrow: '<button type="button" class="slick-next slick-arrow">&gt;</button>',
  //arrows: false,
  dots: true,
  infinite: true,
  slidesToShow: 2,
  slidesToScroll: 2,
  responsive: [
    {
      breakpoint: 980,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }
  ]
});

$('.previous-conference-carousel').slick({
  prevArrow: '<button type="button" class="slick-prev slick-arrow">&lt;</button>',
  nextArrow: '<button type="button" class="slick-next slick-arrow">&gt;</button>',
  //arrows: false,
  dots: true,
  infinite: true,
  slidesToShow: 2,
  slidesToScroll: 2,
  responsive: [
    {
      breakpoint: 980,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        dots: false
      }
    }
  ]
});