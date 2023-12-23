import { cloneDeep, debounce } from '@U/index.js'
import {
  initGroupColumns,
  clsName,
  getNotFixedTotalWidthByColumnKey,
  recursiveRemoveColumnByKey,
  setHeaderContextmenuOptions,
  setBodyContextmenuOptions,
  createEmptyRowData,
  isContextmenuPanelClicked,
  getRowKey,
  getColKeysByHeaderColumn,
  getColumnByColkey,
  getLeftmostColKey,
  isCellInSelectionRange,
  isClearSelectionByBodyCellRightClick,
  cellAutofill,
  isOperationColumn,
  getSelectionRangeData,
  getSelectionRangeKeys,
  getSelectionRangeIndexes,
  setColumnFixed,
  cancelColumnFixed
} from './util/index'
import {
  onBeforeCopy,
  onAfterCopy,
  onBeforePaste,
  onAfterPaste,
  onBeforeCut,
  onAfterCut,
  onBeforeDelete,
  onAfterDelete
} from './util/clipboard'
import {
  getValByUnit,
  isFunction,
  isNumber,
  scrollTo,
  isEmptyValue,
  isEmptyArray,
  isBoolean,
  isDefined,
  createLocale
} from '../../src/utils/index.js'
import { KEY_CODES, MOUSE_EVENT_CLICK_TYPE } from '../../src/utils/constant'
import { getScrollbarWidth } from '../../src/utils/scroll-bar'
import {
  requestAnimationTimeout,
  cancelAnimationTimeout
} from '../../src/utils/request-animation-timeout'
import { isInputKeyCode } from '../../src/utils/event-key-codes'
import Hooks from '../../src/utils/hooks-manager'
import { getMouseEventClickType } from '../../src/utils/mouse-event'
import emitter from '../../src/mixins/emitter'
import {
  COMPS_NAME,
  HOOKS_NAME,
  EMIT_EVENTS,
  COMPS_CUSTOM_ATTRS,
  INSTANCE_METHODS,
  CELL_SELECTION_DIRECTION,
  LOCALE_COMP_NAME,
  CONTEXTMENU_TYPES,
  CONTEXTMENU_NODE_TYPES,
  AUTOFILLING_DIRECTION,
  CURRENT_CELL_SELECTION_TYPES,
  COLUMN_FIXED_TYPE
} from './util/constant'
import Colgroup from './colgroup/index.jsx'
import Header from './header/index.jsx'
import Body from './body/index.jsx'
import Footer from './footer/index.jsx'
import EditInput from './editor/index.jsx'
import Selection from './selection/index.jsx'
import clickoutside from '../../src/directives/clickoutside'
import VueDomResizeObserver from '../../src/comps/resize-observer/index'
import VeContextmenu from '@P/ve-contextmenu/index.js'
import ColumnResizer from './column-resizer/index.jsx'

const t = createLocale(LOCALE_COMP_NAME)

export default {
  name: COMPS_NAME.VE_TABLE,
  directives: {
    'click-outside': clickoutside,
  },
  mixins: [emitter],
  props: {
    tableData: {
      required: true,
      type: Array,
    },
    footerData: {
      type: Array,
      default: function () {
        return []
      },
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    // row key field for row expand、row selection
    rowKeyFieldName: {
      type: String,
      default: null,
    },
    // table scroll width
    scrollWidth: {
      type: [Number, String],
      default: null,
    },
    // table max height
    maxHeight: {
      type: [Number, String],
      default: null,
    },
    // fixed header
    fixedHeader: {
      type: Boolean,
      default: true,
    },
    // fixed footer
    fixedFooter: {
      type: Boolean,
      default: true,
    },
    // border around
    borderAround: {
      type: Boolean,
      default: true,
    },
    // border horizontal
    borderX: {
      type: Boolean,
      default: true,
    },
    // border vertical
    borderY: {
      type: Boolean,
      default: false,
    },
    // event custom option
    eventCustomOption: {
      type: Object,
      default: function () {
        return null
      },
    },
    // cell style option
    cellStyleOption: {
      type: Object,
      default: function () {
        return null
      },
    },
    // cell span option
    cellSpanOption: {
      type: Object,
      default: function () {
        return null
      },
    },
    // row style option
    rowStyleOption: {
      type: Object,
      default: function () {
        return null
      },
    },
    /*
        virual scroll option
        {
            enable:true,
            bufferCount:10, // 缓冲的数据
            minRowHeight:40,
            scrolling:(startRowIndex,visibleStartIndex,visibleEndIndex,visibleAboveCount,visibleBelowCount)=>{}
        }
        */
    virtualScrollOption: {
      type: Object,
      default: null,
    },
    // sort option
    sortOption: {
      type: Object,
      default: function () {
        return null
      },
    },
    // expand row option
    expandOption: {
      type: Object,
      default: function () {
        return null
      },
    },
    // checkbox option
    checkboxOption: {
      type: Object,
      default: function () {
        return null
      },
    },
    // radio option
    radioOption: {
      type: Object,
      default: function () {
        return null
      },
    },
    // cell selection option
    cellSelectionOption: {
      type: Object,
      default: function () {
        return null
      },
    },
    // cell autofill option
    cellAutofillOption: {
      type: [Object, Boolean],
      default: function () {
        return null
      },
    },
    // edit option
    editOption: {
      type: Object,
      default: function () {
        return null
      },
    },
    // column hidden option
    columnHiddenOption: {
      type: Object,
      default: function () {
        return null
      },
    },
    // contextmenu header option
    contextmenuHeaderOption: {
      type: Object,
      default: function () {
        return null
      },
    },
    // contextmenu body option
    contextmenuBodyOption: {
      type: Object,
      default: function () {
        return null
      },
    },
    // clipboard option
    clipboardOption: {
      type: Object,
      default: function () {
        return null
      },
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
      // Hooks instance
      hooks: {},
      // is parent rendered
      parentRendered: false,
      // table viewport width except scroll bar width
      tableViewportWidth: 0,
      /*
            列配置变化次数
            依赖columns 配置渲染，都需要重新计算：粘性布局时，重新触发 on-dom-resize-change 事件
            */
      columnsOptionResetTime: 0,
      tableRootRef: 'tableRootRef',
      tableContainerWrapperRef: 'tableContainerWrapperRef',
      tableContainerRef: 'tableContainerRef',
      tableRef: 'tableRef',
      tableBodyRef: 'tableBodyRef',
      tableContentWrapperRef: 'tableContentWrapperRef',
      virtualPhantomRef: 'virtualPhantomRef',
      editInputRef: 'editInputRef',
      cellSelectionRef: 'cellSelectionRef',
      contextmenuRef: 'contextmenuRef',
      cloneColumns: [],
      // is group header
      isGroupHeader: false,
      /*
            header rows created by groupColumns
            */
      headerRows: [
        /* {
                rowHeight:40
            } */
      ],
      /*
            footer rows created by footerData
            */
      footerRows: [
        /* {
                rowHeight:40
             } */
      ],
      // colgroups
      colgroups: [],
      // groupColumns
      groupColumns: [],
      /*
        存储当前隐藏列信息
        hidden columns
        */
      hiddenColumns: [],
      /*
            // virtual scroll positions（非响应式）
            virtualScrollPositions = [
                {
                    rowKey: "", // 当前行数据 rowKey
                    top: 0, // 距离上一个项的高度
                    bottom: 100, // 距离下一个项的高度
                    height: 100 // 自身高度
                }
            ],
            */
      // virtual scroll visible data
      virtualScrollVisibleData: [],
      // virtual scroll visible indexs
      virtualScrollVisibleIndexs: {
        start: -1,
        end: -1,
      },
      // default virtual scroll buffer scale
      defaultVirtualScrollBufferScale: 1,
      // default virtual scroll min row height
      defaultVirtualScrollMinRowHeight: 40,
      // default placeholder per scrolling row count
      defaultPlaceholderPerScrollingRowCount: 8,
      // 起始索引
      virtualScrollStartIndex: 0,
      // preview virtual scroll start index
      previewVirtualScrollStartIndex: 0,
      // 结束索引
      virtualScrollEndIndex: 0,
      // is scrolling
      showVirtualScrollingPlaceholder: false,
      // disable pointer events timeout id
      disablePointerEventsTimeoutId: null,
      // is scrolling left
      isLeftScrolling: false,
      // is scrolling right
      isRightScrolling: false,
      // is scrolling vertically
      isVerticalScrolling: false,
      // has horizontal scroll bar
      hasXScrollBar: false,
      // has vertical scroll bar
      hasYScrollBar: false,
      // scroll bar width
      scrollBarWidth: 0,
      // preview table container scrollLeft （处理左列或右列固定效果）
      previewTableContainerScrollLeft: null,
      // header cell selection colKeys
      headerIndicatorColKeys: {
        startColKey: '',
        startColKeyIndex: -1,
        endColKey: '',
        endColKeyIndex: -1,
      },
      // body indicator rowKeys
      bodyIndicatorRowKeys: {
        startRowKey: '',
        startRowKeyIndex: -1,
        endRowKey: '',
        endRowKeyIndex: -1,
      },
      // cell selection data
      cellSelectionData: {
        currentCell: {
          rowKey: '',
          colKey: '',
          rowIndex: -1,
        },
        normalEndCell: {
          rowKey: '',
          colKey: '',
          rowIndex: -1,
        },
        autoFillEndCell: {
          rowKey: '',
          colKey: '',
        },
      },
      // cell selection range data
      cellSelectionRangeData: {
        leftColKey: '',
        rightColKey: '',
        topRowKey: '',
        bottomRowKey: '',
      },
      // is header cell mousedown
      isHeaderCellMousedown: false,
      // is body cell mousedown
      isBodyCellMousedown: false,
      // is body operation column mousedown
      isBodyOperationColumnMousedown: false,
      // is cell selection corner mousedown
      isAutofillStarting: false,
      // autofilling direction
      autofillingDirection: null,
      // current cell selection type
      currentCellSelectionType: '',
      /*
            table offest height（开启虚拟滚动时使用）
            1、当 :max-height="500" 时使用 max-height
            2、当 max-height="calc(100vh - 210px)" 或者 max-height="80%" 时使用 tableOffestHeight
            */
      tableOffestHeight: 0,
      // table height
      tableHeight: 0,
      // highlight row key
      highlightRowKey: '',
      /*
            editing cell
            */
      editingCell: {
        rowKey: '',
        colKey: '',
        row: null,
        column: null,
      },
      // 编辑单元格每次开始编辑前的初始值
      editorInputStartValue: '',
      /*
            是否允许按下方向键时，停止编辑并移动选中单元格。当双击可编辑单元格或者点击输入文本框时设置为false值

            像excel一样：如果直接在可编辑单元格上输入内容后，按下上、下、左、右按键可以直接选中其他单元格，并停止当前单元格编辑状态
            like Excel:If you directly enter content in an editable cell, press the up, down, left and right buttons to directly select other cells and stop editing the current cell
            */
      enableStopEditing: true,
      // contextmenu event target
      contextmenuEventTarget: '',
      // contextmenu options
      contextmenuOptions: [],
      // column resize cursor
      isColumnResizerHover: false,
      // is column resizing
      isColumnResizing: false,
    }
  },
  computed: {
    // actual render table data
    actualRenderTableData() {
      return this.isVirtualScroll
        ? this.virtualScrollVisibleData
        : this.tableData
    },
    // return row keys
    allRowKeys() {
      let result = []

      const { tableData, rowKeyFieldName } = this

      if (rowKeyFieldName) {
        result = tableData.map((x) => {
          return x[rowKeyFieldName]
        })
      }

      return result
    },
    // virtual scroll buffer count
    virtualScrollBufferCount() {
      let result = 0

      const {
        virtualScrollOption,
        defaultVirtualScrollBufferScale,
        virtualScrollVisibleCount,
      } = this

      if (virtualScrollOption) {
        const { bufferScale } = virtualScrollOption

        const realBufferScale =
          isNumber(bufferScale) && bufferScale > 0
            ? bufferScale
            : defaultVirtualScrollBufferScale

        result = realBufferScale * virtualScrollVisibleCount
      }

      return result
    },
    // virtual scroll visible count
    virtualScrollVisibleCount() {
      let result = 0

      const {
        isVirtualScroll,
        virtualScrollOption,
        defaultVirtualScrollMinRowHeight,
        maxHeight,
        tableOffestHeight,
      } = this

      if (isVirtualScroll && maxHeight) {
        const minRowHeight = isNumber(virtualScrollOption.minRowHeight)
          ? virtualScrollOption.minRowHeight
          : defaultVirtualScrollMinRowHeight

        if (isNumber(maxHeight)) {
          result = Math.ceil(maxHeight / minRowHeight)
        } else if (tableOffestHeight) {
          // 修复当动态高度 当 max-height="calc(100vh - 210px)" 或者 max-height="80%" 时无法计算的问题
          result = Math.ceil(tableOffestHeight / minRowHeight)
        }
      }
      return result
    },
    // table container wrapper style
    tableContainerWrapperStyle() {
      return {
        width: '100%',
      }
    },
    // table container style
    tableContainerStyle() {
      const maxHeight = getValByUnit(this.maxHeight)

      let tableContainerHeight = null
      if (this.isVirtualScroll) {
        if (maxHeight) {
          tableContainerHeight = maxHeight
        } else {
          console.error(
            "maxHeight prop is required when 'virtualScrollOption.enable = true'",
          )
        }
      } else {
        /*
                fixed:虚拟滚动表格行展开的 ve-table 存在固定头时（sticky 冲突），表格样式错乱的问题
                fixed:When there is a fixed header in the ve-table expanded by the row of the virtual rolling table(header sticky conflict),Incorrect table presentation
                */
        const { tableHeight, hasXScrollBar } = this
        tableContainerHeight = tableHeight
        /*
                    有横向滚动条时，表格高度需要加上滚动条的宽度
                    When there is a horizontal scroll bar, the table height needs to be added with the width of the scroll bar
                    */
        if (hasXScrollBar) {
          tableContainerHeight += this.getScrollBarWidth()
        }

        tableContainerHeight = getValByUnit(tableContainerHeight)
      }

      return {
        'max-height': maxHeight,
        // if virtual scroll
        height: tableContainerHeight,
      }
    },
    // table style
    tableStyle() {
      return {
        width: getValByUnit(this.scrollWidth),
      }
    },
    // table class
    tableClass() {
      const borderY = clsName('border-y')
      return {
        [clsName('border-x')]: this.borderX,
        [borderY]: this.borderY,
      }
    },
    // table container class
    tableContainerClass() {
      const {
        isVirtualScroll,
        isLeftScrolling,
        isRightScrolling,
        isVerticalScrolling,
        isCellEditing,
        isAutofillStarting,
        enableCellSelection,
      } = this
      const virtualScroll = clsName('virtual-scroll')
      const leftScrolling = clsName('container-left-scrolling')
      const rightScrolling = clsName('container-right-scrolling')
      const verticalScroll = clsName('container-vertical-scrolling')
      const cellEditing = clsName('is-cell-editing')
      const autofilling = clsName('autofilling')
      const cellSelection = clsName('enable-cell-selection')
      const result = {
        [clsName('container')]: true,
        [virtualScroll]: isVirtualScroll,
        [leftScrolling]: isLeftScrolling,
        [rightScrolling]: isRightScrolling,
        [verticalScroll]: isVerticalScrolling,
        [cellEditing]: isCellEditing,
        [autofilling]: isAutofillStarting,
        // 如果开启单元格选择，则关闭 user-select
        [cellSelection]: enableCellSelection,
      }
      return result
    },
    // table body class
    tableBodyClass() {
      let result = null

      const { rowStyleOption } = this

      let hoverHighlight = true
      let clickHighlight = true
      let stripe = false

      if (rowStyleOption) {
        hoverHighlight = rowStyleOption.hoverHighlight
        clickHighlight = rowStyleOption.clickHighlight
        stripe = rowStyleOption.stripe
      }
      const clsStripe = clsName('stripe')
      const rowHover = clsName('stripe')
      result = {
        [clsStripe]: stripe === true, // 默认不开启
        [rowHover]: hoverHighlight !== false, // 默认开启
        [clsName('row-highlight')]: clickHighlight !== false, // 默认开启
      }

      return result
    },
    // is virtual scroll
    isVirtualScroll() {
      const { virtualScrollOption } = this
      return virtualScrollOption && virtualScrollOption.enable
    },
    // has fixed column
    hasFixedColumn() {
      return this.colgroups.some(
        (x) =>
          x.fixed === COLUMN_FIXED_TYPE.LEFT ||
          x.fixed === COLUMN_FIXED_TYPE.RIGHT,
      )
    },
    // has left fixed column
    hasLeftFixedColumn() {
      return this.colgroups.some(
        (x) => x.fixed === COLUMN_FIXED_TYPE.LEFT,
      )
    },
    // has right fixed column
    hasRightFixedColumn() {
      return this.colgroups.some(
        (x) => x.fixed === COLUMN_FIXED_TYPE.RIGHT,
      )
    },
    // is editing cell
    isCellEditing() {
      const { editingCell } = this

      return (
        !isEmptyValue(editingCell.rowKey) &&
        !isEmptyValue(editingCell.colKey)
      )
    },
    // has edit column
    hasEditColumn() {
      return this.colgroups.some((x) => x.edit)
    },
    // enable header contextmenu
    enableHeaderContextmenu() {
      let result = false

      const { contextmenuHeaderOption } = this
      if (contextmenuHeaderOption) {
        const { contextmenus } = contextmenuHeaderOption

        if (Array.isArray(contextmenus) && contextmenus.length) {
          result = true
        }
      }
      return result
    },
    // enable body contextmenu
    enableBodyContextmenu() {
      let result = false

      const { contextmenuBodyOption } = this
      if (contextmenuBodyOption) {
        const { contextmenus } = contextmenuBodyOption

        if (Array.isArray(contextmenus) && contextmenus.length) {
          result = true
        }
      }
      return result
    },
    // contextmenu type
    contextMenuType() {
      if (this.headerIndicatorColKeys.startColKeyIndex > -1) {
        return CONTEXTMENU_TYPES.HEADER_CONTEXTMENU
      } else {
        return CONTEXTMENU_TYPES.BODY_CONTEXTMENU
      }
    },
    /*
        enable cell selection
        单元格编辑、剪贴板都依赖单元格选择
        */
    enableCellSelection() {
      let result = true

      const { cellSelectionOption, rowKeyFieldName } = this

      if (isEmptyValue(rowKeyFieldName)) {
        result = false
      } else if (
        cellSelectionOption &&
        isBoolean(cellSelectionOption.enable) &&
        cellSelectionOption.enable === false
      ) {
        result = false
      }
      return result
    },
    // enable clipboard
    enableClipboard() {
      return this.rowKeyFieldName
    },
    // eanble width resize
    enableColumnResize() {
      let result = false
      const { columnWidthResizeOption } = this
      if (columnWidthResizeOption) {
        const { enable } = columnWidthResizeOption
        if (isBoolean(enable)) {
          result = enable
        }
      }
      return result
    },
    // header total height
    headerTotalHeight() {
      let result = 0
      if (this.showHeader) {
        result = this.headerRows.reduce((total, currentVal) => {
          return currentVal.rowHeight + total
        }, 0)
      }
      return result
    },
    // footer total height
    footerTotalHeight() {
      return this.footerRows.reduce((total, currentVal) => {
        return currentVal.rowHeight + total
      }, 0)
    },
  },
  watch: {
    // watch clone table data
    tableData: {
      handler(newVal, oldVal) {
        this.initVirtualScrollPositions()
        // 第一次不需要触发，仅数据变更触发
        if (oldVal) {
          this.initVirtualScroll()
        }
      },
      immediate: true,
    },
    allRowKeys: {
      handler(newVal) {
        if (Array.isArray(newVal)) {
          const { currentCell } = this.cellSelectionData
          // 行被移除，清空单元格选中
          if (currentCell.rowIndex > -1) {
            if (newVal.indexOf(currentCell.rowKey) === -1) {
              this.clearCellSelectionCurrentCell()
            }
          }
        }
      },
      immediate: false,
    },
    columns: {
      handler(newVal, oldVal) {
        this.initColumns()
        this.initGroupColumns()
        this.initColumnWidthByColumnResize()

        // 排除首次
        if (newVal !== oldVal && oldVal) {
          this.columnsOptionResetTime++
          // 需要等待 initColumns 和 initGroupColumns 先执行
          this.initScrolling()
        }
      },
      immediate: true,
    },
    cloneColumns: {
      handler() {
        this.initGroupColumns()
        // 右键（取消）固定列会操作 cloneColumns
        this.initColumnWidthByColumnResize()

        this.columnsOptionResetTime++
        // 需要等待 initColumns 和 initGroupColumns 先执行
        this.initScrolling()
      },
      immediate: false,
    },
    // group columns change watch
    groupColumns: {
      handler(val) {
        if (!isEmptyArray(val)) {
          this.initHeaderRows()
        }
      },
      immediate: true,
    },
    // footer data
    footerData: {
      handler(val) {
        if (!isEmptyArray(val)) {
          this.initFooterRows()
        }
      },
      immediate: true,
    },
    /*
        watch virtualScrollOption enable
        允许按需开启虚拟滚动
        */
    'virtualScrollOption.enable': {
      handler(newVal) {
        // enable virtual scroll
        if (newVal) {
          this.initVirtualScrollPositions()
          this.initVirtualScroll()
        } else { // disable virtual scroll
          // clear table content top value
          this.setTableContentTopValue({ top: 0 })
        }
      },
      immediate: false,
    },
    // is auto fill starting
    isAutofillStarting: {
      handler(val) {
        if (!val) {
          this.setCellSelectionByAutofill()
          this.clearCellSelectionAutofillEndCell()
        }
      },
    },
    // watch current cell
    'cellSelectionData.currentCell': {
      handler: function () {
        this.setCurrentCellSelectionType()
      },
      deep: true,
      immediate: true,
    },
    // watch normal end cell
    'cellSelectionData.normalEndCell': {
      handler: function () {
        this.setCurrentCellSelectionType()
      },
      deep: true,
      immediate: true,
    },
    // watch header indicator colKeys
    headerIndicatorColKeys: {
      handler: function () {
        this.setRangeCellSelectionByHeaderIndicator()
      },
      deep: true,
    },
    // watch body indicator rowKeys
    bodyIndicatorRowKeys: {
      handler: function () {
        this.setRangeCellSelectionByBodyIndicator()
      },
      deep: true,
    },
  },
  created() {
    // bug fixed #467
    this.debouncedBodyCellWidthChange = debounce(
      this.bodyCellWidthChange,
      0,
    )
  },
  mounted() {
    this.parentRendered = true

    // set contextmenu event target
    this.contextmenuEventTarget = this.$el.querySelector(
      `.${clsName('content')}`,
    )

    // create hook instance
    this.hooks = new Hooks()

    // receive sort change
    this.$on(EMIT_EVENTS.SORT_CHANGE, (params) => {
      this.updateColgroupsBySortChange(params)
    })

    // receive row selected change
    this.$on(EMIT_EVENTS.CHECKBOX_SELECTED_ALL_CHANGE, (params) => {
      this.selectedAllChange(params)
    })

    // receive selected all info
    this.$on(EMIT_EVENTS.CHECKBOX_SELECTED_ALL_INFO, (params) => {
      this.setSelectedAllInfo(params)
    })

    // receive multiple header row height change
    this.$on(
      EMIT_EVENTS.HEADER_ROW_HEIGHT_CHANGE,
      ({ rowIndex, height }) => {
        this.headerRowHeightChange({ rowIndex, height })
      },
    )

    // receive virtual scroll row height change
    this.$on(EMIT_EVENTS.BODY_ROW_HEIGHT_CHANGE, ({ rowKey, height }) => {
      this.bodyRowHeightChange({ rowKey, height })
    })

    // receive footer row height change
    this.$on(
      EMIT_EVENTS.FOOTER_ROW_HEIGHT_CHANGE,
      ({ rowIndex, height }) => {
        this.footRowHeightChange({ rowIndex, height })
      },
    )

    // recieve body cell click
    this.$on(EMIT_EVENTS.BODY_CELL_CLICK, (params) => {
      this.bodyCellClick(params)
    })

    // recieve body cell mouseover
    this.$on(EMIT_EVENTS.BODY_CELL_MOUSEOVER, (params) => {
      this.bodyCellMouseover(params)
    })

    // recieve body cell mousedown
    this.$on(EMIT_EVENTS.BODY_CELL_MOUSEDOWN, (params) => {
      this.bodyCellMousedown(params)
    })

    // recieve body cell mousemove
    this.$on(EMIT_EVENTS.BODY_CELL_MOUSEMOVE, (params) => {
      this.bodyCellMousemove(params)
    })

    // recieve body cell mouseup
    this.$on(EMIT_EVENTS.BODY_CELL_MOUSEUP, (params) => {
      this.bodyCellMouseup(params)
    })

    // recieve selection corner mousedown
    this.$on(EMIT_EVENTS.SELECTION_CORNER_MOUSEDOWN, (params) => {
      this.cellSelectionCornerMousedown(params)
    })

    // recieve selection corner mouseup
    this.$on(EMIT_EVENTS.SELECTION_CORNER_MOUSEUP, (params) => {
      this.cellSelectionCornerMouseup(params)
    })

    // autofilling direction change
    this.$on(EMIT_EVENTS.AUTOFILLING_DIRECTION_CHANGE, (params) => {
      this.autofillingDirectionChange(params)
    })

    // recieve body cell contextmenu(right click)
    this.$on(EMIT_EVENTS.BODY_CELL_CONTEXTMENU, (params) => {
      this.bodyCellContextmenu(params)
    })

    // recieve body cell double click
    this.$on(EMIT_EVENTS.BODY_CELL_DOUBLE_CLICK, (params) => {
      this.bodyCellDoubleClick(params)
    })

    // recieve header cell contextmenu(right click)
    this.$on(EMIT_EVENTS.HEADER_CELL_CLICK, (params) => {
      this.headerCellClick(params)
    })

    // recieve header cell contextmenu(right click)
    this.$on(EMIT_EVENTS.HEADER_CELL_CONTEXTMENU, (params) => {
      this.headerCellContextmenu(params)
    })

    // recieve header cell mousedown
    this.$on(EMIT_EVENTS.HEADER_CELL_MOUSEDOWN, (params) => {
      this.headerCellMousedown(params)
    })

    // recieve header cell mouseover
    this.$on(EMIT_EVENTS.HEADER_CELL_MOUSEOVER, (params) => {
      this.headerCellMouseover(params)
    })

    // recieve header cell mousemove
    this.$on(EMIT_EVENTS.HEADER_CELL_MOUSEMOVE, (params) => {
      this.headerCellMousemove(params)
    })

    // recieve header cell mouseleave
    this.$on(EMIT_EVENTS.HEADER_CELL_MOUSELEAVE, (params) => {
      this.headerCellMouseleave(params)
    })

    // add key down event listener
    document.addEventListener('keydown', this.dealKeydownEvent)

    // init scrolling
    this.initScrolling()
  },
  unmounted() {
    // remove key down event listener
    document.removeEventListener('keydown', this.dealKeydownEvent)
  },

  methods: {
    // int header rows
    initHeaderRows() {
      const { groupColumns } = this

      if (Array.isArray(groupColumns)) {
        this.headerRows = groupColumns.map(() => {
          return { rowHeight: 0 }
        })
      }
    },

    // int footer rows
    initFooterRows() {
      const { footerData } = this

      if (Array.isArray(footerData)) {
        this.footerRows = footerData.map(() => {
          return { rowHeight: 0 }
        })
      }
    },

    // header tr height resize
    headerRowHeightChange({ rowIndex, height }) {
      this.headerRows.splice(rowIndex, 1, { rowHeight: height })
    },

    // footer row height resize
    footRowHeightChange({ rowIndex, height }) {
      this.footerRows.splice(rowIndex, 1, { rowHeight: height })
    },

    // body cell width change
    bodyCellWidthChange(colWidths) {
      this.colgroups = this.colgroups.map((item) => {
        item._realTimeWidth = colWidths.get(item.key)
        return item
      })

      this.hooks.triggerHook(HOOKS_NAME.TABLE_CELL_WIDTH_CHANGE)
    },

    // set column width for column resize
    setColumnWidth({ colKey, width }) {
      this.colgroups = this.colgroups.map((item) => {
        if (item.key === colKey) {
          item._columnResizeWidth = width
        }
        return item
      })
      this.$nextTick(() => {
        this.setScrollBarStatus()
      })
      this.hooks.triggerHook(HOOKS_NAME.TABLE_CELL_WIDTH_CHANGE)
    },

    // update colgroups by sort change
    updateColgroupsBySortChange(sortColumns) {
      this.colgroups = this.colgroups.map((item) => {
        // update colgroups by sort columns
        if (Object.keys(sortColumns).indexOf(item.field) > -1) {
          item.sortBy = sortColumns[item.field]
        }
        return item
      })
    },

    // init column width by column resize
    initColumnWidthByColumnResize() {
      const { enableColumnResize } = this

      const columnDefaultWidth = 50
      if (enableColumnResize) {
        this.colgroups = this.colgroups.map((item) => {
          let columnWidth = columnDefaultWidth
          if (isNumber(item.width)) {
            columnWidth = item.width
          }
          item._columnResizeWidth = columnWidth
          return item
        })
      }
    },

    // init columns
    initColumns() {
      const { columnHiddenOption } = this
      if (columnHiddenOption) {
        const { defaultHiddenColumnKeys } = columnHiddenOption

        if (!isEmptyArray(defaultHiddenColumnKeys)) {
          this.hiddenColumns = defaultHiddenColumnKeys
        }
      }

      this.showOrHideColumns()
    },

    // show or hide columns
    showOrHideColumns() {
      let cloneColumns = cloneDeep(this.columns)

      cloneColumns = cloneColumns.map((col) => {
        // 操作列默认左固定
        if (col.operationColumn) {
          col.fixed = COLUMN_FIXED_TYPE.LEFT
        }
        return col
      })

      const { hiddenColumns } = this

      if (!isEmptyArray(hiddenColumns)) {
        //  recursive remove column key
        hiddenColumns.forEach((key) => {
          cloneColumns = recursiveRemoveColumnByKey(
            cloneColumns,
            key,
          )
        })
      }

      this.cloneColumns = cloneColumns
    },

    // 初始化分组表头
    initGroupColumns() {
      const result = initGroupColumns(this.cloneColumns)

      // set is group header
      this.isGroupHeader = result.isGroupHeader
      // set colgroups
      this.colgroups = result.colgroups
      // set groupColumns
      this.groupColumns = result.groupColumns
    },

    // scroll bar width
    getScrollBarWidth() {
      let result = 0

      const { scrollBarWidth } = this

      if (scrollBarWidth) {
        result = scrollBarWidth
      } else {
        result = getScrollbarWidth()
        this.scrollBarWidth = result
      }

      return result
    },

    /*
         * @selectedAllChange
         * @desc  selected all change
         * @param {bool} isSelected - is selected
         */
    selectedAllChange({ isSelected }) {
      this.broadcast(
        COMPS_NAME.VE_TABLE_BODY,
        EMIT_EVENTS.CHECKBOX_SELECTED_ALL_CHANGE,
        {
          isSelected,
        },
      )
    },

    /*
         * @setSelectedAllInfo
         * @desc  set selected all info
         * @param {bool} isSelected - is selected
         * @param {bool} isIndeterminate - is indeterminate
         */
    setSelectedAllInfo({ isSelected, isIndeterminate }) {
      this.broadcast(
        COMPS_NAME.VE_TABLE_HEADER_CHECKBOX_CONTENT,
        EMIT_EVENTS.CHECKBOX_SELECTED_ALL_INFO,
        {
          isSelected,
          isIndeterminate,
        },
      )
    },

    // cell selection current cell change
    cellSelectionCurrentCellChange({ rowKey, colKey }) {
      this.cellSelectionData.currentCell.colKey = colKey
      this.cellSelectionData.currentCell.rowKey = rowKey
      this.cellSelectionData.currentCell.rowIndex =
        this.allRowKeys.indexOf(rowKey)
    },

    // cell selection end cell change
    cellSelectionNormalEndCellChange({ rowKey, colKey }) {
      this.cellSelectionData.normalEndCell.colKey = colKey
      this.cellSelectionData.normalEndCell.rowKey = rowKey
      this.cellSelectionData.normalEndCell.rowIndex =
        this.allRowKeys.indexOf(rowKey)
    },

    // cell selection auto fill cell change
    cellSelectionAutofillCellChange({ rowKey, colKey }) {
      this.cellSelectionData.autoFillEndCell.colKey = colKey
      this.cellSelectionData.autoFillEndCell.rowKey = rowKey
    },

    // clear cell selection current cell
    clearCellSelectionCurrentCell() {
      this.cellSelectionCurrentCellChange({
        rowKey: '',
        colKey: '',
        rowIndex: -1,
      })
    },

    // clear cell selection normal end cell
    clearCellSelectionNormalEndCell() {
      this.cellSelectionNormalEndCellChange({
        rowKey: '',
        colKey: '',
        rowIndex: -1,
      })
    },

    // clear cell selection autofill end cell
    clearCellSelectionAutofillEndCell() {
      this.cellSelectionAutofillCellChange({ rowKey: '', colKey: '' })
    },

    // header indicator colKeys change
    headerIndicatorColKeysChange({ startColKey, endColKey }) {
      const { colgroups } = this
      this.headerIndicatorColKeys.startColKey = startColKey
      this.headerIndicatorColKeys.startColKeyIndex = colgroups.findIndex(
        (x) => x.key === startColKey,
      )
      this.headerIndicatorColKeys.endColKey = endColKey
      this.headerIndicatorColKeys.endColKeyIndex = colgroups.findIndex(
        (x) => x.key === endColKey,
      )
    },

    // clear header indicator colKeys
    clearHeaderIndicatorColKeys() {
      this.headerIndicatorColKeys.startColKey = ''
      this.headerIndicatorColKeys.startColKeyIndex = -1
      this.headerIndicatorColKeys.endColKey = ''
      this.headerIndicatorColKeys.endColKeyIndex = -1
    },

    // body indicator rowKeys change
    bodyIndicatorRowKeysChange({ startRowKey, endRowKey }) {
      const { allRowKeys } = this
      this.bodyIndicatorRowKeys.startRowKey = startRowKey
      this.bodyIndicatorRowKeys.startRowKeyIndex =
        allRowKeys.indexOf(startRowKey)
      this.bodyIndicatorRowKeys.endRowKey = endRowKey
      this.bodyIndicatorRowKeys.endRowKeyIndex =
        allRowKeys.indexOf(endRowKey)
    },

    // clear body indicator RowKeys
    clearBodyIndicatorRowKeys() {
      this.bodyIndicatorRowKeys.startRowKey = ''
      this.bodyIndicatorRowKeys.startRowKeyIndex = -1
      this.bodyIndicatorRowKeys.endRowKey = ''
      this.bodyIndicatorRowKeys.endRowKeyIndex = -1
    },

    // set cell selection by autofill
    setCellSelectionByAutofill() {
      const {
        cellAutofillOption,
        cellSelectionRangeData,
        colgroups,
        allRowKeys,
        autofillingDirection,
        currentCellSelectionType,
      } = this
      const { autoFillEndCell, currentCell } = this.cellSelectionData

      const { rowKey, colKey } = autoFillEndCell

      if (isEmptyValue(rowKey) || isEmptyValue(colKey)) {
        return false
      }

      let currentCellData = {}
      let normalEndCellData = {}

      const { leftColKey, rightColKey, topRowKey, bottomRowKey } =
        cellSelectionRangeData

      // cell selection range auto fill
      if (
        currentCellSelectionType === CURRENT_CELL_SELECTION_TYPES.RANGE
      ) {
        if (
          !isCellInSelectionRange({
            cellData: autoFillEndCell,
            cellSelectionRangeData,
            colgroups,
            allRowKeys,
          })
        ) {
          if (autofillingDirection === AUTOFILLING_DIRECTION.RIGHT) {
            currentCellData = {
              rowKey: topRowKey,
              colKey: leftColKey,
            }
            normalEndCellData = { rowKey: bottomRowKey, colKey }
          } else if (
            autofillingDirection === AUTOFILLING_DIRECTION.DOWN
          ) {
            currentCellData = {
              rowKey: topRowKey,
              colKey: leftColKey,
            }
            normalEndCellData = { rowKey, colKey: rightColKey }
          } else if (
            autofillingDirection === AUTOFILLING_DIRECTION.UP
          ) {
            currentCellData = {
              rowKey,
              colKey: leftColKey,
            }
            normalEndCellData = {
              rowKey: bottomRowKey,
              colKey: rightColKey,
            }
          } else if (
            autofillingDirection === AUTOFILLING_DIRECTION.LEFT
          ) {
            currentCellData = { rowKey: topRowKey, colKey }
            normalEndCellData = {
              rowKey: bottomRowKey,
              colKey: rightColKey,
            }
          }
        } else {
          // return if within the range
          return false
        }
      } else if ( // cell selection single auto fill
        currentCellSelectionType === CURRENT_CELL_SELECTION_TYPES.SINGLE
      ) {
        if (
          currentCell.rowKey !== rowKey ||
          currentCell.colKey !== colKey
        ) {
          if (autofillingDirection === AUTOFILLING_DIRECTION.RIGHT) {
            currentCellData = {
              rowKey,
              colKey: leftColKey,
            }
            normalEndCellData = {
              rowKey,
              colKey,
            }
          } else if (
            autofillingDirection === AUTOFILLING_DIRECTION.DOWN
          ) {
            currentCellData = {
              rowKey: topRowKey,
              colKey: leftColKey,
            }
            normalEndCellData = {
              rowKey,
              colKey: leftColKey,
            }
          } else if (
            autofillingDirection === AUTOFILLING_DIRECTION.UP
          ) {
            currentCellData = {
              rowKey,
              colKey: leftColKey,
            }
            normalEndCellData = {
              rowKey: bottomRowKey,
              colKey: leftColKey,
            }
          } else if (
            autofillingDirection === AUTOFILLING_DIRECTION.LEFT
          ) {
            currentCellData = {
              rowKey,
              colKey,
            }
            normalEndCellData = {
              rowKey,
              colKey: rightColKey,
            }
          }
        } else {
          // return if within the range
          return false
        }
      }

      const cellAutofillParams = {
        tableData: this.tableData,
        allRowKeys: this.allRowKeys,
        colgroups: this.colgroups,
        rowKeyFieldName: this.rowKeyFieldName,
        direction: autofillingDirection,
        currentCellSelectionType,
        cellSelectionRangeData,
        nextCurrentCell: currentCellData,
        nextNormalEndCell: normalEndCellData,
      }

      if (cellAutofillOption) {
        const { beforeAutofill, afterAutofill } = cellAutofillOption

        if (isFunction(beforeAutofill)) {
          // before autofill
          const autofillResponse = cellAutofill({
            isReplaceData: false,
            ...cellAutofillParams,
          })
          const callback = beforeAutofill(autofillResponse)
          if (isBoolean(callback) && !callback) {
            return false
          }
        }

        // after autofill
        const autofillResponse = cellAutofill({
          isReplaceData: true,
          ...cellAutofillParams,
        })
        if (isFunction(afterAutofill)) {
          afterAutofill(autofillResponse)
        }
      }

      if (!isEmptyValue(currentCellData.rowKey)) {
        this.cellSelectionCurrentCellChange({
          rowKey: currentCellData.rowKey,
          colKey: currentCellData.colKey,
        })
      }

      if (!isEmptyValue(normalEndCellData.rowKey)) {
        this.cellSelectionNormalEndCellChange({
          rowKey: normalEndCellData.rowKey,
          colKey: normalEndCellData.colKey,
        })
      }
    },

    // cell selection range data change
    cellSelectionRangeDataChange(newData) {
      this.cellSelectionRangeData = Object.assign(
        this.cellSelectionRangeData,
        newData,
      )
    },

    // autofilling direction change
    autofillingDirectionChange(direction) {
      this.autofillingDirection = direction
    },

    // set current cell selection type
    setCurrentCellSelectionType() {
      const { currentCell, normalEndCell } = this.cellSelectionData

      let result

      if (
        isEmptyValue(currentCell.rowKey) ||
        isEmptyValue(currentCell.colKey)
      ) {
        result = ''
      } else {
        if (
          !isEmptyValue(normalEndCell.rowKey) &&
          !isEmptyValue(normalEndCell.colKey)
        ) {
          result = CURRENT_CELL_SELECTION_TYPES.RANGE
        } else {
          result = CURRENT_CELL_SELECTION_TYPES.SINGLE
        }
      }

      this.currentCellSelectionType = result
    },

    // deal keydown event
    dealKeydownEvent(event) {
      const {
        colgroups,
        cellSelectionData,
        enableStopEditing,
        isCellEditing,
      } = this

      const { keyCode, ctrlKey, shiftKey, altKey } = event

      const { rowKey, colKey } = cellSelectionData.currentCell

      const currentColumn = colgroups.find((x) => x.key === colKey)

      if (!isEmptyValue(rowKey) && !isEmptyValue(colKey)) {
        switch (keyCode) {
        case KEY_CODES.TAB: {
          let direction
          if (shiftKey) {
            direction = CELL_SELECTION_DIRECTION.LEFT
          } else {
            direction = CELL_SELECTION_DIRECTION.RIGHT
          }

          this.selectCellByDirection({
            direction,
          })

          this.clearCellSelectionNormalEndCell()

          this[INSTANCE_METHODS.STOP_EDITING_CELL]()
          event.preventDefault()
          break
        }
        case KEY_CODES.ARROW_LEFT: {
          const direction = CELL_SELECTION_DIRECTION.LEFT
          if (enableStopEditing) {
            this.selectCellByDirection({
              direction,
            })

            this.clearCellSelectionNormalEndCell()

            this[INSTANCE_METHODS.STOP_EDITING_CELL]()
            event.preventDefault()
          }

          break
        }
        case KEY_CODES.ARROW_RIGHT: {
          const direction = CELL_SELECTION_DIRECTION.RIGHT

          if (enableStopEditing) {
            this.selectCellByDirection({
              direction,
            })

            this.clearCellSelectionNormalEndCell()

            this[INSTANCE_METHODS.STOP_EDITING_CELL]()
            event.preventDefault()
          }
          break
        }
        case KEY_CODES.ARROW_UP: {
          const direction = CELL_SELECTION_DIRECTION.UP

          if (enableStopEditing) {
            this.selectCellByDirection({
              direction,
            })

            this.clearCellSelectionNormalEndCell()

            this[INSTANCE_METHODS.STOP_EDITING_CELL]()
            event.preventDefault()
          }
          break
        }
        case KEY_CODES.ARROW_DOWN: {
          const direction = CELL_SELECTION_DIRECTION.DOWN

          if (enableStopEditing) {
            this.selectCellByDirection({
              direction,
            })

            this.clearCellSelectionNormalEndCell()

            this[INSTANCE_METHODS.STOP_EDITING_CELL]()
            event.preventDefault()
          }
          break
        }
        case KEY_CODES.ENTER: {
          let direction
          // add new line
          if (altKey) {
            const editInputEditor =
                this.$refs[this.editInputRef]

            editInputEditor.textareaAddNewLine()
          } else if (shiftKey) { // direction up
            direction = CELL_SELECTION_DIRECTION.UP
            this[INSTANCE_METHODS.STOP_EDITING_CELL]()
          } else if (ctrlKey) { // stop editing and stay in current cell
            this[INSTANCE_METHODS.STOP_EDITING_CELL]()
          } else { // direction down
            direction = CELL_SELECTION_DIRECTION.DOWN
            this[INSTANCE_METHODS.STOP_EDITING_CELL]()
          }

          if (direction) {
            this.clearCellSelectionNormalEndCell()
            this.selectCellByDirection({
              direction,
            })
          }
          event.preventDefault()
          break
        }
        case KEY_CODES.SPACE: {
          if (!isCellEditing) {
            // start editing and enter a space
            this[INSTANCE_METHODS.START_EDITING_CELL]({
              rowKey,
              colKey,
              defaultValue: ' ',
            })
            event.preventDefault()
          }

          break
        }
        case KEY_CODES.BACK_SPACE: {
          if (!isCellEditing) {
            // start editing and clear value
            this[INSTANCE_METHODS.START_EDITING_CELL]({
              rowKey,
              colKey,
              defaultValue: '',
            })
            event.preventDefault()
          }

          break
        }
        case KEY_CODES.DELETE: {
          if (!isCellEditing) {
            // delete cell selection range value
            this.deleteCellSelectionRangeValue()
            event.preventDefault()
          }

          break
        }
        case KEY_CODES.F2: {
          if (!isCellEditing) {
            if (currentColumn.edit) {
              // start editing cell and don't allow stop eidting by direction key
              this.enableStopEditing = false
              this[INSTANCE_METHODS.START_EDITING_CELL]({
                rowKey,
                colKey,
              })
            }
            event.preventDefault()
          }

          break
        }
        default: {
          // enter text directly
          if (isInputKeyCode(event)) {
            this[INSTANCE_METHODS.START_EDITING_CELL]({
              rowKey,
              colKey,
              defaultValue: '',
            })
          }
          break
        }
        }
      }
    },

    // select cell by direction
    selectCellByDirection({ direction }) {
      const { colgroups, allRowKeys, cellSelectionData } = this

      const { rowKey, colKey } = cellSelectionData.currentCell

      const columnIndex = colgroups.findIndex((x) => x.key === colKey)
      const rowIndex = allRowKeys.indexOf(rowKey)

      if (direction === CELL_SELECTION_DIRECTION.LEFT) {
        if (columnIndex > 0) {
          const nextColumn = colgroups[columnIndex - 1]
          this.cellSelectionData.currentCell.colKey = nextColumn.key
          this.columnToVisible(nextColumn)
        }
      } else if (direction === CELL_SELECTION_DIRECTION.RIGHT) {
        if (columnIndex < colgroups.length - 1) {
          const nextColumn = colgroups[columnIndex + 1]
          this.cellSelectionData.currentCell.colKey = nextColumn.key
          this.columnToVisible(nextColumn)
        }
      } else if (direction === CELL_SELECTION_DIRECTION.UP) {
        if (rowIndex > 0) {
          const nextRowKey = allRowKeys[rowIndex - 1]
          this.rowToVisible(KEY_CODES.ARROW_UP, nextRowKey)
        }
      } else if (direction === CELL_SELECTION_DIRECTION.DOWN) {
        if (rowIndex < allRowKeys.length - 1) {
          const nextRowKey = allRowKeys[rowIndex + 1]
          this.rowToVisible(KEY_CODES.ARROW_DOWN, nextRowKey)
        }
      }
    },

    /*
         * @columnToVisible
         * @desc  column to visible
         * @param {object} nextColumn - next column
         */
    columnToVisible(nextColumn) {
      const { hasXScrollBar, colgroups } = this

      if (!hasXScrollBar) {
        return false
      }

      const tableContainerRef = this.$refs[this.tableContainerRef]

      const { scrollWidth, clientWidth, scrollLeft } = tableContainerRef

      if (!nextColumn.fixed) {
        const leftTotalWidth = getNotFixedTotalWidthByColumnKey({
          colgroups,
          colKey: nextColumn.key,
          fixed: COLUMN_FIXED_TYPE.LEFT,
        })

        const rightTotalWidth = getNotFixedTotalWidthByColumnKey({
          colgroups,
          colKey: nextColumn.key,
          fixed: COLUMN_FIXED_TYPE.RIGHT,
        })

        if (scrollLeft) {
          const diff = scrollLeft - leftTotalWidth
          if (diff > 0) {
            tableContainerRef.scrollLeft = scrollLeft - diff
          }
        }

        const scrollRight = scrollWidth - clientWidth - scrollLeft
        if (scrollRight) {
          const diff = scrollRight - rightTotalWidth
          if (diff > 0) {
            tableContainerRef.scrollLeft = scrollLeft + diff
          }
        }
      }
    },

    /*
         * @rowToVisible
         * @desc  row to visible
         * @param {number} keyCode - current keyCode
         * @param {any} nextRowKey - next row key
         */
    rowToVisible(keyCode, nextRowKey) {
      const tableContainerRef = this.$refs[this.tableContainerRef]
      const tableContentWrapperRef =
        this.$refs[this.tableContentWrapperRef].$el

      const { isVirtualScroll, headerTotalHeight, footerTotalHeight } =
        this

      const {
        clientHeight: containerClientHeight,
        scrollTop: containerScrollTop,
      } = tableContainerRef

      const nextRowEl = this.$el.querySelector(
        `tbody tr[${COMPS_CUSTOM_ATTRS.BODY_ROW_KEY}="${nextRowKey}"]`,
      )

      if (nextRowEl) {
        const { offsetTop: trOffsetTop, clientHeight: trClientHeight } =
          nextRowEl

        const parentOffsetTop = tableContentWrapperRef.offsetTop

        // arrow up
        if (keyCode === KEY_CODES.ARROW_UP) {
          let diff = 0
          if (isVirtualScroll) {
            diff =
              headerTotalHeight -
              (trOffsetTop -
                (containerScrollTop - parentOffsetTop))
          } else {
            diff =
              containerScrollTop +
              headerTotalHeight -
              trOffsetTop
          }

          if (diff > 0) {
            tableContainerRef.scrollTop = containerScrollTop - diff
          }
        } else if (keyCode === KEY_CODES.ARROW_DOWN) { // arrow down
          let diff = 0
          if (isVirtualScroll) {
            diff =
              trOffsetTop -
              (containerScrollTop - parentOffsetTop) +
              trClientHeight +
              footerTotalHeight -
              containerClientHeight
          } else {
            diff =
              trOffsetTop +
              trClientHeight +
              footerTotalHeight -
              (containerClientHeight + containerScrollTop)
          }

          if (diff >= 0) {
            tableContainerRef.scrollTop = containerScrollTop + diff
          }
        }
        const { currentCell } = this.cellSelectionData
        this.cellSelectionCurrentCellChange({
          rowKey: nextRowKey,
          colKey: currentCell.colKey,
        })
      }
    },

    // set virtual scroll visible data
    setVirtualScrollVisibleData() {
      const { tableData } = this

      const startIndex = this.virtualScrollStartIndex
      const endIndex = this.virtualScrollEndIndex

      const aboveCount = this.getVirtualScrollAboveCount()
      const belowCount = this.getVirtualScrollBelowCount()

      const start = startIndex - aboveCount
      const end = endIndex + belowCount

      this.virtualScrollVisibleIndexs.start = start
      this.virtualScrollVisibleIndexs.end = end - 1

      this.virtualScrollVisibleData = tableData.slice(start, end)
    },

    // get virtual scroll above count
    getVirtualScrollAboveCount() {
      let result = 0
      const { isVirtualScroll, virtualScrollBufferCount } = this

      const virtualScrollStartIndex = this.virtualScrollStartIndex

      if (isVirtualScroll) {
        result = Math.min(
          virtualScrollStartIndex,
          virtualScrollBufferCount,
        )
      }
      return result
    },

    // get virtual scroll bellow count
    getVirtualScrollBelowCount() {
      let result = 0

      const { isVirtualScroll, tableData, virtualScrollBufferCount } =
        this

      const virtualScrollEndIndex = this.virtualScrollEndIndex

      if (isVirtualScroll) {
        result = Math.min(
          tableData.length - virtualScrollEndIndex,
          virtualScrollBufferCount,
        )
      }

      return result
    },

    // get virtual phantom
    getVirtualViewPhantom() {
      let content = null

      /*
            1、is virtualScroll
            or
            2、
            has left fixed column and expand option（resolve expand row content sticky）
            */
      const { isVirtualScroll, hasLeftFixedColumn, expandOption } = this

      if (isVirtualScroll || (hasLeftFixedColumn && expandOption)) {
        const props = {
          props: {
            tagName: 'div',
          },
          style: {
            width: '100%',
          },
          on: {
            'on-dom-resize-change': ({ width }) => {
              this.tableViewportWidth = width
            },
          },
        }

        content = (
          <div
            ref={this.virtualPhantomRef}
            class={[
              clsName('virtual-phantom'),
              isVirtualScroll ? clsName('virtual-scroll') : '',
            ]}
          >
            <VueDomResizeObserver {...props} />
          </div>
        )
      }

      return content
    },

    // init virtual scroll positions
    initVirtualScrollPositions() {
      if (this.isVirtualScroll) {
        const {
          virtualScrollOption,
          rowKeyFieldName,
          tableData,
          defaultVirtualScrollMinRowHeight,
        } = this

        const minRowHeight = isNumber(virtualScrollOption.minRowHeight)
          ? virtualScrollOption.minRowHeight
          : defaultVirtualScrollMinRowHeight

        this.virtualScrollPositions = tableData.map((item, index) => ({
          rowKey: item[rowKeyFieldName],
          height: minRowHeight,
          top: index * minRowHeight,
          bottom: (index + 1) * minRowHeight,
        }))
      }
    },

    // list item height change
    bodyRowHeightChange({ rowKey, height }) {
      // 获取真实元素大小，修改对应的尺寸缓存
      const index = this.virtualScrollPositions.findIndex(
        (x) => x.rowKey === rowKey,
      )

      const oldHeight = this.virtualScrollPositions[index].height
      const dValue = oldHeight - height
      // 存在差值
      if (dValue) {
        this.virtualScrollPositions[index].bottom =
          this.virtualScrollPositions[index].bottom - dValue
        this.virtualScrollPositions[index].height = height
        for (
          let k = index + 1;
          k < this.virtualScrollPositions.length;
          k++
        ) {
          this.virtualScrollPositions[k].top =
            this.virtualScrollPositions[k - 1].bottom
          this.virtualScrollPositions[k].bottom =
            this.virtualScrollPositions[k].bottom - dValue
        }

        // 更新 virtual phantom 列表总高度
        this.setVirtualPhantomHeight()

        // 更新真实偏移量
        this.setVirtualScrollStartOffset()
      }
    },
    // update virtual phantom list height
    setVirtualPhantomHeight() {
      let totalHeight = 0
      if (this.virtualScrollPositions.length) {
        totalHeight =
          this.virtualScrollPositions[
            this.virtualScrollPositions.length - 1
          ].bottom
      }

      this.$refs[this.virtualPhantomRef].style.height =
        totalHeight + 'px'
    },
    // set virtual scroll start offset
    setVirtualScrollStartOffset() {
      const start = this.virtualScrollStartIndex

      const aboveCount = this.getVirtualScrollAboveCount()

      let startOffset = 0

      if (start >= 1) {
        const size =
          this.virtualScrollPositions[start].top -
          (this.virtualScrollPositions[start - aboveCount]
            ? this.virtualScrollPositions[start - aboveCount].top
            : 0)
        startOffset =
          this.virtualScrollPositions[start - 1].bottom - size
      }

      this.setTableContentTopValue({ top: startOffset })
    },
    // set table content top value
    setTableContentTopValue({ top }) {
      // this.$refs[this.tableContentWrapperRef].style.transform = `translate3d(0,${startOffset}px,0)`;
      window.requestAnimationFrame(() => {
        const ele = this.$refs[this.tableContentWrapperRef]
        if (ele) {
          ele.$el.style.top = `${top}px`
        }
      })
    },
    // get virtual scroll start index
    getVirtualScrollStartIndex(scrollTop = 0) {
      return this.virtualScrollBinarySearch(
        this.virtualScrollPositions,
        scrollTop,
      )
    },
    // virtual scroll binary search
    virtualScrollBinarySearch(list, value) {
      let start = 0
      let end = list.length - 1
      let tempIndex = null

      while (start <= end) {
        const midIndex = parseInt((start + end) / 2)
        const midValue = list[midIndex].bottom
        if (midValue === value) {
          return midIndex + 1
        } else if (midValue < value) {
          start = midIndex + 1
        } else if (midValue > value) {
          if (tempIndex === null || tempIndex > midIndex) {
            tempIndex = midIndex
          }
          end = end - 1
        }
      }
      return tempIndex
    },
    // table container virtual scroll handler
    tableContainerVirtualScrollHandler(tableContainerRef) {
      const {
        virtualScrollVisibleCount: visibleCount,
        virtualScrollOption,
      } = this

      // 当前滚动位置
      const scrollTop = tableContainerRef.scrollTop

      // 此时的开始索引
      const visibleStartIndex = this.getVirtualScrollStartIndex(scrollTop)
      this.virtualScrollStartIndex = visibleStartIndex

      // 此时的结束索引
      const visibleEndIndex = visibleStartIndex + visibleCount
      this.virtualScrollEndIndex = visibleEndIndex

      const visibleAboveCount = this.getVirtualScrollAboveCount()
      const visibleBelowCount = this.getVirtualScrollBelowCount()

      // 此时的偏移量
      this.setVirtualScrollStartOffset()

      if (!this.showVirtualScrollingPlaceholder) {
        const bodyElement = this.$refs[this.tableBodyRef]

        if (bodyElement) {
          bodyElement.renderingRowKeys(
            this.allRowKeys.slice(
              visibleStartIndex - visibleAboveCount,
              visibleEndIndex + visibleBelowCount,
            ),
          )
        }
      }

      const { scrolling } = virtualScrollOption
      if (isFunction(scrolling)) {
        const visibleAboveCount = this.getVirtualScrollAboveCount()
        const visibleBelowCount = this.getVirtualScrollBelowCount()

        const startRowIndex = visibleStartIndex - visibleAboveCount

        scrolling({
          startRowIndex: startRowIndex > 0 ? startRowIndex : 0,
          visibleStartIndex,
          visibleEndIndex,
          visibleAboveCount,
          visibleBelowCount,
        })
      }

      this.setVirtualScrollVisibleData()
    },
    // debounce scroll ended
    debounceScrollEnded() {
      const scrollingResetTimeInterval = 150

      const { disablePointerEventsTimeoutId } = this

      if (disablePointerEventsTimeoutId) {
        cancelAnimationTimeout(disablePointerEventsTimeoutId)
      }

      this.disablePointerEventsTimeoutId = requestAnimationTimeout(
        this.debounceScrollEndedCallback,
        scrollingResetTimeInterval,
      )
    },
    // debounce scroll callback
    debounceScrollEndedCallback() {
      this.disablePointerEventsTimeoutId = null
      this.showVirtualScrollingPlaceholder = false
    },
    // init virtual scroll
    initVirtualScroll() {
      if (this.isVirtualScroll) {
        const startIndex = 0

        this.virtualScrollStartIndex = startIndex
        this.virtualScrollEndIndex =
          startIndex + this.virtualScrollVisibleCount

        // 修复渲染结束，同时开启虚拟滚动和设置表格数据，无法设置 virtual phantom 高度的问题
        this.$nextTick(() => {
          const tableContainerRef =
            this.$refs[this.tableContainerRef]
          this.tableContainerVirtualScrollHandler(tableContainerRef)
          this.setVirtualPhantomHeight()
        })
      }
    },

    // set scrolling
    setScrolling(tableContainerRef) {
      if (this.hasFixedColumn) {
        const { scrollWidth, clientWidth, scrollLeft } =
          tableContainerRef

        const { previewTableContainerScrollLeft: previewScrollLeft } =
          this

        // 仅横向滚动需要处理
        if (
          previewScrollLeft === 0 ||
          previewScrollLeft !== scrollLeft
        ) {
          this.previewTableContainerScrollLeft = scrollLeft

          this.isLeftScrolling = scrollLeft > 0
          this.isRightScrolling =
            scrollWidth - clientWidth > scrollLeft
        }
        this.isLeftScrolling = scrollLeft > 0
        this.isRightScrolling = scrollWidth - clientWidth > scrollLeft
      }

      if (this.fixedHeader) {
        const { scrollTop } = tableContainerRef
        this.isVerticalScrolling = scrollTop > 0
      }
    },

    // set scroll bar status
    setScrollBarStatus() {
      const tableContainerRef = this.$refs[this.tableContainerRef]
      if (tableContainerRef) {
        const { scrollWidth, clientWidth, scrollHeight, clientHeight } =
          tableContainerRef

        if (scrollWidth && clientWidth) {
          this.hasXScrollBar =
            !!(scrollWidth - clientWidth)
        }

        if (scrollHeight && clientHeight) {
          this.hasYScrollBar =
            !!(scrollHeight - clientHeight)
        }
      }
    },

    // init scrolling
    initScrolling() {
      this.setScrolling(this.$refs[this.tableContainerRef])
    },

    // table click outside
    tableClickOutside(e) {
      // exclude contextmenu panel clicked
      if (isContextmenuPanelClicked(e)) {
        return false
      }

      this.isHeaderCellMousedown = false
      this.isBodyCellMousedown = false
      this.isBodyOperationColumnMousedown = false
      this.isAutofillStarting = false
      this.setIsColumnResizing(false)

      // clear cell selection
      this.clearCellSelectionCurrentCell()
      this.clearCellSelectionNormalEndCell()

      // clear indicators
      this.clearHeaderIndicatorColKeys()
      this.clearBodyIndicatorRowKeys()

      // stop editing cell
      this[INSTANCE_METHODS.STOP_EDITING_CELL]()
    },

    // save cell when stop editing
    saveCellWhenStopEditing() {
      const {
        colgroups,
        rowKeyFieldName,
        editOption,
        editingCell,
        isCellEditing,
      } = this

      const {
        cellValueChange,
        beforeCellValueChange,
        afterCellValueChange,
      } = editOption

      if (isCellEditing) {
        const { rowKey, colKey } = editingCell

        const currentRow = this.tableData.find(
          (x) => x[rowKeyFieldName] === rowKey,
        )

        if (currentRow) {
          const currentColumn = colgroups.find(
            (x) => x.key === colKey,
          )

          const changeValue = editingCell.row[currentColumn.field]

          if (isFunction(beforeCellValueChange)) {
            const allowChange = beforeCellValueChange({
              row: cloneDeep(currentRow),
              column: currentColumn,
              changeValue,
            })
            if (isBoolean(allowChange) && !allowChange) {
              // celar editing cell
              this.clearEditingCell()
              return false
            }
          }

          currentRow[currentColumn.field] = changeValue

          // 同 afterCellValueChange，未来被移除
          cellValueChange &&
            cellValueChange({
              row: currentRow,
              column: currentColumn,
              changeValue,
            })

          afterCellValueChange &&
            afterCellValueChange({
              row: currentRow,
              column: currentColumn,
              changeValue,
            })

          // celar editing cell
          this.clearEditingCell()
        }

        // reset status
        this.enableStopEditing = true
      }
    },

    // cell selection by click
    cellSelectionByClick({ rowData, column }) {
      const { rowKeyFieldName } = this

      const rowKey = getRowKey(rowData, rowKeyFieldName)

      // set cell selection and column to visible
      this[INSTANCE_METHODS.SET_CELL_SELECTION]({
        rowKey,
        colKey: column.key,
        isScrollToRow: false,
      })
      // row to visible
      this.rowToVisible(KEY_CODES.ARROW_UP, rowKey)
      this.rowToVisible(KEY_CODES.ARROW_DOWN, rowKey)
    },

    /*
         * @bodyCellContextmenu
         * @desc  recieve td right click\contextmenu event
         * @param {object} rowData - row data
         * @param {object} column - column data
         */
    bodyCellContextmenu({ event, rowData, column }) {
      const { editOption, rowKeyFieldName } = this

      if (editOption) {
        const rowKey = getRowKey(rowData, rowKeyFieldName)
        this.editCellByClick({
          isDblclick: false,
          rowKey,
          colKey: column.key,
        })
      }

      this.setContextmenuOptions(column)
    },

    /*
         * @bodyCellDoubleClick
         * @desc  recieve td double click event
         * @param {object} rowData - row data
         * @param {object} column - column data
         */
    bodyCellDoubleClick({ event, rowData, column }) {
      const { editOption, rowKeyFieldName, colgroups } = this

      if (isOperationColumn(column.key, colgroups)) {
        // clear cell selection
        this.clearCellSelectionCurrentCell()
        this.clearCellSelectionNormalEndCell()

        // stop editing cell
        this[INSTANCE_METHODS.STOP_EDITING_CELL]()
        return false
      }

      if (editOption) {
        const rowKey = getRowKey(rowData, rowKeyFieldName)
        this.editCellByClick({
          isDblclick: true,
          rowKey,
          colKey: column.key,
        })
      }
    },

    /*
         * @bodyCellClick
         * @desc  recieve td click event
         * @param {object} rowData - row data
         * @param {object} column - column data
         */
    bodyCellClick({ event, rowData, column }) {
      // feature...
    },

    /*
         * @bodyCellMousedown
         * @desc  recieve td mousedown event
         * @param {object} rowData - row data
         * @param {object} column - column data
         */
    bodyCellMousedown({ event, rowData, column }) {
      if (!this.enableCellSelection) {
        return false
      }

      const { shiftKey } = event

      const {
        editOption,
        rowKeyFieldName,
        colgroups,
        cellSelectionData,
        cellSelectionRangeData,
        allRowKeys,
      } = this

      const rowKey = getRowKey(rowData, rowKeyFieldName)
      const colKey = column.key

      const { currentCell } = cellSelectionData

      const mouseEventClickType = getMouseEventClickType(event)

      if (isOperationColumn(colKey, colgroups)) {
        // clear header indicator colKeys
        this.clearHeaderIndicatorColKeys()

        const { bodyIndicatorRowKeys } = this
        this.isBodyOperationColumnMousedown = true

        const {
          startRowKey,
          endRowKey,
          startRowKeyIndex,
          endRowKeyIndex,
        } = bodyIndicatorRowKeys
        let newStartRowKey = startRowKey
        let newEndRowKey = endRowKey

        if (
          shiftKey &&
          (startRowKeyIndex > -1 || currentCell.rowIndex > -1)
        ) {
          newStartRowKey = isEmptyValue(currentCell.rowKey)
            ? startRowKey
            : currentCell.rowKey
          newEndRowKey = rowKey
        } else {
          const currentRowIndex = allRowKeys.indexOf(rowKey)

          // 左键点击 || 不在当前选择行内
          if (
            mouseEventClickType ===
            MOUSE_EVENT_CLICK_TYPE.LEFT_MOUSE ||
            currentRowIndex < startRowKeyIndex ||
            currentRowIndex > endRowKeyIndex
          ) {
            newStartRowKey = rowKey
            newEndRowKey = rowKey
          }
        }

        this.bodyIndicatorRowKeysChange({
          startRowKey: newStartRowKey,
          endRowKey: newEndRowKey,
        })
      } else {
        // body cell mousedown
        this.isBodyCellMousedown = true

        const isClearByRightClick =
          isClearSelectionByBodyCellRightClick({
            mouseEventClickType,
            cellData: {
              rowKey,
              colKey,
            },
            cellSelectionData,
            cellSelectionRangeData,
            colgroups,
            allRowKeys,
          })

        if (isClearByRightClick) {
          // clear header indicator colKeys
          this.clearHeaderIndicatorColKeys()
          // clear body indicator colKeys
          this.clearBodyIndicatorRowKeys()

          if (shiftKey && currentCell.rowIndex > -1) {
            this.cellSelectionNormalEndCellChange({
              rowKey,
              colKey,
            })
          } else {
            // cell selection by click
            this.cellSelectionByClick({ rowData, column })
            this.clearCellSelectionNormalEndCell()
          }
        }
      }

      if (editOption) {
        this.editCellByClick({
          isDblclick: false,
          rowKey,
          colKey,
        })
      }
    },

    /*
         * @bodyCellMouseover
         * @desc  recieve td mouseover event
         * @param {object} rowData - row data
         * @param {object} column - column data
         */
    bodyCellMouseover({ event, rowData, column }) {
      const {
        rowKeyFieldName,
        isBodyCellMousedown,
        isAutofillStarting,
        isHeaderCellMousedown,
        isBodyOperationColumnMousedown,
      } = this

      const rowKey = getRowKey(rowData, rowKeyFieldName)
      const colKey = column.key

      if (isBodyCellMousedown) {
        // 操作列不能单元格选中
        if (isOperationColumn(colKey, this.colgroups)) {
          return false
        }
        this.cellSelectionNormalEndCellChange({
          rowKey,
          colKey,
        })
      }

      if (isBodyOperationColumnMousedown) {
        this.bodyIndicatorRowKeysChange({
          startRowKey: this.bodyIndicatorRowKeys.startRowKey,
          endRowKey: rowKey,
        })
      }

      // 允许在body cell mouseover 里补充 header indicator 信息
      if (isHeaderCellMousedown) {
        this.headerIndicatorColKeysChange({
          startColKey: this.headerIndicatorColKeys.startColKey,
          endColKey: colKey,
        })
      }

      if (isAutofillStarting) {
        // 操作列不能autofilling 效果
        if (isOperationColumn(colKey, this.colgroups)) {
          return false
        }
        this.cellSelectionAutofillCellChange({
          rowKey,
          colKey,
        })
      }
    },

    /*
         * @bodyCellMousemove
         * @desc  recieve td mousemove event
         * @param {object} rowData - row data
         * @param {object} column - column data
         */
    bodyCellMousemove({ event, rowData, column }) {
      this.hooks.triggerHook(HOOKS_NAME.BODY_CELL_MOUSEMOVE, {
        event,
        column,
      })
    },

    /*
         * @bodyCellMouseup
         * @desc  recieve td mouseup event
         * @param {object} rowData - row data
         * @param {object} column - column data
         */
    bodyCellMouseup({ event, rowData, column }) {
      // feature...
    },

    // header cell click
    headerCellClick({ event, column }) {
      // feature...
    },

    // header cell contextmenu
    headerCellContextmenu({ event, column }) {
      this.setContextmenuOptions(column)
    },

    // set contextmenu options
    setContextmenuOptions(column) {
      const { contextMenuType } = this

      // header contextmenu
      if (contextMenuType === CONTEXTMENU_TYPES.HEADER_CONTEXTMENU) {
        // set header contextmenu options before contextmen show
        this.contextmenuOptions = setHeaderContextmenuOptions({
          column,
          contextmenuHeaderOption: this.contextmenuHeaderOption,
          cellSelectionRangeData: this.cellSelectionRangeData,
          colgroups: this.colgroups,
          allRowKeys: this.allRowKeys,
          headerIndicatorColKeys: this.headerIndicatorColKeys,
          enableHeaderContextmenu: this.enableHeaderContextmenu,
          t,
        })
      } else { // body contextmenu
        // set body contextmenu options before contextmen show
        this.contextmenuOptions = setBodyContextmenuOptions({
          enableBodyContextmenu: this.enableBodyContextmenu,
          contextmenuBodyOption: this.contextmenuBodyOption,
          cellSelectionRangeData: this.cellSelectionRangeData,
          colgroups: this.colgroups,
          allRowKeys: this.allRowKeys,
          bodyIndicatorRowKeys: this.bodyIndicatorRowKeys,
          t,
        })
      }
    },

    // header cell mousedown
    headerCellMousedown({ event, column }) {
      if (!this.enableCellSelection) {
        return false
      }

      this.isHeaderCellMousedown = true

      const { shiftKey } = event

      const {
        isGroupHeader,
        colgroups,
        headerIndicatorColKeys,
        cellSelectionData,
      } = this

      // clear body indicator colKeys
      this.clearBodyIndicatorRowKeys()

      let colKeys
      if (isGroupHeader) {
        colKeys = getColKeysByHeaderColumn({
          headerColumnItem: column,
        })
      } else {
        colKeys = [column.key]
      }

      const currentCellStartColKey = colKeys[0]
      const currentCellEndColKey = colKeys[colKeys.length - 1]

      const { currentCell } = cellSelectionData

      if (isOperationColumn(column.key, colgroups)) {
        // clear cell selection
        this.clearCellSelectionCurrentCell()
        this.clearCellSelectionNormalEndCell()
        this.$nextTick(() => {
          // select all cell
          this[INSTANCE_METHODS.SET_ALL_CELL_SELECTION]()
        })
        return false
      }

      // 需要先将之前选中单元格元素清空
      if (isEmptyValue(headerIndicatorColKeys.startColKey)) {
        // 值的比较（currentCell.colKey 会变化）
        if (
          JSON.stringify(colKeys) !==
          JSON.stringify([currentCell.colKey])
        ) {
          this.$refs[this.cellSelectionRef].clearCurrentCellRect()
        }
        this.$refs[this.cellSelectionRef].clearNormalEndCellRect()
      }

      const { startColKey, endColKey, startColKeyIndex, endColKeyIndex } =
        headerIndicatorColKeys

      let newStartColKey = startColKey
      let newEndColKey = endColKey
      if (shiftKey) {
        if (isEmptyValue(startColKey)) {
          if (!isEmptyValue(currentCell.colKey)) {
            const leftColKey = getLeftmostColKey({
              colgroups,
              colKeys: colKeys.concat([currentCell.colKey]),
            })

            newStartColKey = currentCell.colKey
            if (leftColKey === currentCell.colKey) {
              newEndColKey = currentCellEndColKey
            } else {
              newEndColKey = currentCellStartColKey
            }
          } else {
            newStartColKey = currentCellStartColKey
            newEndColKey = currentCellEndColKey
          }
        } else {
          newStartColKey = startColKey
          const leftColKey = getLeftmostColKey({
            colgroups,
            colKeys: colKeys.concat([startColKey]),
          })

          if (leftColKey === startColKey) {
            newEndColKey = currentCellEndColKey
          } else {
            newEndColKey = currentCellStartColKey
          }
        }
      } else {
        const mouseEventClickType = getMouseEventClickType(event)
        const currentCellStartColIndex = colgroups.findIndex(
          (x) => x.key === currentCellEndColKey,
        )
        const currentCellEndColIndex = colgroups.findIndex(
          (x) => x.key === currentCellStartColKey,
        )
        // 左键点击 || 不在当前选择列内
        if (
          mouseEventClickType === MOUSE_EVENT_CLICK_TYPE.LEFT_MOUSE ||
          currentCellStartColIndex < startColKeyIndex ||
          currentCellEndColIndex < startColKeyIndex ||
          currentCellStartColIndex > endColKeyIndex ||
          currentCellEndColIndex > endColKeyIndex
        ) {
          newStartColKey = currentCellStartColKey
          newEndColKey = currentCellEndColKey
        }
      }

      this.headerIndicatorColKeysChange({
        startColKey: newStartColKey,
        endColKey: newEndColKey,
      })
    },

    // header cell mouseover
    headerCellMouseover({ event, column }) {
      const {
        colgroups,
        isGroupHeader,
        isHeaderCellMousedown,
        headerIndicatorColKeys,
      } = this

      if (
        isHeaderCellMousedown &&
        !isOperationColumn(column.key, colgroups)
      ) {
        let colKeys
        if (isGroupHeader) {
          colKeys = getColKeysByHeaderColumn({
            headerColumnItem: column,
          })
        } else {
          colKeys = [column.key]
        }

        const leftColKey = getLeftmostColKey({
          colgroups,
          colKeys: colKeys.concat([
            headerIndicatorColKeys.startColKey,
          ]),
        })

        let endColKey
        if (leftColKey === headerIndicatorColKeys.startColKey) {
          endColKey = colKeys[colKeys.length - 1]
        } else {
          endColKey = colKeys[0]
        }
        this.headerIndicatorColKeysChange({
          startColKey: this.headerIndicatorColKeys.startColKey,
          endColKey,
        })
      }
    },

    // header cell mousemove
    headerCellMousemove({ event, column }) {
      this.hooks.triggerHook(HOOKS_NAME.HEADER_CELL_MOUSEMOVE, {
        event,
        column,
      })
    },

    // header cell mouseleave
    headerCellMouseleave({ event, column }) {
      // todo
    },

    // header mouseleave
    headerMouseleave(event) {
      this.setIsColumnResizerHover(false)
    },

    // table container mouseup
    tableContainerMouseup() {
      this.isHeaderCellMousedown = false
      this.isBodyCellMousedown = false
      this.isBodyOperationColumnMousedown = false
      this.isAutofillStarting = false
    },

    /*
         * @cellSelectionCornerMousedown
         * @desc  recieve cell selection corner mousedown
         */
    cellSelectionCornerMousedown({ event }) {
      this.isAutofillStarting = true
    },

    /*
         * @cellSelectionCornerMouseup
         * @desc  recieve cell selection corner mouseup
         */
    cellSelectionCornerMouseup({ event }) {
      this.isAutofillStarting = false
    },

    // is edit column
    isEditColumn(colKey) {
      return this.colgroups.some((x) => x.key === colKey && x.edit)
    },

    /*
         * @editCellByClick
         * @desc  recieve td click event
         * @param {boolean} isDblclick - is dblclick
         */
    editCellByClick({ isDblclick, rowKey, colKey }) {
      const {
        editOption,
        isCellEditing,
        hasEditColumn,
        editingCell,
        isEditColumn,
      } = this

      if (!editOption) {
        return false
      }

      // has edit column
      if (!hasEditColumn) {
        return false
      }

      if (isEmptyValue(rowKey) || isEmptyValue(colKey)) {
        return false
      }
      if (
        editingCell &&
        editingCell.rowKey === rowKey &&
        editingCell.colKey === colKey
      ) {
        return false
      }
      if (isCellEditing) {
        this[INSTANCE_METHODS.STOP_EDITING_CELL]()
      }

      if (isDblclick && isEditColumn(colKey)) {
        this.enableStopEditing = false

        this[INSTANCE_METHODS.START_EDITING_CELL]({
          rowKey,
          colKey,
        })
      } else {
        this.enableStopEditing = true
      }
    },

    /*
         * @setEditingCell
         * @desc  add editing cells
         * @param {object} rowKey - row key
         * @param {object} colKey - col key
         * @param {object} column - column
         * @param {object} row - row data
         */
    setEditingCell({ rowKey, colKey, column, row }) {
      this.editingCell = {
        rowKey,
        row: cloneDeep(row),
        colKey,
        column,
      }
    },

    // update editing cell value
    updateEditingCellValue(value) {
      const { editingCell } = this
      const { row, column } = editingCell
      row[column.field] = value
      this.editingCell.row = row
    },

    /*
         * @clearEditingCell
         * @desc clear editing cell
         */
    clearEditingCell() {
      this.editingCell = {
        rowKey: '',
        colKey: '',
        row: null,
        column: null,
      }
    },

    // contextmenu item click
    contextmenuItemClick(type) {
      // header contextmenu
      if (this.contextMenuType === CONTEXTMENU_TYPES.HEADER_CONTEXTMENU) {
        this.headerContextmenuItemClick(type)
      } else { // body contextmenu
        this.bodyContextmenuItemClick(type)
      }
    },

    // header contextmenu item click
    headerContextmenuItemClick(type) {
      const {
        contextmenuHeaderOption,
        cellSelectionData,
        cellSelectionRangeData,
        allRowKeys,
        colgroups,
        enableColumnResize,
      } = this

      const { rowKey, colKey } = cellSelectionData.currentCell
      const { afterMenuClick } = contextmenuHeaderOption

      if (!isEmptyValue(rowKey) && !isEmptyValue(colKey)) {
        const selectionRangeKeys = getSelectionRangeKeys({
          cellSelectionRangeData,
        })

        const selectionRangeIndexes = getSelectionRangeIndexes({
          cellSelectionRangeData,
          colgroups,
          allRowKeys,
        })

        if (isFunction(afterMenuClick)) {
          const callback = afterMenuClick({
            type,
            selectionRangeKeys,
            selectionRangeIndexes,
          })
          if (isBoolean(callback) && !callback) {
            return false
          }
        }
        const editInputEditor = this.$refs[this.editInputRef]

        // cut
        if (CONTEXTMENU_NODE_TYPES.CUT === type) {
          editInputEditor.textareaSelect()
          document.execCommand('cut')
        } else if (CONTEXTMENU_NODE_TYPES.COPY === type) {
          editInputEditor.textareaSelect()
          document.execCommand('copy')
        } else if (CONTEXTMENU_NODE_TYPES.EMPTY_COLUMN === type) { // empty column
          this.deleteCellSelectionRangeValue()
        } else if (CONTEXTMENU_NODE_TYPES.LEFT_FIXED_COLUMN_TO === type) { // left fixed column to
          this.cloneColumns = setColumnFixed({
            cloneColumns: this.cloneColumns,
            cellSelectionRangeData,
            fixedType: COLUMN_FIXED_TYPE.LEFT,
            colgroups,
            enableColumnResize,
          })
        } else if ( // cancel left fixed column to
          CONTEXTMENU_NODE_TYPES.CANCEL_LEFT_FIXED_COLUMN_TO === type
        ) {
          this.cloneColumns = cancelColumnFixed({
            cloneColumns: this.cloneColumns,
            colgroups,
            fixedType: COLUMN_FIXED_TYPE.LEFT,
            enableColumnResize,
          })
        } else if ( // right fixed column to
          CONTEXTMENU_NODE_TYPES.RIGHT_FIXED_COLUMN_TO === type
        ) {
          this.cloneColumns = setColumnFixed({
            cloneColumns: this.cloneColumns,
            cellSelectionRangeData,
            fixedType: COLUMN_FIXED_TYPE.RIGHT,
            colgroups,
            enableColumnResize,
          })
        } else if ( // cancel right fixed column to
          CONTEXTMENU_NODE_TYPES.CANCEL_RIGHT_FIXED_COLUMN_TO === type
        ) {
          this.cloneColumns = cancelColumnFixed({
            cloneColumns: this.cloneColumns,
            colgroups,
            fixedType: COLUMN_FIXED_TYPE.RIGHT,
            enableColumnResize,
          })
        }
      }
    },

    // body contextmenu item click
    bodyContextmenuItemClick(type) {
      const {
        contextmenuBodyOption,
        cellSelectionData,
        cellSelectionRangeData,
        tableData,
        allRowKeys,
        colgroups,
        rowKeyFieldName,
      } = this

      const { rowKey, colKey } = cellSelectionData.currentCell
      const { afterMenuClick } = contextmenuBodyOption

      if (!isEmptyValue(rowKey) && !isEmptyValue(colKey)) {
        const selectionRangeKeys = getSelectionRangeKeys({
          cellSelectionRangeData,
        })

        const selectionRangeIndexes = getSelectionRangeIndexes({
          cellSelectionRangeData,
          colgroups,
          allRowKeys,
        })

        if (isFunction(afterMenuClick)) {
          const callback = afterMenuClick({
            type,
            selectionRangeKeys,
            selectionRangeIndexes,
          })
          if (isBoolean(callback) && !callback) {
            return false
          }
        }

        const { startRowIndex, endRowIndex } = selectionRangeIndexes

        const currentRowIndex = allRowKeys.findIndex(
          (x) => x === rowKey,
        )

        const editInputEditor = this.$refs[this.editInputRef]

        // cut
        if (CONTEXTMENU_NODE_TYPES.CUT === type) {
          editInputEditor.textareaSelect()
          document.execCommand('cut')
        } else if (CONTEXTMENU_NODE_TYPES.COPY === type) { // copy
          editInputEditor.textareaSelect()
          document.execCommand('copy')
        } else if (CONTEXTMENU_NODE_TYPES.REMOVE_ROW === type) {
        // paste todo
        // else if (CONTEXTMENU_NODE_TYPES.PASTE === type) {
        //     editInputEditor.textareaSelect();
        //     document.execCommand("paste", null, null);
        // }
        // remove rows
          tableData.splice(
            startRowIndex,
            endRowIndex - startRowIndex + 1,
          )
        } else if (CONTEXTMENU_NODE_TYPES.EMPTY_ROW === type) { // empty rows
          this.deleteCellSelectionRangeValue()
        } else if (CONTEXTMENU_NODE_TYPES.EMPTY_CELL === type) { // empty rows
          this.deleteCellSelectionRangeValue()
        } else if (CONTEXTMENU_NODE_TYPES.INSERT_ROW_ABOVE === type) { // insert row above
          tableData.splice(
            currentRowIndex,
            0,
            createEmptyRowData({ colgroups, rowKeyFieldName }),
          )
        } else if (CONTEXTMENU_NODE_TYPES.INSERT_ROW_BELOW === type) { // insert row below
          tableData.splice(
            currentRowIndex + 1,
            0,
            createEmptyRowData({ colgroups, rowKeyFieldName }),
          )
        }
      }
    },

    // editor copy
    editorCopy(event) {
      const {
        isCellEditing,
        enableClipboard,
        clipboardOption,
        cellSelectionRangeData,
        tableData,
        colgroups,
        allRowKeys,
      } = this

      if (!enableClipboard) {
        return false
      }

      // 正在编辑的单元格不进行自定义复制功能
      if (isCellEditing) {
        return false
      }

      const {
        copy,
        beforeCopy: beforeCopyCallback,
        afterCopy: afterCopyCallback,
      } = clipboardOption || {}

      if (isBoolean(copy) && !copy) {
        return false
      }

      event.preventDefault()

      const selectionRangeData = getSelectionRangeData({
        cellSelectionRangeData,
        resultType: 'flat',
        tableData,
        colgroups,
        allRowKeys,
      })

      const response = onBeforeCopy({
        cellSelectionRangeData,
        selectionRangeData,
        colgroups,
        allRowKeys,
      })

      if (isFunction(beforeCopyCallback)) {
        const allowCoping = beforeCopyCallback(response)
        if (isBoolean(allowCoping) && !allowCoping) {
          return false
        }
      }

      onAfterCopy({ event, selectionRangeData })

      if (isFunction(afterCopyCallback)) {
        afterCopyCallback(response)
      }
    },

    // editor paste
    editorPaste(event) {
      const { isCellEditing, enableClipboard, clipboardOption } = this

      if (!enableClipboard) {
        return false
      }

      // 正在编辑的单元格不进行自定义粘贴功能
      if (isCellEditing) {
        return false
      }

      const {
        paste,
        beforePaste: beforePasteCallback,
        afterPaste: afterPasteCallback,
      } = clipboardOption || {}

      if (isBoolean(paste) && !paste) {
        return false
      }

      event.preventDefault()

      const response = onBeforePaste({
        event,
        cellSelectionRangeData: this.cellSelectionRangeData,
        colgroups: this.colgroups,
        allRowKeys: this.allRowKeys,
        rowKeyFieldName: this.rowKeyFieldName,
      })

      if (
        response &&
        Array.isArray(response.data) &&
        response.data.length
      ) {
        if (isFunction(beforePasteCallback)) {
          const allowPasting = beforePasteCallback(response)
          if (isBoolean(allowPasting) && !allowPasting) {
            return false
          }
        }
        // change table cell data
        onAfterPaste({
          tableData: this.tableData,
          beforePasteResponse: response,
        })

        if (isFunction(afterPasteCallback)) {
          afterPasteCallback(response)
        }

        const { startColKey, endColKey, startRowKey, endRowKey } =
          response.selectionRangeKeys

        this.cellSelectionCurrentCellChange({
          rowKey: startRowKey,
          colKey: startColKey,
        })

        this.cellSelectionNormalEndCellChange({
          rowKey: endRowKey,
          colKey: endColKey,
        })

        // clipboard cell value change
        this.hooks.triggerHook(HOOKS_NAME.CLIPBOARD_CELL_VALUE_CHANGE)
      }
    },

    // editor cut
    editorCut(event) {
      const {
        isCellEditing,
        enableClipboard,
        clipboardOption,
        cellSelectionRangeData,
        tableData,
        colgroups,
        allRowKeys,
      } = this

      if (!enableClipboard) {
        return false
      }

      // 正在编辑的单元格不进行自定义剪切功能
      if (isCellEditing) {
        return false
      }

      const {
        cut,
        beforeCut: beforeCutCallback,
        afterCut: afterCutCallback,
      } = clipboardOption || {}

      if (isBoolean(cut) && !cut) {
        return false
      }

      event.preventDefault()

      const selectionRangeData = getSelectionRangeData({
        cellSelectionRangeData,
        resultType: 'flat',
        tableData,
        colgroups,
        allRowKeys,
      })

      const response = onBeforeCut({
        cellSelectionRangeData,
        selectionRangeData,
        colgroups,
        allRowKeys,
      })

      if (isFunction(beforeCutCallback)) {
        const allowCuting = beforeCutCallback(response)
        if (isBoolean(allowCuting) && !allowCuting) {
          return false
        }
      }

      onAfterCut({
        event,
        tableData,
        colgroups,
        selectionRangeData,
        selectionRangeIndexes: response.selectionRangeIndexes,
      })

      if (isFunction(afterCutCallback)) {
        afterCutCallback(response)
      }
    },

    // delete selection cell value
    deleteCellSelectionRangeValue() {
      const {
        isCellEditing,
        enableClipboard,
        clipboardOption,
        cellSelectionRangeData,
        tableData,
        colgroups,
        allRowKeys,
      } = this

      if (!enableClipboard) {
        return false
      }

      // 正在编辑的单元格不进行删除区域单元格功能
      if (isCellEditing) {
        return false
      }

      const {
        // delete is key word
        delete: delete2,
        beforeDelete: beforeDeleteCallback,
        afterDelete: afterDeleteCallback,
      } = clipboardOption || {}

      if (isBoolean(delete2) && !delete2) {
        return false
      }

      const selectionRangeData = getSelectionRangeData({
        cellSelectionRangeData,
        resultType: 'flat',
        tableData,
        colgroups,
        allRowKeys,
      })

      const response = onBeforeDelete({
        cellSelectionRangeData,
        selectionRangeData,
        colgroups,
        allRowKeys,
      })

      if (isFunction(beforeDeleteCallback)) {
        const allowDeleting = beforeDeleteCallback(response)
        if (isBoolean(allowDeleting) && !allowDeleting) {
          return false
        }
      }

      onAfterDelete({
        tableData,
        colgroups,
        selectionRangeIndexes: response.selectionRangeIndexes,
      })

      if (isFunction(afterDeleteCallback)) {
        afterDeleteCallback(response)
      }
    },

    // set range cell selection by header indicator
    setRangeCellSelectionByHeaderIndicator() {
      const { headerIndicatorColKeys, allRowKeys } = this
      const { startColKey, endColKey } = headerIndicatorColKeys

      if (isEmptyValue(startColKey) || isEmptyValue(endColKey)) {
        return false
      }

      this.cellSelectionCurrentCellChange({
        rowKey: allRowKeys[0],
        colKey: startColKey,
      })

      this.cellSelectionNormalEndCellChange({
        rowKey: allRowKeys[allRowKeys.length - 1],
        colKey: endColKey,
      })
    },

    // set range cell selection by body indicator
    setRangeCellSelectionByBodyIndicator() {
      const { bodyIndicatorRowKeys, colgroups } = this
      const { startRowKey, endRowKey } = bodyIndicatorRowKeys

      if (isEmptyValue(startRowKey) || isEmptyValue(endRowKey)) {
        return false
      }

      if (colgroups.length > 1) {
        this.cellSelectionCurrentCellChange({
          rowKey: startRowKey,
          colKey: colgroups[1].key,
        })

        this.cellSelectionNormalEndCellChange({
          rowKey: endRowKey,
          colKey: colgroups[colgroups.length - 1].key,
        })
      }
    },

    // set isColumnResizerHover
    setIsColumnResizerHover(val) {
      this.isColumnResizerHover = val
    },

    // set isColumnResizing
    setIsColumnResizing(val) {
      this.isColumnResizing = val
    },

    /*
        set cell selection and column to visible
        */
    [INSTANCE_METHODS.SET_CELL_SELECTION](receive) {
      let {
        rowKey,
        colKey,
        isScrollToRow
      } = receive
      if (isScrollToRow === undefined) {
        isScrollToRow = true
      }
      const { enableCellSelection } = this

      if (!enableCellSelection) {
        return false
      }

      if (!isEmptyValue(rowKey) && !isEmptyValue(colKey)) {
        this.cellSelectionCurrentCellChange({
          rowKey,
          colKey,
        })

        const column = getColumnByColkey(colKey, this.colgroups)
        // column to visible
        this.columnToVisible(column)
        // row to visible
        if (isScrollToRow) {
          this[INSTANCE_METHODS.SCROLL_TO_ROW_KEY]({ rowKey })
        }
      }
    },

    /*
        set range cell selection and column to visible
        */
    [INSTANCE_METHODS.SET_RANGE_CELL_SELECTION](receive) {
      let {
        startRowKey,
        startColKey,
        endRowKey,
        endColKey,
        isScrollToStartCell
      } = receive
      if (isScrollToRow === undefined) {
        isScrollToStartCell = false
      }
      const { enableCellSelection } = this

      if (!enableCellSelection) {
        return false
      }

      if (
        isEmptyValue(startRowKey) ||
        isEmptyValue(startColKey) ||
        isEmptyValue(endRowKey) ||
        isEmptyValue(endColKey)
      ) {
        return false
      }

      this.cellSelectionCurrentCellChange({
        rowKey: startRowKey,
        colKey: startColKey,
      })

      this.cellSelectionNormalEndCellChange({
        rowKey: endRowKey,
        colKey: endColKey,
      })

      // row to visible
      if (isScrollToStartCell) {
        const column = getColumnByColkey(startColKey, this.colgroups)
        // column to visible
        this.columnToVisible(column)
        this[INSTANCE_METHODS.SCROLL_TO_ROW_KEY]({
          rowKey: startRowKey,
        })
      }
    },

    /*
        get range cell selection
        */
    [INSTANCE_METHODS.GET_RANGE_CELL_SELECTION]() {
      const {
        cellSelectionData,
        cellSelectionRangeData,
        allRowKeys,
        colgroups,
      } = this

      const { rowKey, colKey } = cellSelectionData.currentCell

      if (!isEmptyValue(rowKey) && !isEmptyValue(colKey)) {
        const selectionRangeKeys = getSelectionRangeKeys({
          cellSelectionRangeData,
        })

        const selectionRangeIndexes = getSelectionRangeIndexes({
          cellSelectionRangeData,
          colgroups,
          allRowKeys,
        })

        return {
          selectionRangeKeys,
          selectionRangeIndexes,
        }
      }
    },

    /*
        set all cell selection and column to visible
        */
    [INSTANCE_METHODS.SET_ALL_CELL_SELECTION]() {
      const { enableCellSelection } = this

      if (!enableCellSelection) {
        return false
      }

      const { colgroups, allRowKeys } = this

      if (colgroups.length) {
        const colKeys = colgroups
          .filter((x) => !x.operationColumn)
          .map((x) => x.key)

        if (colKeys.length) {
          this.headerIndicatorColKeysChange({
            startColKey: colKeys[0],
            endColKey: colKeys[colKeys.length - 1],
          })
        }
      }

      if (allRowKeys.length) {
        this.bodyIndicatorRowKeysChange({
          startRowKey: allRowKeys[0],
          endRowKey: allRowKeys[allRowKeys.length - 1],
        })
      }
    },

    // hide columns by keys
    [INSTANCE_METHODS.HIDE_COLUMNS_BY_KEYS](keys) {
      if (!isEmptyArray(keys)) {
        /*
                将要隐藏的列添加到 hiddenColumns 中
                Add the columns you want to hide to hidden columns
                */
        this.hiddenColumns = Array.from(
          new Set(this.hiddenColumns.concat(keys)),
        )

        this.showOrHideColumns()
      }
    },

    // show columns by keys
    [INSTANCE_METHODS.SHOW_COLUMNS_BY_KEYS](keys) {
      if (!isEmptyArray(keys)) {
        /*
                将要显示的列从 hiddenColumns 中移除
                Remove the columns to show from hidden columns
                */
        for (let i = keys.length - 1; i >= 0; i--) {
          const delIndex = this.hiddenColumns.indexOf(keys[i])
          if (delIndex > -1) {
            this.hiddenColumns.splice(delIndex, 1)
          }
        }

        this.showOrHideColumns()
      }
    },

    // table scrollTo
    [INSTANCE_METHODS.SCROLL_TO](option) {
      scrollTo(this.$refs[this.tableContainerRef], option)
    },
    // table scroll to rowKey position
    [INSTANCE_METHODS.SCROLL_TO_ROW_KEY]({ rowKey }) {
      if (isEmptyValue(rowKey)) {
        console.warn("Row key can't be empty!")
        return false
      }

      let scrollTop = 0

      const { isVirtualScroll, headerTotalHeight } = this

      const tableContainerRef = this.$refs[this.tableContainerRef]

      if (isVirtualScroll) {
        const position = this.virtualScrollPositions.find(
          (x) => x.rowKey === rowKey,
        )

        if (position) {
          scrollTop = position.top
        }

        // fix bug #470
        setTimeout(() => {
          scrollTo(tableContainerRef, {
            top: scrollTop,
            behavior: 'auto',
          })
        }, 200)
      } else {
        const rowEl = this.$el.querySelector(
          `tbody tr[${COMPS_CUSTOM_ATTRS.BODY_ROW_KEY}="${rowKey}"]`,
        )

        scrollTop = rowEl.offsetTop - headerTotalHeight
      }

      scrollTo(tableContainerRef, {
        top: scrollTop,
        behavior: isVirtualScroll ? 'auto' : 'smooth',
      })
    },
    // scroll to col key position
    [INSTANCE_METHODS.SCROLL_TO_COL_KEY]({ colKey }) {
      const column = getColumnByColkey(colKey, this.colgroups)
      if (column) {
        this.columnToVisible(column)
      }
    },
    // start editing cell
    [INSTANCE_METHODS.START_EDITING_CELL]({
      rowKey,
      colKey,
      defaultValue,
    }) {
      const {
        editOption,
        colgroups,
        rowKeyFieldName,
        editingCell,
        cellSelectionData,
      } = this

      if (!editOption) {
        return false
      }

      let currentRow = this.tableData.find(
        (x) => x[rowKeyFieldName] === rowKey,
      )

      currentRow = cloneDeep(currentRow)

      /*
            调用API编辑的情况，需要关闭之前编辑的单元格
            */
      if (
        editingCell.rowKey === rowKey &&
        editingCell.colKey === colKey
      ) {
        return false
      }

      const currentColumn = colgroups.find((x) => x.key === colKey)
      // 当前列是否可编辑
      if (!currentColumn.edit) {
        return false
      }

      const { beforeStartCellEditing } = editOption

      if (isFunction(beforeStartCellEditing)) {
        const allowContinue = beforeStartCellEditing({
          row: cloneDeep(currentRow),
          column: currentColumn,
          cellValue: isDefined(defaultValue)
            ? defaultValue
            : currentRow[currentColumn.field],
        })
        if (isBoolean(allowContinue) && !allowContinue) {
          return false
        }
      }

      // 给当前列赋默认值
      if (isDefined(defaultValue)) {
        this.editorInputStartValue = defaultValue
        // doesn't change cell original value
        currentRow[currentColumn.field] = defaultValue
      } else {
        this.editorInputStartValue = currentRow[currentColumn.field]
      }

      if (
        cellSelectionData.currentCell.colKey !== colKey ||
        cellSelectionData.currentCell.rowKey !== rowKey
      ) {
        this.cellSelectionCurrentCellChange({
          rowKey,
          colKey,
        })
      }

      // set editing cell
      this.setEditingCell({
        rowKey,
        colKey,
        column: currentColumn,
        row: cloneDeep(currentRow),
      })
    },
    // stop editing cell
    [INSTANCE_METHODS.STOP_EDITING_CELL]() {
      const { editOption, isCellEditing } = this

      if (!editOption) {
        return false
      }

      // clear editor input start value
      this.editorInputStartValue = ''

      if (isCellEditing) {
        this.saveCellWhenStopEditing()
      }
    },
    // set highlight row
    [INSTANCE_METHODS.SET_HIGHLIGHT_ROW]({ rowKey }) {
      this.highlightRowKey = rowKey
    },
  },
  render() {
    const {
      showHeader,
      tableViewportWidth,
      tableContainerStyle,
      tableStyle,
      tableClass,
      colgroups,
      groupColumns,
      fixedHeader,
      fixedFooter,
      actualRenderTableData,
      debouncedBodyCellWidthChange,
      expandOption,
      checkboxOption,
      radioOption,
      rowKeyFieldName,
      virtualScrollOption,
      isVirtualScroll,
      sortOption,
      cellStyleOption,
      showVirtualScrollingPlaceholder,
      cellSelectionData,
      editOption,
      contextmenuOptions,
      allRowKeys,
      enableCellSelection,
      enableColumnResize,
      cellSelectionRangeData,
      headerIndicatorColKeys,
      bodyIndicatorRowKeys,
    } = this

    // header props
    const headerProps = {
      class: clsName('header'),
      style: {
        cursor:
          this.isColumnResizerHover || this.isColumnResizing
            ? 'col-resize'
            : '',
      },
      props: {
        columnsOptionResetTime: this.columnsOptionResetTime,
        tableViewportWidth,
        groupColumns,
        colgroups,
        isGroupHeader: this.isGroupHeader,
        fixedHeader,
        checkboxOption,
        sortOption,
        cellStyleOption,
        eventCustomOption: this.eventCustomOption,
        headerRows: this.headerRows,
        cellSelectionData,
        cellSelectionRangeData,
        headerIndicatorColKeys,
      },
      nativeOn: {
        click: () => {
          this[INSTANCE_METHODS.STOP_EDITING_CELL]()
        },
        mouseleave: (event) => {
          this.headerMouseleave(event)
        },
      },
    }
    const widthChange = EMIT_EVENTS.BODY_CELL_WIDTH_CHANGE
    // body props
    const bodyProps = {
      ref: this.tableBodyRef,
      class: [clsName('body'), this.tableBodyClass],
      props: {
        tableViewportWidth,
        columnsOptionResetTime: this.columnsOptionResetTime,
        colgroups,
        expandOption,
        checkboxOption,
        actualRenderTableData,
        rowKeyFieldName,
        radioOption,
        virtualScrollOption,
        isVirtualScroll,
        cellStyleOption,
        cellSpanOption: this.cellSpanOption,
        eventCustomOption: this.eventCustomOption,
        cellSelectionOption: this.cellSelectionOption,
        hasFixedColumn: this.hasFixedColumn,
        cellSelectionData,
        cellSelectionRangeData,
        allRowKeys,
        editOption,
        highlightRowKey: this.highlightRowKey,
        showVirtualScrollingPlaceholder,
        bodyIndicatorRowKeys,
      },
      on: {
        [widthChange]:
          debouncedBodyCellWidthChange,
        [EMIT_EVENTS.HIGHLIGHT_ROW_CHANGE]:
          this[INSTANCE_METHODS.SET_HIGHLIGHT_ROW],
      },
    }

    // footer props
    const footerProps = {
      class: [clsName('footer')],
      props: {
        colgroups,
        footerData: this.footerData,
        rowKeyFieldName,
        cellStyleOption,
        fixedFooter,
        cellSpanOption: this.cellSpanOption,
        eventCustomOption: this.eventCustomOption,
        hasFixedColumn: this.hasFixedColumn,
        allRowKeys,
        footerRows: this.footerRows,
      },
      nativeOn: {
        click: () => {
          this[INSTANCE_METHODS.STOP_EDITING_CELL]()
        },
      },
    }

    // table root props
    const tableRootProps = {
      ref: this.tableRootRef,
      class: {
        'vue-table-root': true,
      },
    }

    // table container wrapper props
    const tableContainerWrapperProps = {
      ref: this.tableContainerWrapperRef,
      style: this.tableContainerWrapperStyle,
      class: {
        've-table': true,
        [clsName('border-around')]: this.borderAround,
      },
      props: {
        tagName: 'div',
      },
      on: {
        'on-dom-resize-change': ({ height }) => {
          this.tableOffestHeight = height
          this.initVirtualScroll()
          // fixed #404
          this.initScrolling()
          this.setScrollBarStatus()
          this.hooks.triggerHook(HOOKS_NAME.TABLE_SIZE_CHANGE)
        },
      },
      directives: [
        {
          name: 'click-outside',
          value: (e) => {
            this.tableClickOutside(e)
          },
        },
      ],
    }

    // table container props
    const tableContainerProps = {
      ref: this.tableContainerRef,
      class: this.tableContainerClass,
      style: tableContainerStyle,
      on: {
        scroll: () => {
          const tableContainerRef =
            this.$refs[this.tableContainerRef]

          this.hooks.triggerHook(
            HOOKS_NAME.TABLE_CONTAINER_SCROLL,
            tableContainerRef,
          )
          this.setScrolling(tableContainerRef)

          if (isVirtualScroll) {
            this.tableContainerVirtualScrollHandler(
              tableContainerRef,
            )

            const {
              virtualScrollStartIndex: startIndex,
              previewVirtualScrollStartIndex: previewStartIndex,
            } = this

            const differ = Math.abs(startIndex - previewStartIndex)

            this.previewVirtualScrollStartIndex = startIndex

            // default placeholder per scrolling row count
            if (
              differ > this.defaultPlaceholderPerScrollingRowCount
            ) {
              this.showVirtualScrollingPlaceholder = true
            } else {
              this.showVirtualScrollingPlaceholder = false
            }

            this.debounceScrollEnded()
          }
        },
        mouseup: () => {
          // 事件的先后顺序 containerMouseup > bodyCellMousedown > bodyCellMouseup > bodyCellClick
          this.tableContainerMouseup()
        },
        mousemove: (event) => {
          // todo
        },
      },
    }

    // table wrapper props
    const tableWrapperProps = {
      ref: this.tableContentWrapperRef,
      class: [clsName('content-wrapper')],
      props: {
        tagName: 'div',
      },
      on: {
        'on-dom-resize-change': ({ height }) => {
          this.tableHeight = height
        },
      },
    }

    // tale props
    const tableProps = {
      ref: this.tableRef,
      class: [clsName('content'), tableClass],
      style: tableStyle,
    }

    // selection props
    const selectionProps = {
      ref: this.cellSelectionRef,
      props: {
        tableEl: this.$refs[this.tableRef],
        allRowKeys,
        colgroups,
        parentRendered: this.parentRendered,
        hooks: this.hooks,
        cellSelectionData,
        isAutofillStarting: this.isAutofillStarting,
        cellSelectionRangeData,
        currentCellSelectionType: this.currentCellSelectionType,
        showVirtualScrollingPlaceholder,
        isVirtualScroll,
        virtualScrollVisibleIndexs: this.virtualScrollVisibleIndexs,
        isCellEditing: this.isCellEditing,
        cellAutofillOption: this.cellAutofillOption,
      },
      on: {
        [EMIT_EVENTS.CELL_SELECTION_RANGE_DATA_CHANGE]: (newData) => {
          this.cellSelectionRangeDataChange(newData)
        },
      },
    }

    // edit input props
    const inputClick = EMIT_EVENTS.EDIT_INPUT_CLICK
    const inputValueChange = EMIT_EVENTS.EDIT_INPUT_VALUE_CHANGE
    const inputCopy = EMIT_EVENTS.EDIT_INPUT_COPY
    const inputPaste = EMIT_EVENTS.EDIT_INPUT_PASTE
    const editInputProps = {
      ref: this.editInputRef,
      props: {
        hooks: this.hooks,
        parentRendered: this.parentRendered,
        inputStartValue: this.editorInputStartValue,
        rowKeyFieldName,
        tableData: this.tableData,
        cellSelectionData,
        colgroups,
        editingCell: this.editingCell,
        isCellEditing: this.isCellEditing,
        allRowKeys,
        hasXScrollBar: this.hasXScrollBar,
        hasYScrollBar: this.hasYScrollBar,
        hasRightFixedColumn: this.hasRightFixedColumn,
        scrollBarWidth: this.getScrollBarWidth(),
      },
      on: {
        // edit input click
        [inputClick]: () => {
          this.enableStopEditing = false
        },
        // edit input value change
        [inputValueChange]: (value) => {
          this.updateEditingCellValue(value)
        },
        // copy
        [inputCopy]: (e) => {
          this.editorCopy(e)
        },
        // paste
        [inputPaste]: (e) => {
          this.editorPaste(e)
        },
        // cut
        [EMIT_EVENTS.EDIT_INPUT_CUT]: (e) => {
          this.editorCut(e)
        },
      },
    }

    // 直接在组件上写事件，单元测试无法通过。如 on={{"on-node-click":()=>{}}}
    const contextmenuProps = {
      ref: this.contextmenuRef,
      props: {
        eventTarget: this.contextmenuEventTarget,
        options: contextmenuOptions,
      },
      on: {
        'on-node-click': (type) => {
          this.contextmenuItemClick(type)
        },
      },
    }

    // column resizer props
    const columnResizerProps = {
      props: {
        parentRendered: this.parentRendered,
        tableContainerEl: this.$refs[this.tableContainerRef],
        hooks: this.hooks,
        colgroups,
        isColumnResizerHover: this.isColumnResizerHover,
        isColumnResizing: this.isColumnResizing,
        setIsColumnResizerHover: this.setIsColumnResizerHover,
        setIsColumnResizing: this.setIsColumnResizing,
        setColumnWidth: this.setColumnWidth,
        columnWidthResizeOption: this.columnWidthResizeOption,
      },
    }

    return (
      <div {...tableRootProps}>
        <VueDomResizeObserver {...tableContainerWrapperProps}>
          <div {...tableContainerProps}>
            {/* virtual view phantom */}
            {this.getVirtualViewPhantom()}
            {/* vue 实例类型，访问dom时需要通过$el属性访问 */}
            <VueDomResizeObserver {...tableWrapperProps}>
              <table {...tableProps}>
                {/* colgroup */}
                <Colgroup
                  colgroups={colgroups}
                  enableColumnResize={enableColumnResize}
                />
                {/* table header */}
                {showHeader && <Header {...headerProps} />}
                {/* table body */}
                <Body {...bodyProps} />
                {/* table footer */}
                <Footer {...footerProps} />
              </table>
              {/* cell selection */}
              {enableCellSelection && (
                <Selection {...selectionProps} />
              )}
            </VueDomResizeObserver>
          </div>
          {/* edit input */}
          {enableCellSelection && <EditInput {...editInputProps} />}
          {/* contextmenu */}
          {(this.enableHeaderContextmenu ||
            this.enableBodyContextmenu) && (
            <VeContextmenu {...contextmenuProps} />
          )}
          {/* column resizer */}
          {enableColumnResize && (
            <ColumnResizer {...columnResizerProps} />
          )}
        </VueDomResizeObserver>
      </div>
    )
  },
}
