import VeIcon from '@P/ve-icon/ve-icon.js'
import { clsName } from './util/index'
import { LOCALE_COMP_NAME } from './util/constant'
import { createLocale } from '@P/src/locale/index'
import { ICON_NAMES } from '@P/ve-icon/src/util/constant'

const t = createLocale(LOCALE_COMP_NAME)

export default {
  name: 'FanPaginationPager',
  props: {
    pageCount: {
      type: Number,
      required: true,
    },
    pageIndex: {
      type: Number,
      required: true,
    },
    pagingCount: {
      type: Number,
      required: true,
    },
  },
  computed: {
    numOffset() {
      return Math.floor((this.pagingCount + 2) / 2) - 1
    },

    showJumpPrev() {
      if (this.pageCount > this.pagingCount + 2) {
        if (this.pageIndex > this.pagingCount) {
          return true
        }
      }
      return false
    },

    showJumpNext() {
      if (this.pageCount > this.pagingCount + 2) {
        // if (this.pageIndex < this.pageCount - this.numOffset) {
        if (this.pageIndex <= this.pageCount - this.pagingCount) {
          return true
        }
      }
      return false
    },

    // 当前要显示的数字按钮集合
    pagingCounts() {
      let startNum
      const result = []
      const showJumpPrev = this.showJumpPrev
      const showJumpNext = this.showJumpNext

      if (showJumpPrev && !showJumpNext) {
        startNum = this.pageCount - this.pagingCount
        for (let i = startNum; i < this.pageCount; i++) {
          result.push(i)
        }
      } else if (!showJumpPrev && showJumpNext) {
        for (let i = 2; i < this.pagingCount + 2; i++) {
          result.push(i)
        }
      } else if (showJumpPrev && showJumpNext) {
        for (
          let i = this.pageIndex - this.numOffset;
          i <= this.pageIndex + this.numOffset;
          i++
        ) {
          result.push(i)
        }
      } else {
        for (let i = 2; i < this.pageCount; i++) {
          result.push(i)
        }
      }

      return result
    },
  },
  methods: {
    jumpPage(pageIndex) {
      this.$emit('jumpPageHandler', pageIndex)
    },
  },
  render() {
    const {
      pageIndex,
      jumpPage,
      showJumpPrev,
      pagingCount,
      pagingCounts,
      showJumpNext,
      pageCount,
    } = this

    return (
      <span class={clsName('pager')}>
        <li
          class={[
            pageIndex === 1 ? clsName('li-active') : '',
            clsName('li'),
          ]}
          onClick={() => jumpPage(1)}
        >
          <a>1</a>
        </li>

        {showJumpPrev && (
          <li
            class={[
              pageIndex === 1 ? 'disabled' : '',
              clsName('li'),
              clsName('jump-prev'),
            ]}
            title={t('prev5', pagingCount)}
            onClick={() => jumpPage(pageIndex - pagingCount)}
          >
            <a>
              <VeIcon name={ICON_NAMES.DOUBLE_LEFT_ARROW} />
            </a>
          </li>
        )}
        {pagingCounts.map((number, index) => {
          return (
            <li
              key={index}
              class={[
                number === pageIndex
                  ? clsName('li-active')
                  : '',
                clsName('li'),
              ]}
              onClick={() => jumpPage(number)}
            >
              <a>{number}</a>
            </li>
          )
        })}

        {showJumpNext && (
          <li
            class={[clsName('li'), clsName('jump-next')]}
            title={t('next5', pagingCount)}
            onClick={() => jumpPage(pageIndex + pagingCount)}
          >
            <a>
              <VeIcon name={ICON_NAMES.DOUBLE_RIGHT_ARROW} />
            </a>
          </li>
        )}

        {pageCount > 1 && (
          <li
            class={[
              pageIndex === pageCount ? clsName('li-active') : '',
              clsName('li'),
            ]}
            onClick={() => jumpPage(pageCount)}
          >
            <a>{pageCount}</a>
          </li>
        )}
      </span>
    )
  },
}
