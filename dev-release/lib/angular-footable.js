/**
 * License: MIT
 */
(function(angular) {
    'use strict';
    angular
        .module('ui.footable', [])
        .directive('footable', function() {
            var events = {
                beforeFiltering: 'footable_filtering'
            };
            var extractSpecOpts = function(opts, attrs) {
                var extracted = {},
                    k;
                for (k in opts) {
                    if (k !== 'filter' && (!angular.isUndefined(events[k]))) {
                        if(!angular.isFunction(scope.$eval(attrs[k]))) {
                            extracted[k] = attrs[k];
                        }
                    }
                }
                return extracted;
            };

            var bindEventHandler = function(tableObj, scope, attrs) {
                var k;
                for (k in attrs) {
                    if (k !== 'filter' && (!angular.isUndefined(events[k]))) {
                        var targetEventName = events[k];
                        if(angular.isFunction(scope.$eval(attrs[k]))) {
                            tableObj.bind(targetEventName, scope.$eval(attrs[k]));
                        }
                    }
                }
            };

            return {
                restrict: 'C',
                scope: {
                    loadWhen: '='
                },
                link: function(scope, element, attrs) {
                    var tableOpts = {
                        'event-filtering': null
                    };
                    angular.extend(
                        tableOpts,
                        footable.options
                    );
                    angular.extend(
                        tableOpts,
                        extractSpecOpts(tableOpts, attrs)
                    );
                    var tableObj = {};
                    var initTable = function(){
                        if(typeof element.footable === 'function'){
                            tableObj = element.footable(tableOpts); 
                        } else {
                            tableObj = jQuery(element).footable(tableOpts);
                        }
                        bindEventHandler(tableObj, scope, attrs);
                    };
                    if(typeof attrs.loadWhen !== 'undefined'){
                        scope.$watch(function(){return scope.loadWhen; }, function(data){
                            if(typeof data!== 'undefined'&&data.length){
                                initTable();
                            }
                        });
                    } else {
                        initTable();
                    }
                }
            };
        });
})(angular);
