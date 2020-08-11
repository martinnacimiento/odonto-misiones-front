<template lang="pug">
  div
    v-snackbar(v-model="snackbar" :color="color") {{ message }}
    v-card(class="rounded-lg" :elevation="12")
      v-card-title Editar cliente
      v-card-text
        v-form(ref="form" v-model="valid" lazy-validation)
          v-row
            v-col(cols="12" md="6")
              v-text-field(
                label="Id"
                v-model="customer.id"
                disabled
              )
            v-col(cols="12" md="6")
              v-text-field(
                label="Nombre"
                v-model="customer.nombre"
                :rules="[rules.required, rules.counter(200)]"
              )
            v-col(cols="12" md="6")
              v-text-field(
                label="Apellido"
                v-model="customer.apellido"
                :rules="[rules.required, rules.counter(200)]"
              )
            v-col(cols="12" md="6")
              v-text-field(
                label="Teléfono"
                v-model="customer.telefono"
                :rules="[rules.required, rules.counter(10)]"
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
                v-model="customer.nota"
                :rules="[rules.required, rules.counter(200)]"
              )
          v-divider
          h3 Domicilio
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
                v-model="home.barrio"
                :rules="[rules.required]" 
                :loading="$fetchState.pending"
              )
            v-col(cols="12" md="6")
              v-text-field(
                label="Calle"
                v-model="home.calle"
                :rules="[rules.required, rules.counter(100)]"
              ) 
            v-col(cols="12" md="6")
              v-text-field(
                label="Numero"
                v-model="home.nro"
                :rules="[rules.required, rules.counter(50)]"
              ) 
            v-col(cols="12" md="6")
              v-text-field(
                label="Manzana"
                v-model="home.mz"
                :rules="[rules.required, rules.counter(50)]"
              ) 
            v-col(cols="12" md="6")
              v-text-field(
                label="Departamento"
                v-model="home.departamento"
                :rules="[rules.required, rules.counter(50)]"
              )
            v-col(cols="12" md="6")
              v-text-field(
                label="Piso"
                v-model="home.piso"
                :rules="[rules.required, rules.counter(50)]"
              )
      v-card-actions
        v-spacer
        v-btn(outlined @click="$router.go(-1)") Volver
        v-btn(outlined @click="save" :loading="loading") Guardar
</template>
<script>
export default {
  async fetch() {
    const { id } = this.$route.params
    const customer = await this.$axios.$get(`apps/clientes/${id}/`)
    const home = await this.$axios.$get(`apps/domicilio/${customer.domicilio}/`)
    const countries = await this.$axios.$get(`apps/pais/`)
    const provinces = await this.$axios.$get(`apps/provincia/`)
    const cities = await this.$axios.$get(`apps/localidad/`)
    const districts = await this.$axios.$get(`apps/barrio/`)
    this.customer = customer
    this.home = home
    this.countries = countries
    this.provinces = provinces
    this.localities = cities
    this.districts = districts
    this.districtSelected = home.barrio
  },
  data: () => ({
    customer: {},
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
      if (this.countrySelected) return 'Ok'
      const province = this.provinces.find((p) => p.id === id)
      const country = this.countries.find((c) => c.id === province.pais)
      this.countrySelected = country.id
    },
    localitySelected(id) {
      if (this.provinceSelected) return 'Ok'
      const locality = this.localities.find((l) => l.id === id)
      const province = this.provinces.find((p) => p.id === locality.provincia)
      this.provinceSelected = province.id
    },
    districtSelected(id) {
      if (this.localitySelected) return 'Ok'
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
          const home = await this.$axios.$put(
            `apps/domicilio/${this.home.id}/`,
            {
              calle: this.home.calle,
              nro: this.home.nro,
              mz: this.home.mz,
              departamento: this.home.departamento,
              piso: this.home.piso,
              barrio: this.home.barrio,
            }
          )
          await this.$axios.$put(`apps/clientes/${this.customer.id}/`, {
            nombre: this.customer.nombre,
            apellido: this.customer.apellido,
            domicilio: home.id,
            telefono: this.customer.telefono,
            email: this.customer.email,
            nota: this.customer.nota,
          })
          this.snack('Cliente actualizado!')
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
