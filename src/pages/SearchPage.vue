<template>
  <div class="search-page-wrapper">
    <div class="container mt-4 content-box">
      <h1 class="title text-center">Search Page</h1>

      <SearchBar @search="handleSearchQuery" />
      <SearchFilters @updateFilters="handleFilterUpdate" />
      <SortDropdown @sort="handleSort" />

      <div v-if="recipes.length > 0" class="mt-4">
        <div class="row">
          <RecipePreview
            v-for="recipe in recipes"
            :key="recipe.id"
            :recipe="recipe"
            :viewed="viewedRecipes.includes(recipe.id)"
            :isFavorite="favoriteRecipes.includes(recipe.id)"
          />
        </div>
      </div>

      <div v-else-if="searchPerformed" class="mt-4 alert alert-warning">
        No recipes found for the selected search criteria.
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import SearchBar from '@/components/SearchBar.vue'
import SearchFilters from '@/components/SearchFilters.vue'
import SortDropdown from '@/components/SortDropdown.vue'
import RecipePreview from '@/components/RecipePreview.vue'

export default {
  name: 'SearchPage',
  components: {
    SearchBar,
    SearchFilters,
    SortDropdown,
    RecipePreview
  },
  data() {
    return {
      query: '',
      recipes: [],
      searchPerformed: false,
      filters: {
        cuisine: '',
        diet: '',
        intolerance: '',
        number: 5
      },
      sortBy: '',
      viewedRecipes: [],
      favoriteRecipes: []
    }
  },
  computed: {
    isLoggedIn() {
      return this.$root?.store?.username !== undefined;
    }
  },
  methods: {
    handleSearchQuery(query) {
      this.query = query
      this.fetchRecipes()
    },
    handleFilterUpdate(filters) {
      this.filters = filters
      this.fetchRecipes()
    },
    handleSort(sort) {
      this.sortBy = sort
      this.sortRecipes()
    },
    sortRecipes() {
      if (this.sortBy === 'time') {
        this.recipes.sort((a, b) => a.readyInMinutes - b.readyInMinutes)
      } 
    },
    async fetchRecipes() {
      console.log('query:', this.query)
      console.log('filters:', this.filters)
      try {
        const response = await axios.get('/recipes/search', {
          params: {
            ...(this.query && { query: this.query }),
            ...(this.filters.cuisine && { cuisine: this.filters.cuisine }),
            ...(this.filters.diet && { diet: this.filters.diet }),
            ...(this.filters.intolerance && { intolerances: this.filters.intolerance }),
            ...(this.filters.number && { number: this.filters.number }),
            ...(this.sortBy && { sortBy: this.sortBy })
          }
        })
        this.recipes = response.data
        this.searchPerformed = true
        this.sortRecipes()

        if (this.isLoggedIn) {
          localStorage.setItem('lastSearch', JSON.stringify({
            query: this.query,
            filters: this.filters,
            sortBy: this.sortBy
          }))
        }

        this.updateViewedAndFavorites()
      } catch (error) {
        console.error('Error fetching recipes:', error)
        this.recipes = []
        this.searchPerformed = true
      }
    },
    updateViewedAndFavorites() {
      const viewed = JSON.parse(localStorage.getItem('viewedRecipes') || '[]')
      const favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]')
      this.viewedRecipes = viewed
      this.favoriteRecipes = favorites
    }
  },
  mounted() {
    if (this.isLoggedIn) {
      const lastSearch = localStorage.getItem('lastSearch')
      if (lastSearch) {
        const { query, filters, sortBy } = JSON.parse(lastSearch)
        this.query = query
        this.filters = filters
        this.sortBy = sortBy
        this.fetchRecipes()
      }
    }
  }
}
</script>

<style scoped>
.search-page-wrapper {
background-image: url('../assets/background.png');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  padding-top: 40px;
}

.content-box {
  background-color: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}

.container {
  max-width: 1000px;
}
</style>
