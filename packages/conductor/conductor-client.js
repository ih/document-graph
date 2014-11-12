Template.registerHelper('count', function (countable) {
	return countable.length;
});

Template.layout.rendered = function () {
	// Editor.initialize('create');
};

console.log('in the conductor client ' + window.location.pathname);

// function route(currentPath) {
// 	var parameters = getParameters(currentPath, /\/node\/(.*$)/);
// 	if (parameters) {
// 		var targetNode = GraphAPI.getNode(this.params._id);
// 		Mondrian.setCellContent(
// 			{templateName: 'viewer', context: targetNode});
// 	}
// 	else {
// 		Mondrian.setCellContent({templateName: 'text', context: {text: 'hello'}});
// 	}
// }

// function getParameters(path, regex) {
// 	var match = path.match(regex);
// 	if (match) {
// 		return _.rest(match);
// 	}
// 	else {
// 		return null;
// 	}
// }

// route(window.location.pathname);
