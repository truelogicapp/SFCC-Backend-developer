'use strict';

var page = module.superModule;

var server = require('server');


server.append('PlaceOrder', server.middleware.https, function (req, res, next) {
    var OrderMgr = require('dw/order/OrderMgr');
    var sendSMSMsg = require('*/cartridge/scripts/service/SMSService.js');
    var viewData = res.getViewData();

    if(viewData.error) {
        res.json(viewData);
        return next();
    }

    var order = OrderMgr.getOrder(viewData.orderID, viewData.orderToken);
    if (order) {
        var phoneNumber = order.defaultShipment.shippingAddress.phone;
        if (phoneNumber) {
            var svc = sendSMSMsg.getOrderConfirmationSMS();
            var svcResult = svc.call(phoneNumber);
        }
    }

    res.json(viewData);
    return next();
});


module.exports = server.exports();
