<template>
  <section class="vh-100">
    <div class="container-fluid h-custom">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <!-- Image section -->
        <div class="col-md-9 col-lg-6 col-xl-5">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            class="img-fluid"
            alt="Sample image"
          />
        </div>

        <!-- Form section -->
        <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
          <h2 class="fw-bold text-center mb-4">Login</h2>
          <b-form @submit.prevent="login">
            <!-- Username -->
            <b-form-group label="Username" label-for="username" class="mb-4">
              <b-form-input
                id="username"
                v-model="state.username"
                :state="getValidationState(v$.username)"
                placeholder="Enter your username"
                class="form-control-lg"
              />
              <b-form-invalid-feedback v-if="v$.username.$error">
                Username is required.
              </b-form-invalid-feedback>
            </b-form-group>

            <!-- Password -->
            <b-form-group label="Password" label-for="password" class="mb-3">
              <b-form-input
                id="password"
                type="password"
                v-model="state.password"
                :state="null"
                placeholder="Enter your password"
                class="form-control-lg"
              />
              <b-form-invalid-feedback v-if="v$.password.$error">
                Password is required.
              </b-form-invalid-feedback>
            </b-form-group>

            <!-- Remember + Forgot -->
            <div class="d-flex justify-content-between align-items-center mb-3">
              <b-form-checkbox class="mb-0">Remember me</b-form-checkbox>
              <a href="#" class="text-body">Forgot password?</a>
            </div>

            <!-- Login button -->
            <div class="text-center text-lg-start mt-4 pt-2">
              <b-button type="submit" variant="primary" class="btn-lg w-100">
                Login
              </b-button>
              <p class="small fw-bold mt-3 mb-0 text-center">
                Don't have an account?
                <router-link to="/register" class="link-danger"
                  >Register</router-link
                >
              </p>
            </div>

            <!-- Error alert -->
            <b-alert
              variant="danger"
              class="mt-3"
              dismissible
              v-if="state.submitError"
              show
            >
              Login failed: {{ state.submitError }}
            </b-alert>
          </b-form>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div
      class="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary"
    >
      <div class="text-white mb-3 mb-md-0">
        © 2025 Grandma's Recipes. All rights reserved.
      </div>
      <div>
        <a href="#!" class="text-white me-4"
          ><i class="fab fa-facebook-f"></i
        ></a>
        <a href="#!" class="text-white me-4"><i class="fab fa-twitter"></i></a>
        <a href="#!" class="text-white me-4"><i class="fab fa-google"></i></a>
        <a href="#!" class="text-white"><i class="fab fa-linkedin-in"></i></a>
      </div>
    </div>
  </section>
</template>

<script>
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { getCurrentInstance } from "vue";
import axios from "axios";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

export default {
  name: "LoginPage",
  setup() {
    const state = reactive({
      username: "",
      password: "",
      submitError: null,
    });

    const rules = {
      username: { required },
      password: { required },
    };

    const v$ = useVuelidate(rules, state);
    const { proxy } = getCurrentInstance();
    const toast = useToast();
    const router = useRouter();
    const serverDomain = proxy.store.server_domain;

    const getValidationState = (field) => {
      return field.$dirty ? !field.$invalid : null;
    };

    const login = async () => {
      v$.value.$touch();
      const valid = await v$.value.$validate();
      if (!valid) {
        toast.error("User name or Password are incorrect");
        return;
      }

      try {
        await axios.post(serverDomain + "/login", {
          username: state.username,
          password: state.password,
        });
        proxy.store.login(state.username);
        toast.success("Logged in successfully");
        router.push("/main");
      } catch (err) {
        if (err.response?.status === 401) {
          toast.error("Username or Password are incorrect");
        } else {
          toast.error("Unexpected error occurred.");
        }
        state.submitError = err.response?.data?.message || "Unexpected error.";
      }
    };

    return { state, v$, login, getValidationState };
  },
};
</script>

<style scoped>
.divider:after,
.divider:before {
  content: "";
  flex: 1;
  height: 1px;
  background: #eee;
}

.h-custom {
  height: calc(100% - 73px);
}

@media (max-width: 450px) {
  .h-custom {
    height: 100%;
  }
}
</style>
