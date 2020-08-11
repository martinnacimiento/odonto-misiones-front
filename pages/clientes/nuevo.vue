<template lang="pug">
  div
    v-snackbar(v-model="snackbar" :color="color") {{ message }}
    v-card(class="rounded-lg" :elevation="12")
      v-card-title Nuevo cliente
      v-card-text
        v-form(ref="form" v-model="valid" lazy-validation)
          v-divider(inset)
          v-subheader(inset) Datos del cliente
          v-row
            v-col(cols="12" md="6")
              v-text-field(
                label="Nombre"
                v-model="customer.name"
                :rules="[rules.required, rules.counter(200)]"
              )
            v-col(cols="12" md="6")
              v-text-field(
                label="Apellido"
                v-model="customer.surname"
                :rules="[rules.required, rules.counter(200)]"
              )
            v-col(cols="12" md="6")
              v-text-field(
                label="Teléfono"
                v-model="customer.telephone"
                :rules="[rules.required, rules.counter(10), rules.number]"
              )
            v-col(cols="12" md="6")
              v-text-field(
                label="Email"
                v-model="customer.email"
                :rules="[rules.required, rules.counter(100), rules.email]"
              )
            v-col(cols="12" md="6")
              v-text-field(
                label="Nota"
                v-model="customer.note"
                :rules="[rules.required, rules.counter(200)]"
              )
          v-divider(inset)
          v-subheader(inset) Datos del domicilio
          v-row
            v-col(cols="12" md="6")
              v-select(
                  label="País"
                  :items="countries"
                  item-text="pais"
                  item-value="id"
                  v-model="countrySelected"
                  :rules="[rules.required]" 
                  :loading="$fetchState.pending"
              )
            v-col(cols="12" md="6")
              v-select(
                label="Provincia"
                :items="provincesFilter"
                item-text="provincia"
                item-value="id"
                v-model="provinceSelected"
                :rules="[rules.required]" 
                :loading="$fetchState.pending"
              )
            v-col(cols="12" md="6")
              v-select(
                  label="Localidad"
                  :items="localitiesFilter"
                  item-text="localidad"
                  item-value="id"
                  v-model="localitySelected"
                  :rules="[rules.required]" 
                  :loading="$fetchState.pending"
              )
            v-col(cols="12" md="6")
              v-select(
                  label="Barrio"
                  :items="districtsFilter"
                  item-text="barrio"
                  item-value="id"
                  v-model="districtSelected"
                  :rules="[rules.required]" 
                  :loading="$fetchState.pending"
              )
            v-col(cols="12" md="6")
              v-text-field(
                label="Calle"
                v-model="home.street"
                :rules="[rules.required, rules.counter(100)]"
              ) 
            v-col(cols="12" md="6")
              v-text-field(
                label="Numero"
                v-model="home.number"
                :rules="[rules.required, rules.counter(50), rules.number]"
              ) 
            v-col(cols="12" md="6")
              v-text-field(
                label="Manzana"
                v-model="home.apple"
                :rules="[rules.required, rules.counter(50)]"
              ) 
            v-col(cols="12" md="6")
              v-text-field(
                label="Departamento"
                v-model="home.department"
                :rules="[rules.required, rules.counter(50)]"
              ) 
            v-col(cols="12" md="6")
              v-text-field(
                label="Piso"
                v-model="home.floor"
                :rules="[rules.required, rules.counter(50), rules.number]"
              )
      v-card-actions
        v-spacer
        v-btn(outlined @click="$router.go(-1)") Volver
        v-btn(outlined @click="save" :loading="loading") Guardar
</template>
<script>
export default {
  name: 'ClienteId',
  async fetch() {
    const countries = await this.$axios.$get(`apps/pais/`)
    const provinces = await this.$axios.$get(`apps/provincia/`)
    const cities = await this.$axios.$get(`apps/localidad/`)
    const districts = await this.$axios.$get(`apps/barrio/`)
    this.countries = countries
    this.provinces = provinces
    this.localities = cities
    this.districts = districts
  },
  data: () => ({
    customer: { customer: '' },
    home: {}, // Domicilio
    countries: [],
    provinces: [],
    localities: [],
    districts: [],
    countrySelected: null,
    provinceSelected: null,
    localitySelected: null,
    districtSelected: null,
    valid: false,
    snackbar: false,
    color: 'green',
    message: '',
    rules: {
      required: (value) => !!value || 'Requerido.',
      counter: (limit) => (value) =>
        value?.length <= limit || `${limit} caracteres máximo.`,
      email: (v) =>
        /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(
          v
        ) || 'El email no es válido.',
      number: (v) => /^[0-9]+$/.test(v) || 'Solo números.',
    },
    loading: false,
  }),
  computed: {
    provincesFilter() {
      if (!this.countrySelected) return this.provinces
      return this.provinces.filter((p) => p.pais === this.countrySelected)
    },
    localitiesFilter() {
      if (!this.provinceSelected) return this.localities
      return this.localities.filter(
        (l) => l.provincia === this.provinceSelected
      )
    },
    districtsFilter() {
      if (!this.localitySelected) return this.districts
      return this.districts.filter((d) => d.localidad === this.localitySelected)
    },
  },
  watch: {
    provinceSelected(id) {
      if (this.countrySelected || !id) return 'Ok'
      const province = this.provinces.find((p) => p.id === id)
      const country = this.countries.find((c) => c.id === province.pais)
      this.countrySelected = country.id
    },
    localitySelected(id) {
      if (this.provinceSelected || !id) return 'Ok'
      const locality = this.localities.find((l) => l.id === id)
      const province = this.provinces.find((p) => p.id === locality.provincia)
      this.provinceSelected = province.id
    },
    districtSelected(id) {
      if (this.localitySelected || !id) return 'Ok'
      const district = this.districts.find((d) => d.id === id)
      const locality = this.localities.find((l) => l.id === district.localidad)
      this.localitySelected = locality.id
    },
  },
  methods: {
    async save() {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          const home = await this.$axios.$post('apps/domicilio/', {
            calle: this.home.street,
            nro: this.home.number,
            mz: this.home.apple,
            departamento: this.home.department,
            piso: this.home.floor,
            barrio: this.districtSelected,
          })
          await this.$axios.$post(`apps/clientes/`, {
            nombre: this.customer.name,
            apellido: this.customer.surname,
            domicilio: home.id,
            telefono: this.customer.telephone,
            email: this.customer.email,
            nota: this.customer.note,
          })
          this.snack('Cliente creado!')
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
