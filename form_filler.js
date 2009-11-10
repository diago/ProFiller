/*
Copyright (c) 2009 Heath Padrick

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
 */

var FormFiller = Class.create( {
	initialize : function(form, options) {
		this.options = Object.extend( {
			onStart : Prototype.emptyFunction,
			onComplete : Prototype.emptyFunction
		}, options || {});

		this.form = $(form);
		// stores the form as is
	this.initialData = this.form.serialize( {
		hash : true
	});

	},
	/**
	 * Fills the form with the supplied data
	 */
	fill : function(data) {
	
		if (this.timeout) {
			window.clearTimeout(this.timeout);
		} else {
			this.options.onStart(this);
			this.hide();
		}
	
		for ( var x in data) {
			var elm = $(x);
			var type;
	
			if (elm) {
				this.elm = elm;
				this.value = data[x] == null ? '' : data[x];
				type = '_' + elm.tagName.toLowerCase();
	
				this[type]();
			}
	
		}
	
		this.timeout = this.show.bind(this).delay(.2);
	
	},
	
	/**
	 * Reset the form with the initial data
	 */
	reset : function() {
		this.fill(this.initialData);
	},
	
	_input : function() {
	
		this.elm.value = this.value;
		this.elm.writeAttribute('value', this.value);
	
	},
	
	_select : function() {
	
		var options = $A(this.elm.options);
	
		options.each(function(o) {
	
			if (o.value == this.value) {
	
				o.selected = true;
	
			}
	
		}.bind(this));
	
	},
	
	_textarea : function() {
	
		this.elm.update(this.value);
	
	}
});