<template lang="pug">
  v-menu(
    offset-y
    :close-on-content-click="false"
    open-on-hover
    transition="slide-y-transition"
  )
    template(#activator="{on}")
      v-btn(fab small v-on="on").mr-2
        v-icon mdi-account
    v-card(class="rounded-lg")
      v-list
        v-list-item
          v-list-item-avatar(size="44" color="primary")
            span(class="white--text headline") {{ $store.state.auth.username[0] }}
        
          v-list-item-content
            v-list-item-title {{ $store.state.auth.username }}
            v-list-item-subtitle {{ $store.state.auth.email }}
          
      v-divider
      v-card-actions
        v-spacer
        v-btn(text @click="$store.dispatch('delete_token')") Cerrar sesión
</template>
