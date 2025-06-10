<template>
  <q-page class="login-page">
    <!-- Overlay sloj -->
    <div class="overlay"></div>

    <!-- Sadržaj forme -->
    <div class="login-container q-pa-md column items-center justify-center">
      <h5 class="text-center q-mb-md">Prijava</h5>

      <q-form @submit.prevent="login" class="form-card">
        <q-input v-model="username" label="Korisničko ime" filled required />
        <q-input
          v-model="password"
          type="password"
          label="Lozinka"
          filled
          required
        />
        <q-btn
          label="Prijavi se"
          type="submit"
          color="primary"
          class="full-width q-mt-md"
        />
      </q-form>

      <div v-if="message" class="q-mt-md text-negative">{{ message }}</div>

      <q-btn
        flat
        label="Nemate račun? Registrirajte se"
        color="secondary"
        class="q-mt-lg"
        @click="goToRegister"
      />
    </div>
  </q-page>
</template>

<script>
import axios from "axios";
import jwt_decode from "jwt-decode";

export default {
  data() {
    return {
      username: "",
      password: "",
      message: "",
    };
  },
  methods: {
    async login() {
      try {
        const res = await axios.post("https://localhost:4444/login", {
          username: this.username,
          lozinka: this.password,
        });

        const token = res.data.token;
        localStorage.setItem("token", token);

        const decoded = jwt_decode(token);
        localStorage.setItem("uloga", decoded.uloga);
        localStorage.setItem("username", decoded.username);

        if (decoded.uloga === "Trener") {
          this.$router.push("/admin");
        } else if (decoded.uloga === "Korisnik") {
          this.$router.push("/korisnik");
        } else {
          this.message = "Nepoznata uloga.";
        }
      } catch (error) {
        this.message = error.response?.data?.message || "Došlo je do greške.";
      }
    },
    goToRegister() {
      this.$router.push("/registracija");
    },
  },
};
</script>

<style scoped>
.login-page {
  position: relative;
  min-height: 100vh;
  background-image: url("/lokot.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Sloj za zatamnjenje */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

/* Kontejner s formom */
.login-container {
  position: relative;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

/* Forma izgleda kao kartica */
.form-card {
  width: 100%;
}
</style>
