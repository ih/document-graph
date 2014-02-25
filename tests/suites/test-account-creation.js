casper.test.begin('Creating an account.', function suite(test) {
	casper.start(SERVER, function () {
		this.viewport(1200, 768);
		this.waitForSelector('#login-sign-in-link', function () {
			this.click('#login-sign-in-link');
		});
	});

	casper.then(function () {
		this.waitForSelector('#signup-link', function success() {
			this.click('#signup-link');
		});
	});

	casper.thenEvaluate(function (EMAIL, PASSWORD) {
		$('#login-email').val(EMAIL);
		$('#login-password').val(PASSWORD);

	}, EMAIL, PASSWORD);

	casper.thenClick('#login-buttons-password', function success() {
	});

	casper.then(function () {
		this.waitForSelector('#login-name-link', function success() {
			test.assertSelectorHasText('#login-name-link', EMAIL);
		});
	});

	casper.run(function () {
		test.done();
	});
});

