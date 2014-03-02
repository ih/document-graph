casper.test.begin('Finding both public and private', function suite(test) {
	waitForLogin(test);

	casper.thenClick('.search-submit');

	casper.then(function () {
		// this.waitForSelector('.search-result', function success() {
		// 	casper.capture('contains.png');
		// 	assertContainsText(test, '.search-results', privateNodeTitle);
		// });
		this.waitForText(privateNodeTitle, function success() {
			this.test.pass('private node found!');
		});
	});

	casper.run(function () {
		test.done();
	});
});
