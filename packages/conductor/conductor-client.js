Router.map(function() {
	this.route('viewer', {
		path: '/node/:_id',
		data: function () {
			return GraphAPI.getNode(this.params._id);}});
	this.route('dewer', {path: '/test'});
});

Template.conductor.rendered = function () {
	Editor.initialize('create');
};


