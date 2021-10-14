'use strict';

var collections = require('*/cartridge/scripts/util/collections');
var urlHelper = require('*/cartridge/scripts/helpers/urlHelpers');
var ImageModel = require('*/cartridge/models/product/productImages');
var productHelper = require('*/cartridge/scripts/helpers/productHelpers');



/**
 * Retrieve all attribute values
 *
 * @param {dw.catalog.ProductVariationModel} variationModel - A product's variation model
 * @param {dw.catalog.ProductVariationAttributeValue} selectedValue - Selected attribute value
 * @param {dw.catalog.ProductVariationAttribute} attr - Attribute value'
 * @param {string} endPoint - The end point to use in the Product Controller
 * @param {string} selectedOptionsQueryParams - Selected options query params
 * @param {string} quantity - Quantity selected
 * @returns {Object[]} - List of attribute value objects for template context
 */
function getAllAttrValues(
    variationModel,
    selectedValue,
    attr,
    endPoint,
    selectedOptionsQueryParams,
    quantity
) {
    var attrValues = variationModel.getAllValues(attr);
    var actionEndpoint = 'Product-' + endPoint;
    var HashMap = require('dw/util/HashMap');
    var hashMap = new HashMap();

    return collections.map(attrValues, function (value) {
        var isSelected = (selectedValue && selectedValue.equals(value)) || false;
        var valueUrl = '';
        var availableInventory = 0;

        var processedAttr = {
            id: value.ID,
            description: value.description,
            displayValue: value.displayValue,
            value: value.value,
            selected: isSelected,
            selectable: variationModel.hasOrderableVariants(attr, value),
            availableInventory: availableInventory
        };

        hashMap.put(attr.ID, value.ID);
        var variationAttributes = variationModel.getProductVariationAttributes().iterator();
        while (variationAttributes.hasNext()) {
            var variationAttribute = variationAttributes.next();
            if (variationAttribute.ID !== attr.ID) {
                var vaSelectedValue = variationModel.getSelectedValue(variationAttribute);
                if (vaSelectedValue) {
                    hashMap.put(variationAttribute.ID, vaSelectedValue.ID);
                }
            }
        }
        var variants = variationModel.getVariants(hashMap);
        var count = 0;
        for (var i = 0; i < variants.length; i++) {
            var onHoldExchange = 0;
            if (variants[i].availabilityModel && variants[i].availabilityModel.inventoryRecord) {
                count += variants[i].availabilityModel.inventoryRecord.ATS.value;
            }
        }
        processedAttr.availableInventory = count;
        if (count > 0) {
            processedAttr.selectable = true;
        } else {
            processedAttr.selectable = false;
        }
        return processedAttr;
    });
}


/**
 * @constructor
 * @classdesc Get a list of available attributes that matches provided config
 *
 * @param {dw.catalog.ProductVariationModel} variationModel - current product variation
 * @param {Object} attrConfig - attributes to select
 * @param {Array} attrConfig.attributes - an array of strings,representing the
 *                                        id's of product attributes.
 * @param {string} attrConfig.attributes - If this is a string and equal to '*' it signifies
 *                                         that all attributes should be returned.
 *                                         If the string is 'selected', then this is comming
 *                                         from something like a product line item, in that
 *                                         all the attributes have been selected.
 *
 * @param {string} attrConfig.endPoint - the endpoint to use when generating urls for
 *                                       product attributes
 * @param {string} selectedOptionsQueryParams - Selected options query params
 * @param {string} quantity - Quantity selected
 */
function VariationAttributesModel(variationModel, attrConfig, selectedOptionsQueryParams, quantity) {
    var allAttributes = variationModel.productVariationAttributes;
    var result = [];
    collections.forEach(allAttributes, function (attr) {
        if (attr.ID === 'color') {
            var selectedValue = variationModel.getSelectedValue(attr);
            var values = getAllAttrValues(variationModel, selectedValue, attr, attrConfig.endPoint,
                selectedOptionsQueryParams, quantity);
            var resetUrl = getAttrResetUrl(values, attr.ID);
    
            if ((Array.isArray(attrConfig.attributes)
                && attrConfig.attributes.indexOf(attr.attributeID) > -1)
                || attrConfig.attributes === '*') {
                result.push({
                    attributeId: attr.attributeID,
                    displayName: attr.displayName,
                    id: attr.ID,
                    swatchable: isSwatchable(attr.attributeID),
                    values: values,
                    resetUrl: resetUrl
                });
            } else if (attrConfig.attributes === 'selected') {
                result.push({
                    displayName: attr.displayName,
                    displayValue: selectedValue && selectedValue.displayValue ? selectedValue.displayValue : '',
                    attributeId: attr.attributeID,
                    id: attr.ID
                });
            }
        }
        
    });
    result.forEach(function (item) {
        this.push(item);
    }, this);
}

VariationAttributesModel.prototype = [];

module.exports = VariationAttributesModel;
