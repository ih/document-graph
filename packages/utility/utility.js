Utility = {
	choose: function(array) {
		return array[Math.floor(Math.random() * array.length)];
	},
	// http://www.paulirish.com/2009/random-hex-color-code-snippets/
	randomColor: function () {
		return '#' + (function co(lor){
			return (lor +=
					[0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)])
				&& (lor.length == 6) ?  lor : co(lor); })('');
	},
	randomContrastColor: function (isLight) {
		do {
			var randomColor = Utility.randomColor();
			var randomRGB = Utility.hexToRgb(randomColor);
			var colorBrightness = (randomRGB.r + randomRGB.g + randomRGB.b) / 3;
		} while (isLight ? colorBrightness < 170 : colorBrightness >= 170);
		console.log('hex:' + randomColor + ' rgb:' + JSON.stringify(randomRGB) + ' brightness:' + colorBrightness);
		return randomColor;
	},
	// http://stackoverflow.com/a/5624139

	 rgbToHex: function (r, g, b) {
		return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
		function componentToHex(c) {
			var hex = c.toString(16);
			return hex.length == 1 ? "0" + hex : hex;
		}
	},
	hexToRgb: function (hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		if (result) {
			return {
				r: parseInt(result[1], 16),
				g: parseInt(result[2], 16),
				b: parseInt(result[3], 16)
			};
		}
		else {
			console.error('problem generating rgb for ' + hex);
			return {
				r: 255,
				g: 255,
				b: 255
			};
		}
	},
	makeReactive: function (object) {
		var reactiveObject = new ReactiveDict();
		_.each(_.keys(object), function (key) {
			reactiveObject.set(key, object[key]);
		});
		return reactiveObject;
	},
	contains: function (list,  item) {
		for (var i = 0; i < list.length; i++) {
			console.log(i);
			if (_.isEqual(list[i], item)) {
				return true;
			}
		}
		return false;
	},
	difference: function (list1, list2) {
		return _.compact(_.map(list1, function (item) {
			if (!Utility.contains(list2, item)) {
				return item;
			}
			return null;
		}));
	},
	/** By referenced object we mean like tags for a node
	 */
	updateReferencedObjects: function (
		mainObjectId, updatedObjects, getObjects, createObject, 
		deleteObject) {
		var existingObjects = _.map(getObjects(mainObjectId), function (object) {
			return _.omit(object, '_id');
		});
		var objectsToCreate = Utility.difference(updatedObjects, existingObjects);
		_.each(objectsToCreate, function (newObject) {
			createObject(newObject);
		});

		var objectsToDelete = Utility.difference(existingObjects, updatedObjects);
		_.each(objectsToDelete, function (oldObject) {
			deleteObject(oldObject);
		});
	}
};
