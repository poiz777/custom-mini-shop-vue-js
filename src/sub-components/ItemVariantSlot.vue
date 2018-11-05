<template>
    <div :id="'pz-variant-slot-'+ variantsCluster.aids[cursor]" class="pz-variant-slot" :data-block-root="prodBlockRoot">
        <div id="pz-variant-link-4" class="pz-variant-link" :data-href="getDetailPageURI(prodItem)"
             :data-block-root="prodBlockRoot">
            <img :id="'pz-variant-pix-' + variantsCluster.aids[cursor]" class="pz-variant-pix thumbnail"
                 :src="restAccessURI + variantsCluster.images[cursor]"
                 style="width: 100%;"
                 :data-pid="prodItem.productID"
                 :data-aid="variantsCluster.aids[cursor]"
                 :data-cid="prodItem.productCID"
                 data-action="getProductVariantData"
                 :data-processor="getVariantProcessor()"
                 :data-endpoint="getVariantEndPoint()"
                 :data-block-root="prodBlockRoot">
        </div>
        <aside :id="'pz-color-slot-' + variantsCluster.aids[cursor]" class="pz-color-slot" :data-block-root="prodBlockRoot">
            <span class="pz-color-unit" :style="getBackgroundStyle()"></span>
            <span class="pz-price-unit">{{ getVariantPrice() }}</span>
        </aside>
    </div>
</template>

<script>
    import sMeths       from '@/Services/SharedMethods';
    import ajaxFetch    from '@/Services/JQAjax';

    export default {
        name: "ItemVariantSlot",
        props: ['prodBlockRoot', 'variantsCluster', 'prodItem', 'cursor'],
        components: {},
        data: function(){
            return {
                restAccessURI : 'http://sim-rest.poiz.me/',
            };
        },

        created: function(){
            sMeths.bindActionEvents();
        },
        methods: {
            getDetailPageURI(prodItem){
                return  '/item/' + prodItem.productAlias + '/' + prodItem.productAID + '/' + prodItem.productCID + '/' + prodItem.productID
            },

            getBackgroundStyle(){
                return  'background: ' + this.getRGBTranspose(this.variantsCluster.colors[this.cursor]) + ';';
            },

            getVariantEndPoint(){
                return  ajaxFetch.endPointBaseURL + '/get_variants/' + this.variantsCluster.aids[this.cursor] + '/' + this.prodItem.productCID + '/' + this.prodItem.productID;
            },

            getVariantProcessor(){
                return  this.getVariantEndPoint();
            },

            getVariantPrice(){
                return  (parseInt(this.prodItem.onSale) === 1) ?
                        ajaxFetch.number_format(this.variantsCluster.salePrices[this.cursor], 2, '.', "'"):
                        ajaxFetch.number_format(this.variantsCluster.prices[this.cursor], 2, '.', "'");
            },
            getRGBTranspose(color){
                let objColorMap         = {};
                objColorMap["BLACK"]    = "rgba(0, 0, 0, 1)";
                objColorMap["BLUE"]     = "rgba(0, 0, 170, 1)";
                objColorMap["BROWN"]    = "rgba(125, 68, 40, 1)";
                objColorMap["SILVER"]   = "rgba(191, 192, 191, 1)";
                objColorMap["GOLDEN"]   = "rgba(150, 107, 36, 1)";
                objColorMap["GREEN"]    = "rgba(0, 170, 0, 1)";
                objColorMap["ORANGE"]   = "rgba(233, 131, 0, 1)";
                objColorMap["PINK"]     = "rgba(255, 13, 159, 1)";
                objColorMap["YELLOW"]   = "rgba(255, 216, 0, 1)";
                objColorMap["WHITE"]    = "rgba(254, 255, 253, 1);text-shadow: 1px 1px 1px rgba(210, 161, 111, 0.95);";
                objColorMap["NONE"]     = "rgba(255, 255, 255, 0.01);text-shadow: 1px 1px 1px rgba(210, 161, 111, 0.95);";
                objColorMap["--"]       = "rgba(255, 255, 255, 0.01);text-shadow: 1px 1px 1px rgba(210, 161, 111, 0.95);";
                objColorMap["RED"]      = "rgba(190, 0, 0, 1)";
                objColorMap["GRAY"]     = "rgba(147, 148, 147, 1)";
                objColorMap["ASH"]      = "rgba(191, 192, 191, 1)";
                objColorMap["OTHER"]    = "rgba(0, 0, 255, 1)";
                objColorMap["RAINBOW"]  = "background: #ff0000; /* Old browsers */"+
                        "background: -moz-linear-gradient(top,  #ff0000 0%, #ff7423 15%, #ffff00 32%, #00ff00 47%, #0000ff 64%, #882ffc 83%, #c170ff 100%); /* FF3.6+ */"+
                        "background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#ff0000), color-stop(15%,#ff7423), color-stop(32%,#ffff00), color-stop(47%,#00ff00), color-stop(64%,#0000ff), color-stop(83%,#882ffc), color-stop(100%,#c170ff)); /* Chrome,Safari4+ */"+
                        "background: -webkit-linear-gradient(top,  #ff0000 0%,#ff7423 15%,#ffff00 32%,#00ff00 47%,#0000ff 64%,#882ffc 83%,#c170ff 100%); /* Chrome10+,Safari5.1+ */"+
                        "background: -o-linear-gradient(top,  #ff0000 0%,#ff7423 15%,#ffff00 32%,#00ff00 47%,#0000ff 64%,#882ffc 83%,#c170ff 100%); /* Opera 11.10+ */"+
                        "background: -ms-linear-gradient(top,  #ff0000 0%,#ff7423 15%,#ffff00 32%,#00ff00 47%,#0000ff 64%,#882ffc 83%,#c170ff 100%); /* IE10+ */"+
                        "background: linear-gradient(to bottom,  #ff0000 0%,#ff7423 15%,#ffff00 32%,#00ff00 47%,#0000ff 64%,#882ffc 83%,#c170ff 100%); /* W3C */"+
                        "filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ff0000', endColorstr='#c170ff',GradientType=0 ); /* IE6-9 */";
                objColorMap["MIXED"]    = objColorMap["RAINBOW"];
	
                if( objColorMap[color.toUpperCase()] !== undefined){
                    return objColorMap[color.toUpperCase()];
                }
                return objColorMap["NONE"];
            }
        }
    }
</script>

<style scoped>

</style>


/*
aids: (3) ["2", "3", "4"]
colors: (3) ["PINK", "BLUE", "BLACK"]
images: (3) ["images/product_images/_prod_img_20C7E0ED40E2BFC43A__0.jpg", "images/product_images/_prod_img_B89C492535D601403E__0.jpg", "images/product_images/_prod_img_7BCF6A7DDE8F6B9895__0.jpg"]
prices: (3) ["395", "380", "420"]
salePrices: (3) ["390", "370", "410"]
saleStates: (3) ["1", "0", "0"]
*/