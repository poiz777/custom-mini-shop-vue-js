<template >
    <div class="container" >
        <div style="margin:0 auto;padding:40px;text-align:center;display:block;color:#dadada;" v-if="!rendered">Loading...</div>
        <div class="fa fa-5x fa-cog fa-spin" style="margin:0 auto;padding:40px;text-align:center;display:block;color:#dadada;" v-if="!rendered" ></div>
        <div style="clear:both"></div>
        <Menu @currentRouteChanged="updateRoute"></Menu>
        <div style="clear:both"></div>
        <article :class="'pz-wrapper-block pz-col-12 pz-group-block-'+cueKey" v-for="(itemsGroup, cueKey) in itemChunks" v-bind:key="getUniqueKey(cueKey)" >
            <app-item
                    v-for="(productItem, index) in itemsGroup"
                    :dataIndex="productItem.id"
                    :key="getUniqueKey(productItem.id)"
                    :wrapContent="true"
                    :prodItem="productItem"
                    :cue="index"
                    :colNum="getColNum()">
            </app-item>
        </article>
    </div>
</template>

<script>
	import Item       from "./Item";
	import sMeths     from "@/Services/SharedMethods";
	import Menu       from "./Menu";
	import ajaxFetch  from '@/Services/JQAjax';
	export default {
		name: "Items",
		props: ['categories'],

		data: function(){
			return {
				psm: ajaxFetch.psm,
				preLoaderURI: '/assets/images/icons/pz-loader-05.gif',
				itemChunks: [],
				rendered : false,
				productItems: [],
				columnsPerRow:4,
				colsPerRow:4,
				prodCount  : 0,
				headerString  : '',
				detailPageData  : {},
			}
		},

		created: function(){
			this.getChunks();
		},

		computed: {
			nullV: {
				get: function(){
					return this.cid;
				},
				set: function(){},
			}
		},
		watch: {
			url: function () {
				this.currentRoute =  this.$route.params.catID || 1;
				this.$emit('currentRouteChanged', this.currentRoute);
			},
		},

		components : {
			'app-item' : Item,
			'Menu'  : Menu,
		},

		methods : {
			...sMeths,
			...{
				updateRoute: function(route) {
					this.cid = route;
					this.getChunks();
					this.$emit('cidChanged', route);
				},

				getChunks: function(){
					let self      = this;
					try{
						self.cid = this.$route.params.catID ;
					}catch (e) {
						self.cid = 1
					}
					self.cid = (!self.cid) ? 1 : self.cid;

					ajaxFetch.flatAjaxFetch(ajaxFetch.endPointBaseURL + ajaxFetch.prodByCIDEndPoint + self.cid, {}).then(
						function(response){
							if (response) {
								self.itemChunks = [];
								let temp        = [];
								let counter     = 0;
								for(let cue in response){
									counter++;
									temp.push(response[cue]);
									if( (counter % self.columnsPerRow === 0) || counter === (response.length) ){
										self.itemChunks.push(temp);
										temp = [];
									}
								}
								self.rendered   = true;
							}
						}).catch(function (error) {
						ajaxFetch.log(error.responseText);
					});
				},

			}
		},

	}
</script>

<style >
    @import './../assets/css/products.css';
</style>
