<template>
    <div :id="'pz-variants-block-'+prodItem.productID" class="col-md-12 pz-variants-block pz-inner-wrap pz-hide-flex" :data-block-root="prodBlockRoot">
        <ItemVariantSlot :prodItem="prodItem" :variantsCluster="variantsCluster" :prodBlockRoot="prodBlockRoot"  :cursor="cueKey"
                        v-for="(cluster, cueKey) in variantAIDS" v-if="variantsCluster.aids.length > 1" :key="'v-cluster-'+cueKey"></ItemVariantSlot>
    </div>
</template>

<script>
    import ItemVariantSlot from '@/sub-components/ItemVariantSlot';

    export default {
        name: "ItemVariantsBlock",
        props: ['prodBlockRoot', 'variantsCluster', 'prodItem'],
        data: function() {
            return{
                variantAIDS: this.variantsCluster.aids,
            };
        },
        components: {
            ItemVariantSlot,
        },
        created: function(){
        },
        methods: {
            getDetailPageURI(prodItem){
                return  '/item/' + prodItem.productAlias + '/' + prodItem.productAID + '/' + prodItem.productCID + '/' + prodItem.productID
            },
        }
    }
</script>

<style scoped>

</style>
