/**
 * Editor gets exported and acts as the interface to the editor component
 *
 * TODO: move tag and privacy editor out into their own packages when it's
 * easy to access data from sub templates or even better create a
 * tags/privacy-ui package that has both editor and display
 */

// maybe this isn't needed...
var Editor = {
	initialize: function (mode, params) {
		console.log('initializing the editor');
	}
};

Template.editor.events({
	// make nodeData reactive for preview functionality
	'input .content': function (event, templateInstance) {
		templateInstance.data.node.set('content', event.target.value);
	},
	'input .title': function (event, templateInstance) {
		templateInstance.data.node.set('title', event.target.value);
	},
	'click .save': function (event, templateInstance) {
		// the keys property of a reactive dict is basically the plain dict
		var nodeData = templateInstance.data.node;
		var updatedNodeData = {
			_id: nodeData.get('_id'),
			content: templateInstance.$('textarea.content').val(),
			title: templateInstance.$('input.title').val()
		};
		GraphAPI.updateNode(updatedNodeData);

		updateReferencedObjects(
			nodeData.get('_id'), getTags(), TagsAPI.getTags, TagsAPI.createTag,
			GraphAPI.deleteTag);

		updateReferencedObjects(
			nodeData.get('_id'), getPermissions(),
			PermissionsAPI.getResourcePermissions,
			PermissionsAPI.createPermission,
			PermissionsAPI.deletePermission
		);

		SearchAPI.index('nodes', updatedNodeData);

		resetEditor(templateInstance);

		// TODO move these functions into their own packages when
		// privacy and tags become separate ui components
		function getPermissions() {
			// currently assumes nodes are private/public, eventually will add
			// non-public shareable
			var permissions = [{
				actorId: Meteor.userId(),
				actions: PermissionsAPI.ALL,
				resourceId: nodeData.get('_id')
			}];

			if ($('#privacy-editor').is(':checked')) {
				permissions = permissions.concat({
					actorId: GroupsAPI.combineGroupRole(
						'public', GroupsAPI.MEMBER),
					actions: PermissionsAPI.READ,
					resourceId: nodeData.get('_id')
				});
			}
			return permissions;
		}

		function getTags() {
			return _.map($('#myTags').tagit("assignedTags"), function (label) {
				return {objectId: nodeData.get('_id'), label: label};
			});
		}

		function updateReferencedObjects(
			nodeId, updatedObjects, getObjects, createObject, deleteObject) {
			var existingObjects = getObjects(nodeId);
			var objectsToCreate = _.difference(updatedObjects, existingObjects);
			_.each(objectsToCreate, function (newObject) {
				createObject(newObject);
			});

			var objectsToDelete = _.difference(existingObjects, updatedObjects);
			_.each(objectsToDelete, function (oldObject) {
				deleteObject(oldObject);
			});
		}
	}
});

Template.editor.created = function () {
	var templateInstance = this;
	templateInstance.data.node = Utility.makeReactive(
		templateInstance.data.node);
	templateInstance.links = new ReactiveVar();
	console.log('creating the editor with node ' + this.data.node.get('_id'));
	// TODO check for tags/node properties in data.node
	// if they are not present fetch them from mongo
	// this.node = this.data.node;

	if (!templateInstance.data.node.permissions) {
		templateInstance.data.node.permissions = PermissionsAPI.getResourcePermissions(
			templateInstance.data.node.nodeId);
	}
};

Template.editor.helpers({
	nodeContent: function () {
		return Template.instance().data.node.get('content');
	},
	nodeTitle: function () {
		return Template.instance().data.node.get('title');
	},
	renderContent: function () {
		var templateInstance = Template.instance();

		console.log('rendering editor preview content');
		var links = templateInstance.links.get();
		var content = templateInstance.data.node.get('content');
		if (links && content) {
			var newContent = SelectionRendering.addSelections(content, links);
			return newContent;
		}
		else {
			return templateInstance.data.node.get('content');
		}
	}
});

Template.editor.rendered = function () {
	var templateInstance = this;
	templateInstance.$('textarea').autogrow();
	templateInstance.$('#privacy-editor').bootstrapSwitch();

	Tracker.autorun(function (computation) {
		console.log('setting links for editor');
		var links = GraphAPI.getNodeLinks(
			templateInstance.data.node.get('_id'), 'from');
		templateInstance.links.set(links);
	});

	templateInstance.$('#myTags').tagit();
	if (!isPublic(templateInstance.data.node.get('permissions'))) {
		templateInstance.$('#privacy-editor').bootstrapSwitch('setState', false);
	}
};

function isPublic(permissions) {
	return _.find(permissions, function (permission) {
		var publicGroupMember = GroupsAPI.combineGroupRole(
			'public', GroupsAPI.MEMBER);
		return permission.actorId ===  publicGroupMember &&
			_.contains(permission.actions, 'read');
	});
}

function resetEditor(templateInstance) {
	// used for resetting the title input, would be nice if there was two-way
	// binding...
	$('input').val('');

	_.each(GraphAPI.nodeProperties, function (nodeProperty) {
		// TODO figure out a better way to set the default value
		templateInstance.data.node.set(nodeProperty, '');
	});
	clearTags();
	console.log('cleared state');
}

function clearTags() {
	return $("#myTags").tagit("removeAll");
}
