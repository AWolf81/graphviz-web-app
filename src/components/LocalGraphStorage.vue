<template lang="html">
  <div v-if="graphs.length > 0" class="container">
    <h4>Stored graphs (in Browser):</h4>
    <div class="media" v-for="graph in graphs">
      <div class="media-body">
        <h4 class="media-heading">{{graph.name}}</h4>
        <button class="btn btn-xs" @click="$emit('show', graph.data)">show</button>
        <button class="btn btn-xs btn-danger" @click="$emit('remove', graph)">delete</button>
        <div class="media-footer">created at {{formatData(graph.createdAt)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: ['graphs'],
  methods: {
    formatData (date) {
      return moment(date).format('YYYY-MM-DD HH:m:s')
    }
  }
}
</script>

<style lang="css">
</style>
