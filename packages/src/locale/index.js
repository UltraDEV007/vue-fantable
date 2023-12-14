import locale from 'vue-easytable/packages/ve-locale'
import { isFunction } from '../utils/index'

/*
 * @createI18N
 * @desc create i18n
 * @param {string} compName
 * @return {array<function>}
 */
export function createI18N(compName) {
  return function (path, ...args) {
    let result = ''

    const messages = locale.getMessage()

    if (messages[compName]) {
      const message = messages[compName][path]
      result = isFunction(message) ? message(...args) : message
    } else {
      console.error(
        `can't find ${compName} in ${JSON.stringify(messages)}`,
      )
    }

    return result
  }
}
