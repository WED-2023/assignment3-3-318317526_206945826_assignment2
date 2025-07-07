<template>
  <div
    class="card h-100 shadow-sm"
    @click="goToRecipe"
    tabindex="0"
    @keydown.enter="goToRecipe"
  >
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
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const props = defineProps({
  recipe: {
    type: Object,
    required: true,
  },
});

// Log recipe information on mount to help with debugging
onMounted(() => {
  console.log(`Recipe loaded: ${props.recipe.title}, Source: ${props.recipe.source || 'not set'}, ID: ${props.recipe.id || props.recipe.recipe_id}`);
  console.log("Recipe details:", {
    id: props.recipe.id || props.recipe.recipe_id,
    source: props.recipe.source,
    owner: props.recipe.owner || props.recipe.owner_name,
    when_to_prepare: props.recipe.when_to_prepare,
    full_recipe: props.recipe
  });
});

const router = useRouter();
function goToRecipe() {
  // Get the source from the recipe, default to 'api' if not specified
  let source = props.recipe.source;
  if (!source) source = 'api'; // Default to API source
  
  // Get recipe_id from either recipe_id or id property
  const recipe_id = props.recipe.recipe_id || props.recipe.id;
  
  // Log navigation information
  console.log(`Navigating to recipe: ${props.recipe.title}`);
  console.log(`Source: ${source}, Recipe ID: ${recipe_id}`);
  
  // Guard against missing data
  if (!recipe_id) {
    console.error('Cannot navigate: Missing recipe_id for recipe:', props.recipe);
    return;
  }
  
  // Navigate to the recipe view page with source and recipe_id
  router.push({
    name: 'recipe',
    params: { source, recipe_id }
  });
}
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
.card {
  transition: transform 0.2s, box-shadow 0.2s;
  /* Ensure display block for transform to work */
  display: block;
  /* Add will-change for smoother animation */
  will-change: transform, box-shadow;
}
.card:hover {
  transform: translateY(-8px) scale(1.04);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
  cursor: pointer;
  z-index: 2;
}
</style>
