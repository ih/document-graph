casper.test.begin('Cell division', function suite(test) {
	casper.start(SERVER, function () {
		this.viewport(1200, 768);
	});
	logout(test);
	login(test, dummyUsers.A);
	// check there is one root cell with the default content
	casper.then(function () {
		test.assertElementCount('.cell', 1);
		test.assertSelectorHasText('.cell-content', 'howdy');
	});

	// check that vertical division works
	casper.then(function () {
		this.click('.divide-vertical');
	});
	casper.then(function () {
		test.assertElementCount('.cell', 3);
		test.assertElementCount('.leaf-cell', 2);
		test.assertElementCount('.column-cell', 2);
	});

	// check that horizontal division works
	casper.then(function () {
		var leafCellIds = this.getElementsAttribute('.leaf-cell', 'id');
		this.echo('The leaves ' + leafCellIds);
		this.click('#'+leafCellIds[0]+' .divide-horizontal');
	});
	casper.then(function () {
		test.assertElementCount('.cell', 5);
		test.assertElementCount('.leaf-cell', 3);
		test.assertElementCount('.column-cell', 2);
		test.assertElementCount('.row-cell', 2);
	});

	casper.run(function () {
		test.done();
	});
});
