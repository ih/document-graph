casper.test.begin('Rating by a non-admin', function suite(test) {
	casper.start(SERVER, function () {
		this.viewport(1200, 768);
	});
	logout(test);
	login(test, dummyUsers.B);

	clickAndView(dummyNodes.publicNodeA);

	casper.then(function () {
		test.assertSelectorHasText('.rating-community', '0');
	});

	casper.thenClick('.ratings-interface .rating-good');

	casper.then(function () {
		// waiting to overcome latency compensation...
		// find a more reliable way
		this.wait(1000, function () {
			test.assertSelectorHasText('.rating-community', '1');
		});
	});

	casper.thenClick('.ratings-interface .rating-good');

	casper.then(function () {
		this.wait(1000, function () {
			test.assertSelectorHasText('.rating-community', '1');
		});
	});

	casper.thenClick('.ratings-interface .rating-bad');

	casper.then(function () {
		this.wait(1000, function () {
			test.assertSelectorHasText('.rating-community', '0');
		});
	});

	casper.thenClick('.ratings-interface .rating-bad');

	casper.then(function () {
		this.wait(1000, function () {
			test.assertSelectorHasText('.rating-community', '-1');
		});
	});

	casper.thenClick('.ratings-interface .rating-bad');

	casper.then(function () {
		this.wait(1000, function () {
			test.assertSelectorHasText('.rating-community', '-1');
		});
	});

	casper.run(function () {
		test.done();
	});
});


casper.test.begin('Rating by an admin', function suite(test) {
	casper.start(SERVER, function () {
		this.viewport(1200, 768);
	});
	logout(test);
	login(test, dummyUsers.A);
	clickAndView(dummyNodes.publicNodeA);

	casper.then(function () {
		this.wait(1000, function () {
			test.assertSelectorHasText('.rating-community', '-1');
		});
	});

	casper.thenClick('.ratings-interface .rating-bad');

	casper.then(function () {
		this.wait(1000, function () {
			test.assertSelectorHasText('.rating-community', '-2');
		});
	});

	casper.thenClick('.ratings-interface .rating-good');
	casper.thenClick('.ratings-interface .rating-good');
	casper.thenClick('.ratings-interface .rating-good');
	casper.thenClick('.ratings-interface .rating-good');

	casper.then(function () {
		this.wait(1000, function () {
			test.assertSelectorHasText('.rating-community', '2');
		});
	});
	casper.run(function () {
		test.done();
	});
});
