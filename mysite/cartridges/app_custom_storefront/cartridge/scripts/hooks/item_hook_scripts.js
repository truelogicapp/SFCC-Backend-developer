
var Logger = require('dw/system/Logger');
var ProductMgr = require('dw/catalog/ProductMgr');
var Status = require('dw/system/Status');

/**
 * update the custom attribute in productlineItems
 * @param {Object} item - productlineItem of basket/basketResponse
 * @param {Object} product - product object
 * @returns {Object} item - updated productlineItem 
 */
function updateLineitem(item, product) {
    item.c_discountPercentage = 'discountPercentage' in product.custom && product.custom.discountPercentage ?  product.custom.discountPercentage : '';
    item.c_maxBuyQuantity = 'maxBuyQuantity' in product.custom && product.custom.maxBuyQuantity ?  product.custom.maxBuyQuantity : '';
    item.c_brand = 'brand' in product.custom && product.custom.brand ? product.custom.brand : '';

    return item;
}

// set the productlineitems custom attribute of basketResponse as well in basket
exports.beforePOST = function (basket, items) {
    try{
        for each(var item in items) {
            var product = ProductMgr.getProduct(item.productId);
            // set the values of product level custom attribute values in added request items 
            if (!empty(product)) {
                updateLineitem(item, product);
            }
        }
    } catch(e) {
        var errorMsg = e.fileName + "| line#:" + e.lineNumber + "| Message:" + e.message + "| Stack:" + e.stack;
        Logger.error("item_hook_scripts.beforePOST()" + errorMsg);
    }

    return new Status(Status.OK);
}

// set the productlineitems custom attribute of only basketResponse
exports.modifyPOSTResponse = function (basket, basketResponse, productItems) {
    try {
        for each(var productItem in productItems) {
            var currentItemId = productItem.productId;
            var lineItems = basketResponse.productItems.iterator();
            while(lineItems.hasNext()){
                var lineItem = lineItems.next();
                var product = ProductMgr.getProduct(currentItemId);
                // set productlineItems custom attribute in basketresposne
                if (currentItemId === lineItem.productId && !empty(product)) {
                    updateLineitem(lineItem, product);
                }
            }
        }
    } catch(e) {
        var errorMsg = e.fileName + "| line#:" + e.lineNumber + "| Message:" + e.message + "| Stack:" + e.stack;
        Logger.error("item_hook_scripts.modifyPOSTResponse()" + errorMsg);
    }
    return new Status(Status.OK);
}


