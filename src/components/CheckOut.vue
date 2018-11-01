<template>
    <div class="container" >
        <Menu></Menu>
        <div class="pz-nav-bar col-md-12">
            <h2 class="well pz-checkout-heading">NOTHING HAPPENS!!! WHAT???</h2>
        </div>
    </div>
</template>

<script>
    import Menu from '@/components/Menu';

    export default {
        components : {
            'Menu'  : Menu,
        },
    }

</script>

<style scoped>
    .pz-checkout-heading{
        text-align: center;
        font-weight: 300;
        letter-spacing:0.05em;
        color: black;
    }
</style>