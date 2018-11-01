<template>
    <aside class="pz-attribute" :data-block-root="prodBlockRoot">
        <span class="pz-attribute-name" :data-block-root="prodBlockRoot">{{ prodAttributeName}}:</span>
        <span class="pz-attribute-value" :data-block-root="prodBlockRoot">{{ prodAttributeValue }}</span>
    </aside>
</template>

<script>
    export default {
        name: "ItemAttributesBlock",
        props: ['prodBlockRoot', 'prodAttributeName', 'prodAttributeValue']
    }
</script>

<style scoped>

</style>