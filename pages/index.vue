<template lang="pug">
  v-parallax(dark src='https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg')
    v-row(align='center' justify='center')
      v-col.text-center(cols='12')
        h1.display-1.font-weight-thin.mb-4 OdontoMisiones
        v-fade-transition
          h4.subheading(v-if="isAuth") Bienvenido {{$store.state.auth.username}}
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['can', 'isAuth']),
  },
}
</script>
