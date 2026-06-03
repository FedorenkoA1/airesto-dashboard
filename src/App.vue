<script setup lang="ts">
import { onMounted } from 'vue'
import { useReservationsStore } from '@/features/reservationGrid/store/reservations'
import AppHeader from '@/features/reservationGrid/components/AppHeader.vue'
import DateTabs from '@/features/reservationGrid/components/DateTabs.vue'
import ZoneFilter from '@/features/reservationGrid/components/ZoneFilter.vue'
import ReservationGrid from '@/features/reservationGrid/components/ReservationGrid.vue'

const store = useReservationsStore()

/**
 * Why onMounted and not immediate top-level await?
 *
 * Vue 3 best practice: async side effects go in onMounted.
 * This way the component renders immediately with a loading state
 * rather than waiting for data before first paint.
 *
 * If we called store.init() at top level, Vue would need to
 * wait for it before rendering anything — worse UX.
 */
onMounted(() => store.init())
</script>

<template>
  <!--
    Root container.

    height: 100vh — fills the full viewport height.

    display: flex + flex-direction: column — stacks children vertically:
    1. AppHeader (fixed height)
    2. Controls bar (fixed height)
    3. ReservationGrid (flex: 1 = takes all remaining space)

    overflow: hidden — prevents double scrollbars.
    The ReservationGrid has its own internal scroll.
    Without this, the page itself would scroll AND the grid would scroll.
  -->
  <div class="app-root">

    <!-- Top navigation bar -->
    <AppHeader />

    <!--
      Controls bar — date tabs and zone filter.
      flex-shrink: 0 prevents it from compressing
      when the grid needs more space.
      border-bottom separates it visually from the grid.
    -->
    <div class="app-controls">
      <DateTabs />
      <ZoneFilter />
    </div>

    <!--
      Main grid — takes all remaining vertical space.
      flex: 1 in ReservationGrid's CSS handles this.
    -->
    <ReservationGrid />

  </div>
</template>

<style scoped>
.app-root {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--color-bg-base);
}

.app-controls {
  /*
    flex-shrink: 0 — never compress this bar.
    If the viewport is very small, the grid shrinks,
    not the controls.
  */
  flex-shrink: 0;
  padding: 12px 16px 10px;
  background-color: var(--color-bg-header);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 10px;  /* space between DateTabs and ZoneFilter */
}
</style>