casper.nodeUrls = {};
casper.test.begin('View public and private nodes', function suite(test) {
	// actually change to get ids
	casper.start(SERVER, function () {
		this.viewport(1200, 768);
	});
	logout(test);
	login(test, dummyUsers.A);
	clickAndView(dummyNodes.privateNodeA);
	clickAndView(dummyNodes.publicNodeA);

	casper.run(function () {
		test.done();
	});
});

casper.test.begin('View public only public nodes', function suite(test) {
	// actually change to get ids
	casper.start(SERVER, function () {
		this.viewport(1200, 768);
	});
	logout(test);
	login(test, dummyUsers.B);
	// clickAndView(dummyNodes.privateNodeA);
	clickAndView(dummyNodes.publicNodeA);
	casper.thenOpen(casper.nodeUrls[dummyNodes.privateNodeA.title]);
	casper.then(function () {
		this.waitForText(dummyNodes.privateNodeA.content, function success() {
			this.test.fail('private node displaying when it should not');
		}, function fail() {
			this.capture('viewing-private.png');
			this.test.pass('prviate not displaying!');
		});
	});
	// clickAndView(dummyNodes.privateNodeA);
	casper.run(function () {
		test.done();
	});
});
