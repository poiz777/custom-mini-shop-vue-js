<template>
    <section  v-bind:class="getColumnClass()" v-if="wrapContent">
        <div class="pz-product-wrapper" :id="getBlockRootID(prodItem.productID)">
            <ItemTitleHeaderBlock :prodID="prodItem.productID"
                                  :prodTitle="prodItem.productTitle"
                                  :prodBlockRoot="getBlockRootID(prodItem.productID, '#')"
                                  :prodCartURI="shoppingCartUrl"></ItemTitleHeaderBlock>

            <ItemAddOrRemoveBlock :prodItem="prodItem"
                                  :restAccessURI="restAccessURI"
                                  :prodBlockRoot="getBlockRootID(prodItem.productID, '#')"
                                  :prodPageURI="prodItem.vueRoute"></ItemAddOrRemoveBlock>

            <ItemPriceBlock :prodItem="prodItem"
                            :prodBlockRoot="getBlockRootID(prodItem.productID, '#')"></ItemPriceBlock>

            <ItemSocialsBlock :prodItem="prodItem"
                              :prodBlockRoot="getBlockRootID(prodItem.productID, '#')"></ItemSocialsBlock>

            <itemImageBlock :prodItem="prodItem"
                            :prodPixURI="restAccessURI + prodItem.productPix"
                            :prodPageURI="prodItem.vueRoute"
                            :prodBlockRoot="getBlockRootID(prodItem.productID, '#')"></itemImageBlock>

            <ItemQTBottomBlock :prodItem="prodItem"
                               :prodBlockRoot="getBlockRootID(prodItem.productID, '#')"></ItemQTBottomBlock>

        </div>
    </section>
    <section v-else >
        <div class="pz-product-wrapper" :id="getBlockRootID(prodItem.productID)">
            <ItemTitleHeaderBlock :prodID="prodItem.productID"
                                  :prodTitle="prodItem.title"
                                  :prodBlockRoot="getBlockRootID(prodItem.productID, '#')"
                                  :prodCartURI="shoppingCartUrl"></ItemTitleHeaderBlock>

            <ItemAddOrRemoveBlock :prodItem="prodItem"
                                  :restAccessURI="restAccessURI"
                                  :prodPageURI="prodItem.vueRoute"></ItemAddOrRemoveBlock>

            <ItemPriceBlock :prodItem="prodItem"
                            :prodBlockRoot="getBlockRootID(prodItem.productID, '#')"></ItemPriceBlock>

            <ItemSocialsBlock :prodItem="prodItem"
                              :prodBlockRoot="getBlockRootID(prodItem.productID, '#')"></ItemSocialsBlock>

            <itemImageBlock :prodItem="prodItem"
                            :prodPixURI="restAccessURI + prodItem.productPix"
                            :prodPageURI="prodItem.vueRoute"
                            :prodBlockRoot="getBlockRootID(prodItem.productID, '#')"></itemImageBlock>

            <ItemQTBottomBlock :prodItem="prodItem"
                               :prodBlockRoot="getBlockRootID(prodItem.productID, '#')"></ItemQTBottomBlock>

        </div>
    </section>
</template>

<script>
	import ItemImageBlock             from '@/sub-components/ItemImageBlock';
	import ItemPriceBlock             from '@/sub-components/ItemPriceBlock';
	import ItemSocialsBlock           from '@/sub-components/ItemSocialsBlock';
	import ItemQTBottomBlock          from '@/sub-components/ItemQTBottomBlock';
	import ItemTitleHeaderBlock       from '@/sub-components/ItemTitleHeaderBlock';
	import ItemAddOrRemoveBlock       from '@/sub-components/ItemAddOrRemoveBlock';
	import ItemAttributesDataBlock    from '@/sub-components/ItemAttributesDataBlock';
	import sMeths                     from "@/Services/SharedMethods";
	export default {
		name: "Item",
		props: ['dataIndex', 'cue', 'colNum', 'wrapContent', 'prodItem'],
		components: {
			ItemPriceBlock,
			ItemImageBlock,
			ItemSocialsBlock,
			ItemQTBottomBlock,
			ItemTitleHeaderBlock,
			ItemAddOrRemoveBlock,
			ItemAttributesDataBlock,
		},

		data: function(){
			return {
				shoppingCartUrl : '/shopping-cart/basket',
				restAccessURI : 'http://sim-rest.poiz.me/'
			};
		},

		methods : {
			...sMeths,
			...{
				getColumnClass : function(){
					this.colNum = (!this.colNum) ? 12: this.colNum;
					return 'col-xs-12 ' + 'col-md-' + this.colNum + ' col-lg-'+ this.colNum;
				},

				getBlockRootID : function(id, prefix){
					prefix = (undefined === prefix) ? '' : prefix;
					return prefix + 'pz-product-wrapper-' + id
				},
			}
		},
	}
</script>

<style scoped>
</style>