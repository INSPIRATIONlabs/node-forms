/*jslint node: true */

var formItem = function(tag) {
  return function (name, field, iterator) {
    var w = field.widget;
    var attr = {'class':field.classes().concat(w.classes), 'id':'item-'+(field.id || name)};
    var html = ['<' + tag + ' ' + attributes(attr) + '>'];
    
    if(field.widget.type === 'fieldset' || field.widget.type === 'multipleCheckbox' || field.widget.type === 'multipleRadio') {
      html = html.concat([
        '<fieldset>',
        '<legend>', field.labelText(name), '</legend>',
        field.errorHTML(),
        field.widget.toHTML(name, field, iterator),
        '</fieldset>'
      ]);
    } else {
      var label = (w.display.title == 'hidden') ? '':field.labelHTML(name);
      var description = (field.description);

      if(!w.display.error || w.display.error == 'before') html.push(field.errorHTML());
      if(!w.display.title || w.display.title == 'before') {
        html.push(label);
      }
      if(field.description && w.display.description == 'before') {
        html.push('<p class="description before">'+field.description+'</p>');
      }
      if(field.widget.prefix) {
        html.push(field.widget.prefix);
      }
      html.push(field.widget.toHTML(name, field));
      if(field.widget.suffix) {
        html.push(field.widget.suffix);
      }
      
      if(w.display.error == 'after') html.push(field.errorHTML());      

      if(field.widget.display.title == 'after') {
        html.push(label);
      }
      if(field.description && w.display.description != 'before') {
        html.push('<p class="description after">'+field.description+'</p>');
      }
    }
    
    return html.join('') + '</' + tag + '>';
  }
}

exports.item = formItem('div');

var wrapWith = function (tag) {
    return function (name, field, iterator) {
        var html = ['<' + tag + ' class="' + field.classes().join(' ') + '">'];
        if (field.widget.type === 'multipleCheckbox' || 
            field.widget.type === 'multipleRadio' ||
            field.widget.type === 'fieldset') {
            html = html.concat([
                '<fieldset>',
                '<legend>', field.labelText(name), '</legend>',
                field.errorHTML(),
                field.widget.toHTML(name, field, iterator),
                '</fieldset>'
            ]);
        } else {
            html.push(field.errorHTML() + field.labelHTML(name, field.id) + field.widget.toHTML(name, field));
        }
        return html.join('') + '</' + tag + '>';
    };
};
exports.div = wrapWith('div');
exports.p = wrapWith('p');
exports.li = wrapWith('li');


exports.table = function (name, field) {
    return [
        '<tr class="', field.classes().join(' '), '">',
        '<th>', field.labelHTML(name), '</th>',
        '<td>',
        field.errorHTML(),
        field.widget.toHTML(name, field),
        '</td>',
        '</tr>'
    ].join('');
};
