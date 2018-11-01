<template>
    <div class="component-wrapper">
     <Category :categories="categories"></Category>
    </div>
</template>

<script>
    import Category         from './components/Category';


    export default {
      data: function(){
        return {
          currentRoute  : window.location.pathname,
          categories    : [],
        }
      },

      created: function(){
      },

      components: {
        "Category": Category
      },

      methods: {
      },
    };



</script>

<style>
    div.component-wrapper {
    }
</style>
