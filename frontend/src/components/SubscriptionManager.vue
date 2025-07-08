<template>
  <div class="subscription-manager">
    <!-- Écran de chargement -->
    <div v-if="loading" class="loading-screen">
      <div class="spinner"></div>
      <p>Vérification de votre abonnement...</p>
    </div>

    <!-- Abonnement actif -->
    <div v-else-if="subscriptionStatus === 'active'" class="subscription-active">
      <slot></slot>
    </div>

    <!-- Abonnement requis mais inactif -->
    <div v-else-if="subscriptionRequired" class="subscription-required">
      <div class="subscription-card">
        <div class="subscription-icon">
          <i class="fas fa-crown"></i>
        </div>
        
        <h2>Abonnement requis</h2>
        
        <div v-if="subscriptionStatus === 'expired'" class="message">
          <p>Votre abonnement a expiré le {{ formatDate(subscriptionEndDate) }}.</p>
          <p>Renouvelez votre abonnement pour continuer à accéder aux thèmes et animations.</p>
        </div>
        
        <div v-else-if="subscriptionStatus === 'payment_failed'" class="message">
          <p>Le paiement de votre abonnement a échoué.</p>
          <p>Veuillez mettre à jour vos informations de paiement.</p>
        </div>
        
        <div v-else class="message">
          <p>Un abonnement est nécessaire pour accéder aux thèmes et animations.</p>
          <p>Abonnez-vous dès maintenant pour profiter de toutes les fonctionnalités.</p>
        </div>

        <div class="subscription-benefits">
          <h3>Avec l'abonnement Cartissimo :</h3>
          <ul>
            <li><i class="fas fa-check"></i> Accès illimité à tous les thèmes</li>
            <li><i class="fas fa-check"></i> Toutes les animations disponibles</li>
            <li><i class="fas fa-check"></i> Mises à jour régulières du contenu</li>
            <li><i class="fas fa-check"></i> Support technique prioritaire</li>
          </ul>
        </div>

        <div class="subscription-price">
          <span class="price">50€</span>
          <span class="period">/ an</span>
        </div>

        <button 
          @click="subscribeNow" 
          :disabled="processingPayment"
          class="subscribe-btn"
        >
          <i v-if="processingPayment" class="fas fa-spinner fa-spin"></i>
          <span v-else>
            {{ subscriptionStatus === 'expired' || subscriptionStatus === 'payment_failed' ? 'Renouveler' : 'S\'abonner' }}
          </span>
        </button>

        <!-- Bouton de simulation pour le développement -->
        <button 
          v-if="isDevelopment"
          @click="simulateSubscription" 
          :disabled="processingPayment"
          class="simulate-btn"
        >
          <i v-if="processingPayment" class="fas fa-spinner fa-spin"></i>
          <span v-else>Simuler l'abonnement (Dev)</span>
        </button>

        <p class="secure-payment">
          <i class="fas fa-lock"></i>
          Paiement sécurisé par Stripe
        </p>
      </div>
    </div>

    <!-- Pas d'abonnement requis -->
    <div v-else>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { loadStripe } from '@stripe/stripe-js'
import { API_URL } from '@/config'

export default {
  name: 'SubscriptionManager',
  setup() {
    const toast = useToast()
    
    const loading = ref(true)
    const subscriptionRequired = ref(false)
    const subscriptionStatus = ref('inactive')
    const subscriptionEndDate = ref(null)
    const processingPayment = ref(false)
    const isDevelopment = process.env.NODE_ENV === 'development'

    const checkSubscriptionStatus = async () => {
      try {
        console.log('Vérification du statut d\'abonnement...')
        const response = await fetch(`${API_URL}/payments/subscription-status`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        console.log('Réponse statut:', response.status)
        console.log('Réponse headers:', response.headers)

        if (response.ok) {
          const data = await response.json()
          console.log('Données reçues:', data)
          subscriptionRequired.value = data.subscriptionRequired
          subscriptionStatus.value = data.status
          subscriptionEndDate.value = data.subscriptionEndDate
        } else {
          console.error('Erreur HTTP:', response.status)
          const errorText = await response.text()
          console.error('Contenu de l\'erreur:', errorText)
          toast.error('Erreur lors de la vérification de l\'abonnement')
        }
      } catch (error) {
        console.error('Erreur:', error)
        toast.error('Erreur de connexion')
      } finally {
        loading.value = false
      }
    }

    const subscribeNow = async () => {
      processingPayment.value = true
      
      try {
        // Créer une session de paiement Stripe
        const response = await fetch(`${API_URL}/payments/create-checkout-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (response.ok) {
          const { sessionId } = await response.json()
          
          // Rediriger vers Stripe Checkout
          const stripe = await loadStripe(process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY)
          const { error } = await stripe.redirectToCheckout({ sessionId })
          
          if (error) {
            toast.error('Erreur lors de la redirection vers le paiement')
          }
        } else {
          toast.error('Erreur lors de la création de la session de paiement')
        }
      } catch (error) {
        console.error('Erreur:', error)
        toast.error('Erreur de connexion')
      } finally {
        processingPayment.value = false
      }
    }

    const simulateSubscription = async () => {
      processingPayment.value = true
      
      try {
        const response = await fetch(`${API_URL}/payments/simulate-activation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })

        if (response.ok) {
          toast.success('Abonnement simulé avec succès !')
          await checkSubscriptionStatus()
        } else {
          toast.error('Erreur lors de la simulation')
        }
      } catch (error) {
        console.error('Erreur:', error)
        toast.error('Erreur de connexion')
      } finally {
        processingPayment.value = false
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('fr-FR')
    }

    onMounted(() => {
      checkSubscriptionStatus()
    })

    return {
      loading,
      subscriptionRequired,
      subscriptionStatus,
      subscriptionEndDate,
      processingPayment,
      isDevelopment,
      subscribeNow,
      simulateSubscription,
      formatDate
    }
  }
}
</script>

<style scoped>
.subscription-manager {
  min-height: 100vh;
}

.loading-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.subscription-required {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.subscription-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.subscription-icon {
  font-size: 60px;
  color: #f39c12;
  margin-bottom: 20px;
}

.subscription-card h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 28px;
}

.message {
  color: #7f8c8d;
  margin-bottom: 30px;
  line-height: 1.6;
}

.subscription-benefits {
  text-align: left;
  margin: 30px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
}

.subscription-benefits h3 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 18px;
}

.subscription-benefits ul {
  list-style: none;
  padding: 0;
}

.subscription-benefits li {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.subscription-benefits li i {
  color: #27ae60;
  margin-right: 10px;
}

.subscription-price {
  margin: 30px 0;
}

.price {
  font-size: 36px;
  font-weight: bold;
  color: #2c3e50;
}

.period {
  font-size: 18px;
  color: #7f8c8d;
}

.subscribe-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 50px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
  min-width: 200px;
}

.subscribe-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.subscribe-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.secure-payment {
  margin-top: 20px;
  color: #7f8c8d;
  font-size: 14px;
}

.secure-payment i {
  color: #27ae60;
  margin-right: 5px;
}

.simulate-btn {
  background: #f39c12;
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 50px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
  min-width: 200px;
  margin-top: 10px;
}

.simulate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  background: #e67e22;
}

.simulate-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style> 