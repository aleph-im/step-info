<template>
  <q-footer
    :class="
      ($q.dark.isActive ? 'text-white' : 'text-black') + ' q-pa-sm bg-header bg-dark'
    "
  >
    <q-toolbar class="row-sm">
      <div class="flex items-center justify-start justify-sm-center col-grow">
        <a
          id="powered-logo"
          href="https://aleph.im"
          target="_blank"
          rel="noopener"
          class="flex items-center text-white text-decoration-none"
        >
          Powered by
          <img
            src="../assets/aleph-logo2.svg"
            alt="powered by aleph.im"
            class="q-ml-sm"
          />
        </a>
      </div>
      <div class="social-links flex q-col-gutter-md">
        <a
          href="https://t.me/alephim"
          target="_blank"
          class="footer-link col text-white text-decoration-none"
        >
          <q-icon name="fab fa-telegram-plane" color="white" />
        </a>
        <a
          href="https://twitter.com/aleph_im"
          target="_blank"
          class="footer-link col text-white text-decoration-none"
        >
          <q-icon name="fab fa-twitter" color="white" />
        </a>
      </div>
    </q-toolbar>
  </q-footer>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "MainFooter",
  components: {},
});
</script>

<style lang="scss">
#powered-logo {
  color: white !important;
  text-decoration: none;

  img {
    @media (max-width: $breakpoint-xs-max) {
      height: 20px;
    }

    height: 30px;
  }
}

.social-links {
  margin-left: -88px;

  @media (max-width: $breakpoint-xs-max) {
    margin-left: 0;
  }
}

.footer-link {
  text-decoration: none;
  font-size: 1.25rem;

  > i {
    color: #a3a6a9;
  }
}

.text-decoration-none {
  text-decoration: none;
}
</style>
