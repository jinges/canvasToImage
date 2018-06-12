export default class DrawTable {
  constructor(title, reviceObject, titles, scoreList, baseColor, ratios) {
    this.title = title
    this.reviceObject = reviceObject
    this.titles = titles
    this.scoreList = scoreList
    this.baseColor = baseColor
    this.ratios = ratios || false;

    this.init();
  }

  init() {
    let data = this.scoreList
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')
    let devicePixelRatio = window.devicePixelRatio || 1
    let backingStoreRatio = this.ctx.webkitBackingStorePixelRatio ||
      this.ctx.mozBackingStorePixelRatio ||
      this.ctx.msBackingStorePixelRatio ||
      this.ctx.oBackingStorePixelRatio ||
      this.ctx.backingStorePixelRatio || 1
    let ratio = devicePixelRatio / backingStoreRatio
    this.ratio = this.ratios ? ratio : 1
    this.canvas.width = this.pixelRatio((data[0].submitList.length + 3) * 100)
    this.canvas.height = this.pixelRatio(data.length * 60)
    this.ctx.scale(ratio, ratio)
  }

  drawFun(cb) {
    let height = this.drawTableHeader()
    this.canvas.height = this.canvas.height + this.pixelRatio(height + 100 + 40)
    this.ctx.fillStyle = '#fff'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.addLoading()
    this.drawTableHeader()
    this.drawTitle()
    this.drawTable(height)
    this.watermark()
    this.convertCanvasToImage(cb)
    this.closeImagePanel()
    this.removeLoading()
  }

  pixelRatio(num) {
    return num * this.ratio
  }

  drawTitle() {
    this.ctx.fillStyle = this.baseColor
    this.ctx.fillRect(this.pixelRatio(10), this.pixelRatio(10), this.canvas.width - this.pixelRatio(20), this.pixelRatio(120))
    this.ctx.font = this.pixelRatio(28) + 'px Microsoft YaHei'
    this.ctx.textBaseline = 'bottom'
    this.ctx.fillStyle = '#fff'
    this.ctx.textAlign = 'center'
    this.ctx.fillText(this.title, this.canvas.width / 2, this.pixelRatio(60))

    this.ctx.font = this.pixelRatio(22) + 'px Microsoft YaHei'
    this.ctx.fillText(this.reviceObject, (this.canvas.width - this.pixelRatio(20)) / 2, this.pixelRatio(100))
  }

  drawTableHeader() {
    let _this = this
    let tableHeaderData = this.titles
    let height = 0
    var num = 8
    _this.ctx.textBaseline = 'bottom'
    _this.ctx.textAlign = 'center'
    tableHeaderData.forEach(function (item, i) {
      var rows = Math.ceil(item.length / num)
      if (height < 24 * (rows + 1)) {
        height = 24 * (rows + 1)
      }
      _this.ctx.fillStyle = '#bee9d3'
      _this.ctx.fillRect(_this.pixelRatio(10), _this.pixelRatio(120), _this.canvas.width - _this.pixelRatio(20), _this.pixelRatio(height))
    })

    tableHeaderData.forEach(function (item, i) {
      _this.ctx.font = _this.pixelRatio(22) + 'px Microsoft YaHei'
      var rows = Math.ceil(item.length / num)

      if (rows > 1) {
        _this.ctx.font = _this.pixelRatio(16) + 'px Microsoft YaHei'
        _this.ctx.textBaseline = 'middle'
        for (var j = 0; j < rows; j++) {
          _this.ctx.fillStyle = '#000'
          _this.ctx.fillText(item.substr(num * j, 8), _this.pixelRatio(100 * i + 50), _this.pixelRatio(150 + j * 24), _this.pixelRatio(100))
        }
      } else {
        _this.ctx.fillStyle = '#000'
        _this.ctx.textBaseline = 'middle'
        _this.ctx.fillText(item, _this.pixelRatio(100 * i + 50), _this.pixelRatio(120 + height / 2), _this.pixelRatio(100))
      }
    })
    return height
  }

  drawTable(height) {
    let _this = this
    let canvas = this.canvas
    let ctx = this.ctx
    let data = this.scoreList
    ctx.textBaseline = 'bottom'
    this.arraySortFun(data)
    for (var i = 0, len = data.length; i < len; i++) {
      var top = 60 * i + 120 + height
      if (i % 2 === 0) {
        ctx.fillStyle = '#f8f8f8'
      } else {
        ctx.fillStyle = '#fffffa'
      }
      ctx.fillRect(this.pixelRatio(10), this.pixelRatio(top), canvas.width - this.pixelRatio(20), this.pixelRatio(60))
      ctx.font = this.pixelRatio(20) + 'px Microsoft YaHei'
      ctx.fillStyle = '#000'
      ctx.textAlign = 'center'
      ctx.fillText((i + 1), this.pixelRatio(50), this.pixelRatio(top + 46))
      ctx.fillText(data[i].name, this.pixelRatio(100 + 50), this.pixelRatio(top + 46), this.pixelRatio(100))
      let score = data[i].submitList
      var scoreLen = 0
      score.forEach(function (item, key) {
        ctx.font = _this.pixelRatio(20) + 'px Microsoft YaHei'
        ctx.fillStyle = '#000'
        scoreLen++
        let text = ''
        if (!item.isSubmit) {
          ctx.fillStyle = '#f00'
          text = '未提交'
          ctx.fillText(text, _this.pixelRatio(100 * (key + 2) + 50), _this.pixelRatio(top + 46), _this.pixelRatio(100))
        } else if (item.moduleId == 66) {
          if (!item.trueCount && !item.falseCount) {
            text = '已提交';
            ctx.fillText(text, _this.pixelRatio(100 * (key + 2) + 50), _this.pixelRatio(top + 46), _this.pixelRatio(100))
          } else {
            ctx.font = _this.pixelRatio(14) + 'px Microsoft YaHei'
            text = ` ${item.trueCount}√ | ${item.falseCount}× `
            ctx.fillText(text, _this.pixelRatio(100 * (key + 2) + 50), _this.pixelRatio(top + 46), _this.pixelRatio(100))
            // ctx.fillText(`正确: ${item.trueCount}个`, _this.pixelRatio(100 * (key + 2) + 50), _this.pixelRatio(top + 30), _this.pixelRatio(100))
            // ctx.fillText(`错误: ${item.falseCount}个`, _this.pixelRatio(100 * (key + 2) + 50), _this.pixelRatio(top + 50), _this.pixelRatio(100))
          }
        } else {
          text = item.actualScore
          ctx.fillText(text, _this.pixelRatio(100 * (key + 2) + 50), _this.pixelRatio(top + 46), _this.pixelRatio(100))
        }
      })
      ctx.font = _this.pixelRatio(20) + 'px Microsoft YaHei'
      ctx.fillStyle = '#000'
      ctx.fillText(data[i].totalScore ? data[i].totalScore : 0, this.pixelRatio(100 * (scoreLen + 2) + 50), this.pixelRatio(top + 46))
    }
    ctx.beginPath()
    ctx.strokeStyle = '#f8f8f8'
    ctx.lineWidth = this.pixelRatio(1)
    ctx.strokeRect(this.pixelRatio(10),
    this.pixelRatio(120 + height),
    canvas.width - this.pixelRatio(20),
    canvas.height - this.pixelRatio(20 + 120 + height))
    ctx.save()
  }

  arraySortFun(data) {
    let temp = {}
    for (var i = 0, len = data.length; i < len; i++) {
      for (let j = data.length - 1; j > i; j--) {
        if (data[j].totalScore > data[j - 1].totalScore) {
          temp = data[j]
          data[j] = data[j - 1]
          data[j - 1] = temp
        }
      }
    }
    this.scoreList = data
  }

  watermark() {
    let canvas = this.canvas
    let ctx = this.ctx
    let width = canvas.width + 400
    let height = canvas.height + 200
    let title = '习习向上 ' + new Date().getFullYear()

    ctx.font = this.pixelRatio(40) + 'px Microsoft YaHei'
    ctx.textBaseline = 'bottom'
    ctx.fillStyle = 'rgba(0,186,143,0.1)'
    // ctx.globalAlpha = 0.1
    ctx.translate(width * 0.5, height * 0.5)
    ctx.rotate(-20 * Math.PI / 180)
    ctx.translate(width * -0.5, height * -0.5)

    for (let h = 0; h < height; h += 200) {
      let w = h % 400 == 0 ? 200: 0;
      for (; w < width; w+=400) {
        ctx.fillText(title, this.pixelRatio(w), this.pixelRatio(h));
      }
    }
  }

  addLoading() {
    let load = document.querySelector('#loading')
    if(load) {
      load.style.display = 'block'
    }
  }

  removeLoading(){
    let load = document.querySelector('#loading')
    if (load) {
      load.style.display = 'none'
    }
  }

  convertCanvasToImage(cb) {
    let canvas = this.canvas
    var image = new Image()
    let sHeight = window.screen.height
    let sWidth = window.screen.width
    let imgHeight = sWidth * canvas.height / canvas.width

    let div = document.createElement('div')
    div.style.cssText = 'position: fixed; width: 100%; height: 100%; left: 0; top: 0; overflow-y: auto;background: #fff;'
    div.setAttribute('id', 'canvasImg')

    image.src = canvas.toDataURL('image/jpeg', 1)
    if (imgHeight < sHeight) {
      let h = (sHeight - imgHeight) / 2
      image.style.marginTop = h + 'px'
    }
    div.appendChild(image)
    document.body.appendChild(div)
    document.body.style.cssText = "height: 0px;"
  }

  closeImagePanel() {
    let img = document.getElementById('canvasImg')
    img.addEventListener('click', function () {
      img.remove()
      document.body.removeAttribute('style')
    }, true)
  }
}
