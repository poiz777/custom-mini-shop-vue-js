<template>
    <h3 class="pz-prod-head" :data-block-root="prodBlockRoot">
        <span v-html="getActualPrice(prodItem)"></span>
    </h3>
</template>

<script>
	import ajaxFetch  from '@/Services/JQAjax';
    export default {
        name: "ItemPriceBlock",
        props: ['prodItem', 'prodBlockRoot'],

        data: function(){
            return {
                preLoaderURI: '/assets/images/icons/pz-loader-05.gif',
            }
        },

        methods: {
            getActualPrice(prodItem){
                let actualPrice = 0.00;
                let strSaleTag  = "";
                let strikePrice = "";
                if(parseInt(prodItem.onSale) === 1){
                    strSaleTag  = "<span class='fa fa-tags'></span>&nbsp; ";
                    strikePrice = "<small id='pz-norm-price-box-" + prodItem.productID +
                                    "' class='pz-norm-price-box pz-strike' data-block-root='" + this.prodBlockRoot +"'>\n" +
                                    prodItem.activeCurrency + ' ' + (ajaxFetch.number_format(parseFloat(prodItem.normalPrice), 2, '.', "'")) + "</small>";
                    actualPrice = prodItem.salePrice;
                }else{
                    actualPrice = prodItem.normalPrice;
                }
                return "<span id='pz-price-box-" + this.prodItem.productID + "' class='pz-price-box' data-block-root='" + this.prodBlockRoot + "'>" +
                        strSaleTag + prodItem.activeCurrency + ' ' + (ajaxFetch.number_format(parseFloat(actualPrice), 2, '.', "'")) + "</span>" +
                        strikePrice;

            }
        },

    }
</script>

<style scoped>

</style>