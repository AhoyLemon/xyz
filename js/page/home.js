// Enable horizontal scrolling with mouse wheel for conference boxes
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".conference-boxes").forEach(function (box) {
    box.addEventListener("wheel", function (e) {
      e.preventDefault();
      e.stopPropagation();
      box.scrollBy(e.deltaY / 5, 0);
    });
  });
});
