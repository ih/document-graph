var colorMap = new ReactiveDict();

SelectionRendering = {
  addSelections: function (content, links, currentSelection) {
    var borderDictionary = createBorderDictionary(links, currentSelection);
    var renderedContent = insertSelectionBorders(content, borderDictionary);
    renderedContent = addColors(_.pluck(links, 'to'), renderedContent);
    return renderedContent;
  },
  colorMap: colorMap
};


function createBorderDictionary(links, currentSelection) {
  var borderDictionary = {};
  // add selection as a "link" if it exists
  // if (currentSelection && currentSelection.selectedContent != '') {
  //    var fakeLink = {selection: currentSelection};
  //    fakeLink.to = 'selection-marker';
  //    links.push(fakeLink);
  // }
  _.each(links, function (link) {
    if (borderDictionary[link.selection.border.open] === undefined) {
      borderDictionary[link.selection.border.open] = {open : [],
                                                      close : []};
    }
    if (borderDictionary[link.selection.border.close] === undefined) {
      borderDictionary[link.selection.border.close] = {open : [],
                                                       close : []};
    }
    borderDictionary[link.selection.border.open]['open'].push(link.to);
    borderDictionary[link.selection.border.close]['close'].push(link.to);
  });

  if (currentSelection && currentSelection.selectedContent != '') {
    if (borderDictionary[currentSelection.border.open] === undefined) {
      borderDictionary[currentSelection.border.open] = {open : [],
                                                        close : []};
    }
    if (borderDictionary[currentSelection.border.close] === undefined) {
      borderDictionary[currentSelection.border.close] = {open : [],
                                                         close : []};
    }
    borderDictionary[currentSelection.border.open]['open'].push('selection-marker');
    borderDictionary[currentSelection.border.close]['close'].push('selection-marker');
  }

  return borderDictionary;
}

function insertSelectionBorders (content, borderDictionary) {
  var newContent = '';
  var openSelections = [];
  var openSpanCount = 0;
  /*
   Insert selection borders by iterating over content instead of selections
   since adding borders will change the length of the new content and
   make the selection border information incorrect
   */
  for (var index = 0; index <= content.length; index++ ) {
    var character = content[index];
    // selectionList => {open: [id,... ],close: [id,... ]}
    var selectionList = borderDictionary[index];
    if (selectionList) {
      // TODO refactor the create of the border tag lists
      // create the html tags that represent borders of a selection
      var borders = _.map(_.range(openSpanCount), function () {
        return '</span>';
      });
      _.map(selectionList['close'], function(selectionId) {
        openSelections = _.without(openSelections, selectionId);
      });

      if (selectionList['open'].length > 0 ||
          (borders.length > 0 && openSelections.length > 0)) {
        var selectionIds = borders.length > 0 ?
              selectionList['open'].concat(openSelections) :
              selectionList['open'];
        var openBorderElement = '<span class="selection-border ' +
              selectionIds.join(' ') + '">';
        borders.push(openBorderElement);
        openSelections = openSelections.concat(selectionList['open']);
        openSpanCount += 1;
      }

      // insert the closing border html elements before the open ones for
      // asthetics
      _.each(borders, function(span) {
        newContent += span;
      });
    }
    // don't try to add any characters after content is over
    if (index < content.length) {
      newContent += character;
    }
  }
  return newContent;
}

function addColors(nodeIds, renderedContent) {
  // nodeIds = _.without(nodeIds, 'selection-marker');
  var $wrapped = $('<div>'+renderedContent+'</div>');
  _.each(nodeIds, function (nodeId) {
    if (colorMap.get(nodeId) === undefined) {
      var newColor = Utility.randomContrastColor(true);
      colorMap.set(nodeId, newColor);
    }
    $wrapped.find('span.'+nodeId).css('background-color', colorMap.get(nodeId));
  });
  console.log('the color map:' + JSON.stringify(colorMap));
  return $wrapped.html();
}
