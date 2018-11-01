import ajaxFetch    from "@/Services/JQAjax";
import router       from "@/Services/Router"

const ST_IN = {
    psm             : ajaxFetch.psm,
    preLoaderURI    : 'http://wp.piz/a/assets/images/icons/pz-loader-05.gif',
    itemChunks      : {},
    rendered        : false,
    productItems    : [],
    columnsPerRow   : 4,
    colsPerRow      : 4,
    prodCount       : 0,
    headerString    : '',
    detailPageData  : {},

    initializeCategories: function(){
        return ajaxFetch.flatAjaxFetch(ajaxFetch.ajaxURI+'/categories', {});
    },

    initializeStore: function() {
        const self          = this;
        self.initializeCategories().
            then(function(categories){
                ajaxFetch.psm.set('poizShopApp', 'categories', categories);
                categories.forEach(function(cat){
                    let cid     = cat.id;
                    ajaxFetch.flatAjaxFetch(ajaxFetch.ajaxURI+'/products/'+cid, {'cid':cid}).then(
                        function(response){
                            if (response) {
                                let prodItems             = JSON.parse(JSON.stringify(response));
                                self.prodCount            = response.length;
                                self.itemChunks[cid]      = [];
                                self.detailPageData[cid]  = {};
                                self.productItems[cid]    = {};

                                response.forEach(function(item, key, ray){
                                    // ADD ROUTE KEY....
                                    item['vueRoute']      = '/item/' + item.alias + '/' + item.cat_id + '/' + item.id;

                                    // BUILD THE ROUTE INTO THE APP
                                    self.buildDetailPageData(item, cid);
                                    self.psm.set('poizShopApp', 'detailPageData', self.detailPageData);

                                    for(let cue in prodItems){
                                        if(parseInt(prodItems[cue].id) === parseInt(item.id)){
                                            self.productItems[cid][cue] = item;
                                            break;
                                        }
                                    }

                                    if( key === (ray.length -1) ){
                                        let cueNum;
                                        let temp        = [];
                                        let objProducts = self.productItems[cid];
                                        if(objProducts){
                                            for(cueNum in objProducts){
                                                let product = objProducts[cueNum];
                                                temp.push(product);
                                                let totalCount = (self.itemChunks[cid].length * self.columnsPerRow) + temp.length;

                                                if( temp.length === self.columnsPerRow || totalCount >= self.prodCount) {
                                                    self.itemChunks[cid].push(temp);
                                                    temp  = [];
                                                    self.psm.set('poizShopApp', 'itemChunks', self.itemChunks);
                                                    ajaxFetch.log(self.itemChunks);
                                                }
                                            }
                                            self.rendered = true;
                                        }
                                    }
                                });

                            }
                        }).catch(function (error) {
                        ajaxFetch.log(error.responseText);
                    });
                });
        }).
            catch(function(){});
    },

    buildDetailPageData: function(item, cid) {
        this.detailPageData[cid][item['vueRoute']]  = item;
    },

    getCID: function () {
        let cid = 1;
        try{
            cid = router.history.current.params.catID;
        }catch (e) {
           cid  = 1;
        }
        return (!cid) ? 1 : cid;
    }

};

export default ST_IN;