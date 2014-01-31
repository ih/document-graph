Groups = new Meteor.Collection('groups');

Meteor.publish('myGroups', function () {
	var self = this;
	var myMemberships = Memberships.find({memberId: self.userId}).fetch();
	return Groups.find({_id: {$in: myMemberships}});
});
