<template>
  <div class="container">
    <div v-if="recipe">      <div class="recipe-header mt-3 mb-4">
        <h1>{{ recipe.title }}</h1>
        <!-- Source badge removed as per requirement -->
        <img v-if="recipe.image" :src="recipe.image" class="center" alt="Recipe image" />
      </div>
      <div class="recipe-body">
        <div class="wrapper">
          <div class="wrapped">
            <div class="mb-3">
              <div>Ready in {{ recipe.readyInMinutes }} minutes</div>
              <div v-if="recipe.servings">Servings: {{ recipe.servings }}</div>
              <div class="dietary-info mt-2">
                <span v-if="recipe.vegan" class="badge bg-success me-1">Vegan</span>
                <span v-else-if="recipe.vegetarian" class="badge bg-success me-1">Vegetarian</span>
                <span v-if="recipe.glutenFree" class="badge bg-warning me-1">Gluten-Free</span>
              </div>
              <!-- Family recipe specific details -->
              <div v-if="recipeSource === 'family'" class="family-recipe-info mt-2">
                <div><strong>Owner:</strong> {{ recipe.owner }}</div>
                <div><strong>When to prepare:</strong> {{ recipe.when_to_prepare }}</div>
              </div>
            </div>            <h4>Ingredients:</h4>
            <ul>
              <li
                v-for="(ingredient, index) in formattedIngredients"
                :key="index"
              >
                <!-- Display ingredients based on their structure -->                <!-- Check for the available properties and display accordingly -->
                <template v-if="ingredient.original">{{ ingredient.original }}</template>
                <template v-else-if="ingredient.name && ingredient.amount">
                  {{ ingredient.name }} - {{ ingredient.amount }} {{ ingredient.unit || '' }}
                </template>
                <template v-else>{{ JSON.stringify(ingredient) }}</template>
              </li>
            </ul>
          </div>
          <div class="wrapped">
            <h4>Instructions:</h4>
            <!-- API source recipes have _instructions with analyzed steps -->
            <div v-if="recipeSource === 'api' && recipe._instructions && recipe._instructions.length > 0">
              <ol>
                <li v-for="s in recipe._instructions" :key="s.number">
                  {{ s.step }}
                </li>
              </ol>
            </div>
            <!-- User and family recipes have plain text instructions -->
            <div v-else class="instructions-text">
              {{ recipe.instructions }}
            </div>
            
            <div v-if="recipe.summary" class="mt-4">
              <h4>Summary:</h4>
              <p v-html="recipe.summary"></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    source: {
      type: String,
      default: "api"
    },
    recipe_id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      recipe: null,
      recipeSource: null,
      loading: true,
      error: null
    };
  },  
  async created() {
    try {
      // Get the source and recipe_id from route params
      const source = this.$route.params.source || this.source;
      const recipe_id = this.$route.params.recipe_id || this.recipe_id;
      
      console.log(`Loading recipe from source: ${source}, ID: ${recipe_id}`);
      this.recipeSource = source;

      try {
        // Make request to the appropriate endpoint based on source
        const response = await this.axios.get(`/users/${source}/${recipe_id}`);

        if (response.status !== 200) {
          this.$router.replace("/NotFound");
          return;
        }

        this.recipe = response.data;
        console.log("Recipe data loaded:", this.recipe);
        
        // Process recipe data to ensure consistent structure
        this.processRecipeData();
        
        this.loading = false;
      } catch (error) {
        console.error("Error fetching recipe:", error);
        this.error = error.message || "Failed to load recipe";
        this.loading = false;
        this.$router.replace("/NotFound");
      }
    } catch (error) {
      console.error("Error:", error);
      this.error = error.message || "An unexpected error occurred";
      this.loading = false;
      this.$router.replace("/NotFound");
    }
  },  computed: {
    // Format ingredients properly regardless of source
    formattedIngredients() {
      if (!this.recipe) return [];
      
      let ingredients = [];
      
      // For API recipes
      if (this.recipeSource === 'api') {
        // Try all possible ingredient properties based on the console output
        ingredients = this.recipe.ingredients || 
                      this.recipe.extendedIngredients || 
                      [];
                      
        // If we have ingredients but they're in a different format, try to normalize them
        if (ingredients && Array.isArray(ingredients) && ingredients.length > 0) {
          // Check if we need to process the ingredients (they might already be processed)
          const firstIngredient = ingredients[0];
          if (!firstIngredient.original && !firstIngredient.name) {
            // Try to extract relevant data from the ingredient
            return ingredients.map(ing => {
              if (typeof ing === 'string') {
                return { original: ing };
              }
              return ing;
            });
          }
        }
      } else {
        // For user and family recipes
        ingredients = this.recipe.ingredients || [];
        
        // If ingredients is a string, try to parse it (might be JSON)
        if (typeof ingredients === 'string') {
          try {
            ingredients = JSON.parse(ingredients);
          } catch (e) {
            console.error('Failed to parse ingredients string:', e);
            ingredients = [{ original: ingredients }];
          }
        }
      }
      
      if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        console.error('No valid ingredients found in recipe:', this.recipe);
        return [];
      }
      
      return ingredients;
    }
  },
  methods: {    processRecipeData() {
      if (!this.recipe) return;
      
      // Special handling for API recipes
      if (this.recipeSource === 'api') {
        // From the console output, we can see that API recipes have an ingredients array
        // with objects that have name, amount, and unit properties
        if (this.recipe.ingredients && Array.isArray(this.recipe.ingredients)) {
          // Check if we need to add the "original" property for rendering
          this.recipe.ingredients = this.recipe.ingredients.map(ing => {
            // If it doesn't have an "original" property, create one
            if (!ing.original) {
              ing.original = `${ing.name} - ${ing.amount} ${ing.unit || ''}`;
            }
            return ing;
          });
        }
        // If no ingredients but has extendedIngredients, use those
        else if (this.recipe.extendedIngredients && Array.isArray(this.recipe.extendedIngredients)) {
          this.recipe.ingredients = this.recipe.extendedIngredients;
        }
      }
      
      // Special handling for user and family recipes
      else {
        // Check if ingredients needs to be parsed from string
        if (typeof this.recipe.ingredients === 'string') {
          try {
            this.recipe.ingredients = JSON.parse(this.recipe.ingredients);
          } catch (e) {
            // If parsing fails, create a simple array with the string
            this.recipe.ingredients = [{ original: this.recipe.ingredients }];
          }
        }
      }
    }
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
}
.wrapped {
  width: 50%;
  padding: 0 15px;
}
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 15px;
}
.instructions-text {
  white-space: pre-line;
}
.dietary-info .badge {
  font-size: 0.8rem;
}
.family-recipe-info {
  background-color: #f8f9fa;
  padding: 10px;
  border-radius: 5px;
  border-left: 3px solid #6c757d;
}

@media (max-width: 768px) {
  .wrapper {
    flex-direction: column;
  }
  .wrapped {
    width: 100%;
    margin-bottom: 20px;
  }
  .center {
    width: 100%;
  }
}
</style>
