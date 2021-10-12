'use strict';
var system = require('dw/system');
var Site = require('dw/system/Site');
var CurrentSite = Site.current.preferences;
var preferences = CurrentSite ? CurrentSite.custom : {};
var StringUtils = require('dw/util/StringUtils')

var LocalServiceRegistry = require('dw/svc/LocalServiceRegistry');
/**
 * Creates a Local Services Framework service definition
 *
 * @returns {dw.svc.Service} - The created service definition.
 */
function getOrderConfirmationSMS() {

    return LocalServiceRegistry.createService('SendOrderConfirmationMsg', {

        /**
         * A callback function to configure HTTP request parameters before
         * a call is made to Stripe web service
         *
         * @param {dw.svc.Service} svc Service instance
         * @param {string} phoneNumber - Request payload
         * @returns {string} - The body of HTTP request
         */
        createRequest: function(svc, phoneNumber) {
            var account_SID = preferences.account_SID;
            var auth_Token = preferences.auth_Token;
            var senderNumber = preferences.senderNumber;
            var message = preferences.message;

            svc.setRequestMethod('POST');
            svc.addHeader('Content-Type', 'application/x-www-form-urlencoded');
            svc.addHeader('Authorization', 'Basic ' + StringUtils.encodeBase64(account_SID + ':' + auth_Token));
            var arg = 'To='+ phoneNumber + '&from=' + senderNumber + '&message=' + message;
            return arg;
        },

        /**
         * A callback function to parse web service response
         *
         * @param {dw.svc.Service} svc - Service instance
         * @param {dw.net.HTTPClient} httpClient - HTTP client instance
         * @returns {string} - Response body in case of a successful request or null
         */
        parseResponse: function(svc, httpClient) {
            return JSON.parse(httpClient.text);
        },

        mockCall: function (svc) {
            return {
                statusCode: 200,
                statusMessage: 'Success',
                text: 'MOCK RESPONSE (' + svc.URL + ')'
            };
        },
        
        getRequestLogMessage: function (request) {
            return request;
        },

        getResponseLogMessage: function (response) {
            return !empty(response.getText()) ? response.getText().substr(0, 100) + '\n\n...[no need to log all the content]\n\n' : 'Response is empty.';
        }
    });
}

module.exports = {
    getOrderConfirmationSMS: getOrderConfirmationSMS
};