
// (function () {
var vueDragDrag = {}

vueDragDrag.install = function (Vue) {
  Vue.directive('drag', {
    inserted: function (el, binding) {
      // 拖拽时的手势
      el.style.cursor = binding.value && binding.value.cursor ? binding.value.cursor : 'default'

      // 如果拖动元素非元素本身（el），传入id
      var moveEl = binding.value && binding.value.moveElId ? document.getElementById(binding.value.moveElId) : el
      // 为拖动元素添加绝对定位
      moveEl.style.position = 'absolute'

      // 如果容器为设置position属性，默认为 position = 'relative'
      if (getComputedStyle(moveEl.parentNode, null).position === 'static') {
        moveEl.parentNode.style.position = 'relative'
      }

      var mouseDownFn = function (e) {
        // .shaow---------- 复制节点，并且插入容器中原来位置
        if (binding.modifiers.shaow) {
          var newNode = moveEl.cloneNode(true)
          moveEl.style.opacity = '0.5'
          moveEl.parentNode.appendChild(newNode)
        }
        // ----------

        var disX, disY
        if (!binding.modifiers.dragY) disX = (e.touches ? e.touches[0].clientX : e.clientX) - moveEl.offsetLeft
        if (!binding.modifiers.dragX) disY = (e.touches ? e.touches[0].clientY : e.clientY) - moveEl.offsetTop
        var mouseMoveFn = function (e) {
          if (!e.touches) {
            e.preventDefault()
          }
          var left = (e.touches ? e.touches[0].clientX : e.clientX) - disX
          var top = (e.touches ? e.touches[0].clientY : e.clientY) - disY

          // 可以拖出去的元素的剩余宽度
          // dragOutX
          var limitWidth = binding.value && binding.value.dragOutX ? moveEl.offsetWidth - binding.value.dragOutX : 0
          // dragOutY
          var limitHeigth = 0
          var limitHeigthTop = 0
          if (binding.value && binding.value.dragOutY) {
            limitHeigth = moveEl.offsetHeight - binding.value.dragOutY
            // 防止可拖拽区域被拖出容器区域
            // 拖拽元素在顶部
            limitHeigthTop = el.offsetHeight - binding.value.dragOutY
          }

          if (left < 0 - limitWidth) {
            left = 0 - limitWidth
          } else if (left > moveEl.parentNode.clientWidth - moveEl.offsetWidth + limitWidth) {
            left = moveEl.parentNode.clientWidth - moveEl.offsetWidth + limitWidth
          }

          if (top < 0 - limitHeigthTop) {
            top = 0 - limitHeigthTop
          } else if (top > moveEl.parentNode.clientHeight - moveEl.offsetHeight + limitHeigth) {
            top = moveEl.parentNode.clientHeight - moveEl.offsetHeight + limitHeigth
          }
          moveEl.style.left = left + 'px'
          moveEl.style.top = top + 'px'

          // 拖拽事件
          if (binding.value && binding.value.ondrag) {
            if (typeof binding.value.ondrag !== 'function') { // throw 'ondrag: should be a function'
              console.log('ondrag: should be a function')
              return
            }
            binding.value.ondrag(e, { left: left, top: top })
          }
        }
        // mousemove
        if (e.touches) {
          document.addEventListener('touchmove', mouseMoveFn)
        } else {
          document.addEventListener('mousemove', mouseMoveFn)
        }

        var mouseUpFn = function () {
          // 移除临时shaow节点
          if (newNode) {
            moveEl.style.opacity = '1'
            newNode.parentNode.removeChild(newNode)
          }
          document.removeEventListener('touchend', mouseUpFn)
          document.removeEventListener('touchmove', mouseMoveFn)
          document.removeEventListener('mousemove', mouseMoveFn)
          document.removeEventListener('mouseup', mouseUpFn)
        }
        //  mouseup
        if (e.touches) {
          document.addEventListener('touchend', mouseUpFn)
        } else {
          document.addEventListener('mouseup', mouseUpFn)
        }
      }

      // mousedown
      el.addEventListener('touchstart', mouseDownFn)
      el.addEventListener('mousedown', mouseDownFn)
    }
  })
}

// 输出
// if (typeof exports == "object") {
//   module.exports = vueDragDrag;
// } else if (typeof define == "function" && define.amd) {
//   define([], function () {
//     return vueDragDrag
//   })
// } else if (window.Vue) {
//   window.vueDragDrag = vueDragDrag;
//   Vue.use(vueDragDrag);
// }
// })();
export default vueDragDrag
