/**
* @Author: jianglei
* @Date:   2017-10-12 12:06:49
*/
'use strict'
import Vue from 'vue'
export default function treeToArray(data, expandAll, parent, level, item) {
  const marLTemp = []
  let tmp = []
  Array.from(data).forEach(function(record) {
    if (record._expanded === undefined) {
      Vue.set(record, '_expanded', expandAll)
    }
    let _level = 1
    if (level !== undefined && level !== null) {
      _level = level + 1
    }
    Vue.set(record, '_level', _level)
    // 如果有父元素
    if (parent) {
      Vue.set(record, 'parent', parent)
      // 如果父元素有偏移量，需要計算在this的偏移量中
      // 偏移量還與前面同級元素有關，需要加上前面所有元素的長度和
      if (!marLTemp[_level]) {
        marLTemp[_level] = 0
      }
      Vue.set(record, '_marginLeft', marLTemp[_level] + parent._marginLeft)
      Vue.set(record, '_width', record[item] / parent[item] * parent._width)
      // 在本次計算過偏移量後加上自己長度，以供下一個元素使用
      marLTemp[_level] += record._width
    } else {
      // 如果為根
      // 初始化偏移量存儲map
      marLTemp[record.id] = []
      // map中是一個數組，存儲的是每級的長度和
      // 初始情況下為0
      marLTemp[record.id][_level] = 0
      Vue.set(record, '_marginLeft', 0)
      Vue.set(record, '_width', 1)
    }
    tmp.push(record)
    if (record.children && record.children.length > 0) {
      const children = treeToArray(record.children, expandAll, record, _level, item)
      tmp = tmp.concat(children)
    }
  })
  return tmp
}
