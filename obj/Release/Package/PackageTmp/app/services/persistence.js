(function(){
    'use strict';

    angular.module('app')
        .factory('persistence', persistence);

    persistence.$inject = ['registration', 'event'];

    function persistence(registration, event){
        var service = {
            save: save,
            load: load,
            clear: clear
        };

        return service;

        function save(sessionId){
            if(!window.localStorage){
                return;
            }

            var data = {
                event: event,
                registration: registration
            };

            data = JSON.stringify(data);

            localStorage.setItem(sessionId, data);
        }

        function load(sessionId){
            if(!window.localStorage){
                return false;
            }

            var data = localStorage.getItem(sessionId);

            if(!data){
                return false;
            }

            data = JSON.parse(data);

            if(data.registration.sessionExpire <= +new Date()){
                clear(sessionId);
                return false;
            }

            angular.copy({}, registration);
            angular.copy({}, event);

            _.extend(registration, data.registration);
            _.extend(event, data.event);

            return true;
        }

        function clear(sessionId){
            if(!window.localStorage){
                return;
            }


        }
    }
})();