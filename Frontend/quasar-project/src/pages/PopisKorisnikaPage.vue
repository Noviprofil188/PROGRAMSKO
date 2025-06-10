<template>
  <q-page class="page-background q-pa-md">
    <q-card class="shadow-2 rounded-borders card-content">
      <q-card-section>
        <div class="text-h5 text-primary text-center">Lista korisnika</div>
      </q-card-section>

      <q-card-section>
        <!-- Tabela za prikaz korisnika -->
        <q-table
          :rows="users"
          :columns="columns"
          row-key="id"
          flat
          bordered
          class="q-mt-md"
        >
          <!-- Uklonjen slot 'top' sa dugmetom -->
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      users: [],
      columns: [
        {
          name: "username",
          label: "Korisničko ime",
          align: "left",
          field: "Username",
          sortable: true,
        },
        {
          name: "ime",
          label: "Ime",
          align: "left",
          field: "Ime",
          sortable: true,
        },
        {
          name: "prezime",
          label: "Prezime",
          align: "left",
          field: "Prezime",
          sortable: true,
        },
        {
          name: "email",
          label: "Email",
          align: "left",
          field: "Email",
          sortable: true,
        },
      ],
    };
  },
  methods: {
    async fetchUsers() {
      try {
        const token = localStorage.getItem("token"); // ili gdje god ga čuvaš

        const response = await axios.get("https://localhost:4444/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.users = response.data;
      } catch (error) {
        console.error("Greška prilikom dohvaćanja korisnika:", error);
        this.$q.notify({
          type: "negative",
          message:
            "Nije moguće dohvatiti korisnike. Provjerite vezu s serverom ili prijavu.",
        });
      }
    },
  },
  mounted() {
    this.fetchUsers();
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
  padding: 16px;
}

.card-content {
  max-width: 800px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
}
</style>
