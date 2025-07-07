<template>
  <div id="app">
    <div id="nav">
      <router-link :to="{ name: 'main' }">Vue Recipes</router-link> |
      <router-link :to="{ name: 'search' }">Search</router-link> |
      <span v-if="!store.username">
        Guest:
        <router-link :to="{ name: 'register' }">Register</router-link> |
        <router-link :to="{ name: 'login' }">Login</router-link> |
      </span>      <span v-else>
        {{ store.username }}:
        <router-link :to="{ name: 'myrecipes' }">My Recipes</router-link> |
        <router-link :to="{ name: 'familyrecipes' }">Family Recipes</router-link> |
        <button @click="logout" class="btn btn-link p-0">Logout</button> |
      </span>
    </div>
    <router-view />
  </div>
</template>

<script>
import { getCurrentInstance } from "vue";
import { useToast } from "vue-toastification";

export default {
  name: "App",
  setup() {
    const internalInstance = getCurrentInstance();
    const store = internalInstance.appContext.config.globalProperties.store;
    const router = internalInstance.appContext.config.globalProperties.$router;
    let toast = useToast();
    const logout = () => {
      store.logout();
      toast.success("User logged out successfully");
      router.push("/").catch(() => {});
    };

    return { store, logout };
  },
};
</script>

<style lang="scss">
@import "@/scss/form-style.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}

#nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 20px 30px;
  background-color: #ffffffcc;
  border-bottom: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
  font-size: 1.1rem;
}

#nav a,
#nav button {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  transition: color 0.2s;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

#nav button {
  background: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
  padding: 0;
}

#nav button:hover,
#nav a:hover {
  color: #1e7e34;
  text-decoration: underline;
}
</style>
