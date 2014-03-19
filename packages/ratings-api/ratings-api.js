RatingsAPI = {
	assignRating: function (objectId, value, assignerId) {
		if (assignerId === undefined) {
			assignerId = Meteor.userId();
		}
		console.log(assignerId + ' assigning value ' + value + ' to object ' + objectId);
	},
	getCommunityRating: function (objectId) {
		return 2;
	}
};
