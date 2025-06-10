<template>
  <q-page class="page-background q-pa-md">
    <q-card class="q-pa-lg card-content">
      <q-card-section>
        <div class="text-h5">Dobrodošli!</div>
        <div class="text-subtitle2">Ovdje možete upravljati aplikacijom.</div>
      </q-card-section>

      <q-separator />

      <q-card-section class="q-gutter-md">
        <q-btn
          to="/admin/korisnici"
          label="Pregled korisnika"
          color="primary"
          icon="group"
          class="full-width"
        />
        <q-btn
          to="/admin/AdminDodajVjezbu"
          label="Dodaj novu vježbu"
          color="secondary"
          icon="fitness_center"
          class="full-width"
        />
        <q-btn
          to="/admin/AdminKreirajPlan"
          label="Kreiraj novi plan"
          color="accent"
          icon="calendar_today"
          class="full-width"
        />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-h6 q-mb-md">Statistike</div>
        <q-item-label v-if="statistika">
          <div>
            <strong>Ukupan broj korisnika:</strong> {{ statistika.korisnici }}
          </div>
          <div><strong>Ukupno vježbi:</strong> {{ statistika.vjezbe }}</div>
          <div><strong>Ukupno planova:</strong> {{ statistika.planovi }}</div>
        </q-item-label>
        <q-item-label v-else> Učitavanje statistike... </q-item-label>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const statistika = ref(null);

async function fetchStatistika() {
  try {
    const token = localStorage.getItem("token");
    console.log("Token:", token);

    if (!token) {
      console.warn("Nema tokena u localStorage, ne mogu dohvatiti statistiku.");
      return;
    }

    const res = await axios.get("https://localhost:4444/api/statistika", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Statistika response:", res.data);
    statistika.value = res.data;
  } catch (error) {
    console.error("Greška pri dohvaćanju statistike:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

onMounted(() => {
  fetchStatistika();
});
</script>

<style scoped>
.page-background {
  min-height: 100vh;
  background-image: url("/plava.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.card-content {
  max-width: 800px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
}

.q-gutter-md > * {
  margin-bottom: 16px;
}
.full-width {
  width: 100%;
}
</style>
