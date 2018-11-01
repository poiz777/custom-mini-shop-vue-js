<template>
    <div class="pz-pix-box" :data-block-root="prodBlockRoot">
        <!-- YOU MAY WRAP WITHIN <router link></router-link> FOR ROUTING PURPOSES -->
        <a :href="getDetailPageURI(prodItem)" class="" :data-block-root="prodBlockRoot">
            <img :src="prodPixURI" :data-block-root="prodBlockRoot" class="thumbnail" style="width: 100%;">
        </a>
    </div>
</template>

<script>
    import ItemSocialsBlock from '@/sub-components/ItemSocialsBlock';

    export default {
        name: "ItemImageBlock",
        props: ['prodPixURI', 'prodBlockRoot', 'prodPageURI', 'prodItem'],
        components: {
            ItemSocialsBlock,
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