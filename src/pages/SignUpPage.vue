<template>
  <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2 col-12">
    <form
      class="card mt-5"
      data-testid="form-sign-up"
      v-if="!isSignupSuccessful"
    >
      <div class="card-header">
        <h1 class="text-center mb-3">Sign Up</h1>
      </div>

      <div class="card-body">
        <VInput
          id="username"
          label="Username"
          v-model="form.username"
          :help="errors.username"
        />

        <VInput
          id="email"
          label="Email"
          v-model="form.email"
          :help="errors.email"
        />

        <VInput
          id="password"
          label="Password"
          type="password"
          v-model="form.password"
          :help="errors.password"
        />

        <VInput
          id="confirm-password"
          label="Confirm Password"
          type="password"
          v-model="form.confirmPassword"
          :help="errors.confirmPassword"
        />

        <div class="text-center">
          <button
            :disabled="disabled || isLoading"
            @click.prevent="submit"
            class="btn btn-primary"
          >
            <span
              v-if="isLoading"
              class="spinner-border spinner-border-sm"
              role="status"
            ></span>
            Sign Up
          </button>
        </div>
      </div>
    </form>
    <div v-else class="alert alert-success mt-2">
      Please check your email to activate your account
    </div>
  </div>
</template>

<script>
import axios from "axios";
import VInput from "./../components/VInput.vue";

export default {
  name: "SignUpPage",
  components: { VInput },
  data() {
    return {
      isLoading: false,
      isSignupSuccessful: false,
      form: {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
      errors: {},
    };
  },
  computed: {
    disabled() {
      return this.form.password && this.form.confirmPassword
        ? this.form.password !== this.form.confirmPassword
        : true;
    },
    hasPasswordMismatch() {
      return this.form.password !== this.form.confirmPassword;
    },
  },
  methods: {
    submit() {
      this.isLoading = true;

      const requestBody = {
        username: this.form.username,
        email: this.form.email,
        password: this.form.password,
      };

      const url = "/api/1.0/users";

      axios
        .post(url, requestBody)
        .then(() => {
          this.isSignupSuccessful = true;
        })
        .catch((error) => {
          if (error.response.status === 400) {
            this.errors = error.response.data.validationErrors || {};
          }
          this.isLoading = false;
        });
    },
  },
  watch: {
    hasPasswordMismatch(v) {
      if (v) {
        this.errors.confirmPassword = "password mismatch";
      } else {
        delete this.errors.confirmPassword;
      }
    },
    "form.username"() {
      delete this.errors.username;
    },
    "form.email"() {
      delete this.errors.email;
    },
    "form.password"() {
      delete this.errors.password;
    },
  },
};
</script>
