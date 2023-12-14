/* thanks for  https://github.com/tobiasahlin/SpinKit*/

import { clsName } from './util'
import { COMPS_NAME } from '../src/util/constant'
import Plane from './plane'
import Bounce from './bounce'
import Wave from './wave'
import Pulse from './pulse'
import Flow from './flow'
import Grid from './grid'

export default {
  name: COMPS_NAME.VE_LOADING,
  components: { Plane, Bounce, Wave, Pulse, Flow, Grid },
  computed: {
    // loading class
    loadingClass() {
      const { visible, fullscreen } = this
      return {
        [clsName('overlay')]: true,
        [clsName('fixed')]: fullscreen,
        [clsName('hide')]: !visible,
      }
    },

    // loading style
    loadingStyle() {
      const { overlayBackgroundColor } = this

      return {
        'background-color': overlayBackgroundColor,
      }
    },
  },

  render() {
    const { width, height, color } = this

    const spinProps = {
      props: {
        width,
        height,
        color,
      },
    }

    return (
      <div
        style={this.loadingStyle}
        class={['ve-loading', this.loadingClass]}
      >
        <div class={clsName('spin-container')}>
          <div class={clsName('spin')}>
            <this.name {...spinProps}></this.name>
          </div>
          <div style={{ color: color }} class={clsName('spin-tip')}>
            {this.tip}
          </div>
        </div>
      </div>
    )
  },
}
