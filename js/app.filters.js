
(function(app, undefined) {
	var rbreaks = /\n/;

	app.filters = {
		add: function(n) {
			return parseFloat(this) + n ;
		},

		capitalize: function() {
			return this.charAt(0).toUpperCase() + string.substring(1);
		},

		cut: function(string) {
			return this.replace(RegExp(string, 'g'), '');
		},

		date: (function(M, F, D, l, s) {
			var formatters = {
				a: function(date) { return date.getHours() < 12 ? 'a.m.' : 'p.m.'; },
				A: function(date) { return date.getHours() < 12 ? 'AM' : 'PM'; },
				b: function(date) { return M[date.getMonth()].toLowerCase(); },
				c: function(date) { return date.toISOString(); },
				d: function(date) { return date.getDate(); },
				D: function(date) { return D[date.getDay()]; },
				//e: function(date) { return ; },
				//E: function(date) { return ; },
				//f: function(date) { return ; },
				F: function(date) { return F[date.getMonth()]; },
				g: function(date) { return date.getHours() % 12; },
				G: function(date) { return date.getHours(); },
				h: function(date) { return ('0' + date.getHours() % 12).slice(-2); },
				H: function(date) { return ('0' + date.getHours()).slice(-2); },
				i: function(date) { return ('0' + date.getMinutes()).slice(-2); },
				//I: function(date) { return ; },
				j: function(date) { return date.getDate(); },
				l: function(date) { return l[date.getDay()]; },
				//L: function(date) { return ; },
				m: function(date) { return ('0' + date.getMonth()).slice(-2); },
				M: function(date) { return M[date.getMonth()]; },
				n: function(date) { return date.getMonth(); },
				//o: function(date) { return ; },
				O: function(date) {
					return (date.getTimezoneOffset() < 0 ? '+' : '-') +
						 ('0' + Math.round(100 * Math.abs(date.getTimezoneOffset()) / 60)).slice(-4) ;
				},
				r: function(date) { return date.toISOString(); },
				s: function(date) { return ('0' + date.getSeconds()).slice(-2); },
				S: function(date) { return S[date.getDate()]; },
				//t: function(date) { return ; },
				//T: function(date) { return ; },
				U: function(date) { return +date; },
				w: function(date) { return date.getDay(); },
				//W: function(date) { return ; },
				y: function(date) { return date.getFullYear() % 100; },
				Y: function(date) { return date.getFullYear(); },
				//z: function(date) { return ; },
				Z: function(date) { return -d.getTimezoneOffset() * 60; }
			};
			
			return function(format) {
				var date = this instanceof Date ? this : new Date(this) ;
				
				return format.replace(/([a-zA-Z])/g, function($0, $1) {
					return formatters[$1](date);
				});
			};
		})(
			('Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov').split(' '),
			('January February March April May June July August September October November December').split(' '),
			('Sun Mon Tue Wed Thu Fri Sat').split(' '),
			('Sunday Monday Tuesday Wednesday Thursday Friday Saturday').split(' '),
			('st nd rd th th th th th th th').split(' ')
		),
		
		'default': function(value) {
			return (this === undefined || this === null) ? value : this ;
		},
		
		//dictsort
		//dictsortreversed
		//divisibleby

		escape: (function() {
			var pre = document.createElement('pre');
			var text = document.createTextNode(this);

			pre.appendChild(text);
			
			return function() {
				text.textContent = this;
				return pre.innerHTML;
			};
		})(),

		//filesizeformat

		first: function() {
			return this[0];
		},

		floatformat: Number.prototype.toFixed,

		//get_digit
		//iriencode

		join: Array.prototype.join,

		json: function() {
			return JSON.stringify(this);
		},

		last: function() {
			return this[this.length - 1];
		},

		length: function() {
			return this.length;
		},

		//length_is
		//linebreaks

		linebreaksbr: function() {
			return this.replace(rbreaks, '<br/>')
		},

		//linenumbers
		//ljust

		lower: String.prototype.toLowerCase,
		
		//make_list 
		
		multiply: function(n) {
			console.log(this, n, this * n);
			return this * n;
		},
		
		//phone2numeric

		pluralize: function() {
			return this + (this > 1 ? 's' : '') ;
		},

		//pprint

		random: function() {
			return this[Math.floor(Math.random() * this.length)];
		},
		
		//raw
		//removetags
		
		replace: function(str1, str2) {
			return this.replace(RegExp(str1, 'g'), str2);
		},
		
		//reverse

		safe: function() {
			
		},

		//safeseq

		slice: Array.prototype.slice,
		
		slugify: function() {
			return this.trim().toLowerCase.replace(/\W/g, '').replace(/_/g, '-');
		},

		//sort
		//stringformat

		striptags: function() {
			
		},

		time: function() {
			
		},

		//timesince
		//timeuntil
		//title

		truncatechars: function(n) {
			return this.length > n ?
				this.length.slice(0, n) + '&hellips;' :
				this ;
		},

		//truncatewords
		//truncatewords_html
		//unique
		//unordered_list

		lower: String.prototype.toLowerCase,

		//urlencode
		//urlize
		//urlizetrunc
		//wordcount
		//wordwrap

		yesno: function(truthy, falsy) {
			return this ? truthy : falsy ;
		}		
	};

	// Alias some filters for django compatibility
	app.filters.capfirst = app.filters.capitalize;


})(window.Sparky);