(function(){
    'use strict';

    angular.module('app')
        .controller('PaymentController', PaymentController);

    PaymentController.$inject = ['$scope', 'event', 'registration', 'eventgrid', 'validator', 'persistence'];

    function PaymentController($scope, event, registration, eventgrid, validator, persistence){
        var order = $scope.order;

        order.setStep('PAYMENT');

        var vm = this;

        vm.registration = registration;

        vm.nextStep = nextStep;
        vm.prevStep = prevStep;

        eventgrid.initPaymentProcessor(event.businessId);

        function nextStep(){
            if(validator.validateForm(_.map(vm.registration.creditCard))){
                vm.loading = true;
                eventgrid.checkout(event, registration).then(function (orderId) {
                    registration.orderId = orderId;
                    persistence.clear(registration.sessionId);
                    order.nextStep();
                }, function(error){
                    vm.loading = false;
                    vm.error = error;
                });
            }
        }

        function prevStep(){
            order.prevStep();
        }
    }
})();