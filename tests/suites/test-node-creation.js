
// assumes logged in from test-account-creation.js
casper.test.begin('Creating a public node', function suite(test) {
	waitForLogin(test);

	casper.thenEvaluate(function () {
		// setting the values through jquery do not trigger the event handlers
		$('.editor input.title').val('first public node title');
		$('.editor input.title').trigger('input');
		$('.editor textarea.content').val('content for first public node');
		$('.editor textarea.content').trigger('input');
	});

	casper.thenClick('.editor button.save', function success() {

		this.test.pass('created node!');
	});
	casper.run(function () {
		test.done();
	});
});


casper.test.begin('Creating a private node', function suite(test) {
	waitForLogin(test);

	casper.thenEvaluate(function () {
		// setting the values through jquery do not trigger the event handlers
		$('.editor input.title').val('first private node title');
		$('.editor input.title').trigger('input');
		$('.editor textarea.content').val('content for first private node');
		$('.editor textarea.content').trigger('input');
		$('#privacy-editor').click();
	});

	casper.thenClick('.editor button.save', function success() {

		this.test.pass('created node!');
	});
	casper.run(function () {
		test.done();
	});
});
