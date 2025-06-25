<template>
  <div class="row mb-3">
    <!-- Cuisine -->
    <div class="col-md-3">
      <label for="cuisine" class="form-label">Cuisine</label>
      <select class="form-select" v-model="filters.cuisine">
        <option value="">Any</option>
        <option v-for="option in cuisines" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </div>

    <!-- Diet -->
    <div class="col-md-3">
      <label for="diet" class="form-label">Diet</label>
      <select class="form-select" v-model="filters.diet">
        <option value="">Any</option>
        <option v-for="option in diets" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </div>

    <!-- Intolerance -->
    <div class="col-md-3">
      <label for="intolerance" class="form-label">Intolerance</label>
      <select class="form-select" v-model="filters.intolerance">
        <option value="">None</option>
        <option v-for="option in intolerances" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </div>

    <!-- Number of Results -->
    <div class="col-md-3">
      <label for="number" class="form-label">Results</label>
      <select class="form-select" v-model="filters.number">
        <option :value="5">5</option>
        <option :value="10">10</option>
        <option :value="15">15</option>
      </select>
    </div>
  </div>
</template>

<script>
import filterOptions from '@/assets/filterOptions.json'

export default {
  name: 'SearchFilters',
  data() {
    return {
      filters: {
        cuisine: '',
        diet: '',
        intolerance: '',
        number: 5
      },
        cuisines: filterOptions.cuisines,
        intolerances: filterOptions.intolerances,
        diets: filterOptions.diets

    }
  },
  watch: {
    filters: {
      handler() {
        this.$emit('updateFilters', this.filters)
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.row {
  margin-left: 0;
  margin-right: 0;
}
</style>
