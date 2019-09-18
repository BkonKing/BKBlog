// template.js
module.exports = {
  vueTemplate: compoenntName => {
    return `<template>
  <div class="${compoenntName}-page">
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';

export default class ${compoenntName} extends Vue {

}
</script>

<style lang="scss" scoped>
</style>`
  },
  entryTemplate: `import Index from './index.vue'
                  export default Index`
}
