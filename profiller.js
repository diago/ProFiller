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

var ProFiller = (function(){
	
	var ProFiller = Class.create();
	
	ProFiller.Version = "2.1.1";
	
	ProFiller.options = {
		reset: true
	};
	
	ProFiller.prototype = {
		initialize: function(form, options){
			this.options = Object.extend(ProFiller.options, options || {});
			this.form = $(form);
			this.elements = this.form.getElements();
		},
		
		fill: function(data){
			
			var value, name, type;
			
			if(this.options.reset) this.form.reset();
			
			this.elements.each(function(elem){
				name = elem.readAttribute('name');
				value = this._getValue(name, data);
				type = elem.readAttribute('type');
				if(Object.isArray(value)){
					for(var i=0;i<value.length;i++){
						this._setValue(elem, type, value[i])
					}
				} else this._setValue(elem, type, value);
			}.bind(this));
			
			return this.form;
		},
		
		_getValue: function(name, hash){
			var data = $H(hash);
			var names = Object.isArray(name) ? name : name.match(/([\w-:\.]+)/g);
			var value = data.get(names[0]);
			if(names.length>1){
				names.shift();
				return this._getValue(names, value);
			}
			return value;
		},
		
		_setValue: function(elem, type, value){
			var elemValue = elem.readAttribute('value');
			switch(type){
				case 'radio':
					(elemValue == value) ? elem.setValue(value) : false;
				break;
				
				case 'checkbox':
					(elemValue == value) ? elem.setValue(value) : false;
				break;
				
				default:
					if(value) elem.setValue(value);
				break;
			}
		}
	};
	
	Element.addMethods('FORM', {
		fill: function(form, data ,resetBeforeFill){
			return new ProFiller(form,{reset: resetBeforeFill}).fill(data);
		}
	});
	
	return ProFiller;
})();


