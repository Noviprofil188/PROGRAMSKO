<template>
  <q-page class="page-background q-pa-md">
    <q-card class="q-pa-md card-content">
      <q-card-section>
        <div class="text-h5 text-primary">Kreiraj novi plan treninga</div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="naziv"
          label="Naziv plana"
          outlined
          class="q-mb-md"
          :rules="[rules.required]"
        />
        <q-input
          v-model="opis"
          label="Opis plana"
          type="textarea"
          outlined
          class="q-mb-md"
          :rules="[rules.required]"
        />
        <q-select
          v-model="odabraneVjezbe"
          :options="vjezbeOptions"
          label="Odaberi vježbe"
          multiple
          use-chips
          emit-value
          map-options
          outlined
          class="q-mb-md"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Spremi plan" color="primary" @click="spremiPlan" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      naziv: "",
      opis: "",
      odabraneVjezbe: [],
      vjezbeOptions: [],
      rules: {
        required: (val) => !!val || "Polje je obavezno",
      },
    };
  },
  methods: {
    async ucitajVjezbe() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          this.$q.notify({
            type: "negative",
            message: "Niste prijavljeni.",
          });
          return;
        }

        const response = await axios.get("https://localhost:4444/api/vjezbe", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        this.vjezbeOptions = response.data.map((v) => ({
          label: v.naziv,
          value: v.naziv,
        }));
      } catch (error) {
        console.error("Greška pri dohvaćanju vježbi:", error);
        this.$q.notify({
          type: "negative",
          message: "Greška pri dohvaćanju vježbi.",
        });
      }
    },
    async spremiPlan() {
      if (!this.naziv.trim() || !this.opis.trim()) {
        this.$q.notify({
          type: "negative",
          message: "Naziv i opis plana su obavezni.",
        });
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          this.$q.notify({
            type: "negative",
            message: "Niste prijavljeni.",
          });
          return;
        }

        await axios.post(
          "https://localhost:4444/api/planovi",
          {
            nazivPlana: this.naziv,
            opisPlana: this.opis,
            vjezbe: this.odabraneVjezbe,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );

        this.$q.notify({
          type: "positive",
          message: "Plan treninga uspješno spremljen!",
        });

        this.naziv = "";
        this.opis = "";
        this.odabraneVjezbe = [];
      } catch (error) {
        console.error("Greška pri spremanju plana:", error);
        this.$q.notify({
          type: "negative",
          message:
            error.response?.data?.message || "Neuspješno spremanje plana.",
        });
      }
    },
  },

  mounted() {
    this.ucitajVjezbe();
  },
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
  max-width: 800px;
}
</style>
