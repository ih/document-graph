casper.test.begin('Finding both public and private', function suite(test) {
	waitForLogin(test, dummyUsers.A);
	casper.thenClick('.search-submit');
	casper.then(function () {
		this.waitFor(function () {
			return this.evaluate(function () {
				var results =  $('.search-result');
				if (results.length < 3) {
					$('.search-submit').click();
				}
				return results.length === 4;
			});
		}, function success() {
			this.test.pass('public and private node found!');
		}, function fail() {
			this.capture('searchnotfound.png');
			this.test.fail('did not get 4 search results!');
		});
	});

	casper.run(function () {
		test.done();
	});
});

casper.test.begin('Finding only public nodes', function suite(test) {
	waitForLogin(test, dummyUsers.A);
	logout();
	login(test, dummyUsers.B);
	casper.thenClick('.search-submit');
	casper.then(function () {
		this.waitUntilVisible('.search-result', function () {
			test.assertElementCount('.search-result', 3);
			test.assertSelectorDoesntHaveText('.search-result', 'private');
		});
	});
	casper.run(function () {
		test.done();
	});
});
