(function(){
    'use strict';

    angular.module('app')
        .directive('textField', textField);

    function textField(){
        var directive = {
            restrict: 'E',
            scope: {
                field: '=fieldModel'
            },
            link: linkFunc,
            templateUrl: 'templates/components/fields/text.html'
        };

        return directive;

        function linkFunc(scope){

        }
    }
})();