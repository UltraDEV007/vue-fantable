import { clsName } from '../util/index'
import FooterTr from './footer-tr.jsx'
import { COMPS_NAME } from '../util/constant'
export default {
  name: COMPS_NAME.VE_TABLE_FOOTER,
  props: {
    colgroups: {
      type: Array,
      required: true,
    },
    footerData: {
      type: Array,
      required: true,
    },
    hasFixedColumn: {
      type: Boolean,
      default: false,
    },
    allRowKeys: {
      type: Array,
      required: true,
    },
    rowKeyFieldName: {
      type: String,
      default: null,
    },
    // cell style option
    cellStyleOption: {
      type: Object,
      default: function () {
        return null
      },
    },
    // event custom option
    eventCustomOption: {
      type: Object,
      default: function () {
        return null
      },
    },
    // footer rows
    footerRows: {
      type: Array,
      default: function () {
        return []
      },
    },
    // fixed footer
    fixedFooter: {
      type: Boolean,
      default: true,
    },
    // cell span option
    cellSpanOption: {
      type: Object,
      default: function () {
        return null
      },
    },
  },
  computed: {
    // footer class
    footerClass() {
      return {
        [clsName('fixed-footer')]: this.fixedFooter,
      }
    },
  },
  methods: {
    // get tr key
    getTrKey({ rowData, rowIndex }) {
      let result = rowIndex

      const { rowKeyFieldName } = this
      if (rowKeyFieldName) {
        result = rowData[rowKeyFieldName]
      }
      return result
    },
  },
  render() {
    const { colgroups, rowKeyFieldName, cellStyleOption } = this

    return (
      <tfoot class={this.footerClass}>
        {this.footerData.map((rowData, rowIndex) => {
          const trProps = {
            key: this.getTrKey({ rowData, rowIndex }),
            rowIndex,
            rowData,
            colgroups,
            rowKeyFieldName,
            cellStyleOption,
            footerRows: this.footerRows,
            fixedFooter: this.fixedFooter,
            cellSpanOption: this.cellSpanOption,
            eventCustomOption: this.eventCustomOption,
          }

          return <FooterTr {...trProps} />
        })}
      </tfoot>
    )
  },
}
