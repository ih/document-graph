casper.nodeUrls = {};
casper.test.begin('View public and private nodes', function suite(test) {
	// actually change to get ids
	casper.start(SERVER, function () {
		this.viewport(1200, 768);
	});
	logout(test);
	login(test, dummyUsers.A);
	clickSearchResult(dummyNodes.privateNodeA.title);
	clickSearchResult(dummyNodes.publicNodeA.title);

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

	clickSearchResult(dummyNodes.publicNodeA.title);
	casper.echo('going to ' + SERVER + dummyNodes.privateNodeA.url);
	casper.thenOpen(SERVER + dummyNodes.privateNodeA.url);
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

casper.test.begin('View tags of node', function suite(test) {
	casper.start(SERVER, function () {
		this.viewport(1200, 768);
	});
	logout(test);
	login(test, dummyUsers.A);

	clickSearchResult(dummyNodes.publicTaggedNodeA.title);

	casper.then(function () {
		this.waitForSelector('.tag', function () {
			this.capture('viewing-tags.png');
			test.assertElementCount('.tag', 2);
		});
	});

	casper.run(function () {
		test.done();
	});
});
