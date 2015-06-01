(function (angular) {

	// Create all modules and define dependencies to make sure they exist
	// and are loaded in the correct order to satisfy dependency injection
	// before all nested files are concatenated by Gulp

	// Config
	angular.module('phonegular.config', [])
		.value('phonegular.config', {
			debug: true
		});

	// Modules
	angular.module('phonegular.directives', []);
	angular.module('phonegular.filters', []);
	angular.module('phonegular.services', []);
	angular.module('phonegular',
		[
			'phonegular.config',
			'phonegular.directives',
			'phonegular.filters',
			'phonegular.services'
		])

		/**
		 * Adds a Phonegular global class instance
		 */
		.run(['PhonegularClass', function (PhonegularClass) {
			function Phonegular() {

			}

			/**
			 * @param {Function} subclass The subclass.
			 * @param {Function) superclass The superclass to extend.
			 * @return {Function} The new prototype
			 */
			Phonegular.prototype.extendClass = function (subclass, superclass) {
				var mix = subclass;
				mix.prototype = Object.create(superclass.prototype);
				mix.prototype.constructor = subclass;

				/**
				 * @param {Object} methods Key-value pair with objects
				 */
				mix.addMethods = function (methods) {
					for (var methodName in methods) {
						mix.prototype[methodName] = methods[methodName];
					}
				};

				return mix;
			};

			window.phonegular = new Phonegular();
		}]);

})(angular);
