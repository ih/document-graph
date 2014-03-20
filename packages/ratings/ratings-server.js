console.log('howdy in the ratings server');

Ratings = new Meteor.Collection('ratings');

Ratings.allow({
	insert: function (raterId, rating) {
		console.log('checking permission to insert into Ratings');
		console.log(PermissionsAPI.hasPermission('rate', rating.ratedId, raterId));
		return PermissionsAPI.hasPermission('rate', rating.ratedId, raterId);
	},
	update: function (raterId, rating, fields, modifier) {
		console.log('checking permission to update');
		console.log(arguments);
		return raterId === rating.raterId && _.isEqual(fields, ['value']) &&
			(_.isEqual(modifier, {$inc: {value: 1}}) ||
			 _.isEqual(modifier, {$inc: {value: -1}}));
	}
});
Meteor.publish('ratingsForObject', function (objectId) {
	if (PermissionsAPI.hasPermission('read', objectId, this.userId)) {
		console.log('publishing ratings for object ' +  objectId);
		console.log(Ratings.find({'ratedId': objectId}).fetch());
		return Ratings.find({'ratedId': objectId});
	}
	else {
		return Ratings.find({'_id': null});
	}
});
