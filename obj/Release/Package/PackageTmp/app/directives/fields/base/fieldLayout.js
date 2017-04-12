(function(){
    'use strict';

    angular.module('app')
        .directive('fieldLayout', fieldLayout);

    function fieldLayout(){
        var directive = {
            restrict: 'E',
            templateUrl: 'templates/components/fields/_fieldLayout.html',
            transclude: true
        };

        return directive;
    }
})();