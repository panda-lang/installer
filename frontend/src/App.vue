<template lang='pug'>
#app
  .row
    // .col.has-logo
      img.logo(src='@/assets/images/installer.png')
    .col.main-frame
      v-stepper(:steps='steps', :value='step', ref='stepper')
        template(slot='step-1') License
        template(slot='step-2') Options
        template(slot='step-3') Installation

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
                li #[.icon-checkmark.text-green] Commercial use
                li #[.icon-checkmark.text-green] Modification
                li #[.icon-checkmark.text-green] Distribution
                li #[.icon-checkmark.text-green] Patent use
                li #[.icon-checkmark.text-green] Private use
              ul.col
                h3 Restrictions
                li #[.icon-restriction.text-red] Trademark use
                li #[.icon-restriction.text-red] Liability
                li #[.icon-restriction.text-red] Warranty
              ul.col
                h3 Conditions
                li #[.icon-star.text-blue] License and copyright notice
                li #[.icon-star.text-blue] State changes
          .row.license-row
            .col
              a.pre(@click='showFullLicense = !showFullLicense')
                | {{ showFullLicense ? 'Hide full license' : 'Read full license' }}
            .col
              .row
                .col
                  input#license(type='checkbox', v-model='licenseAgreed')
                  label(for='license') #[span(:class='{ checked: licenseAgreed }') {{ licenseAgreed ? '☑' : '☐' }}] I agree to the license
          .text-center
            .btn(:disabled='!licenseAgreed', @click='licenseAgreed && (step = 2)') Next
        template(v-if='step === 2')
          .text-center
            .btn(@click='step = 1') Back
            .btn(@click='step = 3') Next
        template(v-if='step === 3') 3
</template>

<script>
import { VStepper } from 'vue-stepper-component'
import '@/assets/css/main.styl'
import '@/assets/css/icons.css'

export default {
  name: 'app',
  components: {
    VStepper
  },
  data () {
    return {
      steps: 3,
      step: 1,
      licenseAgreed: false,
      showFullLicense: false
    }
  }
}
</script>
