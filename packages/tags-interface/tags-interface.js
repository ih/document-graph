/**
activeTags - tags currently selected and used as filters for different subsystems
state:
{
 activeTags: [tagId,... ]
}
**/
var state = new ReactiveDict();

state.set('activeTags', []);

TagsInterface = {
	getActiveTags: function () {
		return state.get('activeTags');
	}
};

Template.navbarActiveTags.helpers({
	getActiveTags: TagsInterface.getActiveTags
});

// used with viewer/template that has an objectId
Template.tagsDisplay.helpers({
	getTags: function () {
		var tags = TagsAPI.getTags(this.objectId);
		return tags;
	}
});

Template.tag.events({
	'click .tag': function (event, templateInstance) {
		var activeTags = state.get('activeTags');
		var tag = templateInstance.data;
		if (_.contains(_.pluck(activeTags, '_id'), tag._id)) {
			activeTags = _.reject(activeTags, function (activeTag) {
				return tag._id === activeTag._id;
			});
		}
		else {
			activeTags.push(tag);
		}
		state.set('activeTags', activeTags);
	}
});

Template.tag.helpers({
	active: function () {
		if (_.contains(_.pluck(state.get('activeTags'), '_id'), this._id)) {
			return 'active-tag';
		}
		else {
			return 'inactive-tag';
		}
	}
});
