<template>
  <div class="container py-4">
    <h2 class="mb-4">Family Recipes</h2>
    <b-tabs v-model="tabIndex">
      <b-tab title="Add Family Recipe">
        <div class="mt-3">
          <p class="text-muted mb-3">
            Share your precious family recipes with details about who created them and the special occasions they're made for.
          </p>
          <b-form @submit.prevent="addFamilyRecipe">
            <b-form-group label="Title" label-for="title">
              <b-form-input id="title" v-model="form.title" required />
            </b-form-group>
            <b-form-group label="Ready In Minutes" label-for="readyInMinutes">
              <b-form-input id="readyInMinutes" v-model.number="form.readyInMinutes" type="number" min="1" required />
            </b-form-group>
            <b-form-group label="Image URL" label-for="image">
              <b-form-input id="image" v-model="form.image" />
            </b-form-group>
            <b-form-group label="Servings" label-for="servings">
              <b-form-input id="servings" v-model.number="form.servings" type="number" min="1" required />
            </b-form-group>
            <b-form-group label="Ingredients (comma separated)" label-for="ingredients">
              <b-form-input id="ingredients" v-model="form.ingredients" required />
            </b-form-group>
            <b-form-group label="Instructions" label-for="instructions">
              <b-form-textarea id="instructions" v-model="form.instructions" rows="3" required />
            </b-form-group>
            <b-form-group label="Owner Name" label-for="owner_name" description="Who created this recipe?">
              <b-form-input id="owner_name" v-model="form.owner_name" required placeholder="Grandma, Mom, etc." />
            </b-form-group>
            <b-form-group label="When to Prepare" label-for="when_to_prepare" description="For which occasions is this recipe typically made?">
              <b-form-input id="when_to_prepare" v-model="form.when_to_prepare" required placeholder="Christmas, Hanukkah, Family gatherings, etc." />
            </b-form-group>
            <b-form-checkbox v-model="form.vegetarian" class="mb-2">Vegetarian</b-form-checkbox>
            <b-form-checkbox v-model="form.vegan" class="mb-2">Vegan</b-form-checkbox>
            <b-form-checkbox v-model="form.glutenFree" class="mb-2">Gluten Free</b-form-checkbox>
            <div class="mt-3">
              <b-button type="submit" variant="primary" :disabled="isSubmitting">
                <b-spinner v-if="isSubmitting" small></b-spinner>
                <span v-if="isSubmitting">Adding...</span>
                <span v-else>Add Family Recipe</span>
              </b-button>
            </div>
            <b-alert v-model="showError" variant="danger" dismissible class="mt-3">
              {{ errorMessage }}
            </b-alert>
          </b-form>
        </div>
      </b-tab>
      <b-tab title="Family Recipes" @click="fetchFamilyRecipes">
        <div class="mt-3">
          <div v-if="loading">
            <b-spinner label="Loading..."></b-spinner>
            <span class="ml-2">Loading family recipes...</span>
          </div>
          <div v-else-if="familyRecipes.length === 0" class="text-muted">No family recipes found.</div>
          <div class="row" v-else>
            <div class="col-md-4 mb-4" v-for="recipe in familyRecipes" :key="recipe.id || recipe.recipe_id">
              <div class="card h-100 family-recipe-card">
                <div class="recipe-header">
                  <span class="family-badge">Family Recipe</span>
                </div>
                <RecipePreview :recipe="recipe" />
                <div class="card-footer bg-light">
                  <div><strong>Owner:</strong> {{ recipe.owner || recipe.owner_name }}</div>
                  <div><strong>When to Prepare:</strong> {{ recipe.when_to_prepare }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import RecipePreview from "../components/RecipePreview.vue";
import { ref, reactive, onMounted } from "vue";
import axios from "axios";

export default {
  name: "FamilyRecipes",
  components: { RecipePreview },
  setup() {
    const tabIndex = ref(0);
    const familyRecipes = ref([]);
    const loading = ref(false);
    const isSubmitting = ref(false);
    const showError = ref(false);
    const errorMessage = ref("");
    
    const form = reactive({
      title: "",
      readyInMinutes: 10,
      image: "",
      servings: 1,
      ingredients: "",
      instructions: "",
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      owner_name: "",
      when_to_prepare: ""
    });

    const fetchFamilyRecipes = async () => {
      try {
        loading.value = true;
        const res = await axios.get("/users/family_recipes");
        console.log("Family recipes response:", res.data);
        
        // Add source property if not present
        familyRecipes.value = res.data.map(recipe => ({
          ...recipe,
          source: recipe.source || "family"
        }));
      } catch (e) {
        console.error("Error fetching family recipes:", e);
        familyRecipes.value = [];
        showError.value = true;
        errorMessage.value = "Failed to load family recipes";
      } finally {
        loading.value = false;
      }
    };

    const addFamilyRecipe = async () => {
      try {
        isSubmitting.value = true;
        showError.value = false;
        
        // Convert ingredients string to array format
        const payload = {
          ...form,
          ingredients: form.ingredients.split(",").map(i => i.trim()).filter(Boolean),
          source: "family" // Explicitly set source
        };
        
        console.log("Submitting family recipe:", payload);
        await axios.post("/users/family_recipes", payload);
        
        // Reset form
        Object.assign(form, {
          title: "",
          readyInMinutes: 10,
          image: "",
          servings: 1,
          ingredients: "",
          instructions: "",
          vegetarian: false,
          vegan: false,
          glutenFree: false,
          owner_name: "",
          when_to_prepare: ""
        });
        
        // Switch to the list tab and refresh the data
        tabIndex.value = 1;
        await fetchFamilyRecipes();
      } catch (e) {
        console.error("Error adding family recipe:", e);
        showError.value = true;
        errorMessage.value = e.response?.data?.message || "Failed to add family recipe";
      } finally {
        isSubmitting.value = false;
      }
    };

    // Initial data fetch
    onMounted(fetchFamilyRecipes);

    return { 
      tabIndex, 
      familyRecipes, 
      form, 
      addFamilyRecipe, 
      fetchFamilyRecipes,
      loading,
      isSubmitting,
      showError,
      errorMessage
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 900px;
}

.family-recipe-card {
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
}

.family-recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.recipe-header {
  position: relative;
  text-align: right;
  padding: 8px 12px;
}

.family-badge {
  background-color: #ffc107;
  color: #343a40;
  font-size: 0.8rem;
  padding: 3px 8px;
  border-radius: 12px;
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
}

.card-footer {
  padding: 10px 15px;
  font-size: 0.9rem;
  background-color: #fff8e1 !important;
  border-top: 1px solid #ffe082;
}
</style>
