
// assumes logged in from test-account-creation.js
casper.test.begin('Creating a public node', function suite(test) {
	waitForLogin(test, dummyUsers.A);

	createNode(dummyNodes.publicNodeA, false, []);

	casper.run(function () {
		test.done();
	});
});


casper.test.begin('Creating a private node', function suite(test) {
	waitForLogin(test, dummyUsers.A);

	createNode(dummyNodes.privateNodeA, true, []);
	casper.run(function () {
		test.done();
	});
});

casper.test.begin('Creating tagged node', function suite(test) {
	waitForLogin(test, dummyUsers.A);

	createNode(dummyNodes.publicTaggedNodeA, false, ['tag1', 'tag2']);
	casper.run(function () {
		test.done();
	});
});

function createNode(nodeData, isPrivate, tags) {
	casper.thenEvaluate(function (nodeData, isPrivate, tags) {
		// setting the values through jquery do not trigger the event handlers
		$('.editor input.title').val(nodeData.title);
		$('.editor input.title').trigger('input');
		$('.editor textarea.content').val(nodeData.content);
		$('.editor textarea.content').trigger('input');
		if (isPrivate) {
			$('#privacy-editor').click();
		}
		if (tags) {
			$('#myTags').val(tags.join());
		}
	}, nodeData, isPrivate, tags);

	casper.thenClick('.editor button.save', function success() {

		this.test.pass('created node!');
	});
}
