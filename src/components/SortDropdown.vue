<template>
  <div class="mb-3">
    <label for="sortBy" class="form-label">Sort by</label>
    <select class="form-select" v-model="sort" @change="emitSort">
      <option value="">None</option>
      <option value="time">Preparation Time</option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'SortDropdown',
  data() {
    return {
      sort: ''
    }
  },
  methods: {
    emitSort() {
      this.$emit('sort', this.sort)
    }
  }
}
</script>

<style scoped>
.mb-3 {
  max-width: 300px;
  margin-left: auto;
  margin-right: auto;
}
</style>
