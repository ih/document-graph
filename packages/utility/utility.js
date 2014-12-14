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
