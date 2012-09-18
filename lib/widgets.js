/*jslint node: true */

exports.attributes = attributes = function (a) {
  var k, str, html = '';
  for(k in a) {    
    str = (!Array.isArray(a[k])) ? ([].concat(a[k]).join(' ')) : a[k].join(' ');
    if(str.length) html += k + '="' + str.replace(/"/g, '&quot;').replace(/\[((.)*?)\]/g, "-$1") + '" ';
  }
  return html;
}

// generates a string for common widget attributes
var attrs = function (a) {
    var html = ' name="' + a.name + '"';
    html += ' id=' + (a.id ? '"' + a.id + '"' : '"id_' + a.name.replace(/\[((.)*?)\]/g, "_$1") + '"');
    html += a.classes.length > 0 ? ' class="' + a.classes.join(' ') + '"' : '';
    return html;
};

var options = function (defaults, opt) {
  opt = opt || {};

  var w = {
    type: defaults.type,
    classes: (opt.classes) || [],
    display: opt.display || [],
    prefix:  opt.prefix || '',
    suffix:  opt.suffix || ''
  }
  if(typeof(opt.classes)=='string') w.classes = opt.classes.split(' ');
  return w;
}
// used to generate different input elements varying only by type attribute
var input = function (type) {
    var dataRegExp = /^data-[a-z]+$/,
        ariaRegExp = /^aria-[a-z]+$/,
        legalAttrs = ['autocomplete', 'autocorrect', 'autofocus', 'autosuggest', 'checked', 'dirname', 'disabled', 'list', 'max', 'maxlength', 'min', 'multiple', 'multiple', 'novalidate', 'pattern', 'placeholder', 'readonly', 'required', 'size', 'step'],
        ignoreAttrs = ['id', 'name', 'class', 'classes'];
    return function (opt) {
        opt = opt || {};
        var w = options({type:type}, opt);
        
        w.toHTML = function (name, f) {
            f = f || {};
            var html = '<input';
            html += ' type="' + type + '"';
            html += attrs({name: name, id: f.id, classes: w.classes});
            html += f.value ? ' value="' + f.value + '"' : '';
            html += Object.keys(opt).reduce(function (html, k) {
                if (ignoreAttrs.indexOf(k) === -1 && legalAttrs.indexOf(k) !== -1 || dataRegExp.test(k) || ariaRegExp.test(k)) {
                    return html + ' ' + k + '="' + opt[k].replace(/"/g, '&quot;') + '"';
                }
                return html;
            }, '');
            return html + ' />';
        };
        w.getDataRegExp = function() {
            return dataRegExp;
        };
        w.getAriaRegExp = function() {
            return ariaRegExp;
        };
        return w;
    };
};

exports.text = input('text');
exports.password = input('password');
exports.hidden = input('hidden');

exports.checkbox = function (opt) {
    var w = options({type:'checkbox'}, opt);
    w.toHTML = function (name, f) {
        f = f || {};
        var html = '<input type="checkbox"';
        html += attrs({name: name, id: f.id, classes: w.classes});
        html += f.value ? ' checked="checked"' : '';
        return html + ' />';
    };
    return w;
};

exports.select = function (opt) {
    var w = options({type:'select'}, opt);
    w.toHTML = function (name, f) {
        f = f || {};
        var html = '<select' + attrs({
            name: name,
            id: f.id,
            classes: w.classes
        }) + '>';
        html += Object.keys(f.choices).reduce(function (html, k) {
            return html + '<option value="' + k + '"' + ((f.value && f.value === k) ? ' selected="selected"' : '') + '>' + f.choices[k] + '</option>';
        }, '');
        return html + '</select>';
    };
    return w;
};

exports.textarea = function (opt) {
    var w = options({type:'textarea'}, opt);
    w.toHTML = function (name, f) {
        f = f || {};
        var html = ['<textarea' + attrs({
                name: name,
                id: f.id,
                classes: w.classes
            })];
        html.push(opt.rows ? ' rows="' + opt.rows + '"' : '');
        html.push(opt.cols ? ' cols="' + opt.cols + '"' : '');
        html.push('>');
        html.push(f.value || '');
        return html.join('') + '</textarea>';
    };
    return w;
};

exports.multipleCheckbox = function (opt) {
    var w = options({type:'multipleCheckbox'}, opt);
    w.toHTML = function (name, f) {
        f = f || {};
        return Object.keys(f.choices).reduce(function (html, k) {
            // input element
            html += '<input type="checkbox"';
            html += ' name="' + name + '"';

            var id = f.id ? f.id + '_' + k : 'id_' + name + '_' + k;
            html += ' id="' + id + '"';

            if (w.classes.length > 0) {
                html += ' class="' + w.classes.join(' ') + '"';
            }

            html += ' value="' + k + '"';

            if (Array.isArray(f.value)) {
                if (f.value.some(function (v) { return v === k; })) {
                    html += ' checked="checked"';
                }
            } else {
                html += f.value === k ? ' checked="checked"' : '';
            }

            html += '>';

            // label element
            html += '<label for="' + id + '">' + f.choices[k] + '</label>';

            return html;
        }, '');
    };
    return w;
};

exports.multipleRadio = function (opt) {
    var w = options({type:'multipleRadio'}, opt);
    w.toHTML = function (name, f) {
        f = f || {};
        return Object.keys(f.choices).reduce(function (html, k) {
            // input element
            html += '<input type="radio"';
            html += ' name="' + name + '"';

            var id = f.id ? f.id + '_' + k : 'id_' + name + '_' + k;
            html += ' id="' + id + '"';

            if (w.classes.length > 0) {
                html += ' class="' + w.classes.join(' ') + '"';
            }

            html += ' value="' + k + '"';

            if (Array.isArray(f.value)) {
                if (f.value.some(function (v) { return v === k; })) {
                    html += ' checked="checked"';
                }
            } else {
                html += f.value === k ? ' checked="checked"' : '';
            }

            html += '>';

            // label element
            html += '<label for="' + id + '">' + f.choices[k] + '</label>';

            return html;
        }, '');
    };
    return w;
};

exports.multipleSelect = function (opt) {
    var w = options({type:'multipleSelect'}, opt);
    w.toHTML = function (name, f) {
        f = f || {};
        var html = '<select multiple="mulitple"' + attrs({
            name: name,
            id: f.id,
            classes: w.classes
        }) + '>';
        html += Object.keys(f.choices).reduce(function (html, k) {
            html += '<option value="' + k + '"';
            if (Array.isArray(f.value)) {
                if (f.value.some(function (v) { return v === k; })) {
                    html += ' selected="selected"';
                }
            } else if (f.value && f.value === k) {
                html += ' selected="selected"';
            }
            html += '>' + f.choices[k] + '</option>';
            return html;
        }, '');
        return html + '</select>';
    };
    return w;
};

exports.fieldset = function (opt) {
  var w = options({type:'fieldset'}, opt);
  w.toHTML = function (name, f, iterator) {
    f = f || {};
    var html = '';
    html += Object.keys(f.fields).reduce(function (html, k) {
      html += f.fields[k].toHTML(name+'['+k+']', iterator);
      return html;
    }, '');
  
    return html;
  }
  return w;
}

exports.submit = function (opt) {
    opt = opt || {};
    var w = {
        classes: opt.classes || [],
        display: opt.display || [],
        type: 'submit'
    };
    w.toHTML = function (name, f) {
        f = f || {};
        var html = '<input type="submit"';
        html += attrs({name: name, id: f.id, classes: w.classes});
        html += f.value ? ' value="' + f.value + '"' : '';
        return html + ' />';
    };
    return w;
};