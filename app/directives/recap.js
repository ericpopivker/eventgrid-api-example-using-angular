(function(){
    'use strict';

    angular.module('app')
        .directive('recap', recap);

    function recap(){
        var directive = {
            restrict: 'E',
            scope: {
                recap: '=recapModel'
            },
            link: linkFunc,
            templateUrl: 'templates/components/recap.html'
        };

        return directive;

        function linkFunc(scope){

            scope.getFullName = function(item){
                var firstName = _.get(item, 'form[0].value'),
                    lastName =  _.get(item, 'form[1].value');

                if(firstName && lastName){
                    return firstName + ' ' + lastName;
                }

                return null;
            };

            scope.getText = function(field){
                return ({
                    text: function(field){
                        return field.value;
                    },
                    email: function(field){
                        return field.value;
                    },
                    radio: function(field){
                        var optId = field.value;
                        return (_.find(field.options, function(option){return option.id == optId;}) || {}).label;
                    }
                })[field.type](field);
            };
        }
    }
})();