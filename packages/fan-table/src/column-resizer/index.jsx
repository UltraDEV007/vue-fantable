import { clsName } from '../util/index'
import { COMPS_NAME, HOOKS_NAME } from '../util/constant'
import { isNumber } from '../../../src/utils/index.js'

export default {
  name: COMPS_NAME.FAN_TABLE_COLUMN_RESISZER,
  props: {
    parentRendered: {
      type: Boolean,
      required: true,
    },
    tableContainerEl: {
      type: HTMLDivElement,
      default: null,
    },
    hooks: {
      type: Object,
      required: true,
    },
    colgroups: {
      type: Array,
      required: true,
    },
    isColumnResizerHover: {
      type: Boolean,
      required: true,
    },
    isColumnResizing: {
      type: Boolean,
      required: true,
    },
    setIsColumnResizerHover: {
      type: Function,
      required: true,
    },
    setIsColumnResizing: {
      type: Function,
      required: true,
    },
    setColumnWidth: {
      type: Function,
      required: true,
    },
    // column width resize option
    columnWidthResizeOption: {
      type: Object,
      default: function () {
        return null
      },
    },
  },
  data() {
    return {
      // column resizer start x
      columnResizerStartX: 0,
      // current resizing column
      currentResizingColumn: null,
      // column resizer handler width
      columnResizerHandlerWidth: 5,
      // column resizer rect
      columnResizerRect: {
        top: 0,
        left: 0,
        height: 0,
      },
    }
  },
  computed: {
    // column min width
    columnMinWidth() {
      let result = 30

      const { columnWidthResizeOption } = this

      if (columnWidthResizeOption) {
        const { minWidth } = columnWidthResizeOption
        if (isNumber(minWidth) && minWidth > 0) {
          result = minWidth
        }
      }
      return result
    },
  },
  watch: {
    parentRendered: {
      handler: function (val) {
        if (val) {
          // header cell mousemove
          this.hooks.addHook(
            HOOKS_NAME.HEADER_CELL_MOUSEMOVE,
            ({ event, column }) => {
              if (column.disableResizing) return
              this.initColumnResizerPosition({ event, column })
            },
          )
        }
      },
      immediate: true,
    },
  },
  methods: {
    // init column resizer position
    initColumnResizerPosition({ event, column }) {
      const { tableContainerEl, isColumnResizing } = this

      if (tableContainerEl && !isColumnResizing) {
        const { left: tableContainerLeft, top: tableContainerTop } =
                    tableContainerEl.getBoundingClientRect()

        const col = this.colgroups.find((x) => x.key === column.key)

        // 表头分组，不支持分组表头列宽拖动
        if (!col) {
          return false
        }

        if (col._realTimeWidth) {
          const target = event.target
          const cellRect = target.getBoundingClientRect()
          const { height, left, top } = cellRect

          this.columnResizerRect.left =
                        left + col._realTimeWidth - tableContainerLeft
          this.columnResizerRect.top = top - tableContainerTop
          this.columnResizerRect.height = height

          this.currentResizingColumn = col
          this.columnResizerStartX = left + col._realTimeWidth
        } else {
          console.warn('Resizer column needs set column width')
        }
      }
    },

    // set column resizer position byu drag
    setColumnResizerPositionByDrag(event) {
      const {
        tableContainerEl,
        isColumnResizing,
        currentResizingColumn,
      } = this

      if (tableContainerEl && isColumnResizing) {
        const { left: tableContainerLeft } =
                    tableContainerEl.getBoundingClientRect()

        if (isColumnResizing && currentResizingColumn) {
          const { columnResizerStartX, columnMinWidth } = this

          // 不允许拖动小于列最小宽度
          if (
            currentResizingColumn._realTimeWidth +
                            (event.clientX - columnResizerStartX) >
                        columnMinWidth
          ) {
            this.columnResizerRect.left =
                            event.clientX - tableContainerLeft
          }
        }
      }
    },

    // column resizer handler mousedown
    columnResizerHandlerMousedown({ event }) {
      if (this.isColumnResizerHover) {
        this.setIsColumnResizing(true)

        // add document mousemove listener
        document.addEventListener(
          'mousemove',
          this.setColumnResizerPositionByDrag,
        )
        // add document mouseup listener
        document.addEventListener('mouseup', this.columnResizerMouseup)

        // stop text select when reszing
        document.onselectstart = function () {
          return false
        }
        document.ondragstart = function () {
          return false
        }
      }
    },

    // column resizer mouseup
    columnResizerMouseup(event) {
      const {
        isColumnResizing,
        currentResizingColumn,
        columnResizerStartX,
        setColumnWidth,
        columnWidthResizeOption,
        columnMinWidth,
      } = this

      if (!isColumnResizing || !currentResizingColumn) {
        return false
      }

      let differWidth
      // 拖动小于列最小宽度
      if (
        currentResizingColumn._realTimeWidth +
                    (event.clientX - columnResizerStartX) <
                columnMinWidth
      ) {
        differWidth =
                    columnMinWidth - currentResizingColumn._realTimeWidth
      } else {
        differWidth = event.clientX - columnResizerStartX
      }
      differWidth = Math.floor(differWidth)

      // 偏差阈值，低于则不处理
      if (Math.abs(differWidth) > 1) {
        let nextColumnWidth = currentResizingColumn._realTimeWidth
        nextColumnWidth += differWidth

        // set column width
        setColumnWidth({
          colKey: currentResizingColumn.key,
          width: nextColumnWidth,
        })

        if (columnWidthResizeOption) {
          const { sizeChange } = columnWidthResizeOption
          sizeChange &&
                        sizeChange({
                          column: currentResizingColumn,
                          differWidth,
                          columnWidth: nextColumnWidth,
                        })
        }
      }

      this.clearColumnResizerStatus()
      // add document mousemove listener
      document.removeEventListener(
        'mousemove',
        this.setColumnResizerPositionByDrag,
      )
      // add document mouseup listener
      document.removeEventListener('mouseup', this.columnResizerMouseup)
    },

    // clear column resizer status
    clearColumnResizerStatus() {
      this.currentResizingColumn = null
      this.columnResizerStartX = 0
      this.setIsColumnResizerHover(false)
      this.setIsColumnResizing(false)

      // enable text select when reszing
      document.onselectstart = function () {
        return true
      }
      document.ondragstart = function () {
        return true
      }
    },
  },

  render() {
    const {
      isColumnResizerHover,
      isColumnResizing,
      columnResizerRect,
      columnResizerHandlerWidth,
    } = this

    const { left, top, height } = columnResizerRect

    const columnResizerHandlerProps = {
      class: {
        [clsName('column-resizer-handler')]: true,
        active: isColumnResizerHover || isColumnResizing,
      },
      style: {
        left: left - columnResizerHandlerWidth + 'px',
        top: top + 'px',
        height: height + 'px',
      },
      onClick: () => {
        //
      },
      onMousedown: (event) => {
        this.columnResizerHandlerMousedown({ event })
      },
      onMouseenter: () => {
        this.setIsColumnResizerHover(true)
      },
      onMouseleave: () => {
        this.setIsColumnResizerHover(false)
      },
      onMouseup: (event) => {
        this.columnResizerMouseup(event)
      },
    }

    const columnResizerLineProps = {
      class: [clsName('column-resizer-line')],
      style: {
        display: isColumnResizing ? 'block' : 'none',
        left: left + 'px',
      },
    }

    return (
      <div class={clsName('column-resizer')}>
        <div {...columnResizerHandlerProps} />
        <div {...columnResizerLineProps} />
      </div>
    )
  },
}
