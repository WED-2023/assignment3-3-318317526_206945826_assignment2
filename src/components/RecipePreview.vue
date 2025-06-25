<template>
  <div class="card h-100 shadow-sm">
    <img
      v-if="recipe.image"
      :src="recipe.image"
      :alt="recipe.title"
      class="card-img-top recipe-image"
    />

    <div class="card-body">
      <h5 class="card-title">{{ recipe.title }}</h5>

      <!-- prep time -->
      <div class="d-flex align-items-center gap-1 mb-2">
        <i class="bi bi-clock text-secondary"></i>
        <span>{{ recipe.readyInMinutes }} mins</span>
      </div>

      <!-- dietary badges -->
      <div class="mt-2">
        <span v-if="recipe.vegan" class="badge bg-success">Vegan</span>
        <span v-else-if="recipe.vegetarian" class="badge bg-success"
          >Vegetarian</span
        >
        <span v-if="recipe.glutenFree" class="badge gluten-free-badge"
          >Gluten-Free</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  recipe: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.recipe-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.gluten-free-badge {
  background-color: #d2b48c;
}
</style>
