import Vue          from 'vue'
import Router       from 'vue-router'
import Category     from '@/components/Category'
import SingleItem   from '@/components/SingleItem'
import CheckOut     from '@/components/CheckOut'
import ShoppingCart from '@/components/ShoppingCart'
import App          from './../App';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'App',
            component: App
        },
        {
            path: '/shopping-cart/basket',
            name: 'ShoppingCartView',
            component: ShoppingCart
        },
        {
            path: '/category/:name/:catID',
            name: 'MainItemsView',
            component: Category
        },
        {
            path: '/item/:name/:AID/:CID/:PID',
            name: 'SingleItemView',
            component: SingleItem
        },
        {
            path: '/checkout',
            name: 'CheckOutView',
            component: CheckOut
        },
    ]
});

