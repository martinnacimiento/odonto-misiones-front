<template lang="pug">
  div
    v-snackbar(v-model="snackbar" :color="color") {{ message }}
    v-card(:loading="$fetchState.pending" class="rounded-lg" :elevation="12")
      v-card-title Editar barrio
      v-card-text
        v-form(ref="form" v-model="valid" lazy-validation)
          v-row
            v-col(cols="12" md="6")
              v-text-field(
                label="Id"
                v-model="district.id"
                disabled
              )
            v-col(cols="12" md="6")
              v-text-field(
                label="Barrio"
                v-model="district.barrio"
                :rules="[rules.required, rules.counter]"
                autofocus
              )
            v-col(cols="12" md="6")
              v-select(
                  label="Localidad"
                  :items="cities"
                  item-text="localidad"
                  item-value="id"
                  v-model="district.localidad"
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
  name: 'barrios-id',
  async fetch() {
    const { id } = this.$route.params
    const district = await this.$axios.$get(`apps/barrio/${id}/`)
    const cities = await this.$axios.$get(`apps/localidad/`)
    this.district = district
    this.cities = cities
  },
  data: () => ({
    district: {},
    cities: [],
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
          await this.$axios.$put(`apps/barrio/${this.district.id}/`, {
            barrio: this.district.barrio,
            localidad: this.district.localidad,
          })
          this.snack('Barrio actualizada!')
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
