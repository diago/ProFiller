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
	
		this.data = $H(data);
		
		this.options.onStart(this.form);

		// used to run through and fill
		// this is here to recheck for dynamically added elements
		this.elements = this.form.getElements();

		var type;
		this.elements.each(function(elem){
			this.elem = $(elem);
			this.id = this.elem.identify();
			this.value = this.elem.readAttribute('value');
			this.type = '_' + this.elem.tagName.toLowerCase();
			this[this.type]();
		}.bind(this));
	
		this.options.onComplete(this.form);
	
	},
	
	/**
	 * Reset the form with the initial data
	 */
	reset : function() {
		this.form.reset();
	},
	
	_find: function(id){
		var id = id || this.id;
		var data = this.data.get(id) || false;
		if(!data && this.id.endsWith(']')){
			var exp = new RegExp("\\[.*\\]");
			var real_id = this.id.sub(exp, '');
			data = this._find(real_id);
		}
		return data;
	},
	
	_input : function() {

		switch(this.elem.readAttribute('type').toLowerCase()){
		case 'checkbox' :
			var values = this._find();
			if(values.indexOf(this.value) !== -1){
				this.elem.checked = true;
			}
			break;
			
		case 'radio' :
			this.elem.checked = this._find();
			break;
			
		case 'text' :
			this.elem.value = this._find();
			break;
		}
	
	},
	
	_select : function() {
		
		var value;
		var values = [];
		if(this.elem.multiple){
			values = this._find();
		} else {
			value = this._find();
		}

		var options = $A(this.elem.options);	
		options.each(function(o) {
	
			if (o.value == value || $A(values).indexOf(o.value) !== -1) {
	
				o.selected = true;
	
			}
	
		}.bind(this));
	
	},
	
	_textarea : function() {
	
		this.elem.value = this._find();
	
	}
});