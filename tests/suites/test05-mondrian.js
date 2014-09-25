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

casper.test.begin('Cell Selection', function suite(test) {
	var leafCellIds;
	casper.start(SERVER, function () {
		this.viewport(1200, 768);
	});
	logout(test);
	login(test, dummyUsers.A);
	// check the only cell is focused on
	casper.then(function () {
		test.assertElementCount('.focused', 1);
	});
	casper.then(function () {
		this.click('.divide-vertical');
	});
	casper.then(function () {
		this.click('.divide-horizontal');
	});
	// check that clicking each cell puts the focus on that cell
	casper.then(function () {
		leafCellIds = this.getElementsAttribute('.leaf-cell', 'id');
		this.click('#'+leafCellIds[0]);
	});
	casper.then(function () {
		test.assertElementCount('.focused', 1);
		test.assertEquals(
			this.getElementAttribute('.focused', 'id'), leafCellIds[0]);
	});

	casper.then(function () {
		this.click('#'+leafCellIds[1]);
	});
	casper.then(function () {
		test.assertElementCount('.focused', 1);
		test.assertEquals(
			this.getElementAttribute('.focused', 'id'), leafCellIds[1]);
	});

	casper.run(function () {
		test.done();
	});
});
