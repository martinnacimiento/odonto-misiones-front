<template lang="pug">
  v-dialog(v-model="dialog" @click:outside="$emit('change', $event.target.dialog)" width="350px")
    v-card(class="rounded-xl" :elevation="12")
      v-toolbar(
        color="primary"
        dark
        flat
      )
        v-toolbar-title Login
      v-card-text
        v-form(ref="form" v-model="valid" lazy-validation)
          v-text-field(
            v-model="username"
            label="Nombre de usuario"
            prepend-icon="mdi-account"
          )
          v-text-field(
            v-model="password"
            label="Contraseña"
            type="password"
            prepend-icon="mdi-lock"
            :rules="passwordRules"
          )
      v-card-actions
        v-spacer
        v-btn(
          text
          class="mr-4"
          color="primary"
          :loading="loading"
          @click="$store.dispatch('get_token', { username, password })"
        ) Iniciar Sesión
</template>
<script>
export default {
  model: {
    prop: 'dialog',
    event: 'change',
  },
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    username: null,
    password: null,
    passwordRules: [],
    loading: false,
    valid: false,
  }),
}
</script>
