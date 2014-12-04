/**
activeLabels - tags currently selected and used as filters for different subsystems
state:
{
 activeLabels: [tagId,... ]
}
**/
var state = new ReactiveDict();

state.set('activeLabels', []);

TagsInterface = {
	getActiveLabels: function () {
		return state.get('activeLabels');
	}
};

Template.navbarActiveLabels.helpers({
	getActiveLabels: TagsInterface.getActiveLabels
});

// used with viewer/template that has an objectId
Template.labelsDisplay.helpers({
	getLabels: function () {
		var tags = TagsAPI.getTags(this.objectId);
		return _.pluck(tags, 'label');
	}
});

Template.label.events({
	'click .tag-label': function (event, templateInstance) {
		var activeLabels = state.get('activeLabels');
		var label = templateInstance.data;
		if (_.contains(activeLabels, label)) {
			activeLabels = _.without(activeLabels, label);
		}
		else {
			activeLabels.push(label);
		}
		state.set('activeLabels', activeLabels);
	}
});

Template.label.helpers({
	active: function () {
		if (_.contains(state.get('activeLabels'), Template.instance().data)) {
			return 'active-label';
		}
		else {
			return 'inactive-label';
		}
	}
});
