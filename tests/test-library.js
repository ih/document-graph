var SERVER = 'http://localhost:3000/';

var DIMENSIONS = {'width': 1200, 'height': 768, 'top': 0, 'left': 0};
var privateNodeTitle = 'first private node title';
var dummyUsers = {
	'A': {
		username: 'aaa',
		email: 'a@a.a',
		password: 'aaaaaa'
	},
	'B': {
		username: 'bbb',
		email: 'b@b.b',
		password: 'bbbbbb'
	},
	'IRVIN': {
		username: 'irvin',
		email: 'irvin.hwang@gmail.com',
		password: 'password'
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
	},
	'realNode': {
		title: 'Document Graph',
		content: 'Expander is an easy way to create a network of documents.' +
			'It should have the following features:\n' +
			'1. UI that makes it easy to create1 and link documents1 together.\n' +
			'2. UI that makes it easy to reorganize existing links\n' +
			'3. UI for easily finding and understanding the context of documents\n' +
			'4. Extensible by third parties\n' +
			'5. Permissions for document access3\n' +
			'6. Promotion of content by the community2'
	}
};

function waitForLogin(test, account) {
	casper.start(SERVER, function () {
		this.viewport(1200, 768);
		this.waitForSelector('#login-name-link', function success() {
			test.assertSelectorHasText('#login-name-link', account.username);
		});

		this.waitForSelector('#login-name-link', function success() {
			test.assertSelectorHasText('#login-name-link', account.username);
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

	casper.echo('making account... ');
	casper.echo(account);
	casper.thenEvaluate(function (account) {
		$('#login-username').val(account.username);
		$('#login-email').val(account.email);
		$('#login-password').val(account.password);
	}, account);

	casper.thenClick('#login-buttons-password');

	casper.then(function () {
		this.waitForSelector('#login-name-link', function success() {
			test.assertSelectorHasText('#login-name-link', account.username);
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
		$('#login-username-or-email').val(account.email);
		$('#login-password').val(account.password);
	}, account);

	casper.thenClick('#login-buttons-password');

	casper.then(function () {
		this.waitForSelector('#login-name-link', function success() {
			test.assertSelectorHasText('#login-name-link', account.username);
		});
	});
}

function clickAndOpen(node) {
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
			// casper.nodeUrls[node.title] = SERVER + url;
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
	casper.wait(1000);
}


function createNode(nodeData, isPrivate, tags) {
	casper.thenClick(' button.create-node');
	casper.waitForSelector('.editor', function () {
		casper.thenEvaluate(function (nodeData, isPrivate, tags) {
			// setting the values through jquery do not trigger the event handlers
			$('.editor input.title').val(nodeData.title);
			$('.editor input.title').trigger('input');
			$('.editor textarea.content').val(nodeData.content);
			$('.editor textarea.content').trigger('input');
			if (!isPrivate) {
				$('#privacy-editor').click();
			}
			if (tags) {
				_.each(tags, function (tag) {
					$('#myTags').tagit('createTag', tag);
				});
			}
		}, nodeData, isPrivate, tags);
	});

	casper.thenClick('.editor button.save', function success() {
		this.test.pass('created node!');
	});

	// save node id
	casper.wait(1000, function () {
		casper.thenClick('.search-submit');
		casper.echo('search for saving node id');
		casper.waitForText(nodeData.title, function () {
			casper.echo('saving node id');
			var url = this.evaluate(function (title) {
				return $(
					'.search-result a:contains("'+ title +'")').attr(
						'href').slice(1);
			}, nodeData.title);
			this.echo('create node url:'+ url);
			nodeData.url = url;
		});
	});
}
