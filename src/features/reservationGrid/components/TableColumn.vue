<script setup lang="ts">
import { computed } from "vue";
import type { Table } from "@/features/reservationGrid/types";
import { computeTableLayout } from "@/features/reservationGrid/composables/useEventLayout";
import { dateToPercent, parseTimeToMinutes } from "@/features/reservationGrid/composables/useTimeGrid";
import EventBlock from "./EventBlock.vue";

// ── Props ──────────────────────────────────────────────────────────────────

const props = defineProps<{
  table: Table
  openingTime: string  // "11:00" — from restaurant data
  closingTime: string  // "23:40" — from restaurant data
}>()

// ── Time constants ─────────────────────────────────────────────────────────

/**
 * Why computed instead of plain const?
 * Props can change — if a different day is selected,
 * opening/closing times could theoretically differ.
 * computed() reacts to prop changes automatically.
 */
const openMinutes = computed(() => parseTimeToMinutes(props.openingTime));
const totalMinutes = computed(() => parseTimeToMinutes(props.closingTime) - openMinutes.value);

// ── Layout ─────────────────────────────────────────────────────────────────

/**
 * Run the full layout algorithm for this table.
 * Returns NormalizedEvent[] with column/totalColumns assigned.
 *
 * Why computed?
 * - Cached: only recalculates when table.orders or table.reservations change
 * - Reactive: if store updates data, this auto-updates
 *
 * This is called ONCE per table column, not once per event.
 * The algorithm processes all events together — that's why
 * it lives here and not in EventBlock.
 */
const laidOutEvents = computed(() =>
  computeTableLayout(props.table.orders, props.table.reservations)
)

/**
 * For each event compute the CSS positioning values.
 *
 * We separate this from laidOutEvents because:
 * - laidOutEvents = WHAT events exist and their column positions
 * - eventPositions = HOW to render them on screen (CSS values)
 * Two different concerns.
 */
const eventPositions = computed(() =>
  laidOutEvents.value.map((event, index) => {
    // top: where the event starts (% from top of column)
    const top = dateToPercent(event.startTime, openMinutes.value, totalMinutes.value)

    // bottom: where the event ends
    const bottom = dateToPercent(event.endTime, openMinutes.value, totalMinutes.value)

    // height: how tall the event is
    // minimum 1.5% so tiny events are still visible
    const height = Math.max(bottom - top, 1.5)

    // left: which sub-column this event starts at
    // column=0, totalColumns=2 → left=0%
    // column=1, totalColumns=2 → left=50%
    const leftPercent = (event.column / event.totalColumns) * 100

    // width: how wide this event is
    // totalColumns=1 → width=100%
    // totalColumns=2 → width=50%
    const widthPercent = (1 / event.totalColumns) * 100

    /**
     * The 4px indent rule from Figma:
     * When events overlap, the later event gets a 4px
     * left indent relative to the one it overlaps.
     * column > 0 means this event is NOT the first — indent it.
     */

    const hasOverlapWithPrevious = laidOutEvents.value
      .slice(0, index)
      .some(prev => event.startTime < prev.endTime && prev.startTime < event.startTime);

    const indentPx = hasOverlapWithPrevious ? 4 : 0

    return {
      event,
      top,
      height,
      leftPercent,
      widthPercent,
      indentPx,
    }
  })
)
</script>

<template>
  <div class="table-column">
    <div class="table-column__body">
      <div
        v-for="{ event, top, height, leftPercent, widthPercent, indentPx } in eventPositions"
        :key="event.id"
        class="table-column__event-wrapper"
        :style="{
          top:    `${top}%`,
          height: `${height}%`,
          left:   `calc(${leftPercent}% + ${indentPx}px)`,
          width:  `calc(${widthPercent}% - ${indentPx}px)`,
        }"
      >
        <EventBlock
          :event="event"
          :height-percent="height"
        />
      </div>

    </div>
  </div>
</template>

<style scoped>
.table-column {
  flex: 0 0 var(--col-width);
  width: var(--col-width);   
  min-width: var(--col-width);
  height: 100%;
  flex-shrink: 0;
  border-right: 1px solid var(--color-border);
  position: relative;
}

.table-column__body {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--color-bg-surface);
}

.table-column:nth-child(even) .table-column__body {
  background-color: var(--color-bg-base);
}

.table-column__event-wrapper {
  position: absolute;
  padding: 0 1px;
  z-index: 1;
  min-width: 20px;
  box-sizing: border-box;
  overflow: visible;
}

.table-column__event-wrapper:hover {
  z-index: 100;
}

.event-wrapper__glass {
  position: absolute;
  inset: 0;
  width: 100%;
  height: auto;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  z-index: 6;
  pointer-events: none;
  opacity: 0; 
  transition: opacity 0.15s;
}

.table-column__event-wrapper:hover .event-wrapper__glass {
  opacity: 1;
  width: max-content;
  min-width: 100%;
  height: 100%;

}

.table-column__event-wrapper:hover :deep(.event-block) {
  overflow-y: hidden;
  z-index: 3;
  position: relative;
}
</style>