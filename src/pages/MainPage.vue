<template>  <div class="container">
    <h1 class="title">Main Page</h1>

    <RecipePreviewList 
      title="Random Recipes" 
      class="RandomRecipes center" 
      listType="random" 
    />

    <div v-if="!store.username" class="text-center mt-4">
      <router-link :to="{ name: 'login' }">
        <button class="btn btn-danger">You need to Login to view this</button>
      </router-link>
    </div>

    <RecipePreviewList
      title="Last Viewed Recipes"
      listType="last-viewed"
      :class="{
        RandomRecipes: true,
        blur: !store.username,
        center: true,
      }"
      :disabled="!store.username"
    />
  </div>
</template>

<script>
import { getCurrentInstance } from "vue";
import RecipePreviewList from "../components/RecipePreviewList.vue";

export default {
  components: {
    RecipePreviewList,
  },
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;

    return { store };
  },
};
</script>

<style lang="scss" scoped>
.RandomRecipes {
  margin: 10px 0 10px;
}
.blur {
  -webkit-filter: blur(5px); /* Safari 6.0 - 9.0 */
  filter: blur(2px);
}
:deep(.blur .recipe-preview) {
  pointer-events: none;
  cursor: default;
}
</style>
