<template>
    <h3 class="pz-prod-head" :data-block-root="prodBlockRoot">
        <span class="pz-head-title" :data-block-root="prodBlockRoot">{{ getActualPrice(prodItem) }}</span>
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
                if(prodItem.onSale){
                    actualPrice = prodItem.salePrice;
                }else{
                    actualPrice = prodItem.normalPrice;
                }
                return prodItem.activeCurrency + ' ' + (ajaxFetch.number_format(parseFloat(actualPrice), 2, '.', "'"));
            }
        },

    }
</script>

<style scoped>

</style>