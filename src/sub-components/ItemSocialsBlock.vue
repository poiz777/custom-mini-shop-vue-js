<template>
    <div class="pz-socials-wrapper" :data-block-root="prodBlockRoot">
        <div class="col-md-12">
            <div class="col-md-2 pz-icon-pod"><a class="fa fa-facebook" v-bind:href="prodItem.facebookLinkURL" target="_blank"></a></div>
            <div class="col-md-2 pz-icon-pod"><a class="fa fa-twitter" v-bind:href="prodItem.twitterLinkURL" target="_blank"></a></div>
            <div class="col-md-2 pz-icon-pod"><a class="fa fa-xing" v-bind:href="prodItem.xingLinkURL" target="_blank"></a></div>
            <div class="col-md-2 pz-icon-pod"><a class="fa fa-linkedin" v-bind:href="prodItem.linkedinLinkURL" target="_blank"></a></div>
            <div class="col-md-2 pz-icon-pod"><a class="fa fa-instagram" v-bind:href="prodItem.instagramLinkURL" target="_blank"></a></div>
            <div class="col-md-2 pz-icon-pod"><a class="fa fa-google-plus" v-bind:href="prodItem.recommendLinkURL" target="_blank"></a></div>
        </div>
    </div>
</template>

<script>
    import ajaxFetch    from '@/Services/JQAjax';
    import sMeths       from "@/Services/SharedMethods";

    export default {
        name: "ItemSocialsBlock",

        props: ['prodItem', 'prodBlockRoot', 'restAccessURI'],

        data : function(){
            return {
                psm: ajaxFetch.psm,
                separator: null,
                orderTotal: null,
                orderQuantity: null,
            }
        },

        methods : {
            ...sMeths,
            ...{
                handleKeyPress: function () {
                    
                },

                fetchQuantityTotalFromStore: function (pid, toFetch ) {
                    let returnVal               = null;
                    let orderItemsCollection    = this.psm.get('poizShopApp', 'orderedItems');
                    if(orderItemsCollection === undefined || !orderItemsCollection){return returnVal;}
                    let order                   = orderItemsCollection[this.prodItem.id];
                    if(order === undefined || !order){return returnVal;}

                    if(toFetch === 'qty'){
                        returnVal   =  order.qty;
                    }else if(toFetch === 'total'){
                        returnVal   = order.currency + ' ' + ajaxFetch.number_format(parseFloat(order.total),  2, '.', "'");
                    }else{
                        returnVal = {qty: order.qty, total: order.currency + ' ' + ajaxFetch.number_format(parseFloat(order.total),  2, '.', "'")}
                    }

                    return returnVal;
                },
            }
        },

        created: function(){
            this.orderQuantity  = this.fetchQuantityTotalFromStore(this.prodItem.id, 'qty');
            this.orderTotal     = this.fetchQuantityTotalFromStore(this.prodItem.id, 'total');
            this.separator      = (this.orderQuantity) ? '|' : '--';
        },

    }
</script>

<style scoped>
    .pz-socials-wrapper {
        zoom: 1;
        padding:10px 0;
    }

    .pz-socials-wrapper:before, .pz-socials-wrapper:after {
        content: "";
        display: table
    }

    .pz-socials-wrapper:after {
        clear: both
    }

    .pz-socials-wrapper {
        background: #d6d6d6;
        border: solid 1px #c5c5c5;
        border-bottom: none
    }

    .pz-socials-wrapper .pz-icon-pod{
        text-align: center;
        margin: 0 auto;
        color: #a2a2a2;
        transition: all 0.5s;
    }

    .pz-socials-wrapper .pz-icon-pod a.fa{
        text-align: center;
        margin: 0 auto;
        font-size: 18px;
        color: #a2a2a2;
        transition: all 0.5s;
        text-decoration:none;
    }

    .pz-socials-wrapper .pz-icon-pod,
    .pz-socials-wrapper .pz-icon-pod a.fa:hover{
        color: #404040;
    }

</style>