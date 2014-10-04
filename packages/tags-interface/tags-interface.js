TagsInterface = {
};

Template.tagsDisplay.getTags = function () {
	var tags = TagsAPI.getTags(this.objectId);
	return tags;
};
