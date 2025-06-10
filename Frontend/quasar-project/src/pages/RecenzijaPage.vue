<template>
  <q-page class="page-background q-pa-md">
    <q-card class="q-pa-lg card-width">
      <q-card-section>
        <div class="text-h6">Dodaj svoju recenziju</div>
        <div class="text-subtitle2">Autor: {{ Autor_recenzije }}</div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="Tekst_recenzije"
          label="Tekst recenzije"
          type="textarea"
          filled
          autogrow
          class="q-mb-md tekst-recenzije"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          label="Pošalji recenziju"
          color="primary"
          @click="posaljiRecenziju"
        />
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

const Tekst_recenzije = ref("");
const Autor_recenzije = ref("");
const poruka = ref("");
const bojaPoruke = ref("");

onMounted(() => {
  Autor_recenzije.value = localStorage.getItem("username") || "";
});

const posaljiRecenziju = async () => {
  poruka.value = "";

  if (!Tekst_recenzije.value || !Autor_recenzije.value) {
    poruka.value = "Tekst recenzije je obavezan.";
    bojaPoruke.value = "text-negative";
    return;
  }

  try {
    const token = localStorage.getItem("token"); // pretpostavka da je token tu

    const res = await axios.post(
      "https://localhost:4444/api/recenzije",
      {
        tekst: Tekst_recenzije.value,
        autor: Autor_recenzije.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    poruka.value = res.data.message;
    bojaPoruke.value = "text-positive";
    Tekst_recenzije.value = "";
  } catch (err) {
    poruka.value =
      err.response?.data?.message || "Greška pri slanju recenzije.";
    bojaPoruke.value = "text-negative";
  }
};
</script>

<style scoped>
.page-background {
  background-image: url("/plava.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;

  /* Centriranje sadržaja */
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-width {
  max-width: 700px;
  width: 100%;
}

.tekst-recenzije textarea {
  min-height: 250px; /* povećana visina */
  max-height: 400px;
}
</style>
