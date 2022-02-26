<template>
  <q-card class="full-width full-height">
    <q-card-section
      v-if="value !== undefined"
      class="
        column
        items-xs-center items-sm-start
        justify-xs-center justify-sm-start
      "
    >
      <p class="text-bold q-mb-none flex items-center">
        <slot v-if="$slots.default" />
        <template v-else>{{ label }}</template>
      </p>
      <p class="q-mb-none text-h5 text-no-wrap">
        <number :value="value" :symbol="symbol" :decimals="decimals" />
      </p>
    </q-card-section>
    <overlay-spinner v-else height="85px" />
  </q-card>
</template>

<script>
import { defineComponent } from "vue";
import Number from "src/components/Number.vue";
import OverlaySpinner from "src/components/OverlaySpinner.vue";
export default defineComponent({
  components: {
    Number,
    OverlaySpinner,
  },
  props: ["label", "value", "symbol", "decimals"],
});
</script>
