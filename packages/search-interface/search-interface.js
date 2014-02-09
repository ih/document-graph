// results, currentPage
var PAGE_SIZE = 15;
var MAX_PAGES = 10;
var HALF_MAX_PAGES = Math.floor(MAX_PAGES / 2);
var state = new ReactiveDict();

Template.searchInterface.rendered = function () {
	console.log('search interface rendered');
	state.set('results', []);
	state.set('currentPage', null);
	state.set('query');
	state.set('totalHitCount', 0);
};

function numberOfPages() {
	return state.get('totalHitCount') / PAGE_SIZE;
}

function resultsHandler(error, results) {
	console.log('search results');
	console.log(error);
	console.log(results);
	state.set('results', results.hits);
	state.set('totalHitCount', results.totalHitCount);
}

Template.searchInterface.events({
	'click .search-submit': function (event) {
		event.preventDefault();
		var query = $('#search-input').val();
		state.set('query', query);
		SearchAPI.find(
			'nodes', state.get('query'), 0, PAGE_SIZE, GraphAPI.nodeProperties,
			resultsHandler);
		state.set('currentPage', 1);
	}
});

Template.searchInterface.helpers({
	results: function () {return state.get('results');}
});

Template.searchResult.helpers({
	getTitle: function () {
		return (this.highlight && this.highlight.title) || this.title;
	}
});

Template.pagination.events({
	'click .page': function (event) {
		event.preventDefault();
		var pageNumber = Number($(event.target).html());
		SearchAPI.find(
			'nodes', state.get('query'), (pageNumber - 1)*PAGE_SIZE, PAGE_SIZE,
			GraphAPI.nodeProperties, resultsHandler);
		state.set('currentPage', pageNumber);
	}
});

Template.pagination.helpers({
	getPageRange: function () {
		try {
			var currentPage = state.get('currentPage');
			return _.range(
				getLowestPage(currentPage), getHighestPage(currentPage) + 1);
		}
		catch (exception) {
			return [];
		}
	},
	activeIfCurrentPage: function (pageNumber) {
		pageNumber = Number(pageNumber);
		return pageNumber === state.get('currentPage') ? 'active' : '';
	}
});

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
