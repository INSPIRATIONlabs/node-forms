/*jslint node: true */
var forms = require('./forms');

var replaceStrArgs = function(str, args) {
  console.log(args);
  for(var k in args) {
    if(args.hasOwnProperty(k)) str = str.replace(':'+k, args[k]);
  }
  return str;
}

exports.matchField = function (match_field) {
    return function (form, field, callback) {
      if (forms.getField(match_field, form).data !== field.data) {
            callback('Does not match ' + match_field + '.');
        } else {
            callback();
        }
    };
};

exports.min = function (val, error_text) {
    return function (form, field, callback) {
        if (field.data >= val) {
            callback();
        } else {
            str = (error_text || 'Please enter a value greater than or equal to :val.');
            callback(replaceStrArgs(str, {val:val}));
        }
    };
};

exports.max = function (val, error_text) {
    return function (form, field, callback) {
        if (field.data <= val) {
            callback();
        } else {
            str = (error_text || 'Please enter a value less than or equal to :val.');
            callback(replaceStrArgs(str, {val:val}));
        }
    };
};

exports.range = function (min, max, error_text) {
    return function (form, field, callback) {
        if (field.data >= min && field.data <= max) {
            callback();
        } else {
            str = (error_text || 'Please enter a value between :min and :max.');
            callback(replaceStrArgs(str, {min:min,max:max}));
        }
    };
};

exports.minlength = function (val, error_text) {
    return function (form, field, callback) {
        if (field.data.length >= val) {
            callback();
        } else {
            str = (error_text || 'Please enter at least :val characters.');
            callback(replaceStrArgs(str, {val:val}));            
        }
    };
};

exports.maxlength = function (val, error_text) {
    return function (form, field, callback) {
        if (field.data.length <= val) {
            callback();
        } else {
            str = (error_text || 'Please enter no more than :val characters.');
            callback(replaceStrArgs(str, {val:val}));            
        }
    };
};

exports.rangelength = function (min, max, error_text) {
    return function (form, field, callback) {
        if (field.data.length >= min && field.data.length <= max) {
            callback();
        } else {
            str = (error_text || 'Please enter a value between :min and :max characters long.');
            callback(replaceStrArgs(str, {min:min, max:max}));            
        }
    };
};

exports.regexp = function (re, message) {
    re = (typeof re === 'string') ? new RegExp(re) : re;
    return function (form, field, callback) {
        if (re.test(field.data)) {
            callback();
        } else {
            callback(message || 'Invalid format.');
        }
    };
};

exports.email = function (error_text) {
    // regular expression by Scott Gonzalez:
    // http://projects.scottsplayground.com/email_address_validation/
    str = (error_text || 'Please enter a valid email address.');
    return exports.regexp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, str);
};

exports.url = function (error_text) {
    // regular expression by Scott Gonzalez:
    // http://projects.scottsplayground.com/iri/
    str = (error_text || 'Please enter a valid URL.');
    return exports.regexp(/^((ftp|http|https):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i, str);
};
