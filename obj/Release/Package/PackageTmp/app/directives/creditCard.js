(function(){
    'use strict';

    angular.module('app')
        .directive('creditCard', creditCard);

    creditCard.$inject = ['validator'];

    function creditCard(validator){
        var directive = {
            restrict: 'E',
            scope: {
                card: '=cardModel'
            },
            link: linkFunc,
            templateUrl: 'templates/components/creditCard.html'
        };

        return directive;

        function linkFunc(scope){
            scope.card = {
                number: { validationRules: ['required', function(value){
                    if(!Stripe.validateCardNumber(value)){
                        return 'Invalid card number';
                    }
                } ]},
                cvc: { validationRules: ['required', function(value){
                    if(!Stripe.validateCVC(value)){
                        return 'Invalid CVC';
                    }
                }] },
                exp: { validationRules: ['required', function(value){
                    if(!Stripe.validateExpiry(value)){
                        return 'Invalid expiration date';
                    }
                }] },
                zip: { validationRules: ['required', 'zip'] },
                name: { validationRules: ['required'] }
            };

            _.each(scope.card, function(val, key){
                scope.$watch('card.' + key + '.value', function(newVal, oldVal){
                    validator.validateField(scope.card[key]);
                    if(newVal != oldVal){
                        scope.card[key].dirty = true;
                    }
                });
            });
        }
    }
})();