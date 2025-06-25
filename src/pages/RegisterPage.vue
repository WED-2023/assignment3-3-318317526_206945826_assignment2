<template>
  <!-- full-height white section identical to the login page -->
  <section class="auth-section signup-bg">
    <div class="container">
      <div class="row align-items-center justify-content-end">
        <!-- form – right column only -->
        <div class="col-12 col-md-8 col-lg-6 auth-form me-0 ms-auto">
          <h2 class="fw-bold text-center mb-4">Sign up</h2>

          <!-- registration form -->
          <b-form @submit.prevent="register">
            <!-- Username -->
            <div class="mb-3">
              <label>Username</label>
              <b-form-input
                v-model="state.username"
                @blur="v$.username.$touch()"
                placeholder="Enter username"
              />
              <b-form-invalid-feedback v-if="v$.username.$error">
                <div v-if="!v$.username.required">Username is required.</div>
                <div
                  v-else-if="!v$.username.minLength || !v$.username.maxLength"
                >
                  Username must be 3–8 characters.
                </div>
                <div v-else-if="!v$.username.alpha">
                  Username must contain only letters.
                </div>
              </b-form-invalid-feedback>
            </div>

            <!-- First & Last name (side-by-side on lg) -->
            <div class="row">
              <div class="col-md-6 mb-3">
                <label>First Name</label>
                <b-form-input
                  v-model="state.firstName"
                  @blur="v$.firstName.$touch()"
                  placeholder="Enter first name"
                />
                <b-form-invalid-feedback v-if="v$.firstName.$error">
                  First name is required.
                </b-form-invalid-feedback>
              </div>

              <div class="col-md-6 mb-3">
                <label>Last Name</label>
                <b-form-input
                  v-model="state.lastName"
                  @blur="v$.lastName.$touch()"
                  placeholder="Enter last name"
                />
                <b-form-invalid-feedback v-if="v$.lastName.$error">
                  Last name is required.
                </b-form-invalid-feedback>
              </div>
            </div>

            <!-- Email -->
            <div class="mb-3">
              <label>Email</label>
              <b-form-input
                type="email"
                v-model="state.email"
                @blur="v$.email.$touch()"
                placeholder="Enter email"
              />
              <b-form-invalid-feedback v-if="v$.email.$error">
                <div v-if="!v$.email.required">Email is required.</div>
                <div v-else>Email must be valid.</div>
              </b-form-invalid-feedback>
            </div>

            <!-- Country -->
            <div class="mb-3">
              <label>Country</label>
              <b-form-select
                v-model="state.country"
                :options="countries"
                @change="v$.country.$touch()"
              />
              <b-form-invalid-feedback v-if="v$.country.$error">
                Country is required.
              </b-form-invalid-feedback>
            </div>

            <!-- Password + confirm -->
            <div class="row">
              <div class="col-md-6 mb-3">
                <label>Password</label>
                <b-form-input
                  type="password"
                  v-model="state.password"
                  @blur="v$.password.$touch()"
                  placeholder="Enter password"
                />
                <b-form-invalid-feedback v-if="v$.password.$error">
                  <div v-if="!v$.password.required">Password is required.</div>
                  <div
                    v-else-if="!v$.password.minLength || !v$.password.maxLength"
                  >
                    Password must be 5–10 characters.
                  </div>
                  <div v-else-if="!v$.password.hasNumber">
                    At least one number required.
                  </div>
                  <div v-else-if="!v$.password.hasSpecial">
                    Need a special character.
                  </div>
                </b-form-invalid-feedback>
              </div>

              <div class="col-md-6 mb-4">
                <label>Confirm Password</label>
                <b-form-input
                  type="password"
                  v-model="state.confirmedPassword"
                  @blur="v$.confirmedPassword.$touch()"
                  placeholder="Repeat password"
                />
                <b-form-invalid-feedback v-if="v$.confirmedPassword.$error">
                  <div v-if="!v$.confirmedPassword.required">
                    Confirmation is required.
                  </div>
                  <div v-else-if="!v$.confirmedPassword.sameAsPassword">
                    Passwords do not match.
                  </div>
                </b-form-invalid-feedback>
              </div>
            </div>

            <!-- submit -->
            <b-button
              type="submit"
              variant="primary"
              class="btn-register w-100 mb-3"
            >
              Register
            </b-button>

            <!-- backend errors -->
            <b-alert variant="danger" dismissible v-if="state.submitError" show>
              Registration failed: {{ state.submitError }}
            </b-alert>

            <!-- link to login -->
            <div class="text-center">
              <p class="small fw-bold mt-3 mb-0 text-center">
                Already have an account?
                <router-link to="/login">Login here</router-link>
              </p>
            </div>
          </b-form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { reactive } from "vue";
import { computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  minLength,
  maxLength,
  alpha,
  sameAs,
  helpers,
  email,
} from "@vuelidate/validators";
import { getCurrentInstance } from "vue";
import rawCountries from "../assets/countries";
import axios from "axios";

import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

// Custom validators
const hasNumber = (value) => /\d/.test(value);
const hasSpecial = (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value);

export default {
  name: "RegisterPage",
  setup() {
    const state = reactive({
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmedPassword: "",
      country: "",
      submitError: null,
    });
    const passwordRef = computed(() => state.password);
    const rules = computed(() => ({
      username: {
        required: helpers.withMessage("Username is required", required),
        minLength: helpers.withMessage(
          "Username must be at least 3 characters",
          minLength(3)
        ),
        maxLength: helpers.withMessage(
          "Username must be at most 8 characters",
          maxLength(8)
        ),
        alpha: helpers.withMessage("Username must contain only letters", alpha),
      },
      firstName: {
        required: helpers.withMessage("First name is required", required),
      },
      lastName: {
        required: helpers.withMessage("Last name is required", required),
      },
      email: {
        required: helpers.withMessage("Email is required", required),
        email: helpers.withMessage("Email must be valid", email),
      },
      country: {
        required: helpers.withMessage("Country is required", required),
      },
      password: {
        required: helpers.withMessage("Password is required", required),
        minLength: helpers.withMessage(
          "Password must be at least 5 characters",
          minLength(5)
        ),
        maxLength: helpers.withMessage(
          "Password must be at most 10 characters",
          maxLength(10)
        ),
        hasNumber: helpers.withMessage(
          "Password must include at least one number",
          hasNumber
        ),
        hasSpecial: helpers.withMessage(
          "Password must include a special character",
          hasSpecial
        ),
      },
      confirmedPassword: {
        required: helpers.withMessage(
          "Password confirmation is required",
          required
        ),
        sameAsPassword: helpers.withMessage(
          "Passwords do not match",
          sameAs(passwordRef)
        ),
      },
    }));

    const v$ = useVuelidate(rules, state);
    const { proxy } = getCurrentInstance();
    const toast = useToast();
    const router = useRouter();
    const serverDomain = proxy.store.server_domain;

    const register = async () => {
      const valid = await v$.value.$validate();
      if (!valid) {
        const allErrors = [];

        for (const field in v$.value) {
          if (v$.value[field]?.$error) {
            const errors = v$.value[field]?.$errors || [];
            errors.forEach((e) => {
              if (e?.$message) allErrors.push(e.$message);
            });
          }
        }

        if (allErrors.length) {
          for (const e of allErrors) {
            toast.error(e);
          }
        } else {
          toast.error("Form validation failed");
        }
        return;
      }

      try {
        await axios.post(serverDomain + "/Register", {
          username: state.username,
          firstname: state.firstName,
          lastname: state.lastName,
          email: state.email,
          password: state.password,
          country: state.country,
        });
        toast.success("Registration successful");
        router.push("/login");
      } catch (err) {
        if (err.response?.data?.message?.includes("Username")) {
          toast.error("Username already exists. Please choose another.");
        } else {
          console.error("Error during register:", err);
          state.submitError =
            err.response?.data?.message || "Unexpected error.";
        }
      }
    };

    return {
      state,
      countries: ["Select a country", ...rawCountries],
      register,
      v$,
    };
  },
};
</script>

<style scoped>
/* full-height white area, same look as login page */
.auth-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  position: relative;
}

.signup-bg {
  background: url("~@/assets/signup.png") no-repeat left center;
  background-size: cover;
}

/* make input controls match login widths */
b-form-input,
b-form-select {
  height: calc(2.5rem + 2px);
  font-size: 1rem;
}

.btn-register {
  background-color: #4c6b45;
  color: #ffffff;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  padding: 12px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.btn-register:hover {
  background-color: #688c5c;
}
.auth-form {
  max-width: 750px;
  width: 100%;
  margin-right: 0;
  margin-left: auto;
}

.auth-form label {
  font-size: 1.05rem;
}
.auth-form input,
.auth-form select {
  height: 3rem;
  font-size: 1.05rem;
}
.auth-form .btn-primary {
  padding: 0.75rem;
  font-size: 1.1rem;
}

@media (min-width: 1400px) {
  .container {
    max-width: 1700px;
  }
}
</style>
