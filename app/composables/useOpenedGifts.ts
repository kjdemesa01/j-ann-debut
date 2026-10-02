const STORAGE_KEY = 'jann-opened-gifts'

// Progress lives in memory only: it survives moving between pages,
// but every fresh open / reload of the site starts with all boxes closed.
export const useOpenedGifts = () => {
  const openedIds = useState<number[]>('openedGifts', () => [])

  // Kept so gifts.vue doesn't change. Also clears progress saved by the old version.
  const load = () => {
    if (!import.meta.client) return

    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }

  const markOpened = (id: number) => {
    if (!openedIds.value.includes(id)) {
      openedIds.value = [...openedIds.value, id]
    }
  }

  return { openedIds, load, markOpened }
}
