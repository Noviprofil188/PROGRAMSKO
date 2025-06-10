<template>
  <q-page padding class="page-background">
    <q-card>
      <q-card-section v-if="treningPlanovi.length === 0">
        <p>Trening planovi nisu pronađeni.</p>
      </q-card-section>

      <q-card-section v-for="plan in treningPlanovi" :key="plan.naziv">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ plan.naziv }}</div>
            <div>{{ plan.opis }}</div>
            <div class="text-subtitle2">Autor: {{ plan.autor }}</div>
          </q-card-section>

          <q-card-section>
            <div class="text-h6">Vježbe:</div>
            <q-list>
              <q-item v-for="vjezba in plan.vjezbe" :key="vjezba.naziv">
                <q-item-section>{{ vjezba.naziv }}</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      treningPlanovi: [],
    };
  },
  methods: {
    async fetchTreningPlanovi() {
      try {
        const token = localStorage.getItem("token"); // uzimamo token iz localStorage

        const res = await axios.get(
          "https://localhost:4444/api/trening-planovi",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.treningPlanovi = res.data;
      } catch (err) {
        console.error("Greška pri dohvaćanju planova:", err);
        this.$q.notify({
          type: "negative",
          message: "Došlo je do greške pri dohvaćanju planova!",
        });
      }
    },
  },
  mounted() {
    this.fetchTreningPlanovi();
  },
};
</script>

<style scoped>
.page-background {
  background-image: url("/plava.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
}
</style>
