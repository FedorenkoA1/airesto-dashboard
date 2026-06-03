<script setup lang="ts">
import { computed } from "vue";
import { parseISO, differenceInCalendarDays, format } from "date-fns";
import { ru } from 'date-fns/locale'
import { useReservationsStore } from "@/features/reservationGrid/store/reservations"

const store = useReservationsStore();

/**
 * For each available day we compute:
 * - date: the raw string "2025-04-04" (used as key and for store call)
 * - dayLabel: "4 апреля" (shown as main text)
 * - subLabel: "сегодня" / "завтра" / "среда" 
 *
 * Why computed?
 * If availableDays changes (different restaurant loaded),
 * the tabs automatically update.
 */
const tabs = computed(() => {
  // current_day from the server — used to calculate relative labels
  // We parse it to a Date for comparison
  const currentDay = store.apiData?.current_day
    ? parseISO(store.apiData.current_day)
    : new Date()

  return store.availableDays.map(dateStr => {
    const date = parseISO(dateStr);

    const dayLabel = format(date, 'd MMMM', { locale: ru });

    const diff = differenceInCalendarDays(date, currentDay);

    // Sub label logic:
    // 0 → "сегодня"
    // 1 → "завтра"
    // anything else → day of week in Russian e.g. "среда"
    let subLabel: string
    if (diff === 0) {
      subLabel = 'сегодня'
    } else if (diff === 1) {
      subLabel = 'завтра'
    } else {
      // 'EEEE' = full day name: "понедельник", "вторник" etc.
      subLabel = format(date, 'EEEE', { locale: ru })
    }

    return { date: dateStr, dayLabel, subLabel }
  })
})
</script>

<template>
  <div class="date-tabs">
    <span class="date-tabs__label">Дата</span>
    <div class="date-tabs__list">
      <button
        v-for="tab in tabs"
        :key="tab.date"
        class="date-tab"
        :class="{ 'date-tab--active': tab.date === store.selectedDay }"
        @click="store.fetchDay(tab.date)"
      >
        <span class="date-tab__day">{{ tab.dayLabel }}</span>
        <span class="date-tab__sub">{{ tab.subLabel }}</span>
      </button>
    </div>

  </div>
</template>

<style scoped>
.date-tabs {
  display: flex;
  flex-direction: column;
  margin-bottom: 23px;
  align-items: flex-start;
  gap: 5px;
}

.date-tabs__label {
  align-self: flex-start;
  font-size: 11px;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.date-tabs__list {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.date-tab {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  line-height: 1.3;
}

.date-tab:hover {
  background-color: var(--color-bg-elevated);
  border-color: var(--color-border-light);
  color: var(--color-text-primary);
}

.date-tab--active {
  background-color: var(--color-zone-active);
  border-color: var(--color-zone-active);
  color: #ffffff;
}

.date-tab--active,
.date-tab--active:hover {
  background-color: var(--color-zone-active);
  border-color: var(--color-zone-active);
  color: #ffffff;
}

.date-tab__day {
  font-size: 12px;
  font-weight: 600;
}

.date-tab__sub {
  font-size: 10px;
  opacity: 0.8;
}
</style>