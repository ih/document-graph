var SERVER = 'http://localhost:3000/';
var EMAIL = 'a@a.a';
var PASSWORD = 'aaaaaa';
var DIMENSIONS = {'width': 1200, 'height': 768, 'top': 0, 'left': 0};


// assumes logged in from test-account-creation.js
casper.test.begin('Creating a public node', function suite(test) {
	casper.start(SERVER, function () {
		this.viewport(1200, 768);
		this.waitForSelector('#login-name-link', function success() {
			test.assertSelectorHasText('#login-name-link', EMAIL);
		});
		this.reload(function() {
			// remove this when meteor ui comes out and is integrated with 
			// accounts
			this.echo("loaded again");
		});
		this.waitForSelector('#login-name-link', function success() {
			test.assertSelectorHasText('#login-name-link', EMAIL);
		});
	});

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
	casper.start(SERVER, function () {
		this.viewport(1200, 768);
		this.waitForSelector('#login-name-link', function success() {
			test.assertSelectorHasText('#login-name-link', EMAIL);
		});
		this.reload(function() {
			// remove this when meteor ui comes out and is integrated with 
			// accounts
			this.echo("loaded again");
		});
		this.waitForSelector('#login-name-link', function success() {
			test.assertSelectorHasText('#login-name-link', EMAIL);
		});
	});

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
