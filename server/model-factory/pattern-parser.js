/*********************************************************/
/* Parse pattern of model and convert to mongoose format */
/*********************************************************/
module.exports = function (app) {
		var log = app.get('logger')('raving.core/model-factory');
		var config = app.get('config');
		var orm = app.get('orm');
	
		var switchType = function (type) {
			switch (type) {
				case "String":
					type = String;
					break
				case "Number":
					type = Number;
					break
				case "Date":
					type = Date;
					break
				case "Buffer":
					type = Buffer;
					break
				case "Boolean":
					type = Boolean;
					break
				case "Mixed":
					type = orm.Schema.Types.Mixed;
					break
				case "ObjectId":
					type = orm.Schema.Types.ObjectId;
					break
				default:
					type = String;
					break
			}
		return type;
	}
	
	var extParse = function(field) {
		var _field = {};
		_field.type = switchType(field.type);
		if (field.ref) _field.ref  = field.ref;
		// TODO: release build all pattern specification
		return _field;
	}
	
	// parse pattern
	var parsepattern = function (pattern) {
		var _pattern = {};
		for(var key in pattern){
			var field = pattern[key], _field;
			if (typeof(field)=="string") {
				// type of field specifies a string
				_field = switchType(field);
			} else {
				// extended specifies
				if (field instanceof Array) {
					// there need parse of array
					if (typeof(field[0])=='string') {
						_field=[switchType(field[0])];
					} else if (field[0].type) {
						// this is extended specifies of array
						_field = [extParse(field[0])];
					} else {
						_field=[parsepattern(field[0])];
					}
				} else if (field.type) {
					// this is extended specifies of field
					_field = extParse(field); 
				} else {
					// this is subpattern
					_field = parsepattern(field);
				}
			}
			_pattern[key] = _field;
		}
		return _pattern;
	}
	return parsepattern;
}