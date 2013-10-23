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
		module(jQuery, !!window);
	}
})(function(jQuery, global, undefined){
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
	
	function setup(node, name, path, settings) {
		var app = apps[name],
		    data = objFromPath(datas, path);
		
		if (debug) console.log('app: "' + name + (path ? '" data: "' + path + '"' : ''));
		if (!app) { throw new Error('\'' + name + '\' not found in apps'); }
		if (path && !data) { throw new Error('\'' + path + '\' not found in data'); }
		
		app(node, data, settings);
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

	function createCache(cache) {
		function getSet(name, obj) {
			if (obj) {
				cache[name] = obj;
				return this;
			}

			return cache[name];
		}

		getSet.cache = cache;

		return getSet;
	}

	doc.ready(function(){
		if (debug) var start = Date.now();
		
		jQuery('[data-template]', node).each(function() {
			setupTemplate(templates, this);
		});

		jQuery('[data-app]', node).each(function(i, node) {
			var name = node.getAttribute('data-app');
			var data = node.getAttribute('data-data');

			setup(node, name, data, settings);
		});

		jQuery('[data-app]').each(function(i, node) {
			data = {};

			function bind(property, fn) {
				observe(data, property, fn);
			}

			function get(property) {
				return data[property];
			}

			window.dataBind(node, bind, get);
		});
		
		if (debug) console.log('[app] Initialised templates and views (' + (Date.now() - start) + 'ms)');
	});

	app = {
		app: createCache({}),
		data: createCache({})
	};

	return (window.App = App);
});