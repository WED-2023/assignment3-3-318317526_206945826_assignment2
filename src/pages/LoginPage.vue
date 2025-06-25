<template>
  <section class="vh-100 login-bg">
    <div class="container-fluid h-custom">
      <div class="row d-flex justify-content-end align-items-center h-100">
        <!-- Form section only -->
        <div class="col-md-8 col-lg-6 col-xl-4 shift-right">
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
              <b-button
                type="submit"
                variant="primary"
                class="btn-lg w-100 btn-login"
              >
                Login
              </b-button>
              <p class="small fw-bold mt-3 mb-0 text-center">
                Don't have an account?
                <router-link to="/register" class="link">Register</router-link>
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
.btn-login {
  background-color: #4c6b45;
  color: #ffffff;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  padding: 12px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}
.btn-login:hover {
  background-color: #688c5c;
}
.bg-slate {
  background: #34495e;
}
.login-bg {
  background: url("@/assets/login-hero.png") no-repeat left center;
  background-size: cover;
  min-height: 100vh;
}

.h-custom {
  height: calc(100% - 73px);
}
.shift-right {
  margin-right: 60px;
}
@media (max-width: 450px) {
  .h-custom {
    height: 100%;
  }
}
</style>
