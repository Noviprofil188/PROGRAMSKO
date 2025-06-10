<template>
  <q-page class="register-page">
    <!-- Overlay sloj za zatamnjenje pozadine -->
    <div class="overlay"></div>

    <!-- Sadržaj forme -->
    <div class="register-container q-pa-md column items-center justify-center">
      <h5 class="text-center q-mb-md">Registracija</h5>

      <q-form @submit.prevent="register" class="form-card">
        <q-input v-model="username" label="Korisničko ime" filled required />
        <q-input
          v-model="password"
          type="password"
          label="Lozinka"
          filled
          required
        />
        <q-input v-model="ime" label="Ime" filled />
        <q-input v-model="prezime" label="Prezime" filled />
        <q-input v-model="email" label="Email" filled type="email" />

        <q-select
          v-model="uloga"
          :options="['Korisnik', 'Trener']"
          label="Uloga"
          filled
          required
        />

        <q-btn
          label="Registriraj se"
          type="submit"
          color="primary"
          class="full-width q-mt-md"
        />
      </q-form>

      <div
        v-if="message"
        class="q-mt-md"
        :class="{ 'text-positive': success, 'text-negative': !success }"
      >
        {{ message }}
      </div>

      <q-btn
        flat
        label="Već imaš račun? Prijavi se"
        color="secondary"
        class="q-mt-lg"
        @click="goToLogin"
      />
    </div>
  </q-page>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      password: "",
      ime: "",
      prezime: "",
      email: "",
      uloga: "",
      message: "",
      success: false,
    };
  },
  methods: {
    async register() {
      this.message = "";
      this.success = false;
      try {
        const res = await axios.post("https://localhost:4444/register", {
          username: this.username,
          lozinka: this.password,
          ime: this.ime,
          prezime: this.prezime,
          email: this.email,
          uloga: this.uloga,
        });

        this.message = res.data.message;
        this.success = true;

        this.username = "";
        this.password = "";
        this.ime = "";
        this.prezime = "";
        this.email = "";
        this.uloga = "";

        setTimeout(() => {
          this.$router.push("/login");
        }, 1000);
      } catch (error) {
        this.message =
          error.response?.data?.message || "Greška prilikom registracije";
        this.success = false;
      }
    },
    goToLogin() {
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.register-page {
  position: relative;
  min-height: 100vh;
  background-image: url("/gym.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.register-container {
  position: relative;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.92);
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.form-card {
  width: 100%;
}
</style>
