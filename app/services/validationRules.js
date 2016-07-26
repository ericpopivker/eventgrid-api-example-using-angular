(function(){
    'use strict';

    angular.module('app')
        .value('validationRules', getValidationRules());

    function getValidationRules(){
        return {
            required: function(value){
                if(!value){
                    return 'Required';
                }
            },
            email: function(value){
                if(value && !/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(value)){
                    return 'Invalid email';
                }
            },
            zip: function(value){
                if(value && !/^\d*$/.test(value)){
                    return 'Invalid zip';
                }
            }
        }
    }
})();