// Observe and unobserve
// 
// observe(obj, prop, fn)
// Redefines property prop of object obj with a getter and setter
// that call function fn whenever this property is changed.

window.observe = (function(){
	var slice = Array.prototype.slice;
	
	function call(array) {
		// Call observer with stored arguments
		array[0].apply(null, array[1]);
	}
	
	function replaceProperty(obj, prop, observer, call) {
		var v = obj[prop],
		    observers = [observer],
		    descriptor = {
		    	enumerable: true,
		    	configurable: false,
		    	
		    	get: function() {
		    		return v;
		    	},
		    	
		    	set: function(u) {
		    		if (u === v) { return; }
		    		v = u;
		    		observers.forEach(call);
		    	}
		    };
		
		// Store the observers so that future observers can be added.
		descriptor.set.observers = observers;
		
		Object.defineProperty(obj, prop, descriptor);
	}
	
	function observeProperty(obj, prop, fn) {
		var desc = Object.getOwnPropertyDescriptor(obj, prop),
		    args = slice.call(arguments, 0),
		    observer = [fn, args];
		
		args.splice(1,2);
		
		// If an observers list is already defined, this property is
		// already being observed, and all we have to do is add our
		// fn to the queue.
		if (desc && desc.set && desc.set.observers) {
			desc.set.observers.push(observer);
			return;
		}
		
		replaceProperty(obj, prop, observer, call);
	}
	
	return function(obj, prop, fn) {
		var args, key;
		
		// Overload observe to handle observing all properties with
		// the function signature observe(obj, fn).
		if (prop instanceof Function) {
			fn = prop;
			
			for (prop in obj) {
				args = slice.call(arguments, 0);
				args.splice(1, 0, prop, fn);
				observeProperty.apply(null, args);
			};
			
			return;
		}
		
		if (prop instanceof Array) {
			for (key in prop) {
				args = slice.call(arguments, 0);
				args.splice(1, 0, prop[key], fn);
				observeProperty.apply(null, args);
			}
		}
		
		observeProperty.apply(null, arguments);
	};
})();

function observeCollection(array, prop, fn) {
	var key, args;
	
	for (key in array) {
		args = Array.prototype.slice.call(arguments, 0);
		args.splice(0, 1, array[key]);
		args.splice(3, 0, key);
		observe.apply(null, args);
	};
}

function unobserve(obj, prop, fn) {
	if (prop instanceof Function) {
		fn = prop;
		
		for (prop in obj) {
			unobserve(data, key, fn);
		};
		
		return;
	}
	
	var desc = Object.getOwnPropertyDescriptor(obj, prop);
	
	if (!desc.set || !desc.set.observers) { return; }
	
	if (fn) {
		desc.set.observers = desc.set.observers.filter(function(fn2) {
			return fn !== fn2;
		});
	}
	else {
		desc.set.observers.length = 0;
	}
}