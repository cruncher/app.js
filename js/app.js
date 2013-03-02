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
	    
	    rcomment = /\{\%\s*.+?\s*\%\}/g,
	    rtag = /\{\{\s*(\w+)\s*\}\}/g;
	
	
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
	
	function setupTemplate(templates, node) {
		objToPath(templates, node.getAttribute('data-template'), node);
		node.removeAttribute('data-template');
		node.parentNode.removeChild(node);
	}
	
	function setupView(datas, views, node) {
		if (debug) console.log('Setup view \'' + viewPath + '\' with data \'' + dataPath + '\'');
		
		var data = objFromPath(datas, node.getAttribute('data-data'));
		    view = objFromPath(views, node.getAttribute('data-view') || 'default');
		
		if (!view) { throw new Error('\'' + viewPath + '\' not found in app.views'); }
		if (!data) { throw new Error('\'' + dataPath + '\' not found in app.data'); }
		
		view(node, data);
	}
	
	function defaultView(node, data) {
		var html = node.innerHTML;
	
		observe(data, function(data) {
			node.innerHTML = jQuery.render(node.innerHTML, data);
		});
		
		render(node, data);
	}
	
	function replaceStringFn(obj) {
		return function($0, $1) {
			// $1 is the template key. Don't render falsy values like undefined.
			var value = obj[$1];
			
			return value instanceof Array ?
				value.join(', ') :
				value === undefined || value === null ? '' :
				value ;
		};
	}
	
	function render(template, obj) {
		return template
			.replace(rcomment, '')
			.replace(rtag, replaceStringFn(obj));
	};
	
	function renderTemplate(template, context) {
		var node = jQuery.clone(template);
		
		node.innerHTML = render(template.innerHTML, context);
		return node;
	}
	
	
	// Expose
	
	function App(data, node) {
		var app = this,
		    templates = {},
		    views = {
		    	'default': defaultView
		    };
		
		doc.ready(function(){
			if (debug) var start = Date.now();
			
			jQuery('[data-template]', node).each(function() {
				setupTemplate(templates, this);
			});

			jQuery('[data-data]', node).each(function() {
				setupView(app.data, views, this);
			});
			
			if (debug) console.log('Initialise templates and views: ' + (Date.now() - start) + 'ms');
		});
		
		app.data = data;
		app.views = views;
		app.templates = templates;
	};
	
	App.fn = App.prototype = {
		render: function(path, context) {
			var template = objFromPath(this.templates, path);
			
			return renderTemplate(template, context);
		}
	};
	
	return (window.App = App);
});