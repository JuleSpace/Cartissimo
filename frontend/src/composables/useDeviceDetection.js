import { ref, onMounted, onUnmounted } from 'vue'

export function useDeviceDetection() {
  const isMobile = ref(false)
  const screenWidth = ref(0)

  const checkDevice = () => {
    screenWidth.value = window.innerWidth
    // Considérer comme mobile si largeur < 768px ou si c'est un appareil tactile
    isMobile.value = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  const handleResize = () => {
    checkDevice()
  }

  onMounted(() => {
    checkDevice()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return {
    isMobile,
    screenWidth
  }
} 