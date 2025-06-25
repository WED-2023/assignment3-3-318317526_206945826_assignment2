<template>
  <div class="input-group mb-3">
    <input
      type="text"
      class="form-control"
      placeholder="Search for a recipe..."
      v-model="searchTerm"
      @keyup.enter="emitSearch"
    />
    <button class="btn btn-primary" @click="emitSearch">Search</button>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  data() {
    return {
      searchTerm: ''
    }
  },
  methods: {
    emitSearch() {
      this.$emit('search', this.searchTerm.trim())
    }
  }
}
</script>

<style scoped>
.input-group {
  max-width: 600px;
  margin: 0 auto;
}
</style>
