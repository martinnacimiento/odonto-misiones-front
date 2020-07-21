<template lang="pug">
  v-app(dark)
    OmModalLogin(v-model="modal")
    v-navigation-drawer(
      v-if="isAuth"
      v-model='drawer'
      :mini-variant='miniVariant'
      :clipped='clipped'
      fixed
      app
      class="primary accent-4"
      dark
      src="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
    )
      v-list
        template(v-for='(item, i) in items')
          v-list-item(v-if="!item.childs" :key='i' :to='item.to' router exact)
            v-list-item-action
              v-icon {{ item.icon }}
            v-list-item-content
              v-list-item-title(v-text='item.title')
          v-list-group(
            v-else
            :key='i'
            :prepend-icon="item.icon"
          )
            template(#activator v-for="(c, i) in item.childs")
              v-list-item-title(:key="i") {{ item.title }}
            template(v-for='(c, i2) in item.childs')
              v-list-item(:key='i2' :to='c.to' router exact)
                v-list-item-action
                  v-icon {{ c.icon }}
                v-list-item-content
                  v-list-item-title(v-text='c.title')
    v-app-bar(app color="transparent" flat absolute)
      v-slide-x-transition
        v-btn(v-if="isAuth" fab small @click.stop='drawer = !drawer').mr-2
          v-icon mdi-dots-vertical

      v-toolbar-title(v-text='title')
      v-spacer
      v-fade-transition
        v-tooltip(v-if="!isAuth" bottom)
          template(#activator="{on}")
            v-btn(fab small @click="modal = !modal" v-on="on").mr-2
              v-icon mdi-login
          span Iniciar sesión
      v-fade-transition
        OmMenuUser(v-if="isAuth")
      v-tooltip(bottom)
        template(#activator="{on}")
          v-btn(fab small @click='modeDark = !modeDark' v-on="on").mr-2
            v-icon mdi-theme-light-dark
        span Modo noche
    v-main
      v-container(fluid)
        nuxt
          
    v-footer(:fixed='fixed' app)
      span Nacimiento Martin & Senghaas Evelin © {{ new Date().getFullYear() }}
</template>

<script>
import { mapGetters } from 'vuex'
import OmModalLogin from '@/components/OmModalLogin'
import OmMenuUser from '@/components/OmMenuUser'
export default {
  components: { OmModalLogin, OmMenuUser },
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
          permission: '*',
        },
        {
          icon: 'mdi-account-heart',
          title: 'Clientes',
          to: '/clientes',
          permission: 'view_clients',
        },
        {
          icon: 'mdi-toolbox',
          title: 'Equipos',
          to: '/equipos',
          permission: 'view_equipment',
        },
        {
          icon: 'mdi-basket-fill',
          title: 'Insumos',
          to: '/insumos',
          permission: 'view_supplies',
        },
        {
          icon: 'mdi-shape',
          title: 'Parámetros',
          permission: 'view_parameters',
          childs: [
            { title: 'Países', icon: '', to: '/paises', permission: '' },
            {
              title: 'Provincias',
              icon: '',
              to: '/provincias',
              permission: '',
            },
            {
              title: 'Localidades',
              icon: '',
              to: '/localidades',
              permission: '',
            },
            {
              title: 'Barrios',
              icon: '',
              to: '/barrios',
              permission: '',
            },
            {
              title: 'Domicilios',
              icon: '',
              to: '/domicilios',
              permission: '',
            },
          ],
        },
        {
          icon: 'mdi-account-supervisor-circle',
          title: 'Proveedores',
          to: '/proveedores',
          permission: 'view_providers',
        },
        {
          icon: 'mdi-hand-heart',
          title: 'Servicios',
          to: '/servicios',
          permission: 'view_services',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'OdontoMisiones',
      modal: false,
    }
  },
  computed: {
    ...mapGetters(['can', 'isAuth']),
  },
  watch: {
    modeDark(value) {
      this.$vuetify.theme.dark = value
    },
  },
}
</script>
