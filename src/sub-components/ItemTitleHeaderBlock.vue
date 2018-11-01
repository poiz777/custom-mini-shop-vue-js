<template>
    <h3 class="pz-prod-head" :data-block-root="prodBlockRoot" :id="'pz-prod-head'+prodID">
        <span class="pz-head-title" :data-block-root="prodBlockRoot" v-html="prodTitle"></span>
        <!-- USE <router-link></router-link> INSTEAD FOR ROUTING... -->
        <a v-bind:href="prodCartURI"  class="" :data-block-root="prodBlockRoot" >
            <span class="fa fa-shopping-basket pz-cart-icon" :data-block-root="prodBlockRoot"></span>
        </a>
    </h3>
</template>

<script>
    export default {
        name: "ItemTitleHeaderBlock",
        props: ['prodID', 'prodTitle', 'prodBlockRoot', 'prodCartURI']
    }
</script>

<style scoped>
    .pz-prod-head{
        font-size: 12px !important;
    }
</style>