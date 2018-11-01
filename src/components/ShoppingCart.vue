<template>
    <div class="container" >
        <Menu></Menu>
        <article class="pz-wrapper-block pz-col-12 pz-cue-box">
            <section class="">
                <ul class="pz-cart-block list-group list-unstyled pz-list-header">
                    <li class="col-md-12 list-group-item">
                        <div class="col-md-1">#</div>
                        <div class="col-md-1">Photo</div>
                        <div class="col-md-3">Title + ID</div>
                        <div class="col-md-2">Price</div>
                        <div class="col-md-1">QTY</div>
                        <div class="col-md-2">Sub-Total</div>
                        <div class="col-md-2">Actions</div>
                    </li>
                </ul>
                <ul class="pz-cart-block list-group list-unstyled" v-for="(orderData, prodID, loopIDX) in orderItemsCollection" v-bind:key="prodID" >
                    <li class="col-md-12 list-group-item">
                        <div class="col-md-1">{{ loopIDX+1 }}</div>
                        <div class="col-md-1">
                            <router-link :to="'/item/'+orderData.alias+'/' + orderData.aid + '/' + orderData.cid+ '/' + orderData.id">
                                <img v-bind:src="orderData.thumbUrl" style="width:100%" class="thumbnail">
                            </router-link>
                        </div>
                        <div class="col-md-3">
                            <aside class="pz-prod-name" v-html="orderData.name "></aside>
                            <aside class="pz-prod-id"><small>ID — {{ prodID }}</small></aside>
                        </div>
                        <div class="col-md-2">{{ orderData.price | formatAmount }}</div>
                        <div class="col-md-1 pz-qty-box">{{ orderData.qty }}</div>
                        <div class="col-md-2 pz-line-total-box">{{ orderData.total | formatAmount }}</div>
                        <div class="col-md-2">
                            <span class='fa fa-plus pz-add-to-cart-icon'
                                  v-bind:data-id='prodID'
                                  v-bind:data-price='orderData.price'
                                  v-bind:data-name='orderData.name'
                                  v-bind:data-currency='orderData.currency'
                                  v-bind:id="getUniqueKey(prodID)"
                                  v-on:click='addItemsToCart'
                            ></span>
                            <span class='pz-qty-wrapper'>
                                <input type='number' name='qty'
                                       value='' class='pz-qty'
                                       placeholder='1'
                                       v-bind:min='1'
                                       v-bind:max='orderData.qty'
                                       v-bind:data-id='prodID'
                                       v-bind:data-price='orderData.price'
                                       v-bind:data-name='orderData.name'
                                       v-bind:data-currency='orderData.currency'
                                       v-bind:id="getUniqueKey(prodID)"
                                />
                              </span>
                            <span class='fa fa-minus pz-delete-from-cart-icon'
                                  v-bind:data-id='prodID'
                                  v-bind:data-price='orderData.price'
                                  v-bind:data-name='orderData.name'
                                  v-bind:data-currency='orderData.currency'
                                  v-bind:id="getUniqueKey(prodID)"
                                  v-on:click='deleteItemsFromCart'
                            ></span>
                            <span class='fa fa-trash pz-delete-all-icon'
                                  v-bind:data-id='prodID'
                                  v-bind:data-price='orderData.price'
                                  v-bind:data-name='orderData.name'
                                  v-bind:data-currency='orderData.currency'
                                  v-bind:id="getUniqueKey(prodID)"
                                  v-on:click='deleteAllItemsFromCart'
                            ></span>
                        </div>
                    </li>
                </ul>
                <ul class="pz-cart-block list-group list-unstyled">
                    <li class="col-md-12 list-group-item">
                        <div class="col-md-1">&nbsp;</div>
                        <div class="col-md-1">&nbsp;</div>
                        <div class="col-md-3">&nbsp;</div>
                        <div class="col-md-2">&nbsp;</div>
                        <div class="col-md-1">&nbsp;</div>
                        <div class="col-md-2 pz-bottom-line">{{ lineTotal }}</div>
                        <div class="col-md-2"></div>
                    </li>
                </ul>
            </section>
        </article>
    </div>
</template>

<script>
    import ajaxFetch    from '@/Services/JQAjax';
    import sMeths       from "@/Services/SharedMethods";
    import Menu         from "@/components/Menu";

    export default {
        name: "ShoppingCart",
        
        components : {
            'Menu'  : Menu,
        },

        data: function(){
            return {
                psm: ajaxFetch.psm,
                colNum: 12,
                lineTotal:0,
                cnt: 0,
                currency : '',
                currentRoute: window.location.pathname,
                orderItemsCollection: null,
            };
        },

        created: function(){
            let firstRun                = true;
            this.orderItemsCollection   = this.psm.get('poizShopApp', 'orderedItems');


            for(let pid in this.orderItemsCollection){
                this.currency   = (firstRun) ? this.orderItemsCollection[pid].currency : (!this.currency ? '' : this.currency);
                this.lineTotal += parseFloat(this.orderItemsCollection[pid].total);
                firstRun = false;
            }
            this.lineTotal  = this.currency + ' ' + ajaxFetch.number_format(this.lineTotal,  2, '.', "'");
        },

        methods :  {
            getUniqueKey: function (keyID, length) {
                length = (length === undefined) ? 8 : length;
                let characters = '0123456789ABCDEF';
                let randomString = '';

                for (let i = 0; i < length; i++) {
                    randomString += characters[Math.floor((Math.random() * characters.length))];
                }
                return randomString + '-' + keyID;
            },

            addItemsToCart: function(e){
                let val;
                const dispatcher    = ajaxFetch.$(e.target);
                const qty           = (val = dispatcher.parent('div').find('input.pz-qty').val())? val: 1;
                sMeths.addItemsToCart(e, true, qty);
                this.updateCartChanges(dispatcher);
            },

            deleteItemsFromCart: function(e){
                let val;
                const dispatcher    = ajaxFetch.$(e.target);
                const qty           = (val = dispatcher.parent('div').find('input.pz-qty').val())? val: 1;
                sMeths.deleteItemsFromCart(e, false, qty);
                this.updateCartChanges(dispatcher);
            },

            deleteAllItemsFromCart: function(e){
                const dispatcher    = ajaxFetch.$(e.target);
                sMeths.deleteItemsFromCart(e, false, 1000000000000000);
                this.updateCartChanges(dispatcher);
            },

            updateCartChanges: function(dispatcher){
                let index;
                let cartItem        = null;
                const mainParent    = dispatcher.parentsUntil('li').parent('li');
                const pid           = dispatcher.attr('data-id');

                let cartItems       = this.psm.get('poizShopApp', 'orderedItems');
                if(cartItems){
                    for(index in cartItems){
                        if(parseInt(pid) === parseInt(index)){
                            cartItem    = cartItems[index];
                            break;
                        }
                    }
                }
                if(cartItem){
                    mainParent.find('.pz-qty-box').text(cartItem.qty);
                    mainParent.find('.pz-line-total-box').text(ajaxFetch.number_format(cartItem.total, 2, '.', "'"));
                    dispatcher.parent('div').find('input.pz-qty').val('');
                    ajaxFetch.$('.pz-bottom-line').text(ajaxFetch.number_format(this.getSubTotal(cartItems), 2, '.', "'"));
                }else{
                    mainParent.remove();
                    ajaxFetch.$('.pz-bottom-line').text(ajaxFetch.number_format(this.getSubTotal(cartItems), 2, '.', "'"));
                }
            },

            getSubTotal: function(cartItems){
                let lineTotal   = 0;
                for(let i in cartItems){
                    lineTotal    += parseFloat(cartItems[i].total);
                }
                return this.currency + ' ' + ajaxFetch.number_format(lineTotal,  2, '.', "'");
            },
        },

        filters: {
            formatAmount: function (amount) {
                return ajaxFetch.number_format(amount,  2, '.', "'")
            }
        },
    }
</script>

<style scoped>
</style>
