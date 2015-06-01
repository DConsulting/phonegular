angular.module('phonegular.services')

	// TODO: Add desktop fallback to audio tag
	.service('soundManager', ['$q', '$log', '$timeout', function soundManager($q, $log, $timeout) {
		var nativeAudio = null;
		var self = this;

		this._preloadedSounds = {};

		/**
		 * @returns {*}
		 * @private
		 */
		this._getPlugin = function() {
			if (!nativeAudio) {
				nativeAudio = window.plugins && window.plugins.NativeAudio ? window.plugins.NativeAudio : null;
			}

			return nativeAudio;
		};

		this.isSupported = function() {
			self._getPlugin();

			return nativeAudio != null;
		};

		/**
		 * @param {String} assetPath
		 */
		this.preloadFX = function(assetPath) {
			var def = $q.defer();

			self._getPlugin();

			if (typeof assetPath === 'object') {
				assetPath = assetPath.src;
			}

			if (nativeAudio) {
				if (!self._preloadedSounds[assetPath]) {
					nativeAudio.preloadSimple(assetPath, assetPath,
						function onSuccess() {
							$timeout(function () {
								self._preloadedSounds[assetPath] = true;
								def.resolve(assetPath);
							});
						},
						function onFail() {
							$timeout(function () {
								def.reject(assetPath);
							});
						}
					);
				} else {
					$timeout(function () {
						def.resolve(assetPath);
					});
				}
			} else {
				def.reject();
			}

			return def.promise;
		};

		/**
		 * @param {String} assetPath
		 * @param {Number} volume
		 */
		this.preloadAudio = function(assetPath, volume) {
			var def = $q.defer();
			var url = typeof assetPath === 'object' ? assetPath.src : assetPath;

			self._getPlugin();

			if (!self._preloadedSounds[url] && nativeAudio) {
				nativeAudio.preloadComplex(url, url, volume, 1, 0,
					function onSuccess() {
						$timeout(function () {
							self._preloadedSounds[url] = true;
							def.resolve(url);
						});
					},
					function onFail(message) {
						$timeout(function () {
							$log.error('soundService >> preloadAudio: ' + message);
							def.reject(url);
						});
					}
				);
			} else {
				$timeout(function () {
					def.resolve(url);
				});
			}

			return def.promise;
		};

		this.play = function(assetPath) {
			var def = $q.defer();
			var url = typeof assetPath === 'object' ? assetPath.src : assetPath;

			self._getPlugin();

			if (!nativeAudio) {
				$timeout(function() {
					def.resolve(url);
				});
			} else if (self._preloadedSounds[url]) {
				nativeAudio.play(url, angular.noop,
					function onPlayError() {
						$timeout(function () {
							$log.error('soundService >> Failed to play "' + url + '".');
							def.reject(url);
						});
					},
					function onPlayComplete() {
						$timeout(function () {
							def.resolve(url);
						});
					}
				);
			} else {
				self.preloadFX(url).then(
					function onPreloadSuccess() {
						self.play(url).then(function() {
							self.unload(url).then(def.resolve);
						}, def.reject);
					},
					function onPreloadFail() {
						def.reject(url);
					}
				);
			}


			return def.promise;
		};

		this.stop = function(assetPath) {
			var def = $q.defer();
			var url = typeof assetPath === 'object' ? assetPath.src : assetPath;

			self._getPlugin();

			if (nativeAudio) {
				nativeAudio.stop(url,
					function onStopSuccess() {
						$timeout(function() {
							def.resolve(url);
						});
					},
					function onStopError() {
						$timeout(function() {
							$log.error('soundService >> Failed to stop "' + url + '".');
							def.reject(url);
						});
					}
				);
			}

			return def.promise;
		};

		this.loop = function(assetPath) {
			var def = $q.defer();
			var url = typeof assetPath === 'object' ? assetPath.src : assetPath;

			self._getPlugin();

			if (nativeAudio) {
				nativeAudio.loop(url);
				def.resolve();
			} else {
				def.resolve();
			}

			return def.promise;
		};

		this.unload = function(assetPath) {
			var def = $q.defer();
			var url = typeof assetPath === 'object' ? assetPath.src : assetPath;

			self._getPlugin();

			if (self._preloadedSounds[url]) {
				nativeAudio.unload(url,
					function() {
						$timeout(function() {
							self._preloadedSounds[url] = false;
							def.resolve(url);
						});
					},
					function() {
						$timeout(function() {
							self._preloadedSounds[url] = false;
							def.reject(url);
						});
					}
				);
			} else {
				$timeout(function() {
					def.resolve(url);
				});
			}

			return def.promise;
		};
	}]);
