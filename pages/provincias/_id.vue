<template lang="pug">
  div
    v-snackbar(v-model="snackbar" :color="color") {{ message }}
    v-card(:loading="$fetchState.pending" class="rounded-lg" :elevation="12")
      v-card-title Editar provincia
      v-card-text
        v-form(ref="form" v-model="valid" lazy-validation)
          v-row
            v-col(cols="12" md="6")
              v-text-field(
                label="Id"
                v-model="province.id"
                disabled
              )
            v-col(cols="12" md="6")
              v-text-field(
                label="Provincia"
                v-model="province.provincia"
                :rules="[rules.required, rules.counter]"
                autofocus
              )
            v-col(cols="12" md="6")
              v-select(
                label="País"
                :items="countries"
                item-text="pais"
                item-value="id"
                v-model="province.pais"
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
  name: 'ProvinciasId',
  async fetch() {
    const { id } = this.$route.params
    const province = await this.$axios.$get(`apps/provincia/${id}/`)
    const countries = await this.$axios.$get(`apps/pais/`)
    this.province = province
    this.countries = countries
  },
  data: () => ({
    countries: [],
    province: {},
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
          await this.$axios.$put(`apps/provincia/${this.province.id}/`, {
            provincia: this.province.provincia,
            pais: this.province.pais,
          })
          this.snack('Provincia actualizada!')
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
