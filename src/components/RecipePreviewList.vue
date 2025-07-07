<template>
  <div class="container">
    <h3>{{ title }}</h3>

    <div class="row">
      <div class="col" v-for="r in recipes" :key="r.id">
        <RecipePreview class="recipePreview" :recipe="r" />
      </div>
    </div>
  </div>
</template>

<script>
import RecipePreview from "./RecipePreview.vue";

export default {
  name: "RecipePreviewList",
  components: {
    RecipePreview,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false
    },
    listType: {
      type: String,
      default: "random", // Options: "random", "last-viewed"
      validator: (value) => ["random", "last-viewed"].includes(value)
    }
  },
  data() {
    return {
      recipes: [],
    };
  },
  mounted() {
    this.updateRecipes();
  },
  methods: {
    async updateRecipes() {
      try {
        let response;
        if (this.listType === "random") {
          response = await this.axios.get("/recipes/random");
        } else if (this.listType === "last-viewed") {
          if (this.disabled) return;
          response = await this.axios.get("/users/last-viewed");
        }
        this.recipes = response.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
.container {
  min-height: 400px;
}
</style>
