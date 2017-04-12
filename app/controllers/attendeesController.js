(function(){
    'use strict';

    angular.module('app')
        .controller('AttendeesController', AttendeesController);

    AttendeesController.$inject = ['$scope', 'event', 'registration', 'validator', 'persistence'];

    function AttendeesController($scope, event, registration, validator, persistence){
        var order = $scope.order;

        order.setStep('ATTENDEES');

        var vm = this;

        vm.registration = registration;

        vm.nextStep = nextStep;
        vm.prevStep = prevStep;

        var formInited = !!registration.items[0].form;

        if(formInited){
            return;
        }

        _.each(registration.items, function(item){
            item.form = _.map(event.form, function(fld){
                return _.extend({}, fld);
            });
        });

        function nextStep(){
            var allFields = _.flatten(_.map(registration.items, 'form'));
            if(validator.validateForm(allFields)){
                persistence.save(registration.sessionId);
                order.nextStep();
            }
        }

        function prevStep(){
            persistence.clear(registration.sessionId);
            order.prevStep();
        }
    }
})();