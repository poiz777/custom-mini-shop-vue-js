import StorageManager   from '@/Services/StorageManager'
const PSM               = StorageManager.mngR();

Object.size                     = function(obj) {
    let size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

const oBridge       = {
    cat_id              : null,
    item_id             : null,
    attrib_id          	: null,
    product_store      	: null,        //AN ARRAY HOLDING ALL ORDERS KEYED WITH A CONCATENATION OF BOTH CAT_ID AND SUB-KEYED WITH PROD_ID FOR EASIER/FASTER ACCESS
    product_strip      	: null,
    store_session      	: null,
    order_context_obj  	: null,
    namespace          	: "poizShopApp",
    baseKey            	: "orderedItems",
    sessionToken       	: "pz_app_storehouse",

    // METHODS:
    initialize_store                    : function (){
        this.store_session    = new PSM(this.sessionToken);
        if(!this.store_session.has(this.namespace, this.baseKey) ){
            this.store_session.set(this.namespace, this.baseKey, {});
        }

        if(!this.product_store){
            //CREATE A UNIQUELY NAME-SPACED SESSION OBJECT FOR STORING ORDER DATA
            this.product_store    = this.store_session.get(this.namespace, this.baseKey, {});
        }
        //RETURN THE PRODUCT STORE ARRAY FOR CHAINING...
        return this.product_store;
    },

    add_order_to_store                  : function (objPayload){
        let item_id     = parseInt(objPayload.id);
        let item_aid    = parseInt(objPayload.aid);
        let item_cid    = parseInt(objPayload.cid);
        let alias       = objPayload.alias;
        let price       = objPayload.price;
        let name        = objPayload.name;
        let currency    = objPayload.currency;
        let thumbUrl    = objPayload.thumbUrl;
        let qty         = (undefined === objPayload.qty || null === objPayload.qty) ? 1 : objPayload.qty;
        qty             = (0 === qty || "0" === qty) ? 1 : qty;

        if(qty < 0){
            return {message :  'Cannot add or delete Negative Quantity:<br>[ ' + qty  + ' ].'};
        }

        this.product_store          = this.initialize_store();
        let order_strip             = {};
        order_strip.id              = item_id;
        order_strip.aid             = item_aid;
        order_strip.cid             = item_cid;
        order_strip.alias           = alias;
        order_strip.qty             = parseInt(qty);
        order_strip.price           = parseFloat(price);
        order_strip.name            = name;
        order_strip.currency        = currency;
        order_strip.thumbUrl        = thumbUrl;
        order_strip.total           = this.number_format( parseFloat(price * qty), 2, '.', '');
        order_strip.ord_time        = Math.floor( ((new Date()).getTime() / 1000) );

        if(!item_aid) return null;

        if( this.array_key_exists(item_aid,  this.product_store) ){
            this.product_store    = this.process_order(item_aid, order_strip);
        }else{
            this.product_store[item_aid]    = order_strip;
            this.store_session.set(this.namespace, this.baseKey, this.product_store);
        }

        return this.get_context_payload( item_aid, qty, true);
    },

    delete_order_from_store             : function (objPayload){
        let a;
        let item_id     = parseInt(objPayload.id);
        let item_aid    = parseInt(objPayload.aid);
        let item_cid    = parseInt(objPayload.cid);
        let price       = objPayload.price;
        let alias       = objPayload.alias;
        let qty         = (undefined === objPayload.qty || null == objPayload.qty)? 1 : objPayload.qty;
        qty             = (0 === qty || "0" === qty) ? 1 : qty;

        if(qty < 0){
            return {message :  'Cannot add or delete Negative Quantity:<br>[ ' + qty  + ' ].'};
        }
        this.product_store          = this.initialize_store();
        let order_strip             = {};
        order_strip.id              = item_id;
        order_strip.aid             = item_aid;
        order_strip.cid             = item_cid;
        order_strip.alias           = alias;
        order_strip.qty             = parseInt(qty);
        order_strip.price           = parseFloat(price);
        order_strip.total           = this.number_format( parseFloat(price * qty), 2, '.', '');
        order_strip.ord_time        = Math.floor( ((new Date()).getTime() / 1000) );

        if(this.array_key_exists(item_aid,  this.product_store) ){
            this.product_store    = this.process_order(item_aid, order_strip, 0);
            if(!this.array_key_exists(item_aid,  this.product_store)){
                return {message :  'All items successfully deleted.', slotData: '--'};
            }
        }

        return (a = this.get_context_payload(item_aid, qty, false) )? a : null;
    },

    process_order                       : function (item_aid, order_strip, add_or_remove){
        add_or_remove     = (undefined === add_or_remove     || null === add_or_remove ) ? 1 : add_or_remove;
        this.product_store          = this.initialize_store();
        this.order_context_obj      = this.product_store;   //[item_id];

        // LOOP THROUGH THE ALREADY-EXISTING CONTEXT-PAYLOAD AND SEE IF
        // AN OBJECT WITH THE AN ATTRIBUTE OF $order_strip.attrib_id EXISTS IN IT
        // IF IT DOES;  THEN DO THE MATH OF INCREMENTING THE QUANTITY AS THE TOTAL FOR THE THE CONTEXT.
        // ONCE YOU ARE DONE, SAVE THE RESULTS BACK TO THE PRODUCT STORE AND EQUALLY MAKE THE CHANGES TO
        // THE SESSION OBJECT: (pz_store_order_data -- com_pz_store
        if(this.array_key_exists(item_aid, this.order_context_obj)  ){
            //ARE WE ADDING OR REMOVING???  || ADD = 1, REMOVE = 0
            let orderObj    = this.order_context_obj[item_aid];
            if(add_or_remove){
                if(order_strip.qty > 0){
                    orderObj.ord_time       = Math.floor( ((new Date()).getTime() / 1000) );
                    orderObj.qty            = orderObj.qty            + parseInt(order_strip.qty);
                    orderObj.total          = parseFloat(orderObj.total)          + ( parseFloat(order_strip.price) * parseInt(order_strip.qty) );
                    orderObj.total          = this.number_format(orderObj.total, 2, '.', '');
                    this.product_store[item_aid]   = orderObj;
                }
            }else{
                // TRACK & ABORT NEGATIVES:
                if( ( this.intVal(orderObj.qty) - this.intVal(order_strip.qty) ) <= 0){
                    this.unset(this.product_store, item_aid);
                    this.save_to_store_session(this.product_store);
                    return this.product_store;
                }else{
                    orderObj.qty        = orderObj.qty       - parseInt(order_strip.qty);
                    orderObj.total      = orderObj.total     - ( parseFloat(order_strip.price) * parseInt(order_strip.qty) );
                    orderObj.ord_time   =  Math.floor( ((new Date()).getTime() / 1000) );
                    this.product_store[item_aid]    = orderObj;
                }
            }
        }
        this.save_to_store_session(this.product_store);
        return this.product_store;
    },

    save_to_store_session               : function (data){
        this.store_session.set(this.namespace, this.baseKey, data);
    },

    get_context_payload                 : function (item_aid, qty, add){
        let context_total       = 0.00;
        let context_qty         = 0;
        let context_obj_ar, key;
        this.product_store      = this.initialize_store();
        add                     = (undefined === add) ? true : add;
        let addedDeleted        = (add) ? 'added to' : 'deleted from';

        if(undefined === this.product_store[item_aid]) {
            return null;
        }

        context_obj_ar          =  this.product_store;
        let globalTotal         = 0;
        for(let k in context_obj_ar){
            globalTotal += parseFloat(context_obj_ar[k].total);
        }

        if( Object.size(context_obj_ar) > 0){
            for(let key in context_obj_ar){
                let obj         = context_obj_ar[key];
                context_total  += parseFloat(obj.total);
                context_qty    += parseInt(obj.qty);
                context_obj_ar[key].global_total = globalTotal;
                obj.cxt_total   = context_total;
                obj.cxt_qty     = context_qty;
                obj.slotData    = obj.qty ? obj.qty + '&nbsp;&nbsp;|&nbsp;&nbsp;' +
                                  obj.currency + ' ' + this.number_format(obj.total, 2, '.', "'") : '--';
                obj.message     = qty + ' Item(s) successfully ' + addedDeleted + ' Cart...';
            }
            if( this.isSet(context_obj_ar[item_aid])){
                return context_obj_ar[item_aid];
            }
        }
        return null;
    },

    array_key_exists                    : function(key, arrayObject){
        if(undefined !== arrayObject[key] || null != arrayObject[key]){
            return true;
        }
        return false;
    },

    intVal                              : function(num){
        return parseInt(num);
    },
    
    empty                               : function(data){
        let count = 0;
        for(let iKey in data){
            count++;
        }
        return (count<=0);
    },

    unset                               : function(data, unsetKey){
        // EITHER USE NATIVE delete OR IF YOU ARE BUILDING A SESSION OBJECT
        // MODEL A WAY TO REMOVE THAT KEY FROM THE SESSION OBJECT...
        try{
            delete data[unsetKey];
        }catch(e){
            data[unsetKey] = null;
        }
    },

    isSet                               : function(data){
        return (data && (data != undefined) && (data != null))?true : false;
    },

    number_format                       : function number_format(number, decimals, dec_point, thousands_sep) {
        number = (number + '')
            .replace(/[^0-9+\-Ee.]/g, '');
        let n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function(n, prec) {
                let k = Math.pow(10, prec);
                return '' + (Math.round(n * k) / k)
                    .toFixed(prec);
            };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
            .split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '')
            .length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1)
                .join('0');
        }
        return s.join(dec);
    },  //  number_format(4479526648.86, 2, ",", "'")

};

export const OBridge = oBridge;

export const numFormat = oBridge.number_format;