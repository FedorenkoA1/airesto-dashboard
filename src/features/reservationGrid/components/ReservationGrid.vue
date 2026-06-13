<script setup lang="ts">
import { computed } from "vue";
import { useReservationsStore } from "@/features/reservationGrid/store/reservations";
import { useRestaurantTime } from "@/features/reservationGrid/composables/useRestaurantTime";
import {
  generateTimeLabelsForGrid,
  parseTimeToMinutes,
  minutesToPercent,
} from "@/features/reservationGrid/composables/useTimeGrid";
import TableColumn from "./TableColumn.vue";

// ── Grid Configuration ─────────────────────────────────────────────────────

/**
 * Fixed UI measurements.
 * These are design constants — they define the chrome around
 * the grid content, not the content itself.
 * as const = TypeScript treats values as literals, prevents mutation.
 */
const GRID_CONFIG = {
  /** Width of left time axis — fits "23:40" without clipping */
  timeAxisWidth: 56,
  /** Height of sticky header row — fits number + capacity + zone */
  headerHeight: 52,
} as const;

/**
 * Pixels per minute of restaurant operating time.
 * This is the single knob controlling grid density.
 *
 * 1.578px/min × 760min (11:00–23:40) ≈ 1200px total height.
 * Increase → more space between events (easier to read).
 * Decrease → more compact (more events visible at once).
 */
const PIXELS_PER_MINUTE = 1.578;

// ── Store ──────────────────────────────────────────────────────────────────

const store = useReservationsStore();

const restaurant = computed(() => store.restaurant);
const tables     = computed(() => store.filteredTables);

// ── Column Width ───────────────────────────────────────────────────────────

/**
 * Responsive column width set as CSS variable.
 * Both header cells and table columns read from --col-width.
 * One source of truth → always aligned.
 *
 * Logic:
 * - Take available width (viewport minus time axis)
 * - Divide equally between all tables
 * - Clamp between 100px (minimum readable) and 200px (maximum comfortable)
 */
const colWidth = computed(() => {
  const available = window.innerWidth - GRID_CONFIG.timeAxisWidth
  const ideal = Math.floor(available / tables.value.length)
  return `${Math.max(100, Math.min(200, ideal))}px`
});

// ── Computed Grid Height ───────────────────────────────────────────────────

/**
 * Total scrollable height of the grid in pixels.
 * Derived from actual restaurant hours — not hardcoded.
 * Falls back to 1200px while data is still loading.
 */
const totalHeight = computed((): number => {
  if (!restaurant.value) return 1200;

  const openMin  = parseTimeToMinutes(restaurant.value.opening_time);
  const closeMin = parseTimeToMinutes(restaurant.value.closing_time);
  const totalMin = closeMin - openMin;

  return Math.round(totalMin * PIXELS_PER_MINUTE);
})

// ── Time Labels ────────────────────────────────────────────────────────────

/**
 * Array of { label: "12:00", percent: 15.79 } for the time axis.
 * One entry per 30 minutes between opening and closing.
 * Returns [] while data is loading — renders nothing safely.
 */
const timeLabels = computed(() => {
  if (!restaurant.value) return []
  return generateTimeLabelsForGrid(
    restaurant.value.opening_time,
    restaurant.value.closing_time,
  )
});

// ── Current Time Indicator ─────────────────────────────────────────────────

/**
 * Live clock in restaurant's timezone.
 * Why not just new Date()?
 * new Date().getHours() returns YOUR local hours.
 * The restaurant could be in a completely different timezone.
 * useRestaurantTime() gives us the correct hours for the restaurant's location.
 */
const { now } = useRestaurantTime(
  computed(() => restaurant.value?.timezone ?? 'UTC').value
);

/**
 * Vertical position of the "now" line as % of total grid height.
 * Returns -1 = outside restaurant hours → line not shown.
 *
 * Why -1 instead of null/undefined?
 * v-if="nowPercent >= 0" is cleaner than v-if="nowPercent !== null".
 * Numbers are easier to compare than nullable types.
 */
const nowPercent = computed((): number => {
  if (!restaurant.value) return -1

  const openMin  = parseTimeToMinutes(restaurant.value.opening_time);
  const closeMin = parseTimeToMinutes(restaurant.value.closing_time);
  const total    = closeMin - openMin
  const nowMin   = now.value.getHours() * 60 + now.value.getMinutes();

  if (nowMin < openMin || nowMin > closeMin) return -1;

  return minutesToPercent(nowMin, openMin, total);
})
</script>

<template>
  <div
    class="reservation-grid"
    v-loading="store.isLoading"
    element-loading-text="Загрузка..."
    element-loading-background="rgba(15, 17, 23, 0.8)"
  >
    <div 
      class="reservation-grid__scroll"
      :style="{ '--col-width': colWidth}"
    >
      <div
        class="reservation-grid__header"
        :style="{ height: `${GRID_CONFIG.headerHeight}px` }"
      >
        <div
          class="reservation-grid__corner"
          :style="{ width: `${GRID_CONFIG.timeAxisWidth}px` }"
        />
        <div
          v-for="table in tables"
          :key="`header-${table.id}`"
          class="reservation-grid__table-header"
        >
          <div class="table-header__top">
            <span class="table-header__number">#{{ table.number }}</span>
            <span class="table-header__capacity">{{ table.capacity }} чел</span>
          </div>
          <div class="table-header__zone">{{ table.zone }}</div>
        </div>
      </div>
      <div
        class="reservation-grid__body"
        :style="{ height: `${totalHeight}px` }"
      >
        <div
          class="reservation-grid__time-axis"
          :style="{ width: `${GRID_CONFIG.timeAxisWidth}px` }"
        >
          <div
            v-for="label in timeLabels"
            :key="label.label"
            class="time-axis__label"
            :style="{ top: `${label.percent}%` }"
          >
            {{ label.label }}
          </div>
        </div>
        <div class="reservation-grid__columns">
          <div
            v-if="nowPercent >= 0"
            class="time-now-line"
            :style="{ top: `${nowPercent}%` }"
          />
          <TableColumn
            v-for="table in tables"
            :key="table.id"
            :table="table"
            :opening-time="restaurant!.opening_time"
            :closing-time="restaurant!.closing_time"
            :timezone="restaurant!.timezone"
            :searchMode="store.searchMode"
            :searchQuery="store.searchQuery"
          />

        </div>
      </div>
      <el-empty
        v-if="tables.length === 0 && !store.isLoading"
        description="Нет столов для отображения"
        class="reservation-grid__empty"
      />
    </div>
  </div>
</template>

<style scoped>
.reservation-grid {
  flex: 1;
  overflow: hidden;
  position: relative;
  background-color: var(--color-bg-base);
  min-height: 0;
}

/* ── Scroll Container ──────────────────────────────────────────────── */

.reservation-grid__scroll {
  width: 100%;
  height: 100%;
  overflow: auto; 
}

/* ── Header Row ────────────────────────────────────────────────────── */

.reservation-grid__header {
  display: flex;
  position: sticky;
  top: 0;
  z-index: 30;
  min-width: max-content;
  background-color: var(--color-bg-header);
  border-bottom: 2px solid var(--color-border-light);
}

/* ── Corner Cell ───────────────────────────────────────────────────── */

.reservation-grid__corner {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 40;
  flex-shrink: 0;
  background-color: var(--color-bg-header);
  border-right: 1px solid var(--color-border);
}

/* ── Table Header Cells ────────────────────────────────────────────── */

.reservation-grid__table-header {
  flex: 0 0 var(--col-width);
  width: var(--col-width);
  min-width: var(--col-width);
  padding: 6px 8px;
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
}

.table-header__top {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 4px;
}

.table-header__number {
  font-weight: 700;
  font-size: 13px;
  color: var(--color-text-primary);
}

.table-header__capacity {
  font-size: 11px;
  color: var(--color-text-muted);
}

.table-header__zone {
  font-size: 11px;
  font-weight: 400;
  text-align: center;
  color: var(--color-text-muted);
}

/* ── Body ──────────────────────────────────────────────────────────── */

.reservation-grid__body {
  display: flex;
  min-width: max-content;
  position: relative;
}

/* ── Time Axis ─────────────────────────────────────────────────────── */

.reservation-grid__time-axis {
  position: sticky;
  left: 0;
  z-index: 20;
  flex-shrink: 0;
  background-color: var(--color-bg-header);
  border-right: 2px solid var(--color-border-light);
  overflow: visible;
  isolation: isolate;
}

.time-axis__label {
  position: absolute;
  right: 6px;
  font-size: 11px;
  color: var(--color-text-muted);
  transform: translateY(0);
  white-space: nowrap;
  line-height: 1;
  user-select: none;
}

.time-axis__label::after {
  content: '';
  position: absolute;
  left: calc(100% + 6px);
  top: 0;
  width: 10000px;
  height: 1px;
  background-color: var(--color-border);
  pointer-events: none;
  opacity: 0.4;
  z-index: -1;
}

.time-axis__label:nth-child(odd)::after {
  opacity: 0.7;
  z-index: -1;
}

/* ── Columns Container ─────────────────────────────────────────────── */

.reservation-grid__columns {
  display: flex;
  flex: 1;
  position: relative;
  height: 100%;
}

/* ── Current Time Line ─────────────────────────────────────────────── */

.time-now-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--color-now);
  z-index: 15;
  pointer-events: none;
}

/* Dot on the left end of the line */
.time-now-line::before {
  content: '';
  position: absolute;
  left: -4px;
  top: -4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--color-now);
}

/* ── Empty State ───────────────────────────────────────────────────── */

.reservation-grid__empty {
  padding: 60px 0;
}

.reservation-grid__empty :deep(.el-empty__description p) {
  color: var(--color-text-muted);
}
</style>