import type { SearchMode } from "@/features/reservationGrid/types";
import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import type { ApiResponse } from "@/features/reservationGrid/types";
import { getMockDataForDay } from "@/features/reservationGrid/data/mock";
import { tableMatchesSearch } from "@/features/reservationGrid/utils/reservationFilters";


export const useReservationsStore = defineStore('reservations', () => {

  // ── State ──────────────────────────────────────────────────────────

  const apiData = ref<ApiResponse | null>(null);
  const selectedDay = ref<string>('');
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const theme = ref<'dark' | 'light'>('dark');
  const searchQuery = ref<string>('');
  const searchMode = ref<SearchMode>('all');

  /**
   * Why Set instead of Array for visibleZones?
   * We constantly check "is this zone visible?" — that's has().
   * Set.has() is O(1). Array.includes() is O(n).
   */
  const visibleZones = ref<Set<string>>(new Set())

  // ── Getters ────────────────────────────────────────────────────────

  const restaurant = computed(() => apiData.value?.restaurant ?? null)

  const availableDays = computed(() => apiData.value?.available_days ?? [])

  /**
   * All unique zones from the data in a fixed display order.
   */
  const allZones = computed((): string[] => {
    if (!apiData.value) return []
    const order = ['1 этаж', '2 этаж', 'Банкетный зал']
    const found = new Set<string>(apiData.value.tables.map(t => t.zone))
    return order.filter(zone => found.has(zone))
  });

  /**
   * Tables filtered by visible zones.
   * This is what ReservationGrid renders.
   * Automatically updates when visibleZones changes.
   */
  watch(searchMode, () => {
      searchQuery.value = '';
  });

  const filteredTables = computed(() => {
    if (!apiData.value) return [];

    let tables = apiData.value.tables.filter(t =>
      visibleZones.value.has(t.zone)
    );

    const query = searchQuery.value.trim()
    
    if (!(query)) return tables;

    return tables.filter(table => tableMatchesSearch(table, query, searchMode.value));
  });

  // ── Actions ────────────────────────────────────────────────────────

  /**
   * Load data for a specific day.
   * Simulates async API call with a small delay.
   * In production: replace getMockDataForDay with real fetch().
   */
  const fetchDay = async (day: string): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    selectedDay.value = day;

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300))

      const data = getMockDataForDay(day)
      apiData.value = data;
      visibleZones.value = new Set(data.tables.map(t => t.zone))
    } catch (e) {
      error.value = 'Не удалось загрузить данные';
      console.error(e);
    } finally {
      // Always runs — even if try throws
      // Ensures loading spinner always stops
      isLoading.value = false;
    }
  }

  /**
   * Called once when the app mounts.
   * Loads the initial day's data.
   */
  const init = async (): Promise<void> => {
    const initialData = getMockDataForDay('2025-04-04');
    apiData.value = initialData;
    selectedDay.value = initialData.current_day;
    visibleZones.value = new Set(initialData.tables.map(t => t.zone));
  }

  /**
   * Toggle a zone on or off.
   */
  const toggleZone = (zone: string): void => {
    const next = new Set(visibleZones.value);

    if (next.has(zone)) {
      next.delete(zone);
    } else {
      next.add(zone);
    }

    visibleZones.value = next;
  }

  /**
   * Toggle dark/light theme.
   * Adds/removes .light class on <html>.
   * CSS variables in style.css react automatically.
   */
  const toggleTheme = (): void => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('light', theme.value === 'light');
  };

  return {
    // State
    apiData,
    selectedDay,
    visibleZones,
    filteredTables,
    isLoading,
    error,
    theme,
    searchQuery, 
    searchMode,
    // Getters
    restaurant,
    availableDays,
    allZones,
    // Actions
    fetchDay,
    init,
    toggleZone,
    toggleTheme,
  }
})