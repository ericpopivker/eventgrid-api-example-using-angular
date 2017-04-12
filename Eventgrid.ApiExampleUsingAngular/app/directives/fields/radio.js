(function(){
    'use strict';

    angular.module('app')
        .directive('radioField', radioField);

    function radioField(){
        var directive = {
            restrict: 'E',
            scope: {
                field: '=fieldModel'
            },
            link: linkFunc,
            templateUrl: 'templates/components/fields/radio.html'
        };

        return directive;

        function linkFunc(scope){

        }
    }
})();