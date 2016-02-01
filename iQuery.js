/* Selector */

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

//--------------------------------------------------

/* BackToTop */

// 创建两个实例就会出错，怎么解决？

function BackToTop() {
  if (document.getElementById('back-to-top-css') == null) {
    var styleSheet = document.createElement("link");
    styleSheet.rel = "stylesheet";
    styleSheet.type = "text/css";
    styleSheet.href = "styles/back-to-top.css";
    styleSheet.id = "back-to-top-css"
    document.head.appendChild(styleSheet);
  }
}

BackToTop.prototype.init = function(position) {
  var that = this;

  if (arguments.length == 0)
    position = {RightDown: true};   // support Chrome
  this.alreadyTop = (document.body.scrollTop == 0? true : false);

  this.element = document.createElement("a");
  this.element.setAttribute("class", "back-to-top");
  this.element.style.opacity = (this.alreadyTop? 0 : 1);

  this.scrolling = false;

  this.element.onclick = function() {
    var tempLeft = document.body.scrollLeft;
    var everytimeUp = document.body.scrollTop / 70;
    (function() {
      var tempTop = document.body.scrollTop;
      if (!tempTop) return;
      window.scrollTo(tempLeft, tempTop - everytimeUp);
      setTimeout(arguments.callee, 1);
    })();
  };

  // 滚动条拉到顶后立马向下拉，透明度会卡在中间，怎么解决？
  window.onscroll = function() {
    if (that.scrolling) return;
    that.scrolling = true;
    var nowTop = (document.body.scrollTop == 0? true : false);
    if (that.alreadyTop && !nowTop) {
      (function() {
        if (parseFloat(that.element.style.opacity) > 1 - 1e-7) return;
        that.element.style.opacity = (new Number(parseFloat(that.element.style.opacity) + 0.05)).toString();
        setTimeout(arguments.callee, 10);
      })();
      
      that.alreadyTop = false;
      that.scrolling = false;
      return;
    }
    if (!that.alreadyTop && nowTop) {
      (function() {
        if (parseFloat(that.element.style.opacity) < 1e-7) return;
        that.element.style.opacity = (new Number(parseFloat(that.element.style.opacity) - 0.05)).toString();
        setTimeout(arguments.callee, 10);
      })();
        
      that.alreadyTop = true;
    }
    that.scrolling = false;
  };

  document.body.appendChild(this.element);
  if (position.LeftUp) {
    this.element.style.top = this.element.style.left = "0px";
    return;
  }
  if (position.LeftDown) {
    this.element.style.bottom = this.element.style.left = "0px";
    return;
  }
  if (position.RightUp) {
    this.element.style.top = this.element.style.right = "0px";
    return;
  }
  if (position.RightDown) {
    this.element.style.bottom = this.element.style.right = "0px";
    return;
  }
  this.element.style.left = position.x.toString() + "px";
  this.element.style.top = position.y.toString() + "px";
};

//--------------------------------------------------

/* Modal */

function Modal() {
  if (document.getElementById('modal-css') == null) {
      var styleSheet = document.createElement("link");
      styleSheet.rel = "stylesheet";
      styleSheet.type = "text/css";
      styleSheet.href = "styles/modal.css";
      styleSheet.id = "modal-css"
      document.head.appendChild(styleSheet);
  }
}

Modal.prototype.close = function() {
  this.fullscreen.parentNode.removeChild(this.fullscreen);
  this.dialogue.parentNode.removeChild(this.dialogue);
}

Modal.prototype.init = function (parameters) {
  var that = this;

  window.onload = function() {
    var Left = (document.body.clientWidth - that.dialogue.clientWidth) / 2;
    var Top = (document.body.clientHeight - that.dialogue.clientHeight) / 2;
    that.dialogue.style.left = Left.toString() + "px";
    that.dialogue.style.top = Top.toString() + "px";
  };

  // create fullscreen div
  this.fullscreen = document.createElement("div");
  this.fullscreen.setAttribute("class", "fullscreen");
  document.body.appendChild(this.fullscreen);

  this.dialogue = document.createElement("div");
  this.dialogue.setAttribute("class", "dialogue");

  window.onkeydown = function(event) {
    if (event.keyCode == 27 || (that.hasOwnProperty("closeKey") && event.keyCode == that.closeKey))
      that.close();
  };

  if (parameters.hasOwnProperty("content"))
    this.dialogue.innerHTML = parameters.content;

  if (parameters.draggable) {
    var mousedown = false, formerOffsetX, formerOffsetY;
    this.dialogue.onmousedown = function(event) {
      mousedown = true;
      formerOffsetX = event.offsetX;
      formerOffsetY = event.offsetY;
    };
    document.body.onmouseup = function() {
      mousedown = false;
    };
    this.dialogue.onmousemove = function(event) {
      if (!mousedown) return;
      this.style.left = (new Number(this.offsetLeft + event.offsetX - formerOffsetX)).toString() + "px";
      this.style.top = (new Number(this.offsetTop + event.offsetY - formerOffsetY)).toString() + "px";
      formerOffsetX = event.offsetX;
      formerOffsetY = event.offsetY;
    };
  }
  if (parameters.hasOwnProperty("closeKey")) {
    this.closeKey = parameters.closeKey;
  }
  document.body.appendChild(this.dialogue);
};