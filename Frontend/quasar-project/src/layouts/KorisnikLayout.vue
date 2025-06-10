<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="text-weight-bolder text-h4">
          TreningApp
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>

        <!-- Prikaz korisničkog imena -->
        <div v-if="username" class="q-ml-md q-mr-md">
          Dobrodošao, {{ username }}!
        </div>

        <!-- Logout dugme -->
        <q-btn
          flat
          dense
          label="Odjava"
          color="negative"
          @click="logout"
          class="q-ml-md"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Izbornik </q-item-label>
        <q-item
          v-for="link in linksList"
          :key="link.title"
          clickable
          @click="goToPage(link.link)"
        >
          <q-item-section avatar>
            <q-icon :name="link.icon" />
          </q-item-section>
          <q-item-section>
            <div>{{ link.title }}</div>
            <div class="text-caption">{{ link.caption }}</div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const linksList = [
  {
    title: "Naslovnica",
    caption: "početna stranica",
    icon: "home",
    link: "/korisnik",
  },
  {
    title: "O nama",
    caption: "naša priča",
    icon: "info",
    link: "/korisnik/oNama",
  },
  {
    title: "Vjezbe",
    caption: "Popis svih vjezbi",
    icon: "fitness_center",
    link: "/korisnik/vjezbe",
  },
  {
    title: "Planovi",
    caption: "Popis svih planova",
    icon: "fitness_center",
    link: "/korisnik/planovi",
  },
  {
    title: "Recenzije",
    caption: "Vaše mišljenje nam je bitno!",
    icon: "rate_review",
    link: "/korisnik/recenzija",
  },
];

const leftDrawerOpen = ref(false);
const router = useRouter();
const username = ref(null);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function goToPage(link) {
  router.push(link);
}

// Dohvati username iz localStorage kad se komponenta mounta
onMounted(() => {
  username.value = localStorage.getItem("username");
});

// Logout funkcija
const logout = () => {
  localStorage.removeItem("username");
  localStorage.removeItem("token"); // Dodaj ako čuvaš token
  username.value = null;
  router.push("/"); // ili na login, zavisno od tvoje rute
};
</script>
