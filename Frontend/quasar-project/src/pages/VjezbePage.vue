<template>
  <q-page padding class="page-background q-pa-md">
    <div class="row items-center q-mb-md">
      <q-select
        filled
        v-model="selectedKategorija"
        :options="['Sve', ...kategorije]"
        label="Filter po kategoriji"
        dense
        clearable
        @update:model-value="fetchVjezbe"
        style="max-width: 300px"
      />
    </div>

    <div v-if="loading" class="text-center q-my-xl">
      <q-spinner size="50px" color="primary" />
    </div>

    <div v-else>
      <div v-if="vjezbe.length === 0" class="text-center text-h6 text-grey">
        Nema dostupnih vježbi za odabranu kategoriju.
      </div>

      <div class="q-gutter-md row justify-center">
        <q-card
          v-for="(vjezba, index) in vjezbe"
          :key="index"
          class="bg-grey-10 text-white"
          style="width: 360px"
          bordered
          flat
        >
          <q-card-section>
            <div class="text-h5 text-weight-bold text-center q-mb-xs">
              {{ vjezba.naziv }}
            </div>

            <div class="text-body1 text-center q-mb-sm">
              {{ vjezba.opis || "Nema opisa" }}
            </div>

            <div class="text-subtitle2 text-center text-blue-3">
              Kategorija: {{ vjezba.kategorija || "Nedefinirano" }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const vjezbe = ref([]);
const kategorije = ref([]);
const selectedKategorija = ref("Sve");
const loading = ref(false);

async function fetchKategorije() {
  try {
    const token = localStorage.getItem("token");

    console.log("Token iz localStorage:", token);

    const res = await axios.get("https://localhost:4444/api/kategorije", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    kategorije.value = res.data;
  } catch (err) {
    console.error("Greška u dohvatu kategorija:", err);
  }
}

async function fetchVjezbe() {
  loading.value = true;
  try {
    let url = "https://localhost:4444/api/vjezbe";
    if (selectedKategorija.value && selectedKategorija.value !== "Sve") {
      url += "?kategorija=" + encodeURIComponent(selectedKategorija.value);
    }

    const token = localStorage.getItem("token"); // uzimamo token iz localStorage

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    vjezbe.value = res.data;
  } catch (err) {
    console.error("Greška u dohvatu vježbi:", err);
    vjezbe.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await fetchKategorije();
  await fetchVjezbe();
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
  flex-direction: column;
  padding: 16px;
}

.text-white {
  color: white;
}
.text-blue-3 {
  color: #42a5f5;
}
.bg-grey-10 {
  background-color: #212121;
}
</style>
