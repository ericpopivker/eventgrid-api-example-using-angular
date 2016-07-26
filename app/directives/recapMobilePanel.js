(function(){
    'use strict';

    angular.module('app')
        .directive('recapMobilePanel', recapMobilePanel);

    function recapMobilePanel(){
        var directive = {
            restrict: 'E',
            scope: {
                switcher: '=switcherModel'
            },
            link: linkFunc,
            templateUrl: 'templates/components/recapMobilePanel.html'
        };

        return directive;

        function linkFunc(scope, element){
        }
    }
})();