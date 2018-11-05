<template>
    <div class="pz-pix-box" :data-block-root="prodBlockRoot">
        <!-- YOU MAY WRAP WITHIN <router link></router-link> FOR ROUTING PURPOSES -->
        <a :href="getDetailPageURI(prodItem)" class="" :data-block-root="prodBlockRoot">
            <img :src="prodPixURI" :data-block-root="prodBlockRoot" class="thumbnail pz-prod-pix" style="width: 100%;">
        </a>
        <ItemVariantsBlock :prodItem="prodItem" :variantsCluster="getVariantsCluster(prodItem)" :prodBlockRoot="prodBlockRoot"></ItemVariantsBlock>
    </div>
</template>

<script>
    import ItemSocialsBlock     from '@/sub-components/ItemSocialsBlock';
    import ItemVariantsBlock    from '@/sub-components/ItemVariantsBlock';

    export default {
        name: "ItemImageBlock",
        props: ['prodPixURI', 'prodBlockRoot', 'prodPageURI', 'prodItem'],
        components: {
            ItemSocialsBlock,
            ItemVariantsBlock,
        },
        methods: {
            getDetailPageURI(prodItem){
                return  '/item/' + prodItem.productAlias + '/' + prodItem.productAID + '/' + prodItem.productCID + '/' + prodItem.productID
            },

            getVariantsCluster(prodItem){
                return {
                    aids        : prodItem.variantAIDS          ? prodItem.variantAIDS.split(' | ')         : null,
                    prices      : prodItem.variantPrices        ? prodItem.variantPrices.split(' | ')       : null,
                    salePrices  : prodItem.variantSalePrices    ? prodItem.variantSalePrices.split(' | ')   : null,
                    images      : prodItem.variantImages        ? prodItem.variantImages.split(' | ')       : null,
                    saleStates  : prodItem.variantSaleStates    ? prodItem.variantSaleStates.split(' | ')   : null,
                    colors      : prodItem.variantColors        ? prodItem.variantColors.split(' | ')       : null,
                };
            },
        }
    }
</script>

<style scoped>

</style>