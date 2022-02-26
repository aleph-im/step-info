<template>
  <div class="column q-pa-md">
    <p v-if="title" class="title">{{ title }}</p>
    <div
      class="text-subtitle1 col-grow flex items-center justify-center"
      :style="{ 'min-height': height || '290px', 'min-width': width || '100%' }"
    >
      <div class="column items-center">
        <q-avatar text-color="white" size="3rem" icon="storage" />
        <p class="text q-ma-none">No data</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  props: ["title", "height", "width"],
  setup() {},
});
</script>


<style lang="scss" scoped>
.title {
  font-size: 20px;
  letter-spacing: 0.005em;
  font-weight: 400;
}
.text {
  position: relative;
  top: -10px;
}
</style>