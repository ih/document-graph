Viewer = {
	initialize: function () {
		console.log('initialize the viewer');
	}
};

Template.viewer.rendered = function () {
	console.log('viewer rendered');
	console.log(this);
};

Template.viewer.getId = function () {
	return this._id;
};
