/*jslint node: true */

var forms = require('./forms'),
    async = require('async');


exports.string = function (opt) {
    opt = opt || {};

    var k, f = {};

    for (k in opt) {
        if (opt.hasOwnProperty(k)) {
            f[k] = opt[k];
        }
    }
    f.widget = f.widget || forms.widgets.text();

    f.parse = function (raw_data) {
        if (typeof raw_data !== 'undefined' && raw_data !== null) {
            return String(raw_data);
        }
        return '';
    };
    f.bind = function (raw_data) {
        var k, b = {};
        // clone field object:
        for (k in f) {
            if (f.hasOwnProperty(k)) {
                b[k] = f[k];
            }
        }
        b.value = raw_data;
        b.data = b.parse(raw_data);
        b.validate = function (form, callback) {
            if (raw_data === '' || raw_data === null || typeof raw_data === 'undefined') {
                // don't validate empty fields, but check if required
                if (b.required) { 
                  b.errorMessage = (b.error || 'This field is required.'); 
                  form._isValid = false;
                }
                process.nextTick(function () { callback(null, b); });
            } else {
                async.forEachSeries(b.validators || [], function (v, callback) {
                    if (!b.errorMessage) {
                        v(form, b, function (v_err) {
                          if(v_err) {
                            b.errorMessage = v_err.toString();
                            form._isValid = false;
                          } else {
                            b.errorMessage = null;
                          }
                          callback(null);
                        });
                    } else {
                        callback(null);
                    }
                }, function (err) {
                    callback(err, b);
                });
            }
        };
        return b;
    };
    f.errorHTML = function () {
        return this.errorMessage ? '<p class="error_msg">' + this.errorMessage + '</p>' : '';
    };
    f.labelText = function (name) {
        return this.label || name[0].toUpperCase() + name.substr(1).replace('_', ' ');
    };
    f.labelHTML = function (name, id) {
        if (this.widget.type === 'hidden') { return ''; }
        return '<label for="' + (id || 'id_' + name.replace(/\[((.)*?)\]/g, "_$1")) + '">' + this.labelText(name, id) + '</label>';
    };
    f.classes = function () {
        var r = ['field'];
        if (this.errorMessage) { r.push('error'); }
        if (this.required) { r.push('required'); }
        return r;
    };
    f.toHTML = function (name, iterator) {
        return (iterator || forms.render.item)(name, this);
    };

    return f;
};


exports.number = function (opt) {
    opt = opt || {};
    var f = exports.string(opt);

    f.parse = function (raw_data) {
        if (raw_data === null || raw_data === '') {
            return NaN;
        }
        return Number(raw_data);
    };
    return f;
};

exports.boolean = function (opt) {
    opt = opt || {};
    var f = exports.string(opt);

    f.widget = opt.widget || forms.widgets.checkbox();
    f.parse = function (raw_data) {
        return Boolean(raw_data);
    };
    return f;
};

exports.email = function (opt) {
    opt = opt || {};
    var f = exports.string(opt);
    if (f.validators) {
        f.validators.unshift(forms.validators.email());
    } else {
        f.validators = [forms.validators.email()];
    }
    return f;
};

exports.password = function (opt) {
    opt = opt || {};
    var f = exports.string(opt);
    f.widget = opt.widget || forms.widgets.password();
    return f;
};

exports.url = function (opt) {
    opt = opt || {};
    var f = exports.string(opt);
    if (f.validators) {
        f.validators.unshift(forms.validators.url());
    } else {
        f.validators = [forms.validators.url()];
    }
    return f;
};

exports.array = function (opt) {
    opt = opt || {};
    var f = exports.string(opt);
    f.parse = function (raw_data) {
        if (typeof raw_data === 'undefined') { return []; }
        return Array.isArray(raw_data) ? raw_data : [raw_data];
    };
    return f;
};

exports.object = function (opt) {
    opt = opt || {};
    var f = exports.string(opt);
    f.widget = forms.widgets.fieldset();
    
    
    f.bind = function (raw_data) {
        if (typeof raw_data === 'undefined') { raw_data = {}; }
        var k, b = {};
        // clone field object:
        for (k in f) {
            if (f.hasOwnProperty(k)) {
                b[k] = f[k];
            }
        }
        //iterate the sub fields
        Object.keys(b.fields).forEach(function (k) {
            b.fields[k] = b.fields[k].bind(raw_data[k]);
        });
        b.value = raw_data;
        b.data = Object.keys(b.fields).reduce(function (a, k) {
            a[k] = b.fields[k].data;
            return a;
        }, {});
        b.validate = function (form, callback) {
            async.forEach(Object.keys(b.fields), function (k, callback) {
                b.fields[k].validate(form, function (err, bound_field) {
                    b.fields[k] = bound_field;
                    callback(err);
                });
            }, function (err) {
                callback(err, b);
            });
        };
        return b;
    };    
    
    f.parse = function (raw_data) {
      console.log('RAW DATA');
      console.log(raw_data);
      console.log(f);
      if (typeof raw_data !== 'undefined' && raw_data !== null) {
          return String(raw_data);
      }
      return '';
    };

    f.toHTML = function (name, iterator) {
      return (iterator || forms.render.item)(name, this, iterator);
    };
    
    return f;
}