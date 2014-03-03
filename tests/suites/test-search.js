casper.test.begin('Finding both public and private', function suite(test) {
	waitForLogin(test, dummyUsers.A);

	casper.thenClick('.search-submit');

	casper.then(function () {
		this.waitForText(dummyNodes.privateNodeA.title, function success() {
			test.assertEval(function () {
				return $('.search-result').length === 2;
			});
			this.test.pass('private node found!');
		});
	});

	casper.run(function () {
		test.done();
	});
});
