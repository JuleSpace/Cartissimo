<template>
  <div class="payment-cancel">
    <div class="cancel-card">
      <div class="cancel-icon">
        <i class="fas fa-times-circle"></i>
      </div>
      
      <h1>Paiement annulé</h1>
      
      <p class="cancel-message">
        Votre paiement a été annulé. Aucun montant n'a été prélevé.
      </p>
      
      <div class="info-box">
        <h3>Pourquoi s'abonner ?</h3>
        <ul>
          <li><i class="fas fa-check"></i> Accès illimité à tous les thèmes</li>
          <li><i class="fas fa-check"></i> Toutes les animations disponibles</li>
          <li><i class="fas fa-check"></i> Mises à jour régulières</li>
          <li><i class="fas fa-check"></i> Support technique prioritaire</li>
        </ul>
      </div>
      
      <div class="actions">
        <button @click="tryAgain" class="primary-btn">
          <i class="fas fa-credit-card"></i>
          Essayer à nouveau
        </button>
        
        <button @click="goBack" class="secondary-btn">
          <i class="fas fa-arrow-left"></i>
          Retour
        </button>
      </div>
      
      <p class="help-text">
        <i class="fas fa-question-circle"></i>
        Besoin d'aide ? Contactez notre support
      </p>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'PaymentCancel',
  setup() {
    const router = useRouter()
    
    const tryAgain = () => {
      // Retourner à la page précédente pour réessayer
      router.go(-1)
    }
    
    const goBack = () => {
      router.push('/themes')
    }
    
    return {
      tryAgain,
      goBack
    }
  }
}
</script>

<style scoped>
.payment-cancel {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  padding: 20px;
}

.cancel-card {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}

.cancel-icon {
  font-size: 80px;
  color: #e74c3c;
  margin-bottom: 20px;
}

.cancel-card h1 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 32px;
}

.cancel-message {
  color: #7f8c8d;
  margin-bottom: 30px;
  font-size: 18px;
  line-height: 1.6;
}

.info-box {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  margin: 30px 0;
  text-align: left;
}

.info-box h3 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 20px;
  text-align: center;
}

.info-box ul {
  list-style: none;
  padding: 0;
}

.info-box li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: #2c3e50;
}

.info-box li i {
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

.help-text {
  color: #7f8c8d;
  font-size: 14px;
  margin-top: 20px;
}

.help-text i {
  color: #3498db;
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