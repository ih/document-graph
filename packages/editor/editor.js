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
	// 'input .content': function (event, templateInstance) {
	// 	templateInstance.data.node.nodeContent = event.target.value;
	// },
	// 'input .title': function (event, templateInstance) {
	// 	templateInstance.data.node.title = event.target.value;
	// },
	'click .save': function (event, templateInstance) {
		// the keys property of a reactive dict is basically the plain dict
		var nodeData = templateInstance.data.node;
		var updatedNodeData = {
			_id: nodeData._id,
			content: templateInstance.$('textarea.content').val(),
			title: templateInstance.$('input.title').val()
		};
		GraphAPI.updateNode(updatedNodeData);

		updateReferencedObjects(
			nodeData._id, getTags(), TagsAPI.getTags, TagsAPI.createTag,
			GraphAPI.deleteTag);

		updateReferencedObjects(
			nodeData._id, getPermissions(),
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
				resourceId: nodeData._id
			}];

			if ($('#privacy-editor').is(':checked')) {
				permissions = permissions.concat({
					actorId: GroupsAPI.combineGroupRole(
						'public', GroupsAPI.MEMBER),
					actions: PermissionsAPI.READ,
					resourceId: nodeData._id
				});
			}
			return permissions;
		}

		function getTags() {
			return _.map($('#myTags').tagit("assignedTags"), function (label) {
				return {objectId: nodeData._id, label: label};
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
	console.log('creating the editor with node ' + this.data.node._id);
	// TODO check for tags/node properties in data.node
	// if they are not present fetch them from mongo
	// this.node = this.data.node;
	if (!this.data.node.permissions) {
		this.data.node.permissions = PermissionsAPI.getResourcePermissions(
			this.data.node.nodeId);
	}
	this.links = new ReactiveVar();
};

Template.editor.helpers({
	renderContent: function () {
		var templateInstance = Template.instance();

		console.log('rendering editor preview content');
		var links = templateInstance.links.get();
		if (links) {
			var newContent = SelectionRendering.addSelections(
				templateInstance.data.node.content, links);
			return newContent;
		}
		else {
			return templateInstance.data.node.content;
		}

	}
});

Template.editor.rendered = function () {
	this.$('textarea').autogrow();
	this.$('#privacy-editor').bootstrapSwitch();

	this.$('#myTags').tagit();
	if (!isPublic(this.data.node.permissions)) {
		this.$('#privacy-editor').bootstrapSwitch('setState', false);
	}
	var templateInstance = this;

	Tracker.autorun(function (computation) {
		console.log('setting links for editor');
		var links = GraphAPI.getNodeLinks(templateInstance.data.node._id, 'from');
		templateInstance.links.set(links);
	});
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
		templateInstance.data.node[nodeProperty] = '';
	});
	clearTags();
	console.log('cleared state');
}

function clearTags() {
	return $("#myTags").tagit("removeAll");
}
