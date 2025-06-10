<template>
  <q-page padding class="column items-center about-page">
    <q-card class="q-pa-lg card-content q-mb-lg">
      <q-card-section>
        <div class="text-h4 q-mb-md text-center">O nama</div>
        <div class="text-subtitle1 q-mb-md text-center">
          Dobrodošli na našu aplikaciju za trening planove!
        </div>

        <div class="q-mb-md">
          Naša platforma omogućuje vam jednostavno kreiranje i praćenje
          personaliziranih trening programa koji su prilagođeni vašim ciljevima,
          rasporedu i nivou kondicije.
        </div>

        <div class="q-mb-md">
          <strong>Naša misija</strong> je osnažiti svakog pojedinca na putu
          prema zdravijem životu, bilo da ste početnik, rekreativac ili iskusan
          sportaš. Pružamo intuitivno korisničko sučelje, stručne savjete i
          alate koji vas vode korak po korak.
        </div>

        <div class="q-mb-md">
          <strong>Vizija</strong> nam je postati vodeća digitalna platforma za
          fitness zajednicu, gdje korisnici ne samo da prate napredak, nego i
          uče, dijele iskustva i međusobno se motiviraju.
        </div>
      </q-card-section>
    </q-card>

    <q-card class="q-pa-lg card-content q-mb-lg">
      <q-card-section>
        <div class="text-h5 q-mb-md">Naše vrijednosti</div>
        <ul>
          <li>
            <strong>Transparentnost</strong> – uvijek znate što radite i zašto.
          </li>
          <li>
            <strong>Pristupačnost</strong> – aplikacija je dizajnirana za sve
            uzraste i nivoe znanja.
          </li>
          <li>
            <strong>Motivacija</strong> – uz notifikacije, ciljeve i praćenje
            napretka.
          </li>
          <li>
            <strong>Stručnost</strong> – sav sadržaj izrađen je uz suradnju s
            certificiranim trenerima.
          </li>
        </ul>
      </q-card-section>
    </q-card>

    <q-card class="q-pa-lg card-content q-mb-lg">
      <q-card-section>
        <div class="text-h5 q-mb-md">Naš tim</div>
        <div>
          Iza aplikacije stoji multidisciplinarni tim sastavljen od softverskih
          inženjera, osobnih trenera i dizajnera korisničkog iskustva. Svaki
          član tima donosi svoje jedinstveno znanje s ciljem pružanja
          najkvalitetnijeg digitalnog fitness alata.
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: "AboutPage",
};
</script>

<style scoped>
.about-page {
  background-image: url("/plava.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
}

.card-content {
  width: 100%;
  max-width: 800px;
  background-color: rgba(255, 255, 255, 0.92);
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
}
</style>
