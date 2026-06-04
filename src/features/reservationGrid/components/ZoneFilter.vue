<script setup lang="ts">
import { useReservationsStore } from "@/features/reservationGrid/store/reservations";

/**
 * ZoneFilter — toggleable zone chips.
 *
 * No local state needed — everything lives in the store.
 * This component is purely presentational:
 * - reads allZones + visibleZones from store
 * - calls toggleZone() on click
 * - renders chips with active/inactive styling
 */
const store = useReservationsStore()
</script>

<template>
  <div class="zone-filter">
    <span class="zone-filter__label">Отображаемые зоны</span>
    <div class="zone-filter__chips">
      <button
        v-for="zone in store.allZones"
        :key="zone"
        class="zone-chip"
        :class="{ 'zone-chip--active': store.visibleZones.has(zone) }"
        @click="store.toggleZone(zone)"
      >
        {{ zone }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.zone-filter {
  display: flex;
  flex-direction: column; 
  align-items: flex-start;
  gap: 6px;
}

.zone-filter__label {
  font-size: 11px;
  font-weight: 400;
  color: var(--color-text-muted);
}

.zone-filter__chips {
  display: flex;
  gap: 4px;
  flex-wrap: wrap; 
}

.zone-chip {
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid var(--color-border);
  background: transparent;
  margin-bottom: 40px;
  color: var(--color-text-secondary);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}

.zone-chip:hover {
  border-color: var(--color-border-light);
  color: var(--color-text-primary);
  background-color: var(--color-bg-elevated);
}

.zone-chip--active,
.zone-chip--active:hover {
  background-color: var(--color-zone-active);
  border-color: var(--color-zone-active);
  color: #ffffff;
  font-weight: 600;
}

.zone-chip--active {
  background-color: var(--color-zone-active);
  border-color: var(--color-zone-active);
  color: #ffffff;
  font-weight: 600;
}
</style>