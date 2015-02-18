Meteor.publish('myGroups', function () {
  var self = this;
  var myMemberships = Memberships.find({memberId: self.userId}).fetch();
  console.log('publishing groups');
  return Groups.find({_id: {$in: _.pluck(myMemberships, 'groupId')}});
});
