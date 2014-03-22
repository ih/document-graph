casper.test.begin('Finding both public and private', function suite(test) {
	waitForLogin(test, dummyUsers.A);
	casper.thenClick('.search-submit');
	casper.then(function () {
		this.waitFor(function () {
			return this.evaluate(function () {
				var results =  $('.search-result');
				if (results.length < 2) {
					$('.search-submit').click();
				}
				return results.length === 2;
			});
		}, function success() {
			this.test.pass('public and private node found!');
		}, function fail() {
			this.capture('searchnotfound.png');
			this.test.fail('did not get 2 search results!');
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
		this.waitFor(function () {
			return this.evaluate(function () {
				return $('.search-result').length > 1;
			});
		}, function success() {
			this.test.fail('public and private node found for wrong user!');
		}, function fail() {
			this.test.pass('only public found!');
			test.assertTextExists(dummyNodes.publicNodeA.title);
		});
	});
	casper.run(function () {
		test.done();
	});
});
