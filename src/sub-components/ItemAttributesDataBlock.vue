<template>
    <div class=""
         v-html="itemAttributesBlock"
         :data-block-root="prodBlockRoot" ></div>
</template>

<script>
    export default {
        name: "ItemAttributesDataBlock",
        props: ['prodBlockRoot', 'itemAttributesBlock']
    }
</script>

<style scoped>

</style>