(function(){
    'use strict';

    angular.module('app')
        .config(statesConfig);

    statesConfig.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

    function statesConfig($stateProvider, $urlRouterProvider, $locationProvider) {

        $stateProvider
            .state('order', {
                templateUrl: 'templates/views/order.html',
                controller: 'OrderController',
                controllerAs: 'order'
            })
            .state('tickets', {
                url: '/Events/:id',
                templateUrl: 'templates/views/tickets.html',
                controller: 'TicketsController',
                controllerAs: 'tickets',
                parent: 'order',
                resolve: {
                    _event: ['event', 'eventgrid', '$stateParams', function(event, eventgrid, $stateParams){
                        if(!_.isEmpty(event)){
                            return event;
                        }
                        return eventgrid.getEvent($stateParams.id);
                    }]
                }
            })
            .state('attendees', {
                url: '/:sessionId/Order/Attendees',
                templateUrl: 'templates/views/attendees.html',
                controller: 'AttendeesController',
                controllerAs: 'attendees',
                parent: 'order'
            })
            .state('payment', {
                url: '/:sessionId/Order/Payment',
                templateUrl: 'templates/views/payment.html',
                controller: 'PaymentController',
                controllerAs: 'payment',
                parent: 'order'
            })
            .state('thankYou', {
                url: '/Order/ThankYou',
                templateUrl: 'templates/views/thankYou.html',
                controller: 'ThankYouController',
                controllerAs: 'thankYou'
            })
            .state('sessionExpired', {
                url: '/SessionExpired',
                templateUrl: 'templates/views/sessionExpired.html'
            });

        $locationProvider.html5Mode(true);
    }
})();