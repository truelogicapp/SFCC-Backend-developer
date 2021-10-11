var Logger = require('dw/system/Logger');
var ProductMgr = require('dw/catalog/ProductMgr');
var Status = require('dw/system/Status');

exports.modifyGETResponse = function (basket, basketResponse) {
    try{
        var lineItems = basketResponse.productItems.iterator();
        while(lineItems.hasNext()){
            var lineItem = lineItems.next();
            var product = ProductMgr.getProduct(lineItem.productId);
            // set productlineItems custom attribute in basketresposne
            if (!empty(product)) {
                lineItem.c_discountPercentage = 'discountPercentage' in product.custom && product.custom.discountPercentage ?  product.custom.discountPercentage : '';
                lineItem.c_maxBuyQuantity = 'maxBuyQuantity' in product.custom && product.custom.maxBuyQuantity ?  product.custom.maxBuyQuantity : '';
                lineItem.c_brand = 'brand' in product.custom && product.custom.brand ? product.custom.brand : '';
            }
        }
    } catch(e) {
        var errorMsg = e.fileName + "| line#:" + e.lineNumber + "| Message:" + e.message + "| Stack:" + e.stack;
        Logger.error("item_hook_scripts.beforePOST()" + errorMsg);
    }

    return new Status(Status.OK);
}