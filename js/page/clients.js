$('.screenshots').slick({
  infinite: true,
  arrows: false,
  dots: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: false,
  autoplaySpeed: 5000
});

tippy('.tooltip', {
  //content: 'My tooltip!',
  allowHTML: true,
  placement: "left",
  delay: [100,300]
});