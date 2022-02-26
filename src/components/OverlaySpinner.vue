<template>
  <div
    v-if="height || width"
    class="overlay-spinner-spacer"
    :style="{ 'min-height': height || 0, 'min-width': width || 0 }"
  ></div>
  <div class="overlay-spinner" :class="{ top }">
    <spinner :size="size" />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Spinner from "./Spinner.vue";
export default defineComponent({
  components: {
    Spinner,
  },
  props: {
    size: Number,
    top: Boolean,
    height: [String, Number],
    width: [String, Number],
  },
});
</script>

<style lang="scss" scoped>
.overlay-spinner-spacer {
  width: 100%;
  height: 100%;
  position: relative;
}
.overlay-spinner {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  &.top {
    padding-top: 4rem;
    align-items: flex-start;
  }
}
</style>