<template>
  <div class="container mt-4" style="max-width: 500px">
    <h2 class="mb-4">Register</h2>
    <b-form @submit.prevent="register">
      <!-- Username -->
      <b-form-group label="Username" label-for="username">
        <b-form-input
          id="username"
          v-model="state.username"
          @blur="v$.username.$touch()"
        />
        <b-form-invalid-feedback v-if="v$.username.$error">
          <div v-if="!v$.username.required">Username is required.</div>
          <div v-else-if="!v$.username.minLength || !v$.username.maxLength">
            Username must be 3–8 characters.
          </div>
          <div v-else-if="!v$.username.alpha">
            Username must contain only letters.
          </div>
        </b-form-invalid-feedback>
      </b-form-group>
      <!-- First Name -->
      <b-form-group label="First Name" label-for="firstName">
        <b-form-input
          id="firstName"
          v-model="state.firstName"
          @blur="v$.firstName.$touch()"
        />
        <b-form-invalid-feedback v-if="v$.firstName.$error">
          First name is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Last Name -->
      <b-form-group label="Last Name" label-for="lastName">
        <b-form-input
          id="lastName"
          v-model="state.lastName"
          @blur="v$.lastName.$touch()"
        />
        <b-form-invalid-feedback v-if="v$.lastName.$error">
          Last name is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Email -->
      <b-form-group label="Email" label-for="email">
        <b-form-input
          id="email"
          type="email"
          v-model="state.email"
          @blur="v$.email.$touch()"
        />
        <b-form-invalid-feedback v-if="v$.email.$error">
          <div v-if="!v$.email.required">Email is required.</div>
          <div v-else>Email must be valid.</div>
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Country -->
      <b-form-group label="Country" label-for="country">
        <b-form-select
          id="country"
          v-model="state.country"
          :options="countries"
          @change="v$.country.$touch()"
        />
        <b-form-invalid-feedback v-if="v$.country.$error">
          Country is required.
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Password -->
      <b-form-group label="Password" label-for="password">
        <b-form-input
          id="password"
          type="password"
          v-model="state.password"
          @blur="v$.password.$touch()"
        />
        <b-form-invalid-feedback v-if="v$.password.$error">
          <div v-if="!v$.password.required">Password is required.</div>
          <div v-else-if="!v$.password.minLength || !v$.password.maxLength">
            Password must be 5–10 characters.
          </div>
          <div v-else-if="!v$.password.hasNumber">
            Password must contain at least one number.
          </div>
          <div v-else-if="!v$.password.hasSpecial">
            Password must contain at least one special character.
          </div>
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Confirm Password -->
      <b-form-group label="Confirm Password" label-for="confirmedPassword">
        <b-form-input
          id="confirmedPassword"
          type="password"
          v-model="state.confirmedPassword"
          @blur="v$.confirmedPassword.$touch()"
        />
        <b-form-invalid-feedback v-if="v$.confirmedPassword.$error">
          <div v-if="!v$.confirmedPassword.required">
            Confirmation is required.
          </div>
          <div v-else-if="!v$.confirmedPassword.sameAsPassword">
            Passwords do not match.
          </div>
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button type="submit" variant="success" class="w-100">
        Register
      </b-button>

      <b-alert
        variant="danger"
        class="mt-3"
        dismissible
        v-if="state.submitError"
        show
      >
        Registration failed: {{ state.submitError }}
      </b-alert>

      <div class="mt-2">
        Already have an account?
        <router-link to="/login">Login here</router-link>
      </div>
    </b-form>
  </div>
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
