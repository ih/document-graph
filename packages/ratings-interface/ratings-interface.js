var state = new ReactiveDict();

RatingsInterface = {
	initialize: function () {
		console.log('initializing rating interface');
	}
};

Template.ratingsInterface.rendered = function () {
	console.log('rating interface rendered');
	console.log(this.data);
};

Template.ratingsInterface.events({
	'click .rating-good': function (event, template) {
		RatingsAPI.assignRating(template.data, 1);
	},
	'click .rating-bad': function (event, template) {
		RatingsAPI.assignRating(template.data, -1);
	}
});

Template.ratingsInterface.getCommunityRating = function () {
	return RatingsAPI.getCommunityRating(this.data);
};
