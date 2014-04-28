/** If the key is a cell id then the value is that cell's state.
The cell state depends on whether the cell is a leaf cell or a cell that has
been divided.  For leaf cells the cell state has the following format
{
 content: {templateName: 'someTemplateName', context: {templateVar: varValue}},
 parentId: 'cellId'
}

For cells that contain a division the format is
{
 childIds: {cell1: 'cell1Id', cell2: 'cell2Id'},
 direction: 'horizontal/vertical',
 parentId: 'parentCellId'
}

Other keys in the state include
'focusedCellId'
*/
var state = new ReactiveDict();

var cellIdPrefix = 'cell';

function isLeafCell(cellState) {
	return !_.has(cellState, 'childIds');
}

function isInitialCell(cellState) {
	return _.keys(cellState).length === 1;
}

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
	/**
	 @param {string} direction - either 'vertical' or 'horizontal' indicates
	 whether the dividing line between the new cells runs vertically or
	 horizontally
	 @param {string} targetCellId- - the cell whose content should be two new
	 cells CURRENTLY MUST BE A "LEAF" CELL
	 */
	divideCell: function (
		direction, targetCellId, cell1Content, cell2Content) {
		console.log('diving the cell');
		if (targetCellId === undefined) {
			targetCellId = state.get('focusedCellId');
		}
		if (cell1Content === undefined) {
			cell1Content = state.get(targetCellId).content;
		}
		if (cell2Content === undefined) {
			cell2Content = state.get(targetCellId).content;
		}
		var cell1Id = _.uniqueId(cellIdPrefix);
		var cell2Id = _.uniqueId(cellIdPrefix);
		// add new cells to the state
		state.set(cell1Id, {
			content: cell1Content,
			parentId: targetCellId
		});
		state.set(cell2Id, {
			content: cell2Content,
			parentId: targetCellId
		});
		// change the contents for the target cell
		state.set(targetCellId, {
			childIds: {cell1: cell1Id, cell2: cell2Id},
			direction: direction,
			parentId: state.get(targetCellId).parentId
		});
		// update the focused cell
		state.changeFocus(cell2Id);
	},
	collapseFocusedCell: function () {

	}
};

Template.mondrian.rendered = function () {
};

Template.cell.rendered = function () {
	// initialization code for keeping track of different cells
	console.log('rendering a cell');
	var cellId = _.uniqueId(cellIdPrefix);
	var $cell =  $(this.find('.cell'));
	$cell.attr('id', cellId);

	if(!state.get('focusedCellId')) {
		state.set('focusedCellId', cellId);
		// special case since this is the first cell
		// otherwise don't change state in render code
		// TODO change to better default content
		state.set(cellId, {
			parentId: null,
			content: {templateName: 'text', context: {text: 'howdy'}}
		});
	}

	Deps.autorun(function renderCell() {
		console.log(
			'a change in content has occurred! running renderCell...' + cellId);
		var cellState = state.get(cellId);
		if (cellState === null) {
			console.log('collapsing the cell');
		}
		else if (isInitialCell(cellState)) {
			console.log('first cell rendered before content set');
		}
		else if (isLeafCell(cellState)) {
			console.log('change in the cell content for cell ' + cellId);
			renderAndInsert(cellState.content, $cell);
		}
		else {
			console.log('dividing the cell');
			$cell.empty();
			var child1State = state.get(cellState.childIds.cell1);
			var child2State = state.get(cellState.childIds.cell2);
			renderAndInsert(child1State.content, $cell);
			renderAndInsert(child2State.content, $cell);
		}
	});
	console.log(cellId);
};

function renderAndInsert(content, $domElement) {
	var template = Template[content.templateName];
	var componentInstance = UI.renderWithData(
		template, content.context);
	UI.insert(componentInstance, $domElement[0]);
}

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
