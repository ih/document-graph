var SERVER = 'http://localhost:3000/';

var DIMENSIONS = {'width': 1200, 'height': 768, 'top': 0, 'left': 0};
var privateNodeTitle = 'first private node title';
var dummyUsers = {
	'A': {
		email: 'a@a.a',
		password: 'aaaaaa'
	},
	'B': {
		email: 'b@b.b',
		password: 'bbbbbb'
	}
};
var dummyNodes = {
	'privateNodeA': {
		title: 'user a private node title',
		content: 'user a private node content'
	},
	'publicNodeA': {
		title: 'user a public node title',
		content: 'user a public node content'
	},
	'publicTaggedNodeA': {
		title: 'user a public tagged node', 
		content: 'this node has two tags'
	}
};

function waitForLogin(test, account) {
	casper.start(SERVER, function () {
		this.viewport(1200, 768);
		this.waitForSelector('#login-name-link', function success() {
			test.assertSelectorHasText('#login-name-link', account.email);
		});

		this.waitForSelector('#login-name-link', function success() {
			test.assertSelectorHasText('#login-name-link', account.email);
		});
	});
}

function createAccount(test, account) {
	casper.then(function () {
		this.waitForSelector('#login-sign-in-link', function () {
			this.click('#login-sign-in-link');
		});
	});

	casper.then(function () {
		this.waitForSelector('#signup-link', function success() {
			this.click('#signup-link');
		});
	});

	casper.echo('making accoutn... ');
	casper.echo(account);
	casper.thenEvaluate(function (account) {
		$('#login-email').val(account.email);
		$('#login-password').val(account.password);
	}, account);

	casper.thenClick('#login-buttons-password');

	casper.then(function () {
		this.waitForSelector('#login-name-link', function success() {
			test.assertSelectorHasText('#login-name-link', account.email);
		});
	});
}

function assertContainsText(test, selector,  text) {
	test.assertEval(function () {
		return $(selector + ':contains("' + text + '")').length > 0;
	});
}

function logout(test) {
	casper.echo('logging out');
	casper.thenClick('#login-name-link', function () {
		this.capture('nameclick.png');
	});
	casper.thenEvaluate(function () {
		$('#login-buttons-logout').click();
	});
	casper.then(function () {
		this.waitForSelector('#login-sign-in-link', function () {
			this.echo('successfully logged out');
		});
	});
}

function login(test, account) {
	casper.echo('logging in');
	casper.thenClick('#login-sign-in-link');
	casper.thenEvaluate(function (account) {
		$('#login-email').val(account.email);
		$('#login-password').val(account.password);
	}, account);

	casper.thenClick('#login-buttons-password');

	casper.then(function () {
		this.waitForSelector('#login-name-link', function success() {
			test.assertSelectorHasText('#login-name-link', account.email);
		});
	});
}

function clickAndView(node) {
	casper.echo('click and view test');
	casper.thenClick('.search-submit');
	casper.echo('submitted search');
	casper.then(function () {
		this.waitForText(node.title, function () {
			this.echo('looking for title...');
			var url = this.evaluate(function (title) {
				return $(
					'.search-result a:contains("'+ title +'")').attr(
						'href').slice(1);
			}, node.title);
			this.echo('url:'+ url);
			this.open(SERVER + url);
			casper.nodeUrls[node.title] = SERVER + url;
		});
		this.waitForText(node.content, function () {
			this.test.pass('displaying node ' + node.title);
		});
	});
}

function clickSearchResult(resultText) {
	casper.thenClick('.search-submit');
	casper.echo('submitted search');
	casper.then(function () {
		casper.waitUntilVisible('.search-result', function () {
			casper.capture('mondrianresults.png');
			// return the index; for some reason jquery click isn't working for
			// search result links, but casper does
			casper.echo('looking for ' + resultText);
			var resultIndex = this.evaluate(function (resultText) {
				var searchResults = $('.search-result');
				for (var i = 0; i < searchResults.length; i++) {
					if ($(searchResults[i]).text().indexOf(resultText) >= 0) {
						return i + 1;
					}
				}
				return -1;
			}, resultText);
			casper.echo('the result is number '+resultIndex);
			casper.click('.search-results li:nth-child('+resultIndex+') a');
			casper.capture('searchresults'+resultIndex+'.png');
		});
	});
}

