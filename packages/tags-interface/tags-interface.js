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
	},
	getChildLabels: function (nodeId) {
		var links = GraphAPI.getNodeLinks(nodeId, 'from');
		return _.uniq(_.flatten(_.map(links, function (link) {
			var childId = link.to;
			return _.pluck(TagsAPI.getTags(childId), 'label');
		})));
	}
};

Template.navbarActiveLabels.helpers({
	getActiveLabels: TagsInterface.getActiveLabels
});

// used with viewer/template that has an objectId
Template.labelsDisplay.helpers({
	getLabels: function () {
		var tags = TagsAPI.getTags(this.objectId);
		var childLabels = TagsInterface.getChildLabels(this.objectId);
		console.log('the child labels:' + JSON.stringify(childLabels));
		return _.uniq(_.pluck(tags, 'label').concat(childLabels));
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
