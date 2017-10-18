module.exports = {
    random_string: function (length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    },
    addslashes: function (str) {
        return encodeURIComponent((str + '').replace(/\u0000/g, '\\0').replace('\t', '').replace('\'', '`').replace('\'', '`'));
    },
    arrayObjectIndexOf: function (myArray, searchTerm, property) {
        for (var i = 0, len = myArray.length; i < len; i++) {
            if (myArray[i][property] === searchTerm)
                return i;
        }
        return -1;
    },
    compareString: function (str1, str2) {
        if (str1.length !== str2.length) {
            return false;
        }
        for (var i = 0; i < str1.length; i++) {
            if (str1.charCodeAt(i) !== str2.charCodeAt(i)) {
                return false;
            }
        }
        return true;
    },
    formatMoney: function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    },
    mergeJSON: function (source1, source2) {
        var extend = require('util')._extend;
        return extend(source1, source2);
    },
    validateObjectKeysRequired: function(object, keys){
        for(var i in keys){
            if(object[keys[i]] === undefined){
                return keys[i];
            }
        }
        return false;
    },
    validateObjectKeysRequiredOnce: function(object, keys){
        var bool = true;
        for(var i in keys){
            if(object[keys[i]] !== undefined){
                bool = false;
            }
        }
        return bool;
    },
    setDefaults: function(object, defaults){
        for(var i in defaults){
            if(object[i] === undefined){
                object[i] = defaults[i];
            }
        }
        return object;
    }
}
