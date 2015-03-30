var readTourSteps = [{
  target: ".divide-vertical",
  title: "Manage windows",
  content: "Create new windows or close existing ones using these buttons.  Hover over for specifics on each one.",
  placement: 'bottom'
}, {
  target: ".selection-border:first",
  title: "Links",
  content: "You can click these colored parts of the text to see previews of other memos that are related to this text. <b>Go ahead and click this one now.</b>",
  placement: 'top'
}, {
  target: ".node-preview",
  title: "Memo Previews",
  content: "This is a preview to another memo that relates to the text with the same color.",
  placement: 'left'
},{
  target: ".open-new-pane",
  title: "Open memo",
  content: "Click this button to open the memo in a new window. Otherwise click the other button to open the memo in the existing window.  <b>Go ahead and click one of them now.</b>",
  placement: 'left'
}, {
  target: ".glyphicon-arrow-left",
  title: "Back to the previous memo",
  content: "Click this button to view the memos that link to the current one.  You can use this to get back to the previous memo <b>Don't use the back button</b> since that will take you away from the site.",
  placement: 'right'
}, {
  target: ".tag-label:first",
  title: "Tags",
  content: "Tags appear for both the current memo and all the memos corresponding to the links.  You can filter links to documents with a particular tag by clicking on that tag.  Tags that have been clicked are active and displayed at the top of the screen.  To deactivate a tag click it again.",
  placement: 'bottom'
}, {
  target: ".search-submit",
  title: "Search for memos",
  content: "You can find publicly shared memos using this search box.  If there are active tags, search is limited to memos that have these tags.",
  placement: 'bottom'
}];
// add steps for what tags do


var writeTourSteps = [{
  target: '.content-viewer',
  title: 'Highlight text',
  content: 'Highlighting text allows you to create a link either to a new memo or existing one.  Go ahead and <b>highlight some text with your mouse.</b>',
  placement: 'top'
}, {
  target: '.create-linked-node',
  title: 'Create memo',
  content: 'Click this button to create a memo linked to the highlighted text.  The other button for linking to an existing memo has it\'s own instructions when clicked. <b>Click the button for creating a linked memo now.</b>',
  placement: 'bottom'
}, {
  target: '.editor',
  title: 'Edit memo',
  content: 'Enter the title, content, and add tags here.</b>',
  placement: 'left'
}, {
  target: '.privacy-editor-container',
  title: 'Set visibility',
  content: 'Set this switch to public to allow anyone to find and view this memo.  Setting it to private means only you can find and view it. ',
  placement: 'left'
}, {
  target: '.save',
  title: 'Save',
  content: 'Now click save to create the Memo!',
  placement: 'left'
}, {
  target: '.link-existing-node',
  title: 'Link to existing memo',
  content: 'You could also have linked to an existing memo by clicking this button',
  placement: 'bottom'
}, {
  target: '.create-node',
  title: 'New memo',
  content: 'Or created a new memo by clicking this button.',
  placement: 'bottom'
}];

var anonymousTour = {
  id: 'anonymous-tour',
  showPrevButton: true,
  nextOnTargetClick: true,
  steps: readTourSteps.concat([{
    target: '#login-dropdown-list',
    title: 'Create an account',
    content: 'Make an account to create and share your own memos!',
    placement: 'left'
  }])};

var writeTour = {
  id: 'write-tour',
  showPrevButton: true,
  nextOnTargetClick: true,
  steps: writeTourSteps
};

var completeTour = {
  id: 'complete-tour',
  showPrevButton: true,
  nextOnTargetClick: true,
  steps: readTourSteps.concat(writeTourSteps)
};

var tours = {
  anonymousTour: anonymousTour,
  writeTour: writeTour,
  completeTour: completeTour
};

ProductTour = {
  ANONYMOUS: 'anonymousTour',
  WRITE: 'writeTour',
  COMPLETE: 'completeTour',
  startTour: function (tourName, alwaysStart) {
    if (!localStorage[tourName] || alwaysStart) {
      hopscotch.startTour(tours[tourName]);
      localStorage[tourName] = true;
    }
  }
};
