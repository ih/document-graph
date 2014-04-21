// keeps track of the currently focused cell
// maybe keep the structure of the cell tree?
var state = new ReactiveDict();



Mondrian = {
	/** Creates data for the first cell
	 */
	initialize: function() {
		console.log('starting mondrian');
	},
	setFocusedCellContent: function (template, context) {
		console.log('setting the currently focused cell\'s content');
		var focusedCellId = state.get('focusedCellId');
		if (focusedCellId) {
			console.log('focused cell is ' + focusedCellId);
			state.set(focusedCellId, 'blah');
		}
		else {
			console.log('there is no focused cell yet!');
		}
	},
	divideCell: function(direction, context) {
	}
};

Template.mondrian.rendered = function () {
	// create the first cell
};

Template.cell.rendered = function () {
	// initialization code for keeping track of different cells
	console.log('rendering a cell');
	var cellId = _.uniqueId('cell');
	var cell =  $(this.find('.cell'));
	cell.attr('id', cellId);
	if(!state.get('focusedCellId')) {
		state.set('focusedCellId', cellId);
	}
	// Deps.autorun(function renderCells() {
	// 	focusedCell = state.get(cellId);
	// });
	console.log(cellId);
};

Template.cell.events({
	'click .divide-horizontal': function (event,  template) {
		console.log('horizontal splitsaa');
		var cell = template.find('.cell');
		$(cell).empty();
		var newCell1 = UI.render(Template.mondrian);
		var newCell2 = UI.render(Template.mondrian);
		UI.insert(newCell1, cell);
		UI.insert(newCell2, cell);
	},
	'click .kill': function (event,  template) {
		console.log('collapse');
		var cell = template.find('.cell');
		$(cell).remove();
	}
});
