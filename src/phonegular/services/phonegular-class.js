angular.module('phonegular.services')
	/**
	 * Base class for all phonegular services. This should be kept as simple as possible.
	 * It's up to you to call the parent constructors.
	 *
	 * Example:
	 * .factory('CustomClass', function() {
		 *     function CustomClass() {
		 *         CustomClass.call(this);
		 *     }
		 *
		 *     phonegular.extendClass(CustomClass, PhonegularClass);
		 *     return CustomClass;
		 * })
	 */
	.factory('PhonegularClass', [function() {
		function PhonegularClass() {

		}

		/**
		 * @param {Function} otherType
		 */
		PhonegularClass.prototype.is = function(otherType) {
			return this instanceof otherType;
		};

		return PhonegularClass;
	}]);
