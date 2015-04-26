var users = {
	name: 'users',
	pattern: {
		login: {type: "String"},
		password: {type: "String"},
		_password: {
			isNew: "Boolean",
			value: {type: "String"},
			revalue: {type: "String"}
		},
		access: [{ type: 'ObjectId', ref: 'access' }],
		recovery: "String",
		activate: "String"
	},
	populate: 'access',
	access: {
		collection_create: false,
		collection_read: false, 
		collection_update: false, 
		collection_delete: false
	}
}
var access = { 
	name: 'access',
	pattern: {
		title: {type: "String"},
		cName: {type: "String"},
		isGroup: {type: "Boolean", default: false},
		isCustom: {type: "Boolean", default: false},
		child: [{ type: 'ObjectId', ref: 'access' }],
		c: {type: "Boolean", default: false},
		r: {type: "Boolean", default: false},
		u: {type: "Boolean", default: false},
		d: {type: "Boolean", default: false}
	},
	populate: 'child',
	access: {
		collection_create: false,
		collection_read: false, 
		collection_update: false, 
		collection_delete: false
	}	
}
module.exports = {
	users: users,
	access: access
}