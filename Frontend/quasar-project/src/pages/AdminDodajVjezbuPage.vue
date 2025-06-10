<template>
  <q-page class="page-background q-pa-md">
    <q-card class="q-pa-lg card-content" style="max-width: 600px; margin: auto">
      <q-card-section>
        <div class="text-h6">Dodaj novu vježbu</div>
        <div class="text-subtitle2">Autor: {{ autor }}</div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="naziv" label="Naziv vježbe" filled class="q-mb-md" />
        <q-input
          v-model="opis"
          label="Opis vježbe"
          type="textarea"
          filled
          autogrow
          class="q-mb-md"
        />

        <q-select
          v-model="kategorija"
          :options="kategorijeOpcije"
          label="Kategorija"
          filled
          class="q-mb-md"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Dodaj vježbu" color="primary" @click="dodajVjezbu" />
      </q-card-actions>

      <q-card-section v-if="poruka" :class="bojaPoruke">
        {{ poruka }}
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const naziv = ref("");
const opis = ref("");
const kategorija = ref("");
const autor = ref("");

const poruka = ref("");
const bojaPoruke = ref("");

const kategorijeOpcije = ["Snaga", "Kondicija", "Fleksibilnost"];

onMounted(() => {
  autor.value = localStorage.getItem("username") || "";
});

const dodajVjezbu = async () => {
  poruka.value = "";

  if (!naziv.value || !opis.value || !kategorija.value || !autor.value) {
    poruka.value = "Sva polja su obavezna.";
    bojaPoruke.value = "text-negative";
    return;
  }

  const token = localStorage.getItem("token"); // preuzmi token iz localStorage

  if (!token) {
    poruka.value = "Niste prijavljeni. Prijavite se ponovno.";
    bojaPoruke.value = "text-negative";
    return;
  }

  try {
    const res = await axios.post(
      "https://localhost:4444/api/dodajVjezbu",
      {
        naziv: naziv.value,
        opis: opis.value,
        kategorija: kategorija.value,
        autor: autor.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // dodaj token u header
        },
      }
    );

    poruka.value = res.data.message;
    bojaPoruke.value = "text-positive";

    // Reset forme
    naziv.value = "";
    opis.value = "";
    kategorija.value = "";
  } catch (err) {
    poruka.value = err.response?.data?.message || "Greška pri slanju podataka.";
    bojaPoruke.value = "text-negative";
  }
};
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
}

.card-content {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 600px;
}
</style>
