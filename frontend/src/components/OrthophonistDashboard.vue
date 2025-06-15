<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Mes Patients</h2>

    <div v-if="patients.length" class="space-y-4">
      <div
        v-for="patient in patients"
        :key="patient.id"
        class="border p-4 rounded shadow bg-white"
      >
        <h3 class="text-lg font-semibold mb-1">
          {{ patient.firstName }} {{ patient.lastName }}
        </h3>
        <p>Date de naissance : {{ formatDate(patient.birthDate) }}</p>
        <p>Abonnement : 
          <span :class="statusColor(patient.subscriptionStatus)">
            {{ patient.subscriptionStatus }}
          </span>
          (jusqu'au {{ formatDate(patient.subscriptionEndDate) }})
        </p>
        <p>Sessions terminées : <strong>{{ patient.completedSessions }}</strong></p>
      </div>
    </div>

    <p v-else>Aucun patient trouvé.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Simulé ici, à remplacer par l'ID de l'ortho connecté (ex : via Vuex, auth, etc.)
const orthophonisteId = 1
const patients = ref([])

onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:3000/api/orthophonistes/${orthophonisteId}/dashboard`)
    patients.value = response.data.patients
  } catch (err) {
    console.error('Erreur de chargement du dashboard orthophoniste :', err)
  }
})

function formatDate(dateStr) {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR')
}

function statusColor(status) {
  if (status === 'active') return 'text-green-600 font-medium'
  if (status === 'expired') return 'text-red-600 font-medium'
  return 'text-gray-600'
}
</script>
