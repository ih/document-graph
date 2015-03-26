Package.describe({
  summary: "Product tours to explain features."
});

Package.on_use(function (api, where) {
  // TODO figure out why bootstrap-tour still needs to be included in
  // document-graph.html
  api.add_files(
    ['bootstrap-tour.js', 'bootstrap-tour.css', 'product-tour.js'], 'client');

  if (api.export) {
    api.export('ProductTour');
  }
});
