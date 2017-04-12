(function(){
    'use strict';

    angular.module('app')
        .directive('field', field);

    field.$inject = ['$compile', 'validator'];

    function field($compile, validator){
        var directive = {
            restrict: 'E',
            scope: {
                field: '=fieldModel'
            },
            link: linkFunc
        };

        return directive;

        function linkFunc(scope, element){
            var template = _.template('<<%- type %>-field field-model="field"></<%- type %>-field>');
            var fieldElement = $compile(template(scope.field))(scope);
            element.append(fieldElement);

            scope.$watch('field.value', function(newVal, oldVal){
                validator.validateField(scope.field);
                if(newVal != oldVal){
                    scope.field.dirty = true;
                }
            });
        }
    }
})();