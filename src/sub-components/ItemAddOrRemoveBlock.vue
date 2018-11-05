<template>
    <div class="pz-qty-count-order-wrapper" :data-block-root="prodBlockRoot">
        <span :id="'pz-add-item-' + prodItem.productID"
              v-on:click='addItemsToCart'
              v-bind:data-id="prodItem.productID"
              v-bind:data-aid="prodItem.productAID"
              v-bind:data-cid="prodItem.productCID"
              v-bind:data-processor="getProcessor(prodItem)"
              v-bind:data-gif="getPreLoaderIcon(prodItem)"
              v-bind:data-action="prodItem.dataAddAction"
              v-bind:data-price="getActualPrice(prodItem)"
              v-bind:data-name="prodItem.productTitle"
              v-bind:data-alias="prodItem.productAlias"
              v-bind:data-currency="prodItem.activeCurrency"
              v-bind:data-thumb-url="restAccessURI + prodItem.productPix"
              v-bind:data-endpoint="getAddItemEndPoint(prodItem)"
              v-bind:data-block-root="prodBlockRoot"
              class="fa fa-plus pz-add-to-cart-icon">
        </span>

        <div class="pz-qty-count-box" :data-block-root="prodBlockRoot">
            <span class="pz-qty-wrapper" :data-block-root="prodBlockRoot">
                <input type="number" name="qty" value="" placeholder="1" :id="'prodQty' + prodItem.productID"
                       v-bind:onkeypress="handleKeyPress"
                       v-bind:data-id="prodItem.productID"
                       v-bind:data-aid="prodItem.productAID"
                       v-bind:data-cid="prodItem.productCID"
                       v-bind:data-processor="getProcessor(prodItem)"
                       v-bind:data-gif="getPreLoaderIcon(prodItem)"
                       v-bind:data-block-root="prodBlockRoot"
                       class="pz-qty" />
            </span>
            <span :id="'countSlot' + prodItem.productID"
                  v-bind:data-id="prodItem.productID"
                  v-bind:data-aid="prodItem.productAID"
                  v-bind:data-cid="prodItem.productCID"
                  v-bind:data-processor="getProcessor(prodItem)"
                  v-bind:data-gif="getPreLoaderIcon(prodItem)"
                  v-bind:data-block-root="prodBlockRoot"
                  class="pz-count-slot">
                <span>{{ orderQuantity }}&nbsp;&nbsp;{{ separator }}&nbsp;&nbsp;{{ orderTotal }}</span>
            </span>
        </div>

        <span :id="'pz-delete-item-' + prodItem.productID"
              v-on:click='deleteItemsFromCart'
              v-bind:data-id="prodItem.productID"
              v-bind:data-aid="prodItem.productAID"
              v-bind:data-cid="prodItem.productCID"
              v-bind:data-processor="getProcessor(prodItem)"
              v-bind:data-gif="getPreLoaderIcon(prodItem)"
              v-bind:data-action="prodItem.dataDelAction"
              v-bind:data-price="getActualPrice(prodItem)"
              v-bind:data-name="prodItem.productTitle"
              v-bind:data-alias="prodItem.productAlias"
              v-bind:data-currency="prodItem.activeCurrency"
              v-bind:data-thumb-url="restAccessURI + prodItem.productPix"
              v-bind:data-endpoint="getDeleteItemEndPoint(prodItem)"
              v-bind:data-block-root="prodBlockRoot"
              class="fa fa-minus pz-delete-from-cart-icon">
        </span>
    </div>

</template>

<script>
    import ajaxFetch    from '@/Services/JQAjax';
    import sMeths       from "@/Services/SharedMethods";

    export default {
        name: "ItemAddOrRemoveBlock",

        props: ['prodItem', 'prodBlockRoot', 'restAccessURI'],

        data : function(){
            return {
                psm: ajaxFetch.psm,
                separator:  '--',
                orderTotal: null,
                orderQuantity: null,
            }
        },

        methods : {
            ...sMeths,
            ...{
                handleKeyPress: function () {
                    
                },
                getAddItemEndPoint: function (prodItem) {
                    return ajaxFetch.endPointBaseURL + ajaxFetch.addItemEndPoint + prodItem.productAID  + '/'  + prodItem.productCID + '/'  + prodItem.productID + '/1';
                },
                getDeleteItemEndPoint: function (prodItem) {
                    return ajaxFetch.endPointBaseURL +  ajaxFetch.delItemEndPoint + prodItem.productAID  + '/'  + prodItem.productCID + '/'  + prodItem.productID + '/1';
                },
                getActualPrice(prodItem){
                    let  actualPrice = (parseInt(prodItem.onSale) === 1) ? prodItem.salePrice: prodItem.normalPrice;
                    return parseFloat(actualPrice);
                },
                getPreLoaderIcon(prodItem){
                    return '';
                },
                getProcessor(prodItem){
                    return '';
                }

            }
        },

        created: function(){
            let a, b;
            let orderData       = this.psm.get('poizShopApp', 'orderedItems');

            for(let cue in orderData){
                if(cue === this.prodItem.productID){
                    this.orderQuantity  = (a = orderData[cue]['qty'])   ? a : 0;
                    this.orderTotal     = (b = orderData[cue]['total']) ? orderData[cue]['currency'] + ' ' + ajaxFetch.number_format(b, 2, '.', "'") : '0.00';
                    this.separator      = (this.orderQuantity) ? '|' : '--';
                    break;
                }
            }
        },
    }
</script>

<style scoped>

</style>