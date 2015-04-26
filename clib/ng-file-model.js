//
// angular-file-model
// ==================
//
// Directive that makes the inputs with type `file` to be
// available in the `$scope` and be assigned to a model.
//

module.exports = function (angular, undefuned) {
  'use strict';

  angular.module('file-model', [])

  .directive('fileModel', [
    '$parse',
    function ($parse) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var model = $parse(attrs.fileModel);
          var modelSetter = model.assign;

          element.bind('change', function(){
            scope.$apply(function(){
              if (element[0].files.length > 1) {
                modelSetter(scope, element[0].files);
              }
              else {
                modelSetter(scope, element[0].files[0]);
              }
            });
          });
        }
      };
    }
  ]);

}