<template lang="pug">
  div
    v-snackbar(v-model="snackbar" :color="color") {{ message }}
    v-card(class="rounded-lg" :elevation="12")
      v-card-title Nuevo barrio
      v-card-text
        v-form(ref="form" v-model="valid" lazy-validation)
          v-row
            v-col(cols="12" md="6")
              v-text-field(
                label="barrio"
                v-model="district.district"
                :rules="[rules.required, rules.counter]"
              )
              v-col(cols="12" md="6")
              v-select(
                  label="localidad"
                  :items="city"
                  item-text="localidad"
                  item-value="id"
                  v-model="district.localidad_id"
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
  name: 'barrios-nuevo',
  async fetch() {
    const city = await this.$axios.$get(`apps/localidad/`)
    this.city = city
  },
  data: () => ({
    city: [],
    valid: false,
    snackbar: false,
    color: 'green',
    message: '',
    rules: {
      required: (value) => !!value || 'Requerido.',
      counter: (value) => value?.length <= 50 || '50 caracteres máximo.',
    },
    district: { district: '' },
    loading: false,
  }),
  methods: {
    async save() {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          await this.$axios.$post(`apps/barrio/`, {
            barrio: this.district.barrio,
            localidad_id: this.district.localidad_id,
          })
          this.snack('barrio creado!')
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
