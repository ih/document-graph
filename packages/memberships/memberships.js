Memberships = new Meteor.Collection('memberships');

Meteor.publish('myMemberships', function () {
	var self = this;
	return Memberships.find({memberId: self.userId});
});



