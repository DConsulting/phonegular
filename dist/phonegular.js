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
      ]);

})(angular);
