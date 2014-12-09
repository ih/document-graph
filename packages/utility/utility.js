Utility = {
	choose: function(array) {
		return array[Math.floor(Math.random() * array.length)];
	},
	randomColor: function () {
		return '#'+Math.floor(Math.random()*16777215).toString(16);
	},
	makeReactive: function (object) {
		var reactiveObject = new ReactiveDict();
		_.each(_.keys(object), function (key) {
			reactiveObject.set(key, object[key]);
		});
		return reactiveObject;
	}
};
