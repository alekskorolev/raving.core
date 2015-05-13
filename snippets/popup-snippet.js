/*********************************/
/*  Popup snippet                */
/*********************************/
/*jslint browser: true, devel: true, node: true, nomen: true, es5: true*/
/*global  angular, $ */
module.exports = function (config) {
  "use strict";
  var popups = [],
    closeAll = function (currentId) {
      angular.forEach(popups, function (popup) {
        if (popup.id !== currentId) {
          popup.close();
        }
      });
    };
  angular.module(config.core.appid)
    .directive('popupSnippet', ['$rootScope', function ($rootScope) {
      return {
        restrict: 'EA',
        compile: function ($element, $attrs) {
          $attrs.popupBtns = $attrs.popupBtns ? JSON.parse($attrs.popupBtns) : {};
          var btnsHtml = '<div class="btn-panel">';
          angular.forEach($attrs.popupBtns, function (btn, id) {
            if (angular.isString(btn)) {
              btn = {
                action: btn,
                id: id,
                caption: id
              };
            }
            btn.id = btn.id || id;
            if (btn.action === "default") {
              if (btn.id === "cancel" || btn.id === "close") {
                btn.action = "closeAllPopups";
                btn.class = " fa fa-times";
              }
            }
            btnsHtml += '<button class="' + btn.id + btn.class + '" ng-click="' + btn.action + '()">' + btn.caption + '</button>';
          });
          btnsHtml += '</div>';
          $element.html('<div class="overlay"><div class="pop-up-body">' + btnsHtml + $element.html() + '</div></div>');
          //console.log($element, $attrs);
          return {
            pre: function () {},
            post: function ($scope, element, attrs) {

              $.extend($scope, {
                closeAllPopups: function () {
                  $rootScope.$broadcast('popup:closeAll');
                }
              });
              $(element).hide();
              $scope.$on('popup:open:' + attrs.popupId, function () {
                $rootScope.$broadcast('popup:closeAll', {
                  id: attrs.popupId
                });
                $(element).fadeIn();
              });

              $scope.$on('popup:closeAll', function (event, data) {
                data = data || {};
                if (data.id !== attrs.popupId) {
                  $(element).fadeOut();
                }
              });
            }
          };
        }
      };
    }]);
};