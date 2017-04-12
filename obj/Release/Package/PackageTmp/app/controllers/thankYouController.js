(function(){
    'use strict';

    angular.module('app')
        .controller('ThankYouController', ThankYouController);

    ThankYouController.$inject = ['$state', 'registration'];

    function ThankYouController($state, registration){
        if(!registration.orderId){
            $state.go('sessionExpired');
            return;
        }

        var vm = this;

        vm.orderId = registration.orderId;
    }
})();