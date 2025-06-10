const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "oNama", component: () => import("pages/ONamaPage.vue") },
      { path: "login", component: () => import("pages/LoginPage.vue") },
      {
        path: "registracija",
        component: () => import("pages/RegistracijaPage.vue"),
      },
    ],
  },
  {
    path: "/admin",
    component: () => import("layouts/AdminLayout.vue"),
    meta: { requiresAuth: true, role: "Trener" }, // zamijenjeno sa "Trener"
    children: [
      { path: "", component: () => import("pages/AdminPage.vue") },
      {
        path: "korisnici",
        component: () => import("pages/PopisKorisnikaPage.vue"),
      },
      {
        path: "popisKorisnika",
        component: () => import("src/pages/PopisKorisnikaPage.vue"),
      },
      {
        path: "AdminDodajVjezbu",
        component: () => import("src/pages/AdminDodajVjezbuPage.vue"),
      },
      { path: "logout", component: () => import("pages/IndexPage.vue") },
      {
        path: "AdminKreirajPlan",
        component: () => import("pages/AdminKreirajPlanPage.vue"),
      },
    ],
  },
  {
    path: "/korisnik",
    component: () => import("layouts/KorisnikLayout.vue"),
    meta: { requiresAuth: true, role: "Korisnik" },
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "oNama", component: () => import("pages/ONamaPage.vue") },
      {
        path: "recenzija",
        component: () => import("src/pages/RecenzijaPage.vue"),
      },
      {
        path: "planovi",
        component: () => import("src/pages/PopisPlanovaPage.vue"),
      },
      { path: "vjezbe", component: () => import("pages/VjezbePage.vue") },
      { path: "logout", component: () => import("pages/IndexPage.vue") },
    ],
  },

  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
