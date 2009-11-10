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
			type = '_' + this.elem.tagName.toLowerCase();
			this[type]();
		}.bind(this));
	
		this.options.onComplete(this.form);
	
	},
	
	/**
	 * Reset the form with the initial data
	 */
	reset : function() {
		this.fill(this.initialData);
	},
	
	_find: function(id){
		var data = id || this.id;
		return this.data.get(data) || false;		
	},
	
	_input : function() {

		switch(this.elem.readAttribute('type').toLowerCase()){
		case 'radio' :
			this.elem.checked = this._find();
			break;
			
		default :
			this.elem.value = this._find();
			this.elem.writeAttribute('value', this._find());	
			break;
		}
	
	},
	
	_select : function() {
	
		var value = this._find();
		var options = $A(this.elem.options);
	
		options.each(function(o) {
	
			if (o.value == value) {
	
				o.selected = true;
	
			}
	
		}.bind(this));
	
	},
	
	_textarea : function() {
	
		this.elem.update(this.value);
	
	}
});