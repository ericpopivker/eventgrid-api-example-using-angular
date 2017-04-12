(function(){
    'use strict';

    angular.module('app')
        .controller('OrderController', OrderController);

    OrderController.$inject = ['$scope', '$state', 'event', 'registration', 'persistence'];

    function OrderController($scope, $state, event, registration, persistence){
        if($state.current.name != 'tickets'){
            if(!persistence.load($state.params.sessionId)){
                $state.go('sessionExpired');
                return;
            }
        }

        var vm = this;

        vm.event = event;
        vm.registration = registration;
        vm.wizard = [
            {
                name: 'SELECT_TICKETS',
                title: 'Select Tickets',
                state: 'tickets'
            },
            {
                name: 'ATTENDEES',
                title: 'Enter Ticket Info',
                state: 'attendees'
            },
            {
                name: 'PAYMENT',
                title: 'Payment',
                state: 'payment'
            }
        ];
        vm.withTimer = withTimer;
        vm.header = {
            sessionExpire: function(){
                return registration.sessionExpire;
            },
            timerIsOver: function(){
                persistence.clear(registration.sessionId);
                $state.go('sessionExpired');
            }
        };
        vm.recapMobileSwitcher = {
            hide: true,
            total: function(){
                return vm.registration.total;
            }
        };
        vm.setStep = setStep;
        vm.nextStep = nextStep;
        vm.prevStep = prevStep;

        var unsubscribe = $scope.$watch('order.event', function(event){
            if(!_.isEmpty(event)){
                _.extend(vm.header, {
                    title: event.title,
                    venue: event.venue,
                    date: moment(event.date.start).format('MMM D') + ' - ' + moment(event.date.end).format('MMM D, YYYY')
                });
                unsubscribe();
            }
        });

        var steps = [ {
            name:'tickets',
            params: function(){ return { id:event.id }; }
        },
        {
            name:'attendees',
            params: function(){ return { sessionId: registration.sessionId }; }
        },
        {
            name:'payment',
            params: function(){ return { sessionId: registration.sessionId }; }
        },
        {
            name:'thankYou'
        } ],
            currentStep = 0;

        function withTimer(){
           return  _.find(vm.wizard, {active:true}).name != 'SELECT_TICKETS';
        }

        function setStep(stepName){
            var passed = true;
            _.each(vm.wizard, function(step, i){
                step.active = false;
                if(step.name == stepName){
                    step.active = true;
                    currentStep = i;
                    passed = false;
                }
                if(passed){
                    step.passed = true;
                }
            });
        }

        function nextStep(){
            var activeStepIndex = vm.wizard.indexOf(_.find(vm.wizard, {active: true}));
            vm.wizard[activeStepIndex].passed = true;
            currentStep++;
            $state.go(steps[currentStep].name, (steps[currentStep].params || _.noop)());
        }

        function prevStep(){
            var activeStepIndex = vm.wizard.indexOf(_.find(vm.wizard, {active: true}));
            vm.wizard[activeStepIndex].passed = false;
            currentStep--;
            $state.go(steps[currentStep].name, (steps[currentStep].params || _.noop)());
        }
    }
})();