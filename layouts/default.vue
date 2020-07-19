<template lang="pug">
  v-app(dark)
    OmModalLogin(v-model="modal")
    v-navigation-drawer(v-model='drawer' :mini-variant='miniVariant' :clipped='clipped' fixed app)
      v-list
        v-list-item(v-for='(item, i) in items' :key='i' :to='item.to' router exact)
          v-list-item-action
            v-icon {{ item.icon }}
          v-list-item-content
            v-list-item-title(v-text='item.title')
               
    v-app-bar(app color="transparent" flat absolute)
      v-btn(fab small @click.stop='drawer = !drawer').mr-2
        v-icon mdi-dots-vertical

      v-toolbar-title(v-text='title')
      v-spacer
      v-btn(fab small @click='modeDark = !modeDark').mr-2
        v-icon mdi-theme-light-dark
      v-btn(fab small @click="modal = !modal").mr-2
        v-icon mdi-account

    v-main
      v-container(fluid)
        nuxt
          
    v-footer(:fixed='fixed' app)
      span Nacimiento Martin & Senghaas Evelin © {{ new Date().getFullYear() }}
</template>

<script>
import OmModalLogin from '@/components/OmModalLogin'
export default {
  components: { OmModalLogin },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      modeDark: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Bienvenido',
          to: '/',
        },
        {
          icon: 'mdi-file-document',
          title: 'Clientes',
          to: '/clientes',
        },
        {
          icon: 'mdi-account-tie-outline',
          title: 'Equipos',
          to: '/equipos',
        },
        {
          icon: 'mdi-gender-non-binary',
          title: 'Insumos',
          to: '/insumos',
        },
        {
          icon: 'mdi-state-machine',
          title: 'Parámetros',
          to: '/parametros',
        },
        {
          icon: 'mdi-account-arrow-left',
          title: 'Proveedores',
          to: '/proveedores',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Servicios',
          to: '/servicios',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'OdontoMisiones',
      modal: false,
    }
  },
  watch: {
    modeDark(value) {
      this.$vuetify.theme.dark = value
    },
  },
}
</script>
