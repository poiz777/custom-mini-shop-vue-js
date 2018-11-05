import ajaxFetch  from '@/Services/JQAjax';
import {OBridge}  from "@/Extras/OrderBridge";
import $ from "jquery";

const GLOBAL_DATA   = {INITIATOR:null, TRASHED_AID:null,  BLOCK_ROOT:null, PROCESSOR: null, RESET_DATA: false};
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
		payload.aid         = target.attr("data-aid");
		payload.price       = target.attr("data-price");
		payload.thumbUrl    = target.attr("data-thumb-url");
		
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
	},
	
	bindActionEvents: function(){
		const productWrapper    = $(".pz-product-wrapper");
		const variantPix        = $(".pz-variant-pix");
		
		function getUniqueKey(keyID, length) {
			keyID   = (keyID === undefined || !keyID) ? '' : '-' . keyID;
			length  = (length === undefined) ? 8 : length;
			let characters = '0123456789ABCDEF';
			let randomString = '';
			
			for (let i = 0; i < length; i++) {
				randomString += characters[Math.floor((Math.random() * characters.length))];
			}
			
			return randomString  + keyID;
		}
		
		function updateSegments(data) {
			const separator = '&nbsp; | &nbsp;';
			let price       = '0.00';
			let quantity    = '0';
			let priceString = '--';
			
			let a, b;
			let orderData   = ajaxFetch.psm.get('poizShopApp', 'orderedItems');
			if(orderData) {
				for (let cue in orderData) {
					if (cue === data.productAID) {
						quantity    = (a = orderData[cue]['qty']) ? a : 0;
						price       = (b = orderData[cue]['total']) ? ajaxFetch.number_format(b, 2, '.', "'") : '0.00';
						priceString = quantity + separator + orderData[cue]['currency']  + " " + price ;
						break;
					}
				}
			}else if(data){
				price       = ajaxFetch.number_format(data.total, 2, ".", "'");
				quantity    = ((data.qty !== undefined) && parseInt(data.qty) > 0) ? data.qty: 0;
				priceString = ((data.qty !== undefined) && parseInt(data.qty) > 0) ?
					data.qty + separator + GLOBAL_DATA.CURRENCY  + " " + price : priceString;
			}
			$(GLOBAL_DATA.BLOCK_ROOT).find(".pz-count-slot").html(priceString);
			$(GLOBAL_DATA.BLOCK_ROOT).find(".pz-qty-total-wrapper-bottom .pz-price-bottom .pz-sub-val-pod").text(price);
			$(GLOBAL_DATA.BLOCK_ROOT).find(".pz-qty-total-wrapper-bottom .pz-qty-bottom .pz-sub-val-pod").text(quantity);
		}
		
		productWrapper.on("mouseover", function(){
			const variantsBlock = $(this).find('.pz-variants-block');
			if(variantsBlock.hasClass("pz-hide-flex")){
				variantsBlock.removeClass("pz-hide-flex");
				variantsBlock.addClass("pz-show-flex");
			}
		});
		
		productWrapper.on("mouseout", function(){
			const variantsBlock = $(this).find('.pz-variants-block');
			if(variantsBlock.hasClass("pz-show-flex")){
				variantsBlock.removeClass("pz-show-flex");
				variantsBlock.addClass("pz-hide-flex");
			}
		});
		
		variantPix.on("click", function(){
			GLOBAL_DATA.INITIATOR   = $(this);
			let data                = GLOBAL_DATA.INITIATOR.data();
			GLOBAL_DATA.BLOCK_ROOT  = data.blockRoot;
			GLOBAL_DATA.PROCESSOR   = data.processor;
			GLOBAL_DATA.ENDPOINT    = data.endpoint;
			GLOBAL_DATA.CURRENCY    = $(GLOBAL_DATA.BLOCK_ROOT).find('.pz-add-to-cart-icon').attr('data-currency');
			
			const ajaxRequest       = $.ajax({
				url     : GLOBAL_DATA.ENDPOINT,
				type    : "POST",
				dataType: "JSON",
			});
			ajaxRequest.
			then(function(data, textStatus, jqXHR){
				if(data){
					let randVal = getUniqueKey(null, 6);
					const addIcon       = $(GLOBAL_DATA.BLOCK_ROOT).find('.pz-add-to-cart-icon');
					const delIcon       = $(GLOBAL_DATA.BLOCK_ROOT).find('.pz-delete-from-cart-icon');
					const price         = parseInt(data.onSale) === 1 ? data.salePrice : data.normalPrice;
					const endPointAdd   = addIcon.attr('data-endpoint').replace(/(\/\d+)(\/\d+)(\/\d+)(\/[\d.]+)$/, '/' + data.productAID +'$2$3/' + price);
					const endPointDel   = delIcon.attr('data-endpoint').replace(/(\/\d+)(\/\d+)(\/\d+)(\/[\d.]+)$/, '/' + data.productAID +'$2$3/' + price);
					// console.log(GLOBAL_DATA);
					addIcon .attr('data-endPoint', endPointAdd)
							.attr("data-aid",  data.productAID)
							.attr("data-price",  price)
							.attr("data-thumb-url",  ajaxFetch.restAccessURI + data.productPix);
					delIcon .attr('data-endPoint', endPointDel)
							.attr("data-aid",  data.productAID)
							.attr("data-price",  price)
							.attr("data-thumb-url",  ajaxFetch.restAccessURI + data.productPix);
					
					$(GLOBAL_DATA.BLOCK_ROOT).find('.pz-prod-pix').fadeOut(500, function(){
						$(this).attr('src', ajaxFetch.restAccessURI + data.productPix + '?nocache=' + randVal).fadeIn(500);
					});
					$(GLOBAL_DATA.BLOCK_ROOT).find('.pz-norm-price-box.pz-strike').fadeOut(500);
					$(GLOBAL_DATA.BLOCK_ROOT).find('.pz-price-box').fadeOut(500, function(){
						updateSegments(data);
						$(this).html(data.activeCurrency + ' ' + ajaxFetch.number_format(price, 2, '.', "'")).fadeIn(500);
						if(parseInt(data.onSale)){
							$(this).html('<span class="fa fa-tags"></span>&nbsp;' + data.activeCurrency + ' ' + ajaxFetch.number_format(data.salePrice, 2, '.', "'")).fadeIn(500);
							$(GLOBAL_DATA.BLOCK_ROOT).find('.pz-norm-price-box.pz-strike').text(data.activeCurrency + ' ' + ajaxFetch.number_format(data.normalPrice, 2, '.', "'")).fadeIn(500);
						}
					});
					
				}
			}).
			catch(function(jqXHR, textStatus, errorThrown){
				console.log('The following error occurred: ' + textStatus, errorThrown);
			});
		});
  
	}
	
}