var SERVER = 'http://localhost:3000/';
var EMAIL = 'a@a.a';
var PASSWORD = 'aaaaaa';
var DIMENSIONS = {'width': 1200, 'height': 768, 'top': 0, 'left': 0};
var privateNodeTitle = 'first private node title';
function waitForLogin(test) {
	casper.start(SERVER, function () {
		this.viewport(1200, 768);
		this.waitForSelector('#login-name-link', function success() {
			test.assertSelectorHasText('#login-name-link', EMAIL);
		});

		this.waitForSelector('#login-name-link', function success() {
			test.assertSelectorHasText('#login-name-link', EMAIL);
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
