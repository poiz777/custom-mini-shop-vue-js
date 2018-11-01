import ajaxFetch  from '@/Services/JQAjax';
import {OBridge}  from "@/Extras/OrderBridge";
import $ from "jquery";

export default {
    getColNum: function () {
        return Math.abs(12 / this.colsPerRow);
    },

    getUniqueKey: function (keyID, length) {
        length = (length === undefined) ? 8 : length;
        let characters = '0123456789ABCDEF';
        let randomString = '';

        for (let i = 0; i < length; i++) {
            randomString += characters[Math.floor((Math.random() * characters.length))];
        }

        return randomString + '-' + keyID;
    },
	
	fetchQuantityTotalFromStore: function (pid, toFetch, addCurrency ) {
		addCurrency                 = (addCurrency !== undefined) ? addCurrency : true;
		let returnVal               = null;
		let orderItemsCollection    = this.psm.get('poizShopApp', 'orderedItems');
		if(orderItemsCollection === undefined || !orderItemsCollection){return returnVal;}
		let order                   = orderItemsCollection[this.prodItem.id];
		if(order === undefined || !order){return returnVal;}
		
		if(toFetch === 'qty'){
			returnVal   =  order.qty;
		}else if(toFetch === 'total'){
			const total = ajaxFetch.number_format(parseFloat(order.total),  2, '.', "'");
			returnVal   = (addCurrency) ?  order.currency + ' ' + total : total;
		}else{
			returnVal = {qty: order.qty, total: order.currency + ' ' + ajaxFetch.number_format(parseFloat(order.total),  2, '.', "'")}
		}
		
		return returnVal;
	},

    addItemsToCart: function (e, add, qty) {
        add = (add !== undefined) ? add : true;
        qty = (add !== undefined) ? qty : undefined;
        this.handleAddDeleteProcess(e, add, qty);
    },

    deleteItemsFromCart: function (e, add, qty) {
        add = (add !== undefined) ? add : false;
        qty = (add !== undefined) ? qty : undefined;
        this.handleAddDeleteProcess(e, add, qty);
    },

    getColumnClass : function(){
        return 'col-xs-12 ' + 'col-md-' + this.colNum + ' col-lg-'+ this.colNum;
    },
	
	handleAddDeleteProcess: function(e, add, qty){
		let response        = null;
		const target        = ajaxFetch.$(e.target);
		const countSlot     = ajaxFetch.$('#countSlot' + target.attr('data-id'));
		const prodQty       = ajaxFetch.$('#prodQty' + target.attr('data-id'));
		const qtyBottom     = ajaxFetch.$('#pz-sub-val-qty-' + target.attr('data-id'));
		const totalBottom   = ajaxFetch.$('#pz-sub-val-total-' + target.attr('data-id'));
		let payload         = target.data();
		payload.qty         = (qty !== undefined && qty) ? qty : (prodQty.val() ? prodQty.val() : 1);
		add                 = (undefined === add) ? true : add;
		
		if(add){
			response        = OBridge.add_order_to_store(payload);
		}else{
			response        = OBridge.delete_order_from_store(payload);
		}
		
		if(response){
			$("body").remove("#pz_overlay_div");
			$("#pz_overlay_div").remove();
			
			prodQty.val('');
			let maxQty      = (response.maxQty) ? response.maxQty : null;
			prodQty.val(maxQty);
			
			if(response.slotData){
				ajaxFetch.updateStore(target.attr('data-cid'), target.attr('data-id'), response.slotData, 'quantityPrice');
				const qty = response.slotData.replace(/(&nbsp;|\s).*$/, "");
				const tot = response.slotData.replace(/(^\d*)(&nbsp;|\s)*\|(&nbsp;|\s)*[^\d.]*/, "");
				countSlot.html(response.slotData);
				qtyBottom.text(qty);
				totalBottom.text(tot);
			}
			if(response.message){
				ajaxFetch.PoizAlert(response.message, 1000);
			}
		}
	}
	
}