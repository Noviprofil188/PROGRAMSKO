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
          Admin Panel
        </q-toolbar-title>

        <!-- Prikaz prijavljenog korisnika -->
        <div class="q-mr-md text-subtitle1">
          Prijavljen: <strong>{{ username }}</strong>
        </div>

        <div>Quasar v{{ $q.version }}</div>

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
        <q-item-label header> Admin Links </q-item-label>
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
    title: "Admin Hub",
    caption: "Upravljačka ploča",
    icon: "home",
    link: "/admin",
  },
  {
    title: "Korisnici",
    caption: "Popis svih korisnika",
    icon: "people",
    link: "/admin/korisnici",
  },
  {
    title: "Dodaj vježbu",
    caption: "Dodaj novu vježbu",
    icon: "add_circle_outline",
    link: "/admin/AdminDodajVjezbu",
  },
  {
    title: "Kreiraj plan",
    caption: "Kreiraj novi plan",
    icon: "edit",
    link: "/admin/AdminKreirajPlan",
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
  localStorage.removeItem("username"); // Očisti username
  localStorage.removeItem("token"); // Očisti token
  username.value = null;
  router.push("/"); // Preusmjeri korisnika na početnu stranicu (MainLayout ili login)
};
</script>
