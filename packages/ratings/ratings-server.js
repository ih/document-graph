console.log('howdy in the ratings server');

Ratings = new Meteor.Collection('ratings');

Ratings.allow({
	insert: function (raterId, rating) {
		console.log('checking permission to insert into Ratings');
		console.log(
			PermissionsAPI.canRate(rating.ratedId, raterId));
		return PermissionsAPI.canRate(rating.ratedId, raterId) &&
			(rating.value === 1 || rating.value === -1) &&
			!Ratings.findOne({raterId: raterId, ratedId: rating.ratedId});
	},
	update: function (raterId, rating, fields, modifier) {
		console.log('checking permission to update');
		console.log(arguments);
		var newValue = modifier && modifier.$inc &&
				(modifier.$inc.value + rating.value);
		return PermissionsAPI.isAdminOf(rating.ratedId, raterId) ||
			_.contains([-1, 0, 1], newValue);
	}
});
Meteor.publish('ratingsForObject', function (objectId) {
	if (PermissionsAPI.canRead(objectId, this.userId)) {
		console.log('publishing ratings for object ' +  objectId);
		console.log(Ratings.find({'ratedId': objectId}).fetch());
		return Ratings.find({'ratedId': objectId});
	}
	else {
		return Ratings.find({'_id': null});
	}
});
