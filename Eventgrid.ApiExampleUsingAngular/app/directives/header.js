(function(){
    'use strict';

    angular.module('app')
        .directive('header', header);

    function header(){
        var directive = {
            scope: {
                header: '=headerModel'
            },
            link: linkFunc,
            templateUrl: 'templates/components/header.html'
        };

        var intervalId;

        return directive;

        function linkFunc(scope){
            scope.$watch('header.sessionExpire()', function(sessionExpire){
                if(sessionExpire){
                    var secondsLeft = Math.round((sessionExpire - +new Date()) / 1000);
                    _startTimer(secondsLeft, document.getElementById('timer'), function(){
                        scope.header.timerIsOver();
                        scope.$apply();
                    });
                }
                else{
                    _stopTimer(document.getElementById('timer'));
                }
            });
        }

        function _stopTimer(display){
            if(intervalId){
                clearInterval(intervalId);
            }
            display.textContent = '';
        }

        function _startTimer(duration, display, cb) {

            var timer = duration, minutes, seconds;
            if(intervalId){
                clearInterval(intervalId);
            }
            intervalId = setInterval(function () {
                minutes = parseInt(timer / 60, 10)
                seconds = parseInt(timer % 60, 10);

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;

                display.textContent = minutes + ":" + seconds;

                if (--timer < 0) {
                    clearInterval(intervalId);
                    cb();
                }
            }, 1000);
        }
    }
})();