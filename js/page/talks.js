document.querySelectorAll('.conference .pic').forEach(function(pic) {
  pic.addEventListener('click', function() {
    let f = pic.getAttribute('data-pic');
    let i = 'img/talks/' + f;

    if (pic.classList.contains('active')) {
      pic.classList.remove('active', 'inactive');
      pic.parentNode.querySelectorAll('.pic').forEach(function(sibling) {
        sibling.classList.remove('active', 'inactive');
      });
      pic.closest('.conference').classList.remove('photo-background');
    } else {
      pic.closest('.conference').querySelector('.cardpic').style.backgroundImage = 'url(' + i + ')';
      pic.closest('.conference').classList.add('photo-background');
      pic.classList.remove('inactive');
      pic.classList.add('active');
      pic.parentNode.querySelectorAll('.pic').forEach(function(sibling) {
        sibling.classList.remove('active');
        sibling.classList.add('inactive');
      });
    }
  });
});

document.querySelectorAll('button.close-cardpic').forEach(function(button) {
  button.addEventListener('click', function() {
    button.closest('.conference').classList.remove('photo-background');
    button.closest('.conference').querySelectorAll('.pic').forEach(function(pic) {
      pic.classList.remove('active', 'inactive');
    });
  });
});