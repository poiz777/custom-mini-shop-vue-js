/**
 * Created by Poiz Campbell on 29.12.16.
 */

function PSM(namespace, adapter){
    this.instance       = this;
    this.store          = {};
    this.data           = {};
    this.adapter        = (adapter === undefined)?"session":adapter;  //local - session  - Storage
    this.namespace      = (namespace === undefined)?"default":namespace;
    this.build();
}

PSM.prototype.build     = function(){

    // INITIALIZER(S) : START
    this.init           = function(){
        this.bake();
        return this;
    };

    this.bake           = function(){
      if (typeof(Storage) !== "undefined") {
        this.syncStore();
        this.store[this.namespace]  = (this.store[this.namespace] === undefined) ? {} : this.store[this.namespace];
        if(this.adapter === "session"){
          sessionStorage.setItem(this.namespace, JSON.stringify(this.store));
        }else if(this.adapter === "local") {
          localStorage.setItem(this.namespace, JSON.stringify(this.store));
        }
      } else {
        // Sorry! No Web Storage support..
      }
    };
    // INITIALIZER(S) : START



    // GETTERS : START
    this.get            = function(tKey, prop, defVal){
        return this.getProp(tKey, prop, defVal);
    };

    this.getProp        = function(tKey, prop, defVal){
      // FIRST CHECK THE DATA STORED IN THE CONTEXT OF THE THIS CLASS VARIABLE
      // IF NOTHING SHOW UP, TRY ACCESSING IT FROM THE STORE...
      // IF ALL FAILS RETURN NULL!!!
      this.syncStore();
      defVal  = (defVal === undefined) ? null : defVal;
      if(this.store[this.namespace][tKey] !== undefined){

        if(this.store[this.namespace][tKey][prop] !== undefined){
          return this.store[this.namespace][tKey][prop];
        }
      }
      return defVal;
    };

    this.getAll         = function(tKey, defVal){
        this.syncStore();
        defVal  = (defVal === undefined) ? {} : defVal;
        if(this.store[this.namespace][tKey] === undefined){
            return defVal;
        }
        return this.store[this.namespace][tKey];
    };
    // GETTERS : STOP



    // SETTERS : START
    this.set            = function(tKey, prop, propValue){
        this.setProp(tKey, prop, propValue);
    };

    this.setProp        = function(tKey, prop, propValue){
      this.syncStore();
      if(this.store[this.namespace][tKey] === undefined){
        this.store[this.namespace][tKey]    = this.data;
      }
      this.store[this.namespace][tKey][prop]  = propValue;
      // SAVE IMMEDIATELY TO STORE:
      this.save();
    };

    this.add            = function(tKey, prop, propValue){
      this.setProp(tKey, prop, propValue);
    };

    this.setAdapter     = function (adapter) {
      this.adapter = adapter;
    };
    // GETTERS : STOP



    // CLEANERS : START
    this.empty          = function(){
      this.destroy();
    };

    this.destroy        = function(){
        this.store[this.namespace]  = {};
        // RE-SAVE IMMEDIATELY TO STORE:
        this.save();
    };

    this.remove         = function(tKey, prop){
      this.syncStore();
      if(this.store[this.namespace][tKey] !== undefined){

        if(this.store[this.namespace][tKey][prop] !== undefined){
          delete this.store[this.namespace][tKey][prop];
        }
      }
      // RE-SAVE IMMEDIATELY TO STORE:
      this.save();
    };

    this.removeItem     = function(tKey, prop){
      this.remove(tKey, prop);
    };

    this.clear          = function(tKey){
      this.syncStore();
      if(this.store[this.namespace][tKey] !== undefined){
        delete this.store[this.namespace][tKey];
      }
      // RE-SAVE IMMEDIATELY TO STORE:
      this.save();
    };
    // CLEANERS : STOP



    // PERSISTENCE : START
    this.syncStore      = function(){
        // GET DATA FROM STORAGE IF IT EXISTS....
        // HOWEVER, IF WE HAVE A CLASS-SCOPE EQUIVALENT,
        // WE USE IT TO OVERRIDE THAT FROM STORAGE...
        let storedData  = null;
        let confData    = {};
        if(this.adapter === "session"){
            storedData  = sessionStorage.getItem(this.namespace);
        }else if (this.adapter === "local") {
            storedData  = localStorage.getItem(this.namespace);
        }
        if(storedData  !== undefined && storedData ){
            confData    = JSON.parse(storedData);
        }
        this.store      = this.extend({}, this.store, confData);
    };

    this.save           = function(){
        if (typeof(Storage) !== "undefined") {
            if(this.adapter === "session"){
                sessionStorage.setItem(this.namespace, JSON.stringify(this.store));
            }else if(this.adapter === "local") {
                localStorage.setItem(this.namespace, JSON.stringify(this.store));
            }
        } else {
            // Sorry! No Web Storage support..
        }
    };
    // PERSISTENCE : STOP



    // CHECKERS : START
    this.has            = function(tKey, prop){
      this.syncStore();
      if(this.store[this.namespace][tKey] !== undefined){
        if(this.store[this.namespace][tKey][prop] !== undefined){
          return true;
        }
      }
      return false;
    };

    this.hasKey         = function(tKey){
        return (this.store[this.namespace][tKey] !== undefined);
    }
    // CHECKERS : STOP


    // MISCELLANEOUS : START
    this.extend         = function (){
      for(let i=1; i<arguments.length; i++) {
        for (let key in arguments[i]) {
          if (arguments[i].hasOwnProperty(key)) {
            arguments[0][key] = arguments[i][key];
          }
        }
      }
      return arguments[0];
    };
    // MISCELLANEOUS : STOP


    this.init();
};

Object.size = function(obj) {
  let size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};


export default {
  mngR: ()=>PSM,
};
