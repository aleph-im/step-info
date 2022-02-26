<template>
  <span :class="{ buy: change > 0, sell: change < 0 }">
    {{ change !== 0 ? `${numeral(change).format("0.00")} %` : "-" }}
  </span>
</template>


<script>
import { defineComponent } from "vue";
import numeral from "numeral";
export default defineComponent({
  props: ["change"],
  data() {
    return {
      numeral,
    };
  },
});
</script>