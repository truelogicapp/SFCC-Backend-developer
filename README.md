SFCC SFRA Backend Developer Test
========

Usage of GIT is required. Create a repository for this task, solution for each STEP should be in a separate branch in your repository

### Considerations

*	The documentation starting on the README.md file need to be clear
*	We want to see not only the solution but also how you think and your working process, so please keep all your commits accessible and use proper naming standard for them
*	All steps are required so do not skip any. If you don't know, or don't feel comfortable with the required technology, just try your best and commit what you can

### STEP 1
Create a webhook to include three Custom Product attributes (Brand/MaxBuyQuantity/DiscountPercentage) into GET BASKET OCAPI
https://documentation.b2c.commercecloud.salesforce.com/DOC2/topic/com.demandware.dochelp/OCAPI/current/shop/Resources/Baskets.html?cp=0_15_3_0

#### Solution :
dw.ocapi.shop.basket.items.beforePOST
this extension is use to update the productlineItems of the basket and basketResponse

dw.ocapi.shop.basket.items.modifyPOSTResponse
this extension is use to update only the productlineItems of the basketResponse.

dw.ocapi.shop.basket.afterPATCH
this extension is use to the basket during the get response.

#### Configuration 
configure the resource id (customer and basket) in Open Commerce API Settings in global as well site level. 



