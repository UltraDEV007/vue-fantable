export default function debounce(func, wait, immediate) {
  var timeout
  return function() {
    var context = this, args = arguments
    clearTimeout(timeout)
    if (immediate && !timeout) func.apply(context, args)
    timeout = setTimeout(function() {
      timeout = null
      if (!immediate) func.apply(context, args)
    }, wait)
  }
}