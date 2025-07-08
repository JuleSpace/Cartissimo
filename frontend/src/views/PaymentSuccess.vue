<template>
  <div class="payment-success">
    <div class="success-card">
      <div class="success-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      
      <h1>Paiement réussi !</h1>
      
      <p class="success-message">
        Félicitations ! Votre abonnement Cartissimo a été activé avec succès.
      </p>
      
      <div class="subscription-info">
        <h3>Votre abonnement :</h3>
        <div class="info-item">
          <i class="fas fa-calendar-alt"></i>
          <span>Abonnement annuel</span>
        </div>
        <div class="info-item">
          <i class="fas fa-crown"></i>
          <span>Accès illimité à tous les thèmes</span>
        </div>
        <div class="info-item">
          <i class="fas fa-play-circle"></i>
          <span>Toutes les animations disponibles</span>
        </div>
      </div>
      
      <div class="actions">
        <button @click="goToThemes" class="primary-btn">
          <i class="fas fa-play"></i>
          Commencer maintenant
        </button>
        
        <button @click="goToProfile" class="secondary-btn">
          <i class="fas fa-user"></i>
          Voir mon profil
        </button>
      </div>
      
      <p class="email-info">
        <i class="fas fa-envelope"></i>
        Un email de confirmation vous a été envoyé.
      </p>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'PaymentSuccess',
  setup() {
    const router = useRouter()
    
    const goToThemes = () => {
      router.push('/themes')
    }
    
    const goToProfile = () => {
      router.push('/profile')
    }
    
    return {
      goToThemes,
      goToProfile
    }
  }
}
</script>

<style scoped>
.payment-success {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.success-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.success-icon {
  font-size: 80px;
  color: #27ae60;
  margin-bottom: 20px;
}

.success-card h1 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 32px;
}

.success-message {
  color: #7f8c8d;
  margin-bottom: 30px;
  font-size: 18px;
  line-height: 1.6;
}

.subscription-info {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  margin: 30px 0;
}

.subscription-info h3 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: #2c3e50;
}

.info-item i {
  color: #27ae60;
  margin-right: 10px;
  width: 20px;
}

.actions {
  display: flex;
  gap: 15px;
  margin: 30px 0;
  flex-wrap: wrap;
}

.primary-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 25px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
  flex: 1;
  min-width: 200px;
}

.primary-btn:hover {
  transform: translateY(-2px);
}

.secondary-btn {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 15px 25px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  min-width: 200px;
}

.secondary-btn:hover {
  background: #667eea;
  color: white;
}

.email-info {
  color: #7f8c8d;
  font-size: 14px;
  margin-top: 20px;
}

.email-info i {
  color: #27ae60;
  margin-right: 5px;
}

@media (max-width: 600px) {
  .actions {
    flex-direction: column;
  }
  
  .primary-btn,
  .secondary-btn {
    min-width: auto;
  }
}
</style> 