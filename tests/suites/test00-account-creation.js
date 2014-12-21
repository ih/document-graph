casper.test.begin('Creating an account.', function suite(test) {
	casper.start(SERVER, function () {
		this.viewport(1200, 768);
	});
	createAccount(test, dummyUsers.A);
	logout();
	createAccount(test, dummyUsers.B);
	logout();
	createAccount(test, dummyUsers.IRVIN);
	logout();
	casper.echo('last login in account creation');
	login(test, dummyUsers.A);

	casper.run(function () {
		test.done();
	});
});

