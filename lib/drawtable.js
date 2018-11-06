(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.DrawTable = mod.exports;
  }
})(this, function (exports) {
  (function (global, factory) {
    if (typeof define === "function" && define.amd) {
      define(['exports'], factory);
    } else if (typeof exports !== "undefined") {
      factory(exports);
    } else {
      var mod = {
        exports: {}
      };
      factory(mod.exports);
      global.DrawTable = mod.exports;
    }
  })(this, function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    function _classCallCheck(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    }

    var _createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();

    var DrawTable = function () {
      function DrawTable(title, reviceObject, titles, scoreList, baseColor) {
        var ratios = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

        _classCallCheck(this, DrawTable);

        this.title = title;
        this.reviceObject = reviceObject;
        this.titles = titles;
        this.scoreList = scoreList;
        this.baseColor = baseColor;
        this.ratios = ratios;

        this.init();
      }

      _createClass(DrawTable, [{
        key: 'init',
        value: function init() {
          var data = this.scoreList;
          this.canvas = document.createElement('canvas');
          this.ctx = this.canvas.getContext('2d');
          var devicePixelRatio = window.devicePixelRatio || 1;
          var backingStoreRatio = this.ctx.webkitBackingStorePixelRatio || this.ctx.mozBackingStorePixelRatio || this.ctx.msBackingStorePixelRatio || this.ctx.oBackingStorePixelRatio || this.ctx.backingStorePixelRatio || 1;
          var ratio = devicePixelRatio / backingStoreRatio;
          this.ratio = this.ratios ? ratio : 1;
          this.canvas.width = this.pixelRatio((data[0].submitList.length + 3) * 100);
          this.canvas.height = this.pixelRatio(data.length * 60);
          this.ctx.scale(ratio, ratio);
        }
      }, {
        key: 'drawFun',
        value: function drawFun(cb) {
          var height = this.drawTableHeader();
          this.canvas.height = this.canvas.height + this.pixelRatio(height + 100 + 40);
          this.ctx.fillStyle = '#fff';
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
          this.drawTableHeader();
          this.drawTitle();
          this.drawTable(height);
          this.watermark();
          this.convertCanvasToImage(cb);
        }
      }, {
        key: 'pixelRatio',
        value: function pixelRatio(num) {
          return num * this.ratio;
        }
      }, {
        key: 'drawTitle',
        value: function drawTitle() {
          this.ctx.fillStyle = this.baseColor;
          this.ctx.fillRect(0, 0, this.canvas.width, this.pixelRatio(120));
          this.ctx.font = this.pixelRatio(28) + 'px Microsoft YaHei';
          this.ctx.textBaseline = 'bottom';
          this.ctx.fillStyle = '#fff';
          this.ctx.textAlign = 'center';
          this.ctx.fillText(this.title, this.canvas.width / 2, this.pixelRatio(60));

          this.ctx.font = this.pixelRatio(22) + 'px Microsoft YaHei';
          this.ctx.fillText(this.reviceObject, (this.canvas.width - this.pixelRatio(20)) / 2, this.pixelRatio(100));
        }
      }, {
        key: 'drawTableHeader',
        value: function drawTableHeader() {
          var _this = this;
          var tableHeaderData = this.titles;
          var height = 40;
          var newTitle = [];
          var ctx = this.ctx;
          ctx.textAlign = 'left';
          ctx.font = _this.pixelRatio(22) + 'px Microsoft YaHei';
          ctx.textBaseline = 'top';
          tableHeaderData.forEach(function (item, index) {
            var marginHeight = 120 + height * index;
            ctx.fillStyle = '#bee9d3';
            ctx.fillRect(0, _this.pixelRatio(marginHeight), _this.canvas.width, _this.pixelRatio(height));
            ctx.fillStyle = '#000';
            var title = '\u4F5C\u4E1A' + (index + 1);
            ctx.fillText(title + ': ' + item, _this.pixelRatio(10), _this.pixelRatio(marginHeight + 6));
            newTitle.push(title);
          });
          var newHeaderData = ['序号', '姓名'].concat(newTitle, ['总分']);
          var TableMarginTop = tableHeaderData.length * height + 120;
          ctx.fillStyle = '#bee2d9';
          ctx.fillRect(0, _this.pixelRatio(TableMarginTop), _this.canvas.width, _this.pixelRatio(60));
          newHeaderData.forEach(function (item, index) {
            ctx.fillStyle = '#000';
            ctx.fillText(item, _this.pixelRatio(100 * index + 20), _this.pixelRatio(TableMarginTop + 14));
          });

          return tableHeaderData.length * height + 60;
        }
      }, {
        key: 'drawTable',
        value: function drawTable(height) {
          var _this = this;
          var canvas = this.canvas;
          var ctx = this.ctx;
          var data = this.scoreList;
          ctx.textBaseline = 'bottom';
          this.arraySortFun(data);
          for (var i = 0, len = data.length; i < len; i++) {
            var top = 60 * i + 120 + height;
            if (i % 2 === 0) {
              ctx.fillStyle = '#f8f8f8';
            } else {
              ctx.fillStyle = '#fffffa';
            }
            ctx.fillRect(0, this.pixelRatio(top), canvas.width - this.pixelRatio(20), this.pixelRatio(60));
            ctx.font = this.pixelRatio(20) + 'px Microsoft YaHei';
            ctx.fillStyle = '#000';
            ctx.textAlign = 'center';
            ctx.fillText(i + 1, this.pixelRatio(40), this.pixelRatio(top + 46));
            ctx.fillText(data[i].name, this.pixelRatio(100 + 50), this.pixelRatio(top + 46), this.pixelRatio(100));
            var score = data[i].submitList;
            var scoreLen = 0;
            score.forEach(function (item, key) {
              ctx.font = _this.pixelRatio(20) + 'px Microsoft YaHei';
              ctx.fillStyle = '#000';
              scoreLen++;
              var text = '';
              if (!item.isSubmit) {
                ctx.fillStyle = '#f00';
                text = '未提交';
                ctx.fillText(text, _this.pixelRatio(100 * (key + 2) + 50), _this.pixelRatio(top + 46), _this.pixelRatio(100));
              } else if (item.moduleId == 66 && !item.hasQuestion) {
                ctx.fillText('已提交', _this.pixelRatio(100 * (key + 2) + 50), _this.pixelRatio(top + 46), _this.pixelRatio(100));
              } else {
                text = item.actualScore;
                ctx.fillText(text, _this.pixelRatio(100 * (key + 2) + 50), _this.pixelRatio(top + 46), _this.pixelRatio(100));
              }
            });
            ctx.font = _this.pixelRatio(20) + 'px Microsoft YaHei';
            ctx.fillStyle = '#000';
            ctx.fillText(data[i].totalScore ? data[i].totalScore : 0, this.pixelRatio(100 * (scoreLen + 2) + 50), this.pixelRatio(top + 46));
          }
        }
      }, {
        key: 'arraySortFun',
        value: function arraySortFun(data) {
          var temp = {};
          for (var i = 0, len = data.length; i < len; i++) {
            for (var j = data.length - 1; j > i; j--) {
              if (data[j].totalScore > data[j - 1].totalScore) {
                temp = data[j];
                data[j] = data[j - 1];
                data[j - 1] = temp;
              }
            }
          }
          this.scoreList = data;
        }
      }, {
        key: 'watermark',
        value: function watermark() {
          var canvas = this.canvas;
          var ctx = this.ctx;
          var width = canvas.width + 400;
          var height = canvas.height + 200;
          var title = '习习向上 ' + new Date().getFullYear();

          ctx.font = this.pixelRatio(40) + 'px Microsoft YaHei';
          ctx.textBaseline = 'bottom';
          ctx.fillStyle = 'rgba(0,186,143,0.1)';
          // ctx.globalAlpha = 0.1
          ctx.translate(width * 0.5, height * 0.5);
          ctx.rotate(-20 * Math.PI / 180);
          ctx.translate(width * -0.5, height * -0.5);

          for (var h = 0; h < height; h += 200) {
            var w = h % 400 == 0 ? 200 : 0;
            for (; w < width; w += 400) {
              ctx.fillText(title, this.pixelRatio(w), this.pixelRatio(h));
            }
          }
        }
      }, {
        key: 'convertCanvasToImage',
        value: function convertCanvasToImage(cb) {
          var canvas = this.canvas;
          var newCanvas = document.createElement('canvas');
          var ctx = newCanvas.getContext('2d');
          newCanvas.width = canvas.width + 20;
          newCanvas.height = canvas.height + 20;
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, newCanvas.width, newCanvas.height);
          ctx.drawImage(canvas, 10, 10, canvas.width, canvas.height);
          var URL = newCanvas.toDataURL('image/jpeg', 1);
          cb(URL);
        }
      }]);

      return DrawTable;
    }();

    exports.default = DrawTable;
  });
});