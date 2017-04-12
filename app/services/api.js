(function(){
    'use strict';

    angular.module('app')
        .factory('api', api);

    api.$inject = ['$http', '$q'];

    function api($http, $q){
        var service = {
            getEvent: getEvent,
            getAvailableTicketTypes: getAvailableTicketTypes,
            calculateTotals: calculateTotals,
            createCart: createCart,
            loadPaymentSettings: loadPaymentSettings,
            createAndPay: createAndPay
        };

        var baseUrl = '/api/';

        return service;

        function getEvent(id){
            return _get(baseUrl + 'events/' + id + '?loadOptions=All');
        }

        function getAvailableTicketTypes(id, instanceId){
            return _get(baseUrl + 'events/' + id + '/instances/' + instanceId + '/available-ticket-types');
        }

        function calculateTotals(data){
            return _post(baseUrl + 'orders/calculate-totals', data);
        }

        function createCart(data){
            return _post(baseUrl + 'carts', data);
        }

        function loadPaymentSettings(businessId){
            return _get(baseUrl + 'businesses/' + businessId + '?loadOptions=PaymentSettings');
        }

        function createAndPay(data){
            return _post(baseUrl + 'orders/create-and-pay', data);
        }

        function _get(url){
            return $q(function(resolve, reject){
                $http.get(url)
                    .then(function(response){
                        if(response.data.isSuccess){
                            resolve(response.data);
                        }
                        else{
                            reject(response);
                        }
                    }, function(response){
                        reject(response);
                    })
            });
        }

        function _post(url, data){
            return $q(function(resolve, reject){
                $http.post(url, data)
                    .then(function(response){
                        if(response.data.isSuccess){
                            resolve(response.data);
                        }
                        else{
                            reject(response);
                        }
                    }, function(response){
                        reject(response);
                    })
            });
        }
    }
})();