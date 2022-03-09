<template>
  <events-table :events="events" :ammId="ammId" />
</template>

<script>
import { defineComponent, ref } from 'vue'
import EventsTable from './EventsTable.vue'
import poolhistoryquery from '../queries/pool_history.gql'
import { client } from "../services/graphql"

export default defineComponent({
  components: { EventsTable },
  props: {
    address: String
  },
  async setup(props) {
    const events = ref([])
    client.request(poolhistoryquery, {
      address: props.address,
    }).then((result) => {
      events.value = result.events
    });

    return {
      events: events,
      ammId: props.address
    }
  },
})
</script>
