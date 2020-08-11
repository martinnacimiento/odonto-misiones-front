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
        v-card-text Estas seguro que desea eliminar la provincia {{item.provincia}}?
        v-card-actions
          v-spacer
          v-btn(text @click="resetDialog") Cancelar
          v-btn(text @click="destroy(item.id)") Eliminar
    v-card(class="rounded-lg" :elevation="12")
      v-data-table(
        :headers='headers'
        :items='provinces'
        :search="search"
        :loading="$fetchState.pending"
        sort-by='id'
      )
        template( v-slot:top)
          v-toolbar(flat)
            v-toolbar-title Provincias
            v-divider(inset vertical).mx-4
            v-text-field(v-model="search" append-icon="mdi-table-search" label="Buscar" single-line hide-details)
            v-spacer
            v-btn(color="primary" small :to="{name: 'provincias-nuevo'}")
              v-icon mdi-plus-circle-outline
        template( v-slot:item.actions="{ item }")
          v-icon(small @click="$router.push({name: 'provincias-id', params: { id: item.id}})").mr-2 mdi-pencil
          v-icon(small @click="confirmation(item)").mr-2 mdi-delete
</template>
<script>
export default {
  async fetch() {
    const provinces = await this.$axios.$get('apps/provincia/')
    this.provinces = provinces
  },
  data: () => ({
    provinces: [],
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Provincia', value: 'provincia' },
      {
        text: 'Acciones',
        align: 'right',
        value: 'actions',
        sortable: false,
        filterable: false,
      },
    ],
    dialog: false,
    item: { province: '' },
    message: '',
    snackbar: false,
    color: 'green',
    search: '',
  }),
  methods: {
    async get() {
      const provinces = await this.$axios.$get(`apps/provincia/`)
      this.provinces = provinces
    },
    confirmation(item) {
      this.item = item
      this.dialog = true
    },
    resetDialog() {
      this.item = { province: '' }
      this.dialog = false
    },
    async destroy(id) {
      try {
        await this.$axios.$delete(`apps/provincia/${id}/`)
        this.get()
        this.resetDialog()
        this.snack('La provincia ha sido eliminada.')
      } catch (error) {
        this.snack(
          'No puede eliminar la provincia porque tiene localidades asociadas, elimine primero las localidades.',
          'error'
        )
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
