(function () {
  var sections = document.querySelectorAll(".section");
  if (!("IntersectionObserver" in window)) {
    sections.forEach(function (s) { s.classList.add("in-view"); });
    return;
  }
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in-view"); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  sections.forEach(function (s) { obs.observe(s); });
})();
