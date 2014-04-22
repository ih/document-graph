// keeps track of the currently focused cell
// maybe keep the structure of the cell tree?
var state = new ReactiveDict();



Mondrian = {
	/** Creates data for the first cell
	 */
	initialize: function() {
		console.log('starting mondrian');
	},
	changeFocus: function (cellId) {
		state.set('focusedCellId', cellId);
	},
	setFocusedCellContent: function (newContent) {
		console.log('setting the currently focused cell\'s content');
		var focusedCellId = state.get('focusedCellId');
		if (focusedCellId === undefined) {
			console.error('no focused cell!');
			return false;
		}

		console.log('focused cell is ' + focusedCellId);
		state.set(focusedCellId, newContent);

		return true;
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
	Deps.autorun(function renderCell() {
		var cellContent = state.get(cellId);
		console.log('change in the cell content for cell ' + cellId);
		console.log(cellContent);
		cell.html(cellContent);
	});
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
