# cw-drawtable

公司内部使用的， 把数据组成table样式，并以图片格式输出，方便微信里分享


安装
---
```javascript
    npm i cw-drawtable
```

示例
---

```javascript
  const title = "2018-01-30(星期二)英语作业"
  const titles = ["深圳九年级听说考试第7期"]
  const reviceObject = '三年二班'
  const scoreList = [{name: "张三", totalScore: null, score: Array(1)},{name: "李四", totalScore: null, score: Array(1)}]

  new DrawTable(title, reviceObject, titles, scoreList, '#52CC8F')
```


