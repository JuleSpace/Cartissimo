<!-- src/views/DashboardOrthophoniste.vue -->
<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Mes Patients</h2>

    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">Chargement des patients...</p>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600">{{ error }}</p>
      <button @click="fetchPatients" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Réessayer
      </button>
    </div>

    <div v-else-if="Array.isArray(patients) && patients.length" class="space-y-4">
      <div
        v-for="patient in patients"
        :key="patient.id"
        class="border p-4 rounded shadow bg-white"
      >
        <h3 class="text-lg font-semibold mb-1">
          {{ patient.firstName }} {{ patient.lastName }}
        </h3>
        <p>Date de naissance : {{ formatDate(patient.birthDate) }}</p>
        <p>
          Abonnement :
          <span :class="statusColor(patient.subscriptionStatus)">
            {{ patient.subscriptionStatus }}
          </span>
          (jusqu'au {{ formatDate(patient.subscriptionEndDate) }})
        </p>
        <p>Sessions terminées : <strong>{{ patient.completedSessions }}</strong></p>
      </div>
    </div>

    <div v-else class="text-center py-8">
      <p class="text-gray-600">Aucun patient trouvé.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const patients = ref([])
const loading = ref(false)
const error = ref(null)

const currentUser = computed(() => store.getters['auth/currentUser'])

const fetchPatients = async () => {
  if (!currentUser.value) {
    console.error('Aucun utilisateur connecté')
    return
  }

  loading.value = true
  error.value = null

  try {
    console.log('Récupération des patients pour l\'orthophoniste:', currentUser.value.email)
    const response = await store.dispatch('patients/fetchPatients')
    patients.value = response
    console.log('Patients récupérés:', patients.value)
  } catch (err) {
    console.error('Erreur de chargement des patients:', err)
    error.value = err.message || 'Erreur lors du chargement des patients'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPatients()
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
