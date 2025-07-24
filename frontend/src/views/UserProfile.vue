<template>
  <div class="user-profile">
    <div class="header">
      <button @click="goBack" class="btn-secondary">
        <i class="fas fa-arrow-left"></i> Retour
      </button>
      <h1>Mon Profil</h1>
    </div>

    <div v-if="loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      Chargement du profil...
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else class="profile-content">
      <!-- Section Informations personnelles -->
      <div class="profile-section">
        <div class="section-header">
          <h2>
            <i class="fas fa-user"></i>
            Mes informations personnelles
          </h2>
          <button @click="toggleEditProfile" class="btn-edit">
            <i class="fas fa-edit"></i>
            {{ editingProfile ? 'Annuler' : 'Modifier' }}
          </button>
        </div>

        <div class="info-card">
          <div v-if="!editingProfile" class="info-display">
            <div class="info-item">
              <label>Prénom :</label>
              <span>{{ profileData.user.firstName }}</span>
            </div>
            <div class="info-item">
              <label>Nom :</label>
              <span>{{ profileData.user.lastName }}</span>
            </div>
            <div class="info-item">
              <label>Email :</label>
              <span>{{ profileData.user.email }}</span>
            </div>
            <div class="info-item">
              <label>Rôle :</label>
              <span class="role-badge">{{ getRoleLabel(profileData.user.role) }}</span>
            </div>
          </div>

          <form v-else @submit.prevent="updateProfile" class="edit-form">
            <div class="form-group">
              <label for="firstName">Prénom</label>
              <input
                id="firstName"
                v-model="editForm.firstName"
                type="text"
                required
              >
            </div>
            <div class="form-group">
              <label for="lastName">Nom</label>
              <input
                id="lastName"
                v-model="editForm.lastName"
                type="text"
                required
              >
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input
                id="email"
                v-model="editForm.email"
                type="email"
                required
              >
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary" :disabled="updateLoading">
                <i v-if="updateLoading" class="fas fa-spinner fa-spin"></i>
                <i v-else class="fas fa-save"></i>
                {{ updateLoading ? 'Enregistrement...' : 'Enregistrer' }}
              </button>
              <button type="button" @click="cancelEditProfile" class="btn-secondary">
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Section Enfants -->
      <div class="profile-section">
        <div class="section-header">
          <h2>
            <i class="fas fa-child"></i>
            Mes enfants ({{ profileData.children.length }})
          </h2>
          <button @click="openAddChildModal" class="btn-add">
            <i class="fas fa-plus"></i>
            Ajouter un enfant
          </button>
        </div>

        <div v-if="profileData.children.length === 0" class="empty-state">
          <i class="fas fa-child"></i>
          <p>Aucun enfant enregistré</p>
          <button @click="openAddChildModal" class="btn-primary">
            Ajouter votre premier enfant
          </button>
        </div>

        <div v-else class="children-list">
          <div v-for="child in profileData.children" :key="child.id" class="child-card">
            <div class="child-info">
              <div class="child-avatar">
                <i class="fas fa-child"></i>
              </div>
              <div class="child-details">
                <h3>{{ child.firstName }} {{ child.lastName }}</h3>
                <p class="birth-date">
                  <i class="fas fa-birthday-cake"></i>
                  {{ formatDate(child.birthDate) }}
                </p>
                <p v-if="child.orthophoniste" class="orthophonist">
                  <i class="fas fa-user-md"></i>
                  {{ child.orthophoniste.firstName }} {{ child.orthophoniste.lastName }}
                </p>
                <p v-else class="no-orthophonist">
                  <i class="fas fa-exclamation-triangle"></i>
                  Aucun orthophoniste assigné
                </p>
                <div class="subscription-info">
                  <span :class="['status-badge', getStatusClass(child.subscriptionStatus)]">
                    {{ getStatusLabel(child.subscriptionStatus) }}
                  </span>
                  <span v-if="child.subscriptionEndDate" class="end-date">
                    Jusqu'au {{ formatDate(child.subscriptionEndDate) }}
                  </span>
                </div>
              </div>
            </div>
            <div class="child-actions">
              <button @click="editChild(child)" class="btn-edit-small">
                <i class="fas fa-edit"></i>
              </button>
              <button @click="confirmDeleteChild(child)" class="btn-delete-small">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'ajout/édition d'enfant -->
    <div v-if="showChildModal" class="modal-overlay" @click="closeChildModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>
            <i class="fas fa-child"></i>
            {{ editingChild ? 'Modifier l\'enfant' : 'Ajouter un enfant' }}
          </h3>
          <button @click="closeChildModal" class="btn-close">✕</button>
        </div>

        <form @submit.prevent="saveChild" class="modal-form">
          <div class="form-group">
            <label for="childFirstName">Prénom *</label>
            <input
              id="childFirstName"
              v-model="childForm.firstName"
              type="text"
              required
            >
          </div>
          <div class="form-group">
            <label for="childLastName">Nom *</label>
            <input
              id="childLastName"
              v-model="childForm.lastName"
              type="text"
              required
            >
          </div>
          <div class="form-group">
            <label for="childBirthDate">Date de naissance *</label>
            <input
              id="childBirthDate"
              v-model="childForm.birthDate"
              type="date"
              required
            >
          </div>
          <div class="form-group">
            <label for="childOrthophoniste">Orthophoniste</label>
            <select
              id="childOrthophoniste"
              v-model="childForm.orthophonisteId"
            >
              <option value="">Aucun orthophoniste</option>
              <option
                v-for="ortho in orthophonistes"
                :key="ortho.id"
                :value="ortho.id"
              >
                {{ ortho.firstName }} {{ ortho.lastName }} - {{ ortho.city }}
              </option>
            </select>
          </div>

          <div class="modal-actions">
            <button type="submit" class="btn-primary" :disabled="childLoading">
              <i v-if="childLoading" class="fas fa-spinner fa-spin"></i>
              <i v-else class="fas fa-save"></i>
              {{ childLoading ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
            <button type="button" @click="closeChildModal" class="btn-secondary">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de confirmation de suppression -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>
            <i class="fas fa-exclamation-triangle"></i>
            Confirmer la suppression
          </h3>
          <button @click="closeDeleteModal" class="btn-close">✕</button>
        </div>

        <div class="modal-content">
          <p>Êtes-vous sûr de vouloir supprimer <strong>{{ childToDelete?.firstName }} {{ childToDelete?.lastName }}</strong> ?</p>
          <p class="warning">Cette action est irréversible.</p>
        </div>

        <div class="modal-actions">
          <button @click="deleteChild" class="btn-danger" :disabled="deleteLoading">
            <i v-if="deleteLoading" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-trash"></i>
            {{ deleteLoading ? 'Suppression...' : 'Supprimer' }}
          </button>
          <button @click="closeDeleteModal" class="btn-secondary">
            Annuler
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';
import { API_URL } from '@/config';

export default {
  name: 'UserProfile',
  setup() {
    const router = useRouter();
    const store = useStore();

    // États de base
    const loading = ref(true);
    const error = ref('');
    const profileData = ref({ user: {}, children: [] });

    // États d'édition du profil
    const editingProfile = ref(false);
    const editForm = ref({});
    const updateLoading = ref(false);

    // États de gestion des enfants
    const showChildModal = ref(false);
    const editingChild = ref(null);
    const childForm = ref({});
    const childLoading = ref(false);
    const orthophonistes = ref([]);

    // États de suppression
    const showDeleteModal = ref(false);
    const childToDelete = ref(null);
    const deleteLoading = ref(false);

    const goBack = () => {
      router.push('/themes');
    };

    const loadProfile = async () => {
      try {
        loading.value = true;
        error.value = '';

        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        profileData.value = response.data;
        console.log('Profil chargé:', profileData.value);

      } catch (err) {
        console.error('Erreur lors du chargement du profil:', err);
        error.value = err.response?.data?.message || 'Erreur lors du chargement du profil';
      } finally {
        loading.value = false;
      }
    };

    const loadOrthophonistes = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/orthophonistes`);
        orthophonistes.value = response.data;
      } catch (err) {
        console.error('Erreur lors du chargement des orthophonistes:', err);
      }
    };

    // Gestion du profil utilisateur
    const toggleEditProfile = () => {
      if (editingProfile.value) {
        cancelEditProfile();
      } else {
        editForm.value = {
          firstName: profileData.value.user.firstName,
          lastName: profileData.value.user.lastName,
          email: profileData.value.user.email
        };
        editingProfile.value = true;
      }
    };

    const cancelEditProfile = () => {
      editingProfile.value = false;
      editForm.value = {};
    };

    const updateProfile = async () => {
      try {
        updateLoading.value = true;
        
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/users/profile`, editForm.value, {
          headers: { Authorization: `Bearer ${token}` }
        });

        profileData.value.user = response.data.user;
        editingProfile.value = false;
        
        // Mettre à jour le store si nécessaire
        await store.dispatch('auth/fetchUser');

      } catch (err) {
        console.error('Erreur lors de la mise à jour:', err);
        error.value = err.response?.data?.message || 'Erreur lors de la mise à jour';
      } finally {
        updateLoading.value = false;
      }
    };

    // Gestion des enfants
    const openAddChildModal = () => {
      editingChild.value = null;
      childForm.value = {
        firstName: '',
        lastName: '',
        birthDate: '',
        orthophonisteId: ''
      };
      showChildModal.value = true;
    };

    const editChild = (child) => {
      editingChild.value = child;
      childForm.value = {
        firstName: child.firstName,
        lastName: child.lastName,
        birthDate: child.birthDate,
        orthophonisteId: child.orthophonisteId || ''
      };
      showChildModal.value = true;
    };

    const closeChildModal = () => {
      showChildModal.value = false;
      editingChild.value = null;
      childForm.value = {};
    };

    const saveChild = async () => {
      try {
        childLoading.value = true;
        
        const token = localStorage.getItem('token');
        let response;

        if (editingChild.value) {
          // Mise à jour
          response = await axios.put(
            `${API_URL}/users/children/${editingChild.value.id}`,
            childForm.value,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } else {
          // Création
          response = await axios.post(
            `${API_URL}/users/children`,
            childForm.value,
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        // Recharger les données
        await loadProfile();
        closeChildModal();

      } catch (err) {
        console.error('Erreur lors de la sauvegarde:', err);
        error.value = err.response?.data?.message || 'Erreur lors de la sauvegarde';
      } finally {
        childLoading.value = false;
      }
    };

    const confirmDeleteChild = (child) => {
      childToDelete.value = child;
      showDeleteModal.value = true;
    };

    const closeDeleteModal = () => {
      showDeleteModal.value = false;
      childToDelete.value = null;
    };

    const deleteChild = async () => {
      try {
        deleteLoading.value = true;
        
        const token = localStorage.getItem('token');
        await axios.delete(
          `${API_URL}/users/children/${childToDelete.value.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Recharger les données
        await loadProfile();
        closeDeleteModal();

      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        error.value = err.response?.data?.message || 'Erreur lors de la suppression';
      } finally {
        deleteLoading.value = false;
      }
    };

    // Utilitaires
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR');
    };

    const getRoleLabel = (role) => {
      const labels = {
        admin: 'Administrateur',
        orthophonist: 'Orthophoniste',
        parent: 'Parent'
      };
      return labels[role] || role;
    };

    const getStatusLabel = (status) => {
      const labels = {
        active: 'Actif',
        inactive: 'Inactif',
        expired: 'Expiré',
        payment_failed: 'Paiement échoué'
      };
      return labels[status] || status;
    };

    const getStatusClass = (status) => {
      return `status-${status}`;
    };

    // Charger les données au montage
    onMounted(async () => {
      await Promise.all([
        loadProfile(),
        loadOrthophonistes()
      ]);
    });

    return {
      // États
      loading,
      error,
      profileData,
      editingProfile,
      editForm,
      updateLoading,
      showChildModal,
      editingChild,
      childForm,
      childLoading,
      orthophonistes,
      showDeleteModal,
      childToDelete,
      deleteLoading,

      // Méthodes
      goBack,
      toggleEditProfile,
      cancelEditProfile,
      updateProfile,
      openAddChildModal,
      editChild,
      closeChildModal,
      saveChild,
      confirmDeleteChild,
      closeDeleteModal,
      deleteChild,
      formatDate,
      getRoleLabel,
      getStatusLabel,
      getStatusClass
    };
  }
};
</script>

<style scoped>
.user-profile {
  padding: 0.5rem;
  max-width: 1200px;
  margin: 120px auto 20px;
}

@media (min-width: 768px) {
  .user-profile {
    margin: 100px auto 20px;
  }
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
}

.header h1 {
  margin: 0;
  color: var(--blue);
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.loading i {
  font-size: 2rem;
  margin-bottom: 10px;
  color: var(--blue);
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.profile-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  background: linear-gradient(135deg, var(--blue-light) 0%, var(--blue) 100%);
  color: white;
}

.section-header h2 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-edit, .btn-add {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-edit:hover, .btn-add:hover {
  background: rgba(255,255,255,0.3);
}

.info-card {
  padding: 25px;
}

.info-display {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-item label {
  font-weight: 600;
  color: #666;
  font-size: 0.9rem;
}

.info-item span {
  font-size: 1.1rem;
  color: #333;
}

.role-badge {
  background: var(--blue-light);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem !important;
  width: fit-content;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #333;
}

.form-group input, .form-group select {
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus, .form-group select:focus {
  outline: none;
  border-color: var(--blue);
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-start;
}

.btn-primary, .btn-secondary, .btn-danger {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-primary {
  background: var(--blue);
  color: white;
}

.btn-primary:hover {
  background: var(--blue-light);
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

.btn-primary:disabled, .btn-secondary:disabled, .btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-state i {
  font-size: 4rem;
  color: #ddd;
  margin-bottom: 20px;
}

.children-list {
  padding: 25px;
  display: grid;
  gap: 20px;
}

.child-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border: 2px solid #f1f3f4;
  border-radius: 12px;
  transition: all 0.3s;
}

.child-card:hover {
  border-color: var(--blue-light);
  box-shadow: 0 4px 12px rgba(75, 149, 222, 0.1);
}

.child-info {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.child-avatar {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--blue-light) 0%, var(--blue) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.child-details h3 {
  margin: 0 0 8px 0;
  color: #333;
}

.child-details p {
  margin: 4px 0;
  font-size: 0.9rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 8px;
}

.orthophonist {
  color: var(--blue) !important;
}

.no-orthophonist {
  color: #ff9800 !important;
}

.subscription-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-active {
  background: #d4edda;
  color: #155724;
}

.status-inactive {
  background: #f8d7da;
  color: #721c24;
}

.status-expired {
  background: #fff3cd;
  color: #856404;
}

.status-payment_failed {
  background: #f8d7da;
  color: #721c24;
}

.end-date {
  font-size: 0.8rem;
  color: #666;
}

.child-actions {
  display: flex;
  gap: 8px;
}

.btn-edit-small, .btn-delete-small {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.btn-edit-small {
  background: #17a2b8;
  color: white;
}

.btn-edit-small:hover {
  background: #138496;
}

.btn-delete-small {
  background: #dc3545;
  color: white;
}

.btn-delete-small:hover {
  background: #c82333;
}

/* Styles des modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 25px;
  background: linear-gradient(135deg, var(--blue-light) 0%, var(--blue) 100%);
  color: white;
}

.modal-header h3 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: background 0.3s;
}

.btn-close:hover {
  background: rgba(255,255,255,0.2);
}

.modal-form, .modal-content {
  padding: 25px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 25px;
  background: #f8f9fa;
}

.warning {
  color: #dc3545;
  font-weight: 600;
}

@media (max-width: 768px) {
  .user-profile {
    margin: 80px auto 20px;
    padding: 0.25rem;
  }
  
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .info-display {
    grid-template-columns: 1fr;
  }
  
  .child-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .child-actions {
    align-self: flex-end;
  }
  
  .form-actions, .modal-actions {
    flex-direction: column;
  }
}
</style> 