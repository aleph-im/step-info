<template>
  {{ number }}
</template>

<script>
import { defineComponent } from "vue";
import { formatNumber } from "../services/number";
export default defineComponent({
  props: ["value", "format", "decimals", "symbol", "reduce"],
  computed: {
    number: function () {
      return formatNumber(this.value, {
        format: this.format,
        decimals: this.decimals,
        symbol: this.symbol,
        reduce: this.reduce,
      });
    },
  },
});
</script>
