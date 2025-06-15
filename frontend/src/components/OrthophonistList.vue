<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Liste des orthophonistes</h2>

    <div v-if="orthophonistes.length" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="ortho in orthophonistes"
        :key="ortho.id"
        class="border rounded-xl shadow-md p-4 flex flex-col items-center text-center bg-white"
      >
        <img
          v-if="ortho.profilePictureUrl"
          :src="ortho.profilePictureUrl"
          alt="Photo de profil"
          class="w-24 h-24 rounded-full object-cover mb-3 border"
        />
        <div class="font-semibold text-lg">{{ ortho.firstName }} {{ ortho.lastName }}</div>
        <div class="text-sm text-gray-600">{{ ortho.city }} {{ ortho.postalCode }}</div>
        <div class="text-sm mt-1">{{ ortho.phone }}</div>
        <div class="text-sm text-blue-600">{{ ortho.email }}</div>

        <a
          v-if="ortho.doctolibUrl"
          :href="ortho.doctolibUrl"
          target="_blank"
          rel="noopener"
          class="mt-3 inline-block px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Voir sur Doctolib
        </a>
      </div>
    </div>

    <p v-else>Aucun orthophoniste trouvé.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const orthophonistes = ref([])

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/orthophonistes')
    orthophonistes.value = response.data
  } catch (err) {
    console.error('Erreur de chargement des orthophonistes :', err)
  }
})
</script>

<style scoped>
body {
  background-color: #f8f9fa;
}
</style>
