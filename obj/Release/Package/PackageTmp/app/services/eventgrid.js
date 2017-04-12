(function(){
    'use strict';

    angular.module('app')
        .factory('eventgrid', eventgrid);

    eventgrid.$inject = ['$q', 'api'];

    function eventgrid($q, api){
        var service = {
            getEvent: getEvent,
            calculateTotals: calculateTotals,
            createCart: createCart,
            initPaymentProcessor: initPaymentProcessor,
            checkout: checkout
        };

        var paymentProcessorInited = false;

        return service;

        function getEvent(id){
            var eventData;

            return api.getEvent(id).then(function(evData){
                eventData = evData;
                return api.getAvailableTicketTypes(id, eventData.event.instances[0].id);
            }).then(function(ticketTypesData){
                return {
                    id: eventData.event.id,
                    businessId: eventData.event.business.id,
                    title: eventData.event.title,
                    instanceId: eventData.event.instances[0].id,
                    ticketTypes: _.map(ticketTypesData.ticketTypes, function(item){
                        return {
                            id: item.id,
                            title: item.ticketType.name,
                            description: item.ticketType.description,
                            variantId: item.ticketType.variants[0].id,
                            price: item.ticketType.variants[0].price
                        };
                    }),
                    form: _fieldConvertion(eventData.event.ticketForm.formFields),
                    formId: eventData.event.ticketForm.id,
                    venue: eventData.event.venue.name,
                    date: {
                        start: new Date(eventData.event.instances[0].startDateTime),
                        end: new Date(eventData.event.instances[0].endDateTime)
                    }
                };
            });
        }

        function calculateTotals(event, selectedTickets){
            var data = {
                eventId: event.id,
                businessId: event.businessId,
                order: {
                    items: _.map(selectedTickets, function(item){
                        var ticketType = _.find(event.ticketTypes, {id: item.id});
                        return { quantity: item.quantity, type: 3, ticketTypeVariantId: ticketType.variantId, eventInstanceId: event.instanceId };
                    })
                }
            };
            return api.calculateTotals(data).then(function(resp){
                return {
                    total: resp.orderTotals.totalAmount,
                    subtotal: resp.orderTotals.subtotalAmount,
                    items: _.map(resp.orderTotals.items, function(item){
                        return { title: item.title, total: item.itemTotal, variantId: item.ticketTypeVariantId };
                    })
                }
            });
        }

        function createCart(event, selectedTickets){
            var data = {
                eventInstanceId: event.instanceId,
                cart: {
                    items: _.map(selectedTickets, function(item){
                        return { quantity: item.quantity, type: 1, ticketTypeId: item.id, uniqueId: _generateGuid() };
                    })
                }
            };
            return api.createCart(data).then(function(resp){
                return { id: resp.cart.guid, expiresAt: resp.cart.expiresAt }
            });
        }

        function initPaymentProcessor(businessId){
            api.loadPaymentSettings(businessId).then(function(resp){
                var apiKey = resp.business.paymentSettings.publishableApiKey;
                Stripe.setPublishableKey(apiKey);
                paymentProcessorInited = true;
            });
        }

        function checkout(event, registration){
            var cc = registration.creditCard,
                creditCard = {
                    number: cc.number.value,
                    cvc: cc.cvc.value,
                    name: cc.name.value,
                    exp: cc.exp.value,
                    address_zip: cc.zip.value
                };
            return _createStripeToken(creditCard).then(function(token){
                var data = {
                    businessId: event.businessId,
                    reservationToken: registration.cart.id,
                    order: {
                        payment: {
                            tokenId: token,
                            type: 0
                        },
                        buyer: {
                            firstName: registration.items[0].form[0].value,
                            lastName: registration.items[0].form[1].value,
                            email: registration.items[0].form[2].value
                        },
                        items: _.map(registration.items, function(item){
                            return {
                                attendee: {
                                    firstName: item.form[0].value,
                                    lastName: item.form[1].value,
                                    email: item.form[2].value
                                },
                                quantity: 1,
                                eventInstanceId: event.instanceId,
                                ticketTypeVariantId: item.variantId,
                                type: 3,
                                ticketFormDynamicDataSet: {
                                    formFieldValues: _fieldConvertionBack(item.form.slice(3)),
                                    formId: event.formId
                                }
                            }
                        })
                    }
                };
                return api.createAndPay(data).then(function(resp){
                    return resp.orderId;
                });
            });
        }

        function _createStripeToken(creditCard){
            return $q(function(resolve, reject){
                Stripe.card.createToken(creditCard, function(status, response){
                    if (response.error){
                        reject(response.error.message);
                    }
                    else{
                        resolve(response.id);
                    }
                });
            });
        }

        function _generateGuid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }

        function _fieldConvertion(egFields){
            var convertors = {
                SingleLineTextFieldDto: function(item){
                    return { id: item.id, fieldId: item.field.id, label: item.field.name, type: 'text', validationRules:[] };
                },
                EmailFieldDto: function(item){
                    return { id: item.id, fieldId: item.field.id, label: item.field.name, type: 'email', validationRules:['email']};
                },
                PickListFieldDto: function(item){
                    return {
                        id: item.id,
                        fieldId: item.field.id,
                        label: item.field.name,
                        type: 'radio', validationRules:[],
                        options: _.map(item.field.options, function(opt){
                            return _.pick(opt, ['id', 'label']);
                        })
                    };
                }
            };

            var flds = _.filter(egFields, function(item){
                return item.status != 3 && !item.isSection;
            });

            var result = [];

             _.each(flds, function(item){
                 var convFn = convertors[item.field.typeName];
                 if(convFn){
                     var field = convFn(item);
                     if(item.status == 1){
                         field.validationRules.unshift('required');
                     }
                     result.push(field);
                 }
            });

            return result;
        }

        function _fieldConvertionBack(fields){
            var convertors = {
                text: function(field){
                    return {
                        id: field.fieldId,
                        formFieldId: field.id,
                        typeName: 'SingleLineTextFormFieldValueDto',
                        value: field.value
                    }
                },
                radio: function(field){
                    return {
                        id: field.fieldId,
                        formFieldId: field.id,
                        typeName: 'PickListFormFieldValueDto',
                        selectedOptionId: field.value
                    }
                }
            };

            return _.map(fields, function(field){
                return convertors[field.type](field);
            });
        }
    }
})();