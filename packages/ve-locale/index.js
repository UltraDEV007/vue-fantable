import Vue from 'vue'
import { merge, cloneDeep } from 'lodash-es'
import defaultLang from '../src/locale/lang/en-US'

const { defineReactive } = Vue.util
const proto = Vue.prototype

proto.$veTableMessages = proto.$veTableMessages || {}

defineReactive(
  proto,
  '$veTableMessages',
  cloneDeep({
    lang: defaultLang,
  }),
)

export default {
  getMessage() {
    return proto.$veTableMessages.lang
  },
  use(lang) {
    this.update(lang)
  },
  update(lang = {}) {
    merge(proto.$veTableMessages.lang, lang)
  },
}
