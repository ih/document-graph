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
};

Template.tagsDisplay.getTags = function () {
	var tags = TagsAPI.getTags(this.objectId);
	return tags;
};

Template.tag.events({
	'click .tag': function (event, templateInstance) {
		var activeTags = state.get('activeTags');
		var tagId = templateInstance.data._id;
		if (_.contains(activeTags, tagId)) {
			activeTags = _.without(activeTags, tagId);
		}
		else {
			activeTags.push(tagId);
		}
		state.set('activeTags', activeTags);
	}
});

Template.tag.helpers({
	active: function () {
		if (_.contains(state.get('activeTags'), this._id)) {
			return 'active-tag';
		}
		else {
			return 'inactive-tag';
		}
	}
});
