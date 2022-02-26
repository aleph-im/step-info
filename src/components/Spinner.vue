<template>
  <q-spinner-tail
    :color="color || 'primary'"
    :size="size || '50%'"
    :name="name"
  />
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  props: ["color", "size", "name"],
});
</script>

<style lang="scss" scoped>
.q-spinner {
  max-width: 7rem;
  max-height: 7rem;
}
</style>