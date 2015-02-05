'use strict';
/* global services, utils, LOCAL_STORAGE_MAX_MINUTES_TO_CACHE */

/* local storage service */

services.factory('LocalStorageHelper', ['Logger',function(Logger) {

	/** ************* */
	/* Initialization */
	/** ************* */

	var logger = Logger.getInstance('LocalStorageHelper');

	/** ************* */
	/* Public Methods */
	/** ************* */

	return {

		/**
		 * set : Store a Json flow adding a date to check its validity
		 * 
		 * @Param key :
		 *            key on local storage
		 * @Param object :
		 *            value associated to key on local storage
		 */
		set : function(key, object) {

			// Add a date to the content to check its validity
			var storedContent = {
				timestamp : new Date(),
				content : object
			};

			localStorage.setItem(key, angular.toJson(storedContent));
			// Log info about object set on local storage (log is disable on
			// production)
			logger.info('Set', 'Key : {0} / Value : {1}', [key,storedContent.content]);
		},

		/**
		 * get : Return from cache without check time
		 * 
		 * @Param key :
		 *            key on local storage
		 */
		get : function(key) {

			var result = angular.fromJson(localStorage.getItem(key));
			if (!utils.isNull(result)) {
				return result.content;
			}
			return null;
		},

		/**
		 * getIfNotExpired : Return the content only if it exists and if its
		 * expiration date was not reached
		 * 
		 * @Param key :
		 *            key on local storage
		 * @param minutesToCache :
		 *            minutes before considering value is expired
		 */
		getIfNotExpired : function(key, minutesToCache) {

			var result = angular.fromJson(localStorage.getItem(key));

			if (!utils.isNull(result)) {
				// Calculate delta
				var currentDate = new Date();
				var resultDate = new Date(result.timestamp);
				var delta = currentDate - resultDate;
				var nbMinutes = delta / 1000 / 60;

				var cacheTime;
				if (!utils.isNull(minutesToCache)) {
					cacheTime = minutesToCache;
				} else {
					cacheTime = LOCAL_STORAGE_MAX_MINUTES_TO_CACHE;
				}
				if (nbMinutes < cacheTime) {
					return result.content;
				} else {
					this.remove(key);
				}
			}
			return null;
		},

		/**
		 * find : Find a Json flow in ARRAY (and only in array)
		 * 
		 * @Param key :
		 *            key on local storage
		 * @Param object :
		 *            value associated to key on local storage
		 * @Param cmp :
		 *            define the compare function
		 */
		find : function(key, object, cmp) {
			var objectOnLocalStorage = angular.fromJson(localStorage.getItem(key));
			if (utils.isNull(objectOnLocalStorage)) {
				return false;
			} else {
				if (objectOnLocalStorage.content instanceof Array) {
					for ( var i in objectOnLocalStorage.content) {
						if (cmp(objectOnLocalStorage.content[i], object)) {
							return true;
						}
					}
					return false;
				} else {
					return cmp(objectOnLocalStorage.content, object);
				}
			}
		},

		/**
		 * add : Add a Json flow in ARRAY (and only in array)
		 * 
		 * @Param key :
		 *            key on local storage
		 * @Param object :
		 *            value associated to key on local storage
		 * @Param cmp :
		 *            define the optional compare function to prevent duplicate
		 *            item in array
		 */
		add : function(key, object, cmp) {

			var objectOnLocalStorage = angular.fromJson(localStorage.getItem(key));

			// If object does not exist on local storage, we create array
			if (utils.isNull(objectOnLocalStorage)) {
				var storedContent = {
					timestamp : new Date(),
					content : [object]
				};
				localStorage.setItem(key, angular.toJson(storedContent));
			}

			// If object exists and is an array
			else if (objectOnLocalStorage.content instanceof Array) {
				if (typeof cmp === 'undefined' || !this.find(key, object, cmp)) {
					objectOnLocalStorage.content.push(object);
					localStorage.setItem(key, angular.toJson(objectOnLocalStorage));
				} else {
					return false;
				}
			}

			// Log info about object add on local storage (log is disable on
			// production)
			logger.info('Add', 'Key : {0} / Value : {1}', [key,object]);

			return true;
		},

		/**
		 * swap : Swap 2 values on ARRAY stored in local storage
		 * 
		 * @Param key :
		 *            key on local storage
		 * @Param index1 :
		 *            index of first value to swap on array
		 * @Param index2 :
		 *            index of second value to swap on array
		 */
		swap : function(key, index1, index2) {
			var objectOnLocalStorage = angular.fromJson(localStorage.getItem(key));
			if (utils.isNull(objectOnLocalStorage)) {
				logger.error('Swap', 'Array with key \'{0}\' does not exists.', [key]);
				return;
			}
			var arrayToSwap = objectOnLocalStorage.content;
			if (arrayToSwap instanceof Array && (index1 < arrayToSwap.length) && (index2 < arrayToSwap.length)) {
				var swapValue = arrayToSwap[index1];
				arrayToSwap[index1] = arrayToSwap[index2];
				arrayToSwap[index2] = swapValue;
				localStorage.setItem(key, angular.toJson(objectOnLocalStorage));
			}
		},

		/**
		 * splice : Remove 1 value on ARRAY stored in local storage
		 * 
		 * @Param key :
		 *            key on local storage
		 * @Param index :
		 *            index of value to remove on array
		 */
		splice : function(key, index) {
			var objectOnLocalStorage = angular.fromJson(localStorage.getItem(key));
			if (utils.isNull(objectOnLocalStorage)) {
				logger.error('Splice', 'Array with key \'{0}\' does not exists.', [key]);
				return;
			}
			var arrayToSplice = objectOnLocalStorage.content;
			if (arrayToSplice instanceof Array && (index < arrayToSplice.length)) {
				arrayToSplice.splice(index, 1);
				localStorage.setItem(key, angular.toJson(objectOnLocalStorage));
			}
		},

		/**
		 * remove : Remove a previously stored content
		 * 
		 * @Param key :
		 *            key on local storage
		 */
		remove : function(key) {
			localStorage.removeItem(key);
		},

		/**
		 * removeAll : Clean the localStorage
		 */
		removeAll : function() {
			localStorage.clear();
		}
	};
}]);