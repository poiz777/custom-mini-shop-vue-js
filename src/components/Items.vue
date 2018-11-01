
<template >
    <div class="container" >
      <div style="margin:0 auto;padding:40px;text-align:center;display:block;color:#dadada;" v-if="!rendered" >Loading...</div>
      <div class="fa fa-5x fa-cog fa-spin" style="margin:0 auto;padding:40px;text-align:center;display:block;color:#dadada;" v-if="!rendered" >   </div>
      <div style="clear:both"></div>
      <Menu @currentRouteChanged="updateRoute"></Menu>
      <div style="clear:both"></div>
      <article class="pz-wrapper-block pz-col-12 pz-cue-box"  v-for="(itemsGroup, cueKey) in itemChunks" v-bind:key="getUniqueKey(cueKey)" >
        <app-item
                v-for="(productItem, index) in itemsGroup"
                :dataIndex="productItem.productID"
                :key="getUniqueKey(productItem.productID)"
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
    import SingleItem from "./SingleItem";
    import Menu       from "./Menu";

    export default {
      name: "Items",
      props: ['items', 'psm', 'itemChunks', 'rendered', 'colsPerRow'],

      data: function(){
        return {
          preLoaderURI: 'http://wp.piz/a/assets/images/icons/pz-loader-05.gif',
        }
      },

      created: function(){
      },

      computed: {
      },

      components : {
        'app-item' : Item,
        'single-item' : SingleItem,
        'Menu'  : Menu,
      },

      methods : {
          ...sMeths,
          ...{
              updateRoute: function(route) {
                  console.log(route);
                  this.$emit('cidChanged', route);
              },
          }
      },
    }
</script>

<style >
  @import './../assets/css/products.css';
</style>
