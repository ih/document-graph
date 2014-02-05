var state = new ReactiveDict();

Template.searchInterface.events({
	'click .search-submit': function (event) {
		event.preventDefault();
		var query = $('#search-input').val();
		SearchAPI.find('nodes', query, function (error, results) {
			console.log('search results');
			console.log(error);
			console.log(results);
			state.set('results', results);
		});
	}
});

Template.searchInterface.rendered = function () {
	console.log('search interface rendered');
};

Template.searchInterface.helpers({
	results: function () {return state.get('results');}
});
