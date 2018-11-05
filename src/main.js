import Vue          from 'vue';
import router       from '@/Services/Router';


Vue.config.productionTip = false;
const NotFound      = { template: '<p>Page not found</p>' }

const app = new Vue({
    router,

    data: {
        currentRoute: window.location.pathname,
        routes: router.options.routes,
        ViewComp: getRenderAbleComponent(router),
    },

    created: function(){
    },
    watch: {
      '$route' (to) {
          this.ViewComponent = getRenderAbleComponent(router, to.path);
      }
    },
    computed: {
        ViewComponent: {
            // getter
            get: function () {
                return getRenderAbleComponent(this.router) || NotFound;
            },
            // setter
            set: function (viewComponent) {
                this.ViewComp = viewComponent;
            }
        }
    },

    render: function(h){
        return h(this.ViewComp);
    },
});
app.$mount('#app');

window.addEventListener('popstate', () => {
    app.currentRoute = window.location.pathname
});

function getRenderAbleComponent (routerObject, currentRoute) {
    let iKey;
    let routes      = router.options.routes;
    let matcher     = routerObject.matcher;
    currentRoute    = (undefined === currentRoute) ? window.location.pathname : currentRoute;
    let match       = matcher.match(currentRoute, currentRoute);

    for(iKey in routes){
        let routeData   = routes[iKey];
        if(match.name === routeData.name){
            return routeData.component;
        }
    }
    return NotFound;
}
