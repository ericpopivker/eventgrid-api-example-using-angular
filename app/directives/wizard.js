(function(){
    'use strict';

    angular.module('app')
        .directive('wizard', wizard);

    function wizard(){
        var directive = {
            scope: {
                wizard: '=wizardModel'
            },
            link: linkFunc,
            templateUrl: 'templates/components/wizard.html'
        };

        return directive;

        function linkFunc(scope){

        }
    }
})();