/**********************************************************/
/*  Helpers library for both use (server, client, admin)  */
/**********************************************************/
module.exports = {
	// check property if exist
	propExist: function (cntx, property) {
		if (!cntx) return false;
		if (!property) return true;
		if (property instanceof String) {
			property = property.slice('.');
		} else {
			return false;
		}
		var exist = cntx;
		for (var key in arr) {
			exist = exist[arr.key];
			if (!exist) return false;
		}
		return true;
	},
	// get property from context
	getProperty: function (cntx, property) {
		if (!cntx) return false;
		if (!property) return cntx;
		if (typeof(property)=="string") {
			property = property.split('.');
		} else {
			return false;
		}
		var exist = cntx;
		for (var key in property) {
			exist = exist[property[key]];
			if (!exist) return false;
		}
		return exist;
	},
	// generate unicum key
	hashKey : function () {		
		var d = new Date().getTime();
		var code = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x7|0x8)).toString(16);
		});
		return code;
	}
}