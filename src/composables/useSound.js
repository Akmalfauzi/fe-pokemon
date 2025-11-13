import { ref } from 'vue'

const soundEnabled = ref(localStorage.getItem('soundEnabled') !== 'false')

export function useSound() {
    const audio = ref(null)
    const isPlaying = ref(false)

    // Initialize audio
    const initSound = () => {
        if (!audio.value) {
            audio.value = new Audio('/sfx/select.wav')
            audio.value.volume = 0.3 // Set volume to 30%
        }
    }

    // Toggle sound on/off
    const toggleSound = () => {
        soundEnabled.value = !soundEnabled.value
        localStorage.setItem('soundEnabled', soundEnabled.value.toString())
    }

    // Play sound effect
    const playClickSound = () => {
        if (!soundEnabled.value) return

        try {
            initSound()

            if (audio.value) {
                // Stop current playback
                audio.value.currentTime = 0

                // Play the sound
                const playPromise = audio.value.play()

                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            isPlaying.value = true
                        })
                        .catch(error => {
                            console.log('Sound play prevented:', error)
                        })
                        .finally(() => {
                            // Reset
                            setTimeout(() => {
                                isPlaying.value = false
                            }, 200)
                        })
                }
            }
        } catch (error) {
            console.log('Sound error:', error)
        }
    }

    // Alternative play sound with interaction callback
    const playClickSoundWithInteraction = (callback) => {
        return (event) => {
            playClickSound()
            if (callback && typeof callback === 'function') {
                callback(event)
            }
        }
    }

    // Cleanup
    const cleanup = () => {
        if (audio.value) {
            audio.value.pause()
            audio.value = null
        }
    }

    return {
        playClickSound,
        playClickSoundWithInteraction,
        isPlaying,
        soundEnabled,
        toggleSound,
        cleanup
    }
}