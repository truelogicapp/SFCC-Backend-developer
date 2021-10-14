'use strict';

var decorators = require('*/cartridge/models/product/decorators/index');
var ProductMgr = require('dw/catalog/ProductMgr');
var Resource = require('dw/web/Resource');

/**
 * Decorate product with full product information
 * @param {Object} product - Product Model to be decorated
 * @param {dw.catalog.Product} apiProduct - Product information returned by the script API
 * @param {Object} options - Options passed in from the factory
 * @property {dw.catalog.ProductVarationModel} options.variationModel - Variation model returned by the API
 * @property {Object} options.options - Options provided on the query string
 * @property {dw.catalog.ProductOptionModel} options.optionModel - Options model returned by the API
 * @property {dw.util.Collection} options.promotions - Active promotions for a given product
 * @property {number} options.quantity - Current selected quantity
 * @property {Object} options.variables - Variables passed in on the query string
 *
 * @returns {Object} - Decorated product model
 */

 function fullProduct(product, apiProduct, options) {
    // get only the color variation in decorators.
    decorators.variationClrAttributes(product, options.variationModel, {
        attributes: '*',
        endPoint: 'Variation',
        selectedOptionsQueryParams: options.optionModel ? options.optionModel.url('Product-Variation').toString() : ''
    });

 }