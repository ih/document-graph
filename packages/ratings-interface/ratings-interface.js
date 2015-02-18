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
    RatingsAPI.incrementRating(template.data.objectId, 1);
  },
  'click .rating-bad': function (event, template) {
    RatingsAPI.incrementRating(template.data.objectId, -1);
  }
});

Template.ratingsInterface.getCommunityRating = function () {
  console.log('getting community rating for interface');
  return RatingsAPI.getCommunityRating(this.objectId);
};
