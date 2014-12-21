
// assumes logged in from test-account-creation.js
casper.test.begin('Creating a public node', function suite(test) {
	waitForLogin(test, dummyUsers.A);

	createNode(dummyNodes.publicNodeA, false, []);

	casper.run(function () {
		test.done();
	});
});


casper.test.begin('Creating a private node', function suite(test) {
	waitForLogin(test, dummyUsers.A);

	createNode(dummyNodes.privateNodeA, true, []);
	casper.run(function () {
		test.done();
	});
});

casper.test.begin('Creating tagged node', function suite(test) {
	waitForLogin(test, dummyUsers.A);

	createNode(dummyNodes.publicTaggedNodeA, false, ['tag1', 'tag2']);
	casper.run(function () {
		test.done();
	});
});

casper.test.begin('Creating realistic node', function suite(test) {
	logout();
	login(test, dummyUsers.IRVIN);

	createNode(dummyNodes.realNode, false, ['document graph', 'overview']);
	casper.run(function () {
		test.done();
	});
	logout();
	login(test, dummyUsers.A);
});

