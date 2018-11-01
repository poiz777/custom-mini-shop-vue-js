<template>
    <div class="container" >
        <article class="pz-wrapper-block pz-col-12 pz-cue-box"   v-bind:key="getUniqueKey(pageData.productID)" >
            <section class="">
                <Menu></Menu>
                <div v-bind:class="'col-md-7 pz-image-block'">
                    <app-item
                            :dataIndex="pageData.productID"
                            :key="getUniqueKey(pageData.productID)"
                            :wrapContent="true"
                            :prodItem="pageData"
                            :cue="0"
                            :colNum="colNum">
                    </app-item>
                </div>
                <aside class="col-md-5 pz-desc-block">
                    <div class="well pz-description-pod" >
                        <h3 style="text-align:center;" class="pz-full-desc-heading">Full Description</h3>
                        <article class="well" v-html="pageData.productDescription"></article>
                    </div>
                </aside>
            </section>
        </article>
    </div>
</template>

<script>
    import ajaxFetch    from '@/Services/JQAjax';
    import Item         from '@/components/Item';
    import Menu         from '@/components/Menu';
    import sMeths       from "@/Services/SharedMethods";

    export default {
        name: "SingleItem",
        
        components : {
            'app-item'  : Item,
            'Menu'      : Menu,
        },

        data: function(){
            return {
                psm: ajaxFetch.psm,
                clNum: 12,
                currentRoute: window.location.pathname,
                pageData: {},
            };
        },

        created: function(){
            let self                = this;
            const parts     = this.currentRoute.split('/');
            if(parts !== undefined && parts.length > 2){
                const pid   = parts.pop();
                const cid   = parts.pop();
                const aid   = parts.pop();
                ajaxFetch.flatAjaxFetch(ajaxFetch.endPointBaseURL + ajaxFetch.singleItemEndPoint + aid + '/' + cid + '/' + pid   , {}).then(
                    function(response){
                        if (response) {
                            self.pageData = response;
                        }
                    }).catch(function (error) {
                    ajaxFetch.log(error.responseText);
                });
            }
        },

        methods :  sMeths,

        computed: {
            colNum:{
                get: function(){
                    return this.clNum;
                },
                set: function(clNum){
                    this.clNum = clNum;
                },
            }
        },
    }
</script>

<style >
    .pz-description-pod h6{
        font-size: 16px;
        color: gray;
        border-top: solid 1px;
        border-bottom: solid 1px;
        padding-bottom: 10px;
        padding-top: 10px;
        text-align: center;
        margin-bottom: 20px;
    }
</style>
