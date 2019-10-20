<template lang='pug'>
#app
  .row
    .col.has-logo
      img.logo(src='@/assets/images/installer.png')
    .col
      v-stepper(:steps='steps', v-model='step')
</template>

<script>
import { VStepper } from 'vue-stepper-component'
import './assets/css/main.styl'

export default {
  name: 'app',
  components: {
    VStepper
  },
  data () {
    return {
      steps: 3,
      step: undefined
    }
  }
}
</script>
