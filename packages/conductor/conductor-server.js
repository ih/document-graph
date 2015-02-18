Meteor.startup(function () {
  console.log('conducting!');

  //code to run on server at startup
  PermissionsAPI.initialize();
});
