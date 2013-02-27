// app.js
// 
// A simple app toolkit. No magic. Reads data attributes in
// the DOM to bind dynamic data to views.
// 
// Views
// 
// <div data-view="name" data-data="path.to.data">
//     <h1>Hello world</h1>
// </div>
// 
// Where 'name' is the key of a view function in app.views and
// path.to.data points to an object in app.data.
// 
// Template
// 
// <div data-template="name">
//     <h1>{{ prop }}</h1>
// </div>
// 
// The template is stored as a DOM node in app.templates[name],
// and can be rendered with app.render(name, context), where
// context is an object with properties that match template tags
// such as {{ prop }}.

(function (module) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['jquery', './observe'], module);
	} else {
		// Browser globals
		module(jQuery, observe, !!window);
	}
})(function(jQuery, observe, global, undefined){
	var debug = false,
	    
	    doc = jQuery(document),
	    
	    templates = {},
	    views = {},
	    
	    app;
	
	
	// Pure functions
	
	function isDefined(val) {
		return val !== undefined && val !== null;
	}
	
	function isObject(obj) {
		return obj instanceof Object;
	}
	
	
	// App
	
	function objFrom(obj, array) {
		var val = obj[array[0]],
		    slice = array.slice(1);
		
		return isDefined(val) && slice.length ?
			objFrom(val, slice) :
			val ;
	}
	
	function objFromPath(obj, path) {
		return objFrom(obj, path.split('.'));
	}
	
	function objTo(root, array, obj) {
		var key = array[0];
		
		return array.length > 1 ?
			objTo(isObject(root[key]) ? root[key] : (root[key] = {}), array.slice(1), obj) :
			(root[key] = obj) ;
	}
	
	function objToPath(root, path, obj) {
		return objTo(root, path.split('.'), obj);
	}
	
	function render(path, context) {
		var template = typeof path === 'string' ?
		    	objFromPath(templates, path) :
		    	path ,
		    node = jQuery.clone(template);
		
		node.innerHTML = jQuery.render(template.innerHTML, context);
		return node;
	};
	
	views['default'] = function(node, data) {
		var html = node.innerHTML;
		
		observe(data, function(data) {
			node.innerHTML = jQuery.render(node.innerHTML, data);
		});
		
		render(node, data);
	};
	
	doc.ready(function(){
		if (debug) var start = Date.now();
		
		// Extract templates
		jQuery('[data-template]').each(function() {
			var elem = jQuery(this),
			    path = this.getAttribute('data-template');
			
			this.removeAttribute('data-template');
			objToPath(app.templates, path, this);
			elem.remove();
		});
		
		// Initialise views and bind them to dom nodes
		jQuery('[data-data]').each(function() {
			var dataPath = this.getAttribute('data-data'),
			    viewPath = this.getAttribute('data-view') || 'default',
			    view, data;
			
			if (debug) console.log('Setup view \'' + viewPath + '\' with data \'' + dataPath + '\'');
			
			data = objFromPath(app.data, dataPath);
			view = objFromPath(app.views, viewPath);
			
			if (!view) { throw new Error(viewPath + ' not found in app.views'); }
			if (!data)  { throw new Error(dataPath + ' not found in app.data'); }
			
			view(this, data);
		});
		
		if (debug) console.log('Initialise templates and views: ' + (Date.now() - start) + 'ms');
	});
	
	
	// Expose
	
	return (window.app = app = {
		templates: templates,
		views: views,
		render: render
	});
});