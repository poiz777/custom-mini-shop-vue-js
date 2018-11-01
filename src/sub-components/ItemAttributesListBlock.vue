<template>
    <section class="pz-attributes-list" :data-block-root="prodBlockRoot" >
        <item-attributes-block
                :key="'pz-item-attribute' + cueKey"  v-for="(attribute, cueKey) in itemAttributes"
                :prodAttributeName="attribute.name"
                :prodAttributeValue="attribute.value"
                :prodBlockRoot="prodBlockRoot"
                :data-block-root="prodBlockRoot"
        ></item-attributes-block>
    </section>
</template>

<script>
    import ItemAttributesBlock from "@/sub-components/ItemAttributesBlock";
    export default {
        name: "ItemAttributesListBlock",
        components: {ItemAttributesBlock},
        props: ['prodBlockRoot', 'itemAttributes']
    }
</script>

<style scoped>

</style>