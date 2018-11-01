import $                from 'jquery';
import StorageManager   from './StorageManager'
import log              from 'consolelog'
import {numFormat}      from '@/Extras/OrderBridge'

const PSM               = StorageManager.mngR();
export default {
    $                   : $,
    log                 : log,
    psm                 : new PSM('pz_app_storehouse', "session"),
    resourceBase        : 'http://sim-rest.poiz.me/',
    endPointBaseURL     : 'http://sim-rest.poiz.me/en/shop/api/v1/products',
    menusEndPoint       : '/fetch_menu_items',
    allProductsEndPoint : '/fetch_all_items',
    singleItemEndPoint  : '/fetch_single_product/',
    prodByCIDEndPoint   : '/fetch_products_by_cid/',
    variantsEndPoint    : '/get_variants/',
    addItemEndPoint     : '/add_to_store/',
    delItemEndPoint     : '/delete_from_store/',
    delClusterEndPoint  : '/delete_item_cluster/',
    contextPldEndPoint  : '/get_context_order_payload/',
    ajaxURI             : 'http://poiz.me/sim-rest/.poiz.pz/api',

    flatAjaxFetch: function(URL, payLoad, rqType, retType){
        rqType          = (undefined === rqType)    ? 'GET'   : rqType;
        retType         = (undefined === retType)   ? 'JSON'  : retType;
        const config    = {
            url         : URL,
            dataType    : retType,
            cache       : true,
            type        : rqType,
        };
        if(undefined !== payLoad){
            config.data = payLoad;
        }
        if(undefined !== config._){delete config._;}

        return $.ajax(config);
    },

    jqAjaxFetch: function(URL, payLoad, rqType, retType){
        return this.flatAjaxFetch(URL, payLoad, rqType, retType);
    },

    updateStore: function(cid, pid, data, key){
        let iKey, prop, prop2, route;
        let chunks      = this.psm.get('poizShopApp', 'itemChunks');
        let spaData     = this.psm.get('poizShopApp', 'detailPageData');
        let cartItems   = this.psm.get('poizShopApp', 'orderedItems');
        let globalTotal = 0;

        const ErrorObj  = {};
        if(cartItems){
            for(let index in cartItems){
                globalTotal += parseFloat(cartItems[index].total);
            }
            for(let index in cartItems){
                cartItems[index]['global_total']    = globalTotal;
            }
        }
        this.psm.set('poizShopApp', 'orderedItems', cartItems);

        if(spaData){
            try {
                for(let catID in spaData){
                    for(route in spaData[catID]){
                        for(prop2 in spaData[catID][route]){
                            if((prop2 === key) && (parseInt(pid) === parseInt(spaData[route][catID]['id']))){
                                spaData[catID][route][prop2] = data;
                                throw ErrorObj;
                            }
                        }
                    }
                }
            } catch (e) {
                this.psm.set('poizShopApp', 'detailPageData', spaData);
                if (e !== ErrorObj) throw e;
            }
        }

        if(chunks){
            try {
                for(let catID in chunks){
                    let groupChunks = chunks[catID];

                    groupChunks.forEach(function(group, index){
                        for(iKey in group){
                            for(prop in group[iKey]){
                                if((prop === key) && (parseInt(pid) === parseInt(group[iKey]['id']))){
                                    chunks[catID][index][iKey][prop] = data;
                                    throw ErrorObj;
                                }
                            }
                        }
                    });

                }
            } catch (e) {
                this.psm.set('poizShopApp', 'itemChunks', chunks);
                if (e !== ErrorObj) throw e;
            }
        }
    },

    PoizAlert: function PoizAlert(msgText, delay){
            msgText         = (msgText !== undefined) ? msgText : "Das Bild wurde kopiert!";
            delay           = (delay !== undefined) ? delay: 2000;
            let objDim      = this.getWindowParams();
            let message     = "<span " +
                "style='display:block;padding:30px;margin:0 auto;width:350px;max-width:350px;color:#000000;" +
                "text-align:center;background:rgba(189,189,189,0.9);border-radius:7px;border:double 3px rgba(255,255,255,0.4);" +
                "font-size:14px;font-weight:500;letter-spacing:0.01em;'>" + msgText +
                "</span>";

            //CREATE WRAPPER OVERLAY-DIV
            let alertBox    = $("<div />", {
                id: "pz-alert",
                "class": "pz-alert"
            }).css( {
                position    : "fixed",
                width       : "100%",
                height      : "80px",
                background  : "transparent",
                display     : "none",
                margin      : 0,
                padding     : 0,
                left        : 0,
                zIndex      : 9999,
                top         : ((objDim.winHeight - 140)/2) + "px"
            } ).append($(message));
            $("body").append(alertBox);
            alertBox.fadeIn(500, function(){
                setTimeout(function(){
                    alertBox.fadeOut(1000, function(){alertBox.remove();});
                }, delay);
            });
        },

    getWindowParams: function getWindowParams(){
        let config              = {};
        config.winWidth         = $(window).width();
        config.winHeight        = $(window).height();
        config.docWidth         = $(document).width();
        config.docHeight        = $(document).height();
        config.halfDocHeight    = (config.winHeight - config.popHeight)/2;
        return config;
    },

    number_format        : function (number, decimals, dec_point, thousands_sep){
        return numFormat(number, decimals, dec_point, thousands_sep);
    },
}

// API GUIDE NOTES:
// /shop/api/v1/products/fetch_menu_items                                       [ CATEGORIES ]
// /shop/api/v1/products/fetch_all_items                                        [ ALL PUBLISHED PRODUCTS ]
// /shop/api/v1/products/fetch_single_product/{aid}/{cid}/{pid}                 [ SINGLE PRODUCT ]
// /shop/api/v1/products/fetch_products_by_cid/{cid}                            [ ALL PRODUCTS BY CID ]
// /shop/api/v1/products/get_variants/{aid}/{cid}/{pid}                         [ GETS ITEM VARIANTS ]
// /shop/api/v1/products/add_to_store/{aid}/{cid}/{pid}/{price}/{qty}           [ ADDS ITEM(S) TO THE STORE ]
// /shop/api/v1/products/get_cart/{aid}/{cid}/{pid}                             [ GETS SHOPPING CART WITH MINI-BROWSER ]
// /shop/api/v1/products/delete_from_store/{aid}/{cid}/{pid}/{price}/{qty}      [ DELETE SINGLE ITEM FROM STORE ]
// /shop/api/v1/products/delete_item_cluster/{aid}/{cid}/{pid}/{price}/{qty}    [ DELETE ALL OF SAME CID ]
// /shop/api/v1/products/get_context_order_payload/{aid}/{cid}/{pid}            [ GETS CONTEXT ORDER PAYLOAD ]