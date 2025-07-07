import axios from "axios";
import { reactive } from "vue";


const store = reactive({
  username: localStorage.getItem("username"),
  server_domain: "https://tom-einav.cs.bgu.ac.il",

  login(username) {
    localStorage.setItem("username", username);
    this.username = username;
    console.log("login", this.username);
  },

  async logout() {
    console.log("logout");
    console.log("Sending logout request to server:", this.server_domain);
    try {
      const url = this.server_domain + "/logout";
      console.log("Sending logout request to:", url);
      const response = await axios.post(this.server_domain+"/logout", {});
      console.log("Logout request successful:", response.data);
    } catch (error) {
      console.error("Logout request failed:", error);
    }
    console.log("Removing username from localStorage");
    localStorage.removeItem("username");
    this.username = undefined;
  },
});

export default store;
