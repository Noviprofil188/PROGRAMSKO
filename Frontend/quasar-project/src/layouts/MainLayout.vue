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

        <!-- Dodatni gumb za PDF -->
        <q-btn
          flat
          dense
          label="Pomoć"
          color="Secondary"
          @click="openPdf"
          style="margin-left: 16px"
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
          :to="link.link"
          active-class="q-item--active"
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
import { ref } from "vue";

const linksList = [
  {
    title: "Naslovnica",
    caption: "početna stranica",
    icon: "home",
    link: "/",
  },

  {
    title: "O nama",
    caption: "naša priča",
    icon: "info",
    link: "/oNama",
  },
  {
    title: "Prijava",
    caption: "Ukoliko imate račun",
    icon: "login",
    link: "/login",
  },
  {
    title: "Registracija",
    caption: "Ukoliko nemate račun",
    icon: "how_to_reg",
    link: "/registracija",
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function openPdf() {
  window.open("/KorisnickeUpute_TreningApp.pdf", "_blank");
}
</script>
