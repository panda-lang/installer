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
          h1 Options

          h3 Installation type
          h4 Local
          .row
            .col.auto
              input(type='radio', id='if-u' value='user', v-model='options.installFor')
            label.col(for='if-u') Install only for me
          h4 Global
          small.block.text-red(v-if='!hasAdminPriviledges', style='margin-bottom: 7px') This option is disabled due to lack of administrator priviledges
          .row
            .col.auto
              input(type='radio', id='if-e', value='everyone', v-model='options.installFor', :disabled='!hasAdminPriviledges')
            label.col(for='if-e', :class='{ disabled: !hasAdminPriviledges }') Install for everyone

          h3 Installation path
          .row
            .col.auto
              input(type='text', v-model='options.installPath', :disabled='!hasAdminPriviledges')
            .col.auto
              small.btn(:disabled='!hasAdminPriviledges') …

          .text-center
            .btn(@click='step = 1') Back
            .btn(@click='step = 3') Next

        template(v-if='step === 3')
            .btn(@click='step = 2') Back
            .btn Install
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
      showFullLicense: false,
      hasAdminPriviledges: false,
      options: {
        installPath: '',
        installFor: 'user'
      }
    }
  }
}
</script>
