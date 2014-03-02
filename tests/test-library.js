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

function assertContainsText(test, selector,  text) {
	test.assertEval(function () {
		return $(selector + ':contains("' + text + '")').length > 0;
	});
}
// function logout() {
	
// }
