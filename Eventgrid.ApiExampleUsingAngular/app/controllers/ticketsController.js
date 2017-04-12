(function(){
    'use strict';

    angular.module('app')
        .controller('TicketsController', TicketsController);

    TicketsController.$inject = ['$scope', '_event', 'event', 'registration', 'eventgrid', 'persistence'];

    function TicketsController($scope, _event, event, registration, eventgrid, persistence){
        var order = $scope.order;
        _.extend(event, _event);

        order.setStep('SELECT_TICKETS');

        angular.copy({}, registration);

        var vm = this;

        vm.ticketTypes = _.extend([], event.ticketTypes);

        vm.nothingSelected = nothingSelected;
        vm.quantityChanged = quantityChanged;
        vm.nextStep = nextStep;

        _.each(vm.ticketTypes, function(tt){
            tt.quantity = 0;
        });

        function nothingSelected(){
            return _.sum(_.map(vm.ticketTypes, 'quantity')) == 0;
        }

        function quantityChanged(){
            var selectedTickets = _getSelectedTickets();
            if(_.isEmpty(selectedTickets)){
                angular.copy({}, registration);
                return;
            }
            eventgrid.calculateTotals(event, selectedTickets).then(function(totals){
                angular.copy(totals, registration);
            });
        }

        function nextStep(){
            vm.loading = true;
            eventgrid.createCart(event, _getSelectedTickets()).then(function(cart){
                registration.cart = cart;
                registration.sessionId = _generateSessionId();
                registration.sessionExpire = +new Date() + (30 * 60 * 1000);
                persistence.save(registration.sessionId);
                order.nextStep();
            });
        }

        function _getSelectedTickets(){
            var selectedTickets = [];
            _.each(vm.ticketTypes, function(tt){
                if(tt.quantity > 0){
                    selectedTickets.push({id: tt.id, quantity: tt.quantity});
                }
            });
            return selectedTickets;
        }

        function _generateSessionId()
        {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for( var i=0; i < 5; i++ )
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            return text;
        }
    }
})();