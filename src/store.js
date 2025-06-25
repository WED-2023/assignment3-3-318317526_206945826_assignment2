import { reactive } from "vue";

const store = reactive({
  username: localStorage.getItem("username"),
  server_domain: "https://tom-einav.cs.bgu.ac.il",

  login(username) {
    localStorage.setItem("username", username);
    this.username = username;
    console.log("login", this.username);
  },

  logout() {
    console.log("logout");
    localStorage.removeItem("username");
    store.username = undefined;
  },
});

export default store;
