<template>
  <apexchart
    v-if="show"
    height="180px"
    width="100%"
    :options="options"
    :series="series"
  />
  <no-data v-else height="263px" />
</template>

<script>
import { defineComponent } from "vue";
import { commonChartOptions, commonChartSeries } from "../services/charts";
import { formatNumber } from "../services/number";
import NoData from "./NoData.vue";
export default defineComponent({
  components: {
    NoData,
  },
  props: ["tvl", "timeUnit", "timeSize", "numCandles"],
  computed: {
    show() {
      return this.series.some((serie) => serie.data.length > 0);
    },
    series() {
      const { timeUnit, timeSize, numCandles } = this;
      const onCandle = (step, { tvlUsd }) => [step.toMillis(), tvlUsd];
      const data = commonChartSeries(this.tvl, {
        timeUnit,
        timeSize,
        numCandles,
        onData: onCandle,
        onEmpty: onCandle,
      });
      return [
        {
          name: "TVL",
          data,
        },
      ];
    },
    options() {
      const common = commonChartOptions();
      return {
        ...common,
        chart: {
          ...common.chart,
          toolbar: { show: false },
        },
        yaxis: {
          ...common.yaxis,
          labels: {
            formatter(val) {
              return formatNumber(val);
            },
          },
        },
      };
    },
  },
});
</script>
