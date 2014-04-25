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
	/** 
	 @param {object} newContent - consists of a template name and the
	 context data for that template
	 e.g. {templateName: 'foobar', context: {foo: 'bar'}}
	 @params {string} targetCellId - the cell whose content should be changed
	 CURRENTLY MUST BE A "LEAF" CELL
	 */
	setCellContent: function (newContent, targetCellId) {
		// it'd be nice to store the component instance, but reactive dicts
		// only hold EJON, which only allows data to be stored and not
		// functions
		console.log('setting the currently focused cell\'s content');
		if (targetCellId === undefined) {
			targetCellId = state.get('focusedCellId');
		}
		// TODO assert targetCell is a leaf cell 
		if (targetCellId === undefined) {
			console.error('no focused cell!');
			return false;
		}

		console.log('target cell is ' + targetCellId);
		// TODO add a method to ReactiveDict for setting a property directly
		var cellState = state.get(targetCellId);
		cellState['content'] = newContent;
		state.set(targetCellId, cellState);

		return true;
	},
	divideFocusedCell: function (direction, newCellContent) {
		// create two cells here then set the content of the focused cell
		// to be the new cells
	},
	collapseFocusedCell: function () {

	}
};

Template.mondrian.rendered = function () {
};

Template.cell.rendered = function () {
	// initialization code for keeping track of different cells
	console.log('rendering a cell');
	var cellId = _.uniqueId('cell');
	var $cell =  $(this.find('.cell'));
	$cell.attr('id', cellId);
	// state.set(cellId, {parent: null});

	if(!state.get('focusedCellId')) {
		state.set('focusedCellId', cellId);
		// special case since this is the first cell
		// otherwise don't change state in render code
		state.set(cellId, {parent: null});
	}

	Deps.autorun(function renderCell() {
		console.log(
			'a change in content has occurred! running renderCell...' + cellId);
		var cellState = state.get(cellId);
		if (!_.has(cellState, 'content')) {
			console.log('first cell rendered before content set');
			return false;
		}
		else {
			console.log('change in the cell content for cell ' + cellId);
			var newContent = cellState.content;
			var template = Template[newContent.templateName];
			var componentInstance = UI.renderWithData(
				template, newContent.context);
			UI.insert(componentInstance, $cell[0]);
			return true;
		}
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
