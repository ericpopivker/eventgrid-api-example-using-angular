(function(){
    'use strict';

    angular.module('app')
        .directive('emailField', emailField);

    function emailField(){
        var directive = {
            restrict: 'E',
            scope: {
                field: '=fieldModel'
            },
            link: linkFunc,
            templateUrl: 'templates/components/fields/email.html'
        };

        return directive;

        function linkFunc(scope){

        }
    }
})();