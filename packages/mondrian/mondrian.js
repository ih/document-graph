/** If the key is a cell id then the value is that cell's state.
The cell state depends on whether the cell is a leaf cell or a cell that has
been divided.  For leaf cells the cell state has the following format
{
 content: {templateName: 'someTemplateName', context: {templateVar: varValue}},
 parentId: 'cellId'
 siblingId: 'siblingId'
}

For cells that contain a division the format is
{
 childIds: {cell1: 'cell1Id', cell2: 'cell2Id'},
 direction: 'horizontal/vertical/auto(undefined)',
 parentId: 'parentCellId',
 siblingId: 'siblingId'
}

Other keys in the state include
'focusedCellId'
where the value is the cell id that corresponds to the currently active cell.
*/
var state = new ReactiveDict();

var cellIdPrefix = 'cell';

function isLeafCell(cellState) {
	return !_.has(cellState, 'childIds');
}

function isRootCell(cellState) {
	return cellState.parentId === null;
}

Template.cell.helpers({
	focus: function () {
		if (this.cellId === state.get('focusedCellId')) {
			return 'focused';
		}
		else {
			return '';
		}
	},
	direction: function () {
		var cellId = Template.instance().data.cellId;
		var cellState = state.get(cellId);
		if (!cellState) {
			console.log(
				cellId + ' has no cell state. Cannot determine direction');
			return '';
		}
		if (cellState.parentId !== null) {
			if (state.get(cellState.parentId).direction === 'vertical') {
				return 'column-cell';
			}
			else {
				return 'row-cell';
			}
		}
		else {
			return 'root-cell';
		}
	},
	leaf:  function () {
		var cellId = Template.instance().data.cellId;
		var cellState = state.get(cellId);
		if (!cellState) {
			console.warn(cellId + ' has no cell state. Cannot determine leaf');
			return '';
		}
		if (!_.has(state.get(cellId), 'childIds')) {
			return 'leaf-cell';
		}
		else {
			return '';
		}
	}
});

Mondrian = {
	changeFocus: function (cellId) {
		state.set('focusedCellId', cellId);
	},
	/**
	 @param {string} targetCellId - the cell that should be removed and have its
	 parent replaced with its sibling TARGET CELL MUST BE A NONROOT LEAF
	 */
	collapseCell: function (targetCellId) {
		if (targetCellId === undefined) {
			targetCellId = state.get('focusedCellId');
		}
		var cellState = state.get(targetCellId);
		if (isRootCell(cellState)) {
			console.log('cannot collapse the root cell');
			Mondrian.setCellContent(
				{templateName: 'text', context: {text: 'howdy'}});
			return false;
		}
		if (!isLeafCell(cellState)) {
			console.error('trying to collapse non-leaf cell');
			return false;
		}

		var parentState = state.get(cellState.parentId);
		var siblingState = state.get(cellState.siblingId);

		// prepare siblingState to replace the parent cell
		if (siblingState.childIds) {
			_.each(_.keys(siblingState.childIds), function (childIndex) {
				var childId = siblingState.childIds[childIndex];
				var childState = state.get(childId);
				childState.parentId = cellState.parentId;
				state.set(childId, childState);
			});
		}

		siblingState.parentId = parentState.parentId;
		siblingState.siblingId = parentState.siblingId;
		state.set(cellState.siblingId, null);
		state.set(targetCellId, null);
		state.set(cellState.parentId, siblingState);

		if (state.get('focusedCellId') === targetCellId || isLeafCell(siblingState)) {
			Mondrian.changeFocus(cellState.parentId);
		}
		// TODO how to remove cell ids from state?
		return true;
	},
	/**
	 @param {string} direction - either 'vertical' or 'horizontal' indicates
	 whether the dividing line between the new cells runs vertically or
	 horizontally TODO if not passed make this the direction that is larger
	 @param {string} targetCellId- - the cell whose content should be two new
	 cells CURRENTLY MUST BE A "LEAF" CELL
	 */
	divideCell: function (
		direction, targetCellId, cell1Content, cell2Content) {
		console.log('dividing the cell');
		// TODO assert targetCellId is a leaf
		if (targetCellId === undefined) {
			targetCellId = state.get('focusedCellId');
		}
		if (direction === 'auto' || direction === undefined) {
			var cellHeight = $('#' + targetCellId).height();
			var cellWidth = $('#' + targetCellId).width();
			direction =  cellHeight > cellWidth ?  'horizontal': 'vertical';
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
			parentId: targetCellId,
			siblingId: cell2Id
		});
		state.set(cell2Id, {
			content: cell2Content,
			parentId: targetCellId,
			siblingId: cell1Id
		});
		// change the contents for the target cell
		state.set(targetCellId, {
			childIds: {cell1: cell1Id, cell2: cell2Id},
			direction: direction,
			parentId: state.get(targetCellId).parentId,
			siblingId: state.get(targetCellId).siblingId
		});
		// update the focused cell
		Mondrian.changeFocus(cell2Id);
	},
	getFocusedCellContent: function () {
		console.log('focused cell is ' + state.get('focusedCellId'));
		if (state.get('focusedCellId')) {
			return state.get(state.get('focusedCellId')).content;
		}
		else {
			return null;
		}
	},
	getFocusedCellNodeId: function () {
		var cellContent = Mondrian.getFocusedCellContent();
		console.log('cell content ' + JSON.stringify(cellContent));
		if (cellContent && _.has(cellContent.context, '_id')) {
			return cellContent.context._id;
		}
		else if (cellContent && cellContent.templateName === 'Editor') {
			return cellContent.context.node._id;
		}
		else {
			return null;
		}
	},
	getAllCellNodeIds: function () {
		var cellIds = _.filter(_.keys(state.keys), function (stateKey) {
			return stateKey.indexOf(cellIdPrefix) === 0;
		});
		return _.compact(_.map(cellIds, function (cellId) {
			var cellState = state.get(cellId);
			var cellContent = cellState && cellState.content;
			if (cellContent &&  _.has(cellContent.context, '_id')) {
				return cellContent.context._id;
			}
			else {
				return null;
			}
		}));
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

		if (newContent.templateName === 'viewer') {
			analytics.track('Viewed Document', {
				nodeId: newContent.context._id,
				title: newContent.context.title
			});
		}

		return true;
	}
};

/** Initialize and insert the first cell.
 */
Template.mondrian.created = function () {
	console.log('creating mondrian');
};

Template.mondrian.rendered = function () {
	console.log('rendering mondrian');
	var $mondrian = $(this.find('#mondrian'));
	var cellId = _.uniqueId(cellIdPrefix);
	state.set('focusedCellId', cellId);

	state.set(cellId, {
		parentId: null,
		content: {templateName: 'text', context: {text: 'howdy'}},
		siblingId: null
	});

	renderAndInsert(
		{templateName: 'cell', context: {cellId: cellId}}, $mondrian);
};

Template.cell.rendered = function () {
	// initialization code for keeping track of different cells
	console.log('rendering a cell');
	var $cell =  $(this.find('.cell'));
	var $cellContent = $(this.find('.cell-content'));
	var cellId = $cell.attr('id');

	Deps.autorun(function renderCell() {
		console.log(
			'a change in content has occurred! running renderCell...' + cellId);
		var cellState = state.get(cellId);
		if (cellState === null) {
			console.log('collapsing the cell');
			$cell.remove();
		}
		else if (isLeafCell(cellState)) {
			console.log('change in the cell content for cell ' + cellId);
			$cellContent.empty();
			renderAndInsert(cellState.content, $cellContent);
		}
		else {
			console.log('dividing the cell');
			$cellContent.empty();
			var cell1Id = cellState.childIds.cell1;
			var cell2Id = cellState.childIds.cell2;
			renderAndInsert({
				templateName: 'cell', context: {cellId: cell1Id}}, $cellContent);
			renderAndInsert({
				templateName: 'cell', context: {cellId: cell2Id}}, $cellContent);
		}
	});
	console.log(cellId);
};

function renderAndInsert(content, $domElement) {
	var template = Template[content.templateName];
	Blaze.renderWithData(template, content.context, $domElement[0]);
}

Template.cell.events({
	'click': function (event, template) {
		event.stopPropagation();
		Mondrian.changeFocus(template.data.cellId);
	},
	'click .divide-horizontal, click .glyphicon-resize-vertical': function (event,  template) {
		console.log('horizontal splits');
		event.stopPropagation();
		Mondrian.divideCell('horizontal', template.data.cellId);
	},
	'click .divide-vertical, click .glyphicon-resize-horizontal': function (event,  template) {
		console.log('vertical splits');
		event.stopPropagation();
		Mondrian.divideCell('vertical', template.data.cellId);
	},
	'click .collapse-cell, click .collapse-cell span': function (event,  template) {
		console.log('collapse');
		event.stopPropagation();
		Mondrian.collapseCell(template.data.cellId);
	}
});

Template.cell.isLeaf = function () {
	var cellId = Template.instance().data.cellId;
	var cellState = state.get(cellId);
	if (!cellState) {
		console.warn(cellId + ' does not have a state.  Cannot call isLeaf');
		return null;
	}
	return isLeafCell(cellState);
};


