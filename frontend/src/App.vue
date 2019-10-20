<template lang='pug'>
#app
  .row
    .col.has-logo
      img.logo(src='@/assets/images/installer.png')
    .col.main-frame
      v-stepper(:steps='steps', v-model='step', ref='stepper')

      .content
        template(v-if='step === 1')
          h1 License agreement
          p Panda is licensed under Apache License 2.0
          template(v-if='showFullLicense')
            pre.full-license
              include ../public/panda_license.txt
          template(v-else)
            .row
              ul.col
                h3 Permissions
                li Commercial use
                li Modification
                li Distribution
                li Patent use
                li Private use
              ul.col
                h3 Restrictions
                li Trademark use
                li Liability
                li Warranty
              ul.col
                h3 Conditions
                li License and copyright notice
                li State changes
          .row.license-row
            .col
              a.pre(@click='showFullLicense = !showFullLicense')
                | {{ showFullLicense ? 'Hide full license' : 'Read full License' }}
            .col
              .row
                .col
                  input#license(type='checkbox', v-model='licenseAgreed')
                  label(for='license') #[span(:class='{ checked: licenseAgreed }') {{ licenseAgreed ? '☑' : '☐' }}] I agree to the license
          .text-center
            .btn(:disabled='!licenseAgreed', @click='licenseAgreed && $refs.stepper.next()') Next
        template(v-if='step === 2') 2
        template(v-if='step === 3') 3
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
      step: undefined,
      licenseAgreed: false,
      showFullLicense: false
    }
  }
}
</script>
