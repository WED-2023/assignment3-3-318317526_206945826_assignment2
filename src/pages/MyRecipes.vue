<template>
  <div class="container py-4">
    <h2 class="mb-4">My Recipes</h2>
    <b-tabs v-model="tabIndex">
      <b-tab title="Add Recipe">
        <div class="mt-3">
          <b-form @submit.prevent="addRecipe">
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
            <b-form-checkbox v-model="form.vegetarian">Vegetarian</b-form-checkbox>
            <b-form-checkbox v-model="form.vegan">Vegan</b-form-checkbox>
            <b-form-checkbox v-model="form.glutenFree">Gluten Free</b-form-checkbox>
            <div class="mt-3">
              <b-button type="submit" variant="primary">Add Recipe</b-button>
            </div>
          </b-form>
        </div>
      </b-tab>
      <b-tab title="My Recipes" @click="fetchMyRecipes">
        <div class="mt-3">
          <div v-if="myRecipes.length === 0" class="text-muted">No recipes found.</div>
          <div class="row" v-else>
            <div class="col" v-for="r in myRecipes" :key="r.id || r.recipe_id">
              <RecipePreview :recipe="r" />
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
  name: "MyRecipes",
  components: { RecipePreview },
  setup() {
    const tabIndex = ref(0);
    const myRecipes = ref([]);
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
    });

    const fetchMyRecipes = async () => {
      try {
        const res = await axios.get("/users/user_recipes");
        myRecipes.value = res.data;
      } catch (e) {
        myRecipes.value = [];
      }
    };

    const addRecipe = async () => {
      try {
        const payload = {
          ...form,
          ingredients: form.ingredients.split(",").map(i => i.trim()).filter(Boolean),
        };
        await axios.post("/users/user_recipes", payload);
        await fetchMyRecipes();
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
        });
        tabIndex.value = 1;
      } catch (e) {
        alert("Failed to add recipe");
      }
    };

    onMounted(fetchMyRecipes);

    return { tabIndex, myRecipes, form, addRecipe, fetchMyRecipes };
  },
};
</script>

<style scoped>
.container {
  max-width: 700px;
}
</style>
