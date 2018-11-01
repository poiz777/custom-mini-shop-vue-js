<template>
    <div class="pz-qty-total-wrapper-bottom" :data-block-root="prodBlockRoot">
        <h3 class="pz-prod-head" :data-block-root="prodBlockRoot">
            <span :id="'pz-qty-bottom-' + prodItem.productID" class="pz-qty-bottom" style="">
                <span class="pz-sub-text-pod">QUANTITY:</span>
                <span class="pz-sub-val-pod" :id="'pz-sub-val-qty-' + prodItem.productID">{{ orderQuantity }}</span>
            </span>
            <span :id="'pz-price-bottom-' + prodItem.productID"  class="pz-price-bottom">
                <span class="pz-sub-text-pod">TOTAL [{{ prodItem.activeCurrency }}]:</span>
                <span class="pz-sub-val-pod" :id="'pz-sub-val-total-' + prodItem.productID">{{ orderTotal }}</span>
            </span>
        </h3>
    </div>
</template>

<script>
    import ajaxFetch            from '@/Services/JQAjax';
    import sMeths               from "@/Services/SharedMethods";
    import ItemSocialsBlock     from '@/sub-components/ItemSocialsBlock';

    export default {
        name: "ItemQTBottomBlock",

        props: ['prodItem', 'prodBlockRoot', 'restAccessURI'],
        components: {
            ItemSocialsBlock
        },

        data : function(){
            return {
                psm: ajaxFetch.psm,
                orderTotal: '0.00',
                orderQuantity: 0,
            }
        },

        methods : {
            ...sMeths,
            ...{
                handleKeyPress: function () {
                    
                },
            }
        },

        created: function(){
            let a, b;
            let orderData       = this.psm.get('poizShopApp', 'orderedItems');

            for(let cue in orderData){
                if(cue === this.prodItem.productAID){
                    this.orderQuantity  = (a = orderData[cue]['qty'])   ? a : 0;
                    this.orderTotal     = (b = orderData[cue]['total']) ? ajaxFetch.number_format(b, 2, '.', "'") : '0.00';
                    break;
                }
            }
        },

    }
</script>

<style scoped>
    .pz-qty-total-wrapper-bottom .pz-prod-head{
        border-top:none !important;
        border-bottom: solid 1px #c5c5c5  !important;
    }
    .pz-qty-bottom,
    .pz-price-bottom{
        display: inline-block;
        width:40%;
    }

    .pz-qty-bottom{
        margin-right:5%;
        text-align:left;
    }
    .pz-price-bottom{
        margin-left:5%;
        text-align:right;
    }

    .pz-sub-val-pod,
    .pz-sub-text-pod{
        display:block;
    }

    .pz-sub-text-pod{
        font-size:9px;
        color: #824242;
    }
</style>
