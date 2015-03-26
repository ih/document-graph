var readTourSteps = [{
  element: ".search-submit",
  title: "Search for memos",
  content: "You can find publicly shared memos using this search box"
}, {
  element: ".toggle-selections",
  title: "Toggle the links",
  content: "You can show/hide links by clicking this button"
}, {
  element: ".divide-vertical",
  title: "Manage windows",
  content: "Create new windows or close existing ones using these buttons.  Hover over for specifics on each one.",
  placement: 'bottom'
}, {
  element: ".selection-border",
  title: "Links",
  content: "You can click these colored parts of the text to see previews of other memos that are related to this text. <b>Go ahead and click this one now.</b>",
  placement: 'top'
}, {
  element: ".node-preview",
  title: "Memo Previews",
  content: "This is a preview to another memo that relates to the text with the same color.",
  placement: 'left'
},{
  element: ".open-new-pane",
  title: "Open memo",
  content: "Click this button to open the memo in a new window. Otherwise click the other button to open the memo in the existing window.  <b>Go ahead and click one of them now.</b>",
  placement: 'left'
}, {
  element: ".glyphicon-arrow-left",
  title: "Back to the previous memo",
  content: "Click this button to view the memos that link to the current one.  You can use this to get back to the previous memo <b>Don't use the back button</b> since that will take you away from the site.",
  placement: 'right'
}];

var anonymousTour = new Tour({steps: readTourSteps});

ProductTour = {
  startAnonymousTour: function () {
    anonymousTour.init();
    anonymousTour.start();
  },
  restartAnonymousTour: function () {
    anonymousTour.restart();
  }
};
