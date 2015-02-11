// results, currentPage
var PAGE_SIZE = 15;
var MAX_PAGES = 10;
var HALF_MAX_PAGES = Math.floor(MAX_PAGES / 2);
var state = new ReactiveDict();

function resultsHandlerCreator(query, currentPage) {
  return function (error, results) {
    console.log('search results');
    console.log(error);
    console.log(results);
    Mondrian.setCellContent({
      templateName: 'searchResults',
      context: {
        results: results.hits,
        query: query,
        totalHitCount: results.totalHitCount,
        currentPage: currentPage
      }
    });
  };
}

Template.navbarSearchForm.rendered = function () {
  console.log('search interface rendered');
};

Template.navbarSearchForm.events({
  'click .search-submit': function (event) {
    event.preventDefault();

    var query = $('#search-input').val();

    var queryData = {
      queryString: query,
      fields: GraphAPI.nodeProperties.concat(['tags'])
    };

    var pagingData = {
      offset: 0,
      pageSize: PAGE_SIZE
    };

    var tagData = {
      have: TagsInterface.getActiveLabels(),
      notHave: []
    };

    SearchAPI.find(
      'nodes', queryData, pagingData, tagData, undefined,
      resultsHandlerCreator(query, 1));

    analytics.track('Searched', {
      query: query
    });
  }
});

Template.searchResult.events({
  'click .search-result a': function (event, template) {
    event.preventDefault();
    Tracker.autorun(function (computation) {
      console.log('setting search result...');
      var clickedNode = GraphAPI.getNode(template.data.id);
      if (clickedNode) {
        console.log('clicked on node ' + template.data.id + ':' + JSON.stringify(clickedNode));
        Mondrian.setCellContent({templateName: 'viewer', context: clickedNode});
        computation.stop();
      }
    });
    Tracker.flush();
  }
});

Template.searchResults.helpers({
  results: function () {return Template.instance().data.results;},
  getPageRange: function () {
    var currentPage = Template.instance().data.currentPage;

    return _.range(
      getLowestPage(currentPage), getHighestPage(currentPage) + 1);


    function numberOfPages() {
      return Template.instance().data.totalHitCount / PAGE_SIZE;
    }

    function getLowestPage(currentPage) {
      if (numberOfPages() <  MAX_PAGES) {
        return 1;
      }
      else if (currentPage > (numberOfPages() - HALF_MAX_PAGES)) {
        return numberOfPages() - MAX_PAGES + 1;
      }
      else {
        return Math.max(1, currentPage - HALF_MAX_PAGES);
      }
    }

    // TODO make sure this covers all the cases as desired
    function getHighestPage(currentPage) {
      if (!currentPage) {
        return 0;
      }
      else if (numberOfPages() < MAX_PAGES) {
        return numberOfPages();
      }
      else if (currentPage < HALF_MAX_PAGES){
        return MAX_PAGES;
      }
      else {
        return Math.min(currentPage + HALF_MAX_PAGES, numberOfPages());
      }
    }

  },
  activeIfCurrentPage: function (pageNumber) {
    pageNumber = Number(pageNumber);
    return (
      pageNumber === Template.instance().data.currentPage ? 'active' : '');
  }
});

Template.searchResult.helpers({
  getTitle: function () {
    return (this.highlight && this.highlight.title) || this.title;
  }
});

Template.searchResults.events({
  'click .page': function (event, templateInstance) {
    event.preventDefault();
    var pageNumber = Number($(event.target).html());

    var query = Template.instance().data.query;

    var queryData = {
      queryString: query,
      fields: GraphAPI.nodeProperties.concat(['tags'])
    };

    var pagingData = {
      offset: (pageNumber - 1)*PAGE_SIZE,
      pageSize: PAGE_SIZE
    };

    var tagData = {
      have: TagsInterface.getActiveLabels(),
      notHave: []
    };

    SearchAPI.find(
      'nodes', queryData, pagingData, tagData, undefined,
      resultsHandlerCreator(query, pageNumber));

    state.set('currentPage', pageNumber);

    analytics.track('Paged Search', {
      query: query,
      page: pageNumber
    });
  }
});

Template.recentlyAdded.created = function () {
  // loads search results template w/ recently added results
  var queryData = {
    queryString: '',
    fields: GraphAPI.nodeProperties.concat(['tags'])
  };

  var pagingData = {
    offset: 0,
    pageSize: PAGE_SIZE
  };

  SearchAPI.find(
    'nodes', queryData, pagingData, undefined, {createdAt: {order: 'desc'}},
    resultsHandlerCreator('', 1));
};
