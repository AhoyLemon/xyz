$('#PreviousConferences').mousedown(function (event) {
  $(this)
      .data('down', true)
      .data('x', event.clientX)
      .data('scrollLeft', this.scrollLeft)
      .addClass("dragging");
    }).mouseup(function (event) {
        $(this)
          .data('down', false)
          .removeClass("dragging");
    }).mousemove(function (event) {
        if ($(this).data('down') == true) {
          // $(this).css('overflow','hidden')
            this.scrollLeft = $(this).data('scrollLeft') + $(this).data('x') - event.clientX;
        }
    }).mouseout(function() {
      // $(this).css('overflow','auto')
  });

// $('.upcoming-conference-carousel').slick({
//   prevArrow: '<button type="button" class="slick-prev slick-arrow">&lt;</button>',
//   nextArrow: '<button type="button" class="slick-next slick-arrow">&gt;</button>',
//   //arrows: false,
//   dots: true,
//   infinite: true,
//   slidesToShow: 2,
//   slidesToScroll: 2,
//   responsive: [
//     {
//       breakpoint: 1600,
//       settings: {
//         slidesToShow: 1,
//         slidesToScroll: 1
//       }
//     }
//   ]
// });

// $('.previous-conference-carousel').slick({
//   prevArrow: '<button type="button" class="slick-prev slick-arrow">&lt;</button>',
//   nextArrow: '<button type="button" class="slick-next slick-arrow">&gt;</button>',
//   //arrows: false,
//   dots: true,
//   infinite: true,
//   slidesToShow: 2,
//   slidesToScroll: 2,
//   responsive: [
//     {
//       breakpoint: 980,
//       settings: {
//         slidesToShow: 1,
//         slidesToScroll: 1,
//         dots: false
//       }
//     }
//   ]
// });