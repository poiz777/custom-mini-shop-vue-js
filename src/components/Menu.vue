<template>
    <div class="pz-nav-bar col-md-12">
        <ul class="list-inline list-group list-unstyled pz-cart-block pz-main-menu">
            <li class="list-group-item">
                <router-link to="/">Shop <span class="fa fa-home"></span></router-link>
            </li>
            <li class="list-group-item">
                <router-link :to="{name: 'ShoppingCartView'}">Shopping Cart <span class="fa fa-shopping-cart"></span></router-link>
            </li>
            <li class="list-group-item">
                <router-link :to="{name: 'CheckOutView'}">Checkout <span class="fa fa-check"></span></router-link>
            </li>
        </ul>
        <ul class="list-inline list-group list-unstyled pz-cart-block pz-main-menu">
            <li class="list-group-item" v-for="(catData) in catIDs" :key="catData.id">
                <router-link :to="'/category/' + catData.alias + '/' + catData.id" >
                    <span  v-on:mouseup="emitVal">
                        {{ catData.title }} <span class="fa fa-home"></span>
                    </span>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
    import ajaxFetch        from '@/Services/JQAjax';
    const vm    =   {
        data    : function(){
            return {
                psm             : ajaxFetch.psm,
                catIDs          : {},
                url             : window.location.pathname,
                currentRoute    : '',
            }
        },

        created: function() {
            this.initialize();
        },

        methods: {
            initialize: function(){
            const self          = this;
            ajaxFetch.flatAjaxFetch(ajaxFetch.endPointBaseURL +ajaxFetch.menusEndPoint, {}).then(
                function(response){
                    if (response) {
                        self.catIDs = response;
                        self.ready  = true;

                    }
                }).catch(function (error) {
                    ajaxFetch.log(error.responseText);
                });
            },

            emitVal : function() {
                this.url = this.$route.params.catID || 1;
            }
        },

        watch: {
            url: function () {
                this.currentRoute =  this.$route.params.catID || 1;
                this.$emit('currentRouteChanged', this.currentRoute);
            },
        }
    };

    export default vm;

</script>

<style scoped>
    ul.list-inline.list-group.list-unstyled.pz-cart-block.pz-main-menu {
        display: flex;
        align-items: center;
        justify-content: center;
    }

</style>