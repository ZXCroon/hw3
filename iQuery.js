function myElement(element) {
  this.element = element;
}

myElement.prototype.attr = function(attributeName) {
  if (arguments.length == 1)
    return this.element.getAttribute(attributeName);
  else
    this.element.setAttribute(attributeName, arguments[1].toString());
}

function $(selector) {
  //alert(selector.charAt(0));
  if (selector.charAt(0) == '.') {
    var itemList = document.getElementsByClassName(selector.slice(1)), list = new Array();
    for (var i = 0; i < itemList.length; ++i)
      list.push(new myElement(itemList[i]));
    return list.length == 1? list[0] : list;
  }
  if (selector.charAt(0) == '#') {
    return new myElement(document.getElementById(selector.slice(1)));
  }
  var itemList = document.getElementsByTagName(selector), list = new Array();
  for (var i = 0; i < itemList.length; ++i)
    list.push(new myElement(itemList[i]));
  return list.length == 1? list[0] : list;
}