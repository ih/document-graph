console.log('in memberships server');

Memberships = new Meteor.Collection('memberships');

Memberships.allow({
  insert: function (userId, doc) {
    // TODO only allow members of the right role in a group
    // to create new memberships for that group
    return true;
  }
});

Meteor.publish('myMemberships', function () {
  var self = this;
  return Memberships.find({memberId: self.userId});
});
