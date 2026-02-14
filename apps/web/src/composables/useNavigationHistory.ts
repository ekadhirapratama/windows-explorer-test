import { ref, computed } from 'vue'

const history = ref<string[]>([])
const currentIndex = ref(-1)

export function useNavigationHistory() {
  const canGoBack = computed(() => currentIndex.value > 0)
  const canGoForward = computed(() => currentIndex.value < history.value.length - 1)

  function pushHistory(folderId: string) {
    if (history.value[currentIndex.value] === folderId) return

    if (currentIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, currentIndex.value + 1)
    }

    history.value.push(folderId)
    currentIndex.value = history.value.length - 1
  }

  function goBack(): string | null {
    if (!canGoBack.value) return null
    currentIndex.value -= 1
    return history.value[currentIndex.value] ?? null
  }

  function goForward(): string | null {
    if (!canGoForward.value) return null
    currentIndex.value += 1
    return history.value[currentIndex.value] ?? null
  }

  return {
    history,
    currentIndex,
    canGoBack,
    canGoForward,
    pushHistory,
    goBack,
    goForward
  }
}
