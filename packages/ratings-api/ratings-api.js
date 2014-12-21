RatingsAPI = {
	ratingProperties: ['value', 'raterId', 'ratedId'],
	deleteRating: function (ratingData) {
		console.log('removing rating:' + JSON.stringify(ratingData));
		var targetRating = Ratings.findOne(ratingData);
		return Ratings.remove(targetRating._id);
	},
	getCommunityRating: function (ratedId) {
		console.log('getting community rating for ' + ratedId);
		Meteor.subscribe('ratingsForObject', ratedId);
		var ratings = Ratings.find({'ratedId': ratedId}).fetch();
		return _.reduce(ratings, function (memo, rating){
			return memo + rating.value;
		}, 0);
	},
	getRatings: function (ratedId) {
		Meteor.subscribe('ratingsForObject', ratedId);
		return Ratings.find({'ratedId': ratedId}).fetch();
	},
	incrementRating: function (ratedId, valueChange, raterId) {
		if (raterId === undefined) {
			raterId = Meteor.userId();
		}
		console.log(raterId + ' changing value ' + valueChange + ' to object ' + ratedId);
		// assumes subscription already exists, maybe should not
		var rating = Ratings.findOne({'raterId': raterId});
		if (rating) {
			Ratings.update(rating._id, {$inc: {value: valueChange}});
			console.log('incrementing a rating');
			console.log(Ratings.findOne(rating._id));
		}
		else {
			console.log('inserting a rating... ');
			Ratings.insert({value: valueChange, raterId: raterId, ratedId: ratedId});
			console.log(Ratings.findOne());
		}
	}
};
