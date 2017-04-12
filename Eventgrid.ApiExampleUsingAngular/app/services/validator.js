(function(){
    'use strict';

    angular.module('app')
        .factory('validator', validator);

    validator.$inject = ['validationRules'];

    function validator(validationRules){
        var service = {
            validateField: validateField,
            validateForm: validateForm
        };

        return service;

        function validateField(field){
            var error = null;
            _.each(field.validationRules, function(rule){
                var msg = _.isFunction(rule) ? rule(field.value) : validationRules[rule](field.value);
                if(msg){
                    error = msg;
                    return false;
                }
            });
            field.error = error;
            field.valid = !error;
        }

        function validateForm(fields){
            var formValid = true;
            _.each(fields, function(field){
                field.dirty = true;
                if(!field.valid){
                    formValid = false;
                }
            });
            return formValid;
        }
    }
})();