import VeCheckbox from 'vue-easytable/packages/ve-checkbox'
import { COMPS_NAME, EMIT_EVENTS } from '../util/constant'
import { clsName } from '../util'
import emitter from '../../../src/mixins/emitter'
export default {
  name: COMPS_NAME.VE_TABLE_HEADER_CHECKBOX_CONTENT,
  mixins: [emitter],
  props: {
    // checkbox option
    checkboxOption: {
      type: Object,
      default: function () {
        return null
      },
    },
  },
  data() {
    return {
      // is selected
      isSelected: false,
      isIndeterminate: false,
    }
  },
  mounted() {
    // receive selected all info
    this.$on(EMIT_EVENTS.CHECKBOX_SELECTED_ALL_INFO, (params) => {
      this.setSelectedAllInfo(params)
    })
  },

  methods: {
    // selected change
    selectedChange(isSelected) {
      this.isSelected = isSelected

      this.dispatch(
        COMPS_NAME.VE_TABLE,
        EMIT_EVENTS.CHECKBOX_SELECTED_ALL_CHANGE,
        {
          isSelected,
        },
      )
    },

    // set selected all info
    setSelectedAllInfo({ isSelected, isIndeterminate }) {
      this.isSelected = isSelected
      this.isIndeterminate = isIndeterminate
    },
  },
  render() {
    const { isSelected, isIndeterminate, selectedChange } = this

    const checkboxProps = {
      class: clsName('checkbox-wrapper'),
      props: {
        isControlled: true,
        isSelected: isSelected,
        indeterminate: isIndeterminate,
      },
      on: {
        'on-checked-change': (isSelectedParam) =>
          selectedChange(isSelectedParam),
      },
    }

    return <VeCheckbox {...checkboxProps} />
  },
}
