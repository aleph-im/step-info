<template>
  <apexchart
    v-if="show"
    height="180px"
    width="100%"
    :options="options"
    :series="series"
  />
  <no-data v-else height="163px" />
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
  props: ["volume", "timeUnit", "timeSize", "numCandles"],
  computed: {
    show() {
      return this.series.some((serie) => serie.data.length > 0);
    },
    series() {
      const { timeUnit, timeSize, numCandles } = this;
      const onData = (step, { volumeUsd }) => [step.toMillis(), volumeUsd];
      const onEmpty = (step) => [step.toMillis(), 0];
      const data = commonChartSeries(this.volume, {
        timeUnit,
        timeSize,
        numCandles,
        onData,
        onEmpty,
      });
      return [
        {
          name: "Volume",
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
          opposite: true,
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
