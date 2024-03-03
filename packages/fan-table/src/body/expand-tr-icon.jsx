import { clsName } from '../util/index'
import { COMPS_NAME, COLUMN_TYPES } from '../util/constant'
import VeIcon from '@P/ve-icon/ve-icon.js'
import { ICON_NAMES } from '@P/ve-icon/src/util/constant'

export default {
  name: COMPS_NAME.FAN_TABLE_EXPAND_TR_ICON,
  props: {
    column: {
      type: Object,
      required: true,
    },
    // expand row option
    expandOption: {
      type: Object,
      default: function () {
        return null
      },
    },
    rowData: {
      type: Object,
      required: true,
    },
    // expanded row keys
    expandedRowkeys: {
      type: Array,
      default: function () {
        return []
      },
    },
    rowKeyFieldName: {
      type: String,
      default: null,
    },
    // row expand click event
    cellClick: {
      type: Function,
      default: null,
    },
  },
  computed: {
    // is row expanded
    isExpanded() {
      let result = false

      const { column, rowData, expandedRowkeys, rowKeyFieldName } = this

      if (column.type === COLUMN_TYPES.EXPAND) {
        const rowKey = rowData[rowKeyFieldName]
        result = expandedRowkeys.includes(rowKey)
      }

      return result
    },
    // expand row icon class
    expandRowIconContainerClass() {
      return {
        [clsName('row-expand-icon')]: true,
        [clsName('expand-icon-collapsed')]: this.isExpanded,
      }
    },
  },
  render() {
    let content = null

    const { cellClick, column, expandRowIconContainerClass } = this

    if (column.type === COLUMN_TYPES.EXPAND) {
      content = (
        <span
          onClick={(e) => cellClick(e)}
          class={expandRowIconContainerClass}
        >
          <VeIcon name={ICON_NAMES.RIGHT_ARROW} />
        </span>
      )
    }
    return content
  },
}
