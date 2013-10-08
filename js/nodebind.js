// DOM Binder
// 
// Binds data to the DOM. Changes in data are then immediately rendered
// in the nodes that display that data via template tags such as {{ name }}.
// Only those nodes containing the changed data are updated, other nodes are
// not re-rendered, and the actual DOM tree does not change. Template tags
// can also be used in the attributes href, title, id, class, style and value.
// 
// dataBind(node, bindFn, getFn)
// 
// node
// 
// A DOM node to use as a route. The inner DOM tree is traversed and references
// to property names written as {{ name }} cause bindFn to be called with name
// as property.
// 
// bindFn(property, fn)
// 
// Responsible for listening to changes to properties on a data object or model.
// When the named property changes, function fn must be called.
// 
// getFn(property)
// 
// Responsible for returning the value of the named property from a data object
// or model.


(function() {
	var attributes = [
		'href',
		'title',
		'id',
		'class',
		'style',
		'value'
	];

	var rname = /\{\{\s*([a-z]+)\s*\}\}/g;

	var nodeCount = 0;
	var textCount = 0;

	var types = {
		1: function domNode(node, bind, get) {
			var a = attributes.length,
			    attribute, value;

			nodeCount++;

			while (a--) {
				attribute = attributes[a];
				value = node.getAttribute(attribute);

				if (!value) { continue; }
				
				bindAttribute(node, attribute, value, bind, get);
			}

			var children = node.childNodes,
			    n = -1, 
			    l = children.length,
			    child;

			// Loop forwards through the children
			while (++n < l) {
				child = children[n];
				if (types[child.nodeType]) {
					types[child.nodeType](child, bind, get);
				}
			}
		},

		3: function textNode(node, bind, get) {
			var innerText = node.innerText ? 'innerText' : 'textContent';
			
			textCount++;

			observeProperties(node[innerText], bind, get, function(text) {
				node[innerText] = text;
			});
		}
	};

	function bindAttribute(node, attribute, value, bind, get) {
		observeProperties(value, bind, get, function(text) {
			node.setAttribute(attribute, text);
		});
	}

	function extractProperties(str) {
		var propertiesCache = {},
		    properties = [];
		
		str.replace(rname, function($0, $1){
			// Make sure proerties are only added once.
			if (!propertiesCache[$1]) {
				propertiesCache[$1] = true;
				properties.push($1);
			}
		});

		return properties;
	}

	function observeProperties(text, bind, get, fn) {
		var properties = extractProperties(text);

		properties.forEach(function(property) {
			bind(property, function() {
				fn(text.replace(rname, function($0, $1) {
					var word = get($1);
					return word === undefined ? '' : word ;
				}));
			});
		});
	}

	function bindData(node, bind, get) {
		// Assume this is a DOM node, and set the binder off
		types[1](node, bind, get);

		console.log('node count', nodeCount);
		console.log('text count', textCount);
	}

	window.dataBind = bindData;
})();