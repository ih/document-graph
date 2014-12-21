console.log('howdy in the ratings server');

Ratings = new Meteor.Collection('ratings');

Ratings.allow({
	insert: function (raterId, rating) {
		console.log('checking permission to insert into Ratings');
		console.log(
			PermissionsAPI.hasPermission(raterId, 'rate',rating.ratedId));
		return PermissionsAPI.hasPermission(raterId, 'rate',rating.ratedId) &&
			(rating.value === 1 || rating.value === -1) &&
			!Ratings.findOne({raterId: raterId, ratedId: rating.ratedId});
	},
	update: function (raterId, rating, fields, modifier) {
		console.log('checking permission to update');
		console.log(arguments);
		var newValue = modifier && modifier.$inc &&
				(modifier.$inc.value + rating.value);
		return PermissionsAPI.hasPermission(
			raterId, 'multiple-rate', rating.ratedId) ||
			_.contains([-1, 0, 1], newValue);
	},
	remove: function (userId, doc) {
		// TODO also let the rater delete their rating
		console.log('checking ' + userId + ' can remove rating ' + JSON.stringify(doc));
		return PermissionsAPI.hasPermission(userId, 'delete', doc.ratedId);
	}
});
Meteor.publish('ratingsForObject', function (objectId) {
	if (PermissionsAPI.hasPermission(this.userId, 'read', objectId)) {
		console.log('publishing ratings for object ' +  objectId);
		console.log(Ratings.find({'ratedId': objectId}).fetch());
		return Ratings.find({'ratedId': objectId});
	}
	else {
		return Ratings.find({'_id': null});
	}
});
