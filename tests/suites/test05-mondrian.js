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
	casper.thenClick('.divide-vertical', function () {
		this.wait(1000);
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
		this.wait(1000);
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
	casper.thenClick('.divide-vertical', function () {
		this.wait(1000);
	});
	casper.thenClick('.divide-horizontal', function () {
		this.wait(1000);
	});

	// check that clicking each cell puts the focus on that cell
	casper.then(function () {
		leafCellIds = this.getElementsAttribute('.leaf-cell', 'id');
		test.assertEquals(leafCellIds.length, 3);
		this.click('#'+leafCellIds[0]);
		this.wait(1000, function () {
			test.assertElementCount('.focused', 1);
			test.assertEquals(
				this.getElementAttribute('.focused', 'id'), leafCellIds[0]);
		});
	});

	casper.then(function () {
		this.click('#'+leafCellIds[2]);
		this.wait(1000);
	});
	casper.then(function () {
		test.assertElementCount('.focused', 1);
		test.assertEquals(
			this.getElementAttribute('.focused', 'id'), leafCellIds[2]);
	});

	casper.run(function () {
		test.done();
	});
});

casper.test.begin('Load content', function suite(test) {
	casper.start(SERVER, function () {
		this.viewport(1200, 1000);
	});
	logout(test);
	login(test, dummyUsers.A);

	casper.thenClick('.divide-horizontal', function () {
		this.wait(1000, function () {
		});
	});

	clickSearchResult('public');

	casper.then(function () {
		this.wait(1000, function () {
			test.assertSelectorHasText('.cell', 'public');
		});
	});

	casper.thenClick('.leaf-cell:not(.focused)');

	clickSearchResult('private');

	casper.then(function () {
		this.wait(1000, function () {
			test.assertSelectorHasText('.focused', 'private');
			test.assertSelectorHasText('.leaf-cell:not(.focused)', 'public');
		});
	});

	casper.run(function () {
		test.done();
	});
});

casper.test.begin('Collapsing cells', function suite(test) {
	casper.start(SERVER, function () {
		this.viewport(1200, 1000);
	});
	logout(test);
	login(test, dummyUsers.A);

	casper.capture('loggedin.png');

	casper.thenClick('.collapse-cell', function () {
		test.assertElementCount('.cell', 1);
	});

	casper.thenClick('.divide-horizontal', function () {
		this.wait(1000, function () {
			test.assertElementCount('.cell', 3);
		});
	});

	casper.thenClick('.focused .collapse-cell', function () {
		test.assertElementCount('.cell', 1);
	});

	casper.thenClick('.divide-horizontal', function () {
		this.wait(1000, function () {
			test.assertElementCount('.cell', 3);
		});
	});

	casper.thenClick('.divide-horizontal', function () {
		this.wait(1000, function () {
			test.assertElementCount('.cell', 5);
		});
	});

	casper.thenClick('.leaf-cell:not(.focused) .collapse-cell', function () {
		this.wait(1000, function () {
			test.assertElementCount('.cell', 3);
		});
	});

	casper.thenClick('.leaf-cell:not(.focused) .collapse-cell', function () {
		this.wait(1000, function () {
			test.assertElementCount('.cell', 1);
		});
	});

	casper.run(function () {
		test.done();
	});
});
