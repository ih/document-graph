console.log('Tags server side');
Tags = new Meteor.Collection('tags');

Tags.allow({
	insert:  function (userId, doc) {
		// TODO check permission to tag item before writing; add canTag to 
		// permissions api
		console.log('allowing an insert into the tags collection');
		return true;
	}
});
