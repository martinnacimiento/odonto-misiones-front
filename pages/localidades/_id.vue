<template lang="pug">
  div
    v-snackbar(v-model="snackbar" :color="color") {{ message }}
    v-card(:loading="$fetchState.pending" class="rounded-lg" :elevation="12")
      v-card-title Editar localidad
      v-card-text
        v-form(ref="form" v-model="valid" lazy-validation)
          v-row
            v-col(cols="12" md="6")
              v-text-field(
                label="Id"
                v-model="locality.id"
                disabled
              )
            v-col(cols="12" md="6")
              v-text-field(
                label="localidad"
                v-model="locality.localidad"
                :rules="[rules.required, rules.counter]"
                autofocus
              )
            v-col(cols="12" md="6")
              v-select(
                label="Provincias"
                :items="provinces"
                item-text="provincia"
                item-value="id"
                v-model="locality.provincia"
                :rules="[rules.required]" 
                :loading="$fetchState.pending"
              )
      v-card-actions
        v-spacer
        v-btn(outlined @click="$router.go(-1)") Volver
        v-btn(outlined @click="save" :loading="loading") Guardar
</template>
<script>
export default {
  name: 'LocalidadsId',
  async fetch() {
    const { id } = this.$route.params
    const locality = await this.$axios.$get(`apps/localidad/${id}/`)
    const provinces = await this.$axios.$get(`apps/provincia/`)
    this.locality = locality
    this.provinces = provinces
  },
  data: () => ({
    provinces: [],
    locality: {},
    valid: false,
    snackbar: false,
    color: 'green',
    message: '',
    rules: {
      required: (value) => !!value || 'Requerido.',
      counter: (value) => value?.length <= 50 || '50 caracteres máximo.',
    },
    loading: false,
  }),
  methods: {
    async save() {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          await this.$axios.$put(`apps/localidad/${this.locality.id}/`, {
            localidad: this.locality.localidad,
            provincia: this.locality.provincia,
          })
          this.snack('localidad actualizada!')
        } catch (error) {
          this.snack(error.response.data.message, 'error')
        }
        this.loading = false
      }
    },
    snack(message, color = 'green') {
      this.color = color
      this.message = message
      this.snackbar = true
    },
  },
}
</script>
