<template lang="pug">
  div
    v-snackbar(v-model="snackbar" :color="color") {{ message }}
    v-dialog(
      v-model="dialog"
      @click:outside="resetDialog"
      width="500"
    )
      v-card(class="rounded-lg")
        v-card-title
        v-card-text Estas seguro que desea eliminar al cliente {{item.id}}?
        v-card-actions
          v-spacer
          v-btn(text @click="resetDialog") Cancelar
          v-btn(text @click="destroy(item.id)") Eliminar
    v-card(class="rounded-lg" :elevation="12")
      v-data-table(
        :headers='headers'
        :items='customers'
        :search="search"
        :loading="$fetchState.pending"
        sort-by='id'
      )
        template( v-slot:top)
          v-toolbar(flat)
            v-toolbar-title Clientes
            v-divider(inset vertical).mx-4
            v-text-field(v-model="search" append-icon="mdi-table-search" label="Buscar" single-line hide-details)
            v-spacer
            v-btn(color="primary" small :to="{name: 'clientes-nuevo'}")
              v-icon mdi-plus-circle-outline
        template( v-slot:item.actions="{ item }")
          v-icon(small @click="$router.push({name: 'clientes-id', params: { id: item.id}})").mr-2 mdi-pencil
          v-icon(small @click="confirmation(item)").mr-2 mdi-delete
</template>
<script>
export default {
  async fetch() {
    const customers = await this.$axios.$get('apps/clientes/')
    this.customers = customers
  },
  data: () => ({
    customers: [],
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Apellido', value: 'apellido' },
      { text: 'Nombre', value: 'nombre' },
      { text: 'Email', value: 'email' },
      { text: 'Teléfono', value: 'telefono' },
      {
        text: 'Acciones',
        align: 'right',
        value: 'actions',
        sortable: false,
        filterable: false,
      },
    ],
    dialog: false,
    item: { customer: '' },
    message: '',
    snackbar: false,
    color: 'green',
    search: '',
  }),
  methods: {
    async get() {
      const customers = await this.$axios.$get(`apps/clientes/`)
      this.customers = customers
    },
    confirmation(item) {
      this.item = item
      this.dialog = true
    },
    resetDialog() {
      this.item = { customer: '' }
      this.dialog = false
    },
    async destroy(id) {
      await this.$axios.$delete(`apps/clientes/${id}/`)
      const home = this.customers.find((c) => c.id === id).domicilio
      await this.$axios.$delete(`apps/domicilio/${home}/`)
      this.get()
      this.resetDialog()
      this.snack('El cliente ha sido eliminado.')
    },
    snack(message, color = 'green') {
      this.color = color
      this.message = message
      this.snackbar = true
    },
  },
}
</script>
