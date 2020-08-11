<template lang="pug">
  div
    v-snackbar(v-model="snackbar" :color="color") {{ message }}
    v-card(class="rounded-lg" :elevation="12")
      v-card-title Nueva localidad
      v-card-text
        v-form(ref="form" v-model="valid" lazy-validation)
          v-row
            v-col(cols="12" md="6")
              v-text-field(
                label="Localidad"
                v-model="locality.locality"
                :rules="[rules.required, rules.counter]"
              )
            v-col(cols="12" md="6")
                v-select(
                    label="Provincia"
                    :items="provinces"
                    item-text="provincia"
                    item-value="id"
                    v-model="locality.province"
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
  name: 'LocalidadsNuevo',
  async fetch() {
    const province = await this.$axios.$get(`apps/provincia/`)
    this.provinces = province
  },
  data: () => ({
    provinces: [],
    valid: false,
    snackbar: false,
    color: 'green',
    message: '',
    rules: {
      required: (value) => !!value || 'Requerido.',
      counter: (value) => value?.length <= 50 || '50 caracteres máximo.',
    },
    locality: { locality: '' },
    loading: false,
  }),
  methods: {
    async save() {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          await this.$axios.$post(`apps/localidad/`, {
            localidad: this.locality.locality,
            provincia: this.locality.province,
          })
          this.snack('localidad creada!')
          this.$refs.form.reset()
        } catch (error) {
          this.snack(error.response.data.detail, 'error')
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
