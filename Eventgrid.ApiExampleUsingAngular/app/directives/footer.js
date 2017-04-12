(function(){
    'use strict';

    angular.module('app')
        .directive('footer', footer);

    function footer(){
        var directive = {
            templateUrl: 'templates/components/footer.html'
        };

        return directive;
    }
})();