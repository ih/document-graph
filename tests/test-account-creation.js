var SERVER = 'http://localhost:3000/';
casper.test.begin('Creating an account creates a group.', function suite(test) {
	casper.start(SERVER, function () {
		this.waitForSelector('#login-sign-in-link', function () {
			this.click('#login-sign-in-link');
		});
	});

	casper.then(function () {
		this.waitForSelector('#signup-link', function success() {
			this.log('sign up link showed up!');
		}, function error() {
			this.log('login menu never showed up', 'error');
		});

		// this.log('test complete', 'info');
	});

	casper.run(function () {
		test.done();
	});
});
