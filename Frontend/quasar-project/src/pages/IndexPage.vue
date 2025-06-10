<template>
  <q-page class="flex flex-center" style="position: relative; height: 100vh">
    <!-- Slika -->
    <img
      alt="naslovna slika"
      src="~assets/trening.jpg"
      style="width: 100%; height: 100%; object-fit: cover"
    />

    <!-- Tekst uokviren u središtu slike -->
    <q-card
      class="text-center q-pa-md"
      style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        max-width: 80%;
        background-color: rgba(255, 255, 255, 0.7);
        border-radius: 8px;
      "
    >
      <q-card-section>
        <!-- Naslov -->
        <h2 class="welcome-title">
          Dobrodošli{{ username ? `, ${username}` : "" }} na TreningApp
        </h2>

        <!-- Popratni tekst -->
        <p class="popratni-title">
          Ovdje započinje vaša avantura! Pridružite nam se!
        </p>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";

defineOptions({
  name: "IndexPage",
});

const username = ref("");

// Kad se stranica učita, dohvatimo korisničko ime iz localStorage
onMounted(() => {
  username.value = localStorage.getItem("username") || "";
});
</script>

<style scoped>
.welcome-title {
  font-family: "Roboto", sans-serif;
  font-weight: 500;
  color: #1976d2;
}

.popratni-title {
  color: black;
  font-size: 1.25rem;
  font-weight: 500;
}
</style>
