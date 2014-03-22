
// assumes logged in from test-account-creation.js
casper.test.begin('Creating a public node', function suite(test) {
	waitForLogin(test, dummyUsers.A);

	casper.thenEvaluate(function (nodeData) {
		// setting the values through jquery do not trigger the event handlers

		$('.editor input.title').val(nodeData.title);
		$('.editor input.title').trigger('input');
		$('.editor textarea.content').val(nodeData.content);
		$('.editor textarea.content').trigger('input');
	}, dummyNodes.publicNodeA);

	casper.thenClick('.editor button.save', function success() {

		this.test.pass('created node!');
	});
	casper.run(function () {
		test.done();
	});
});


casper.test.begin('Creating a private node', function suite(test) {
	waitForLogin(test, dummyUsers.A);

	casper.thenEvaluate(function (nodeData) {
		// setting the values through jquery do not trigger the event handlers
		$('.editor input.title').val(nodeData.title);
		$('.editor input.title').trigger('input');
		$('.editor textarea.content').val(nodeData.content);
		$('.editor textarea.content').trigger('input');
		$('#privacy-editor').click();
	}, dummyNodes.privateNodeA);

	casper.thenClick('.editor button.save', function success() {

		this.test.pass('created node!');
	});
	casper.run(function () {
		test.done();
	});
});
