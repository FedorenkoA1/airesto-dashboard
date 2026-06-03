<script setup lang="ts">
import { computed } from "vue";
import { format } from "date-fns";
import { PhoneFilled } from "@element-plus/icons-vue";
import type { NormalizedEvent } from "@/features/reservationGrid/types";

// ── Props ──────────────────────────────────────────────────────────────────

/**
 * Why only event as prop and not individual fields?
 * EventBlock owns the entire presentation of one event.
 * Passing the whole object keeps the interface clean —
 * if we add a new field to NormalizedEvent later,
 * we don't need to add a new prop here.
 */
const props = defineProps<{
  event: NormalizedEvent
  heightPercent: number  // needed to decide compact vs full display
}>()

// ── Style Map ─────────────────────────────────────────────────────────────

/**
 * Each event status maps to a visual style.
 * We use CSS variables defined in style.css so light/dark
 * theme switching works automatically.
 *
 * Why a map instead of if/else chains?
 * O(1) lookup. Easy to add new statuses. Easy to read.
 * If/else chains grow ugly fast with 9 cases.
 */
interface EventStyle {
  bg: string        // background color
  border: string    // left border color
  text: string      // text color
  label: string     // human readable label shown in card
  chipLabel: string // status chip text (empty = no chip)
  chipBg?: string
}

/**
 * For better practises we can move the configuring object to another file and import it further
*  but my project is small scale so for better visualisation put it here
*/
const styleMap: Record<string, EventStyle> = {
  // ── Orders ──────────────────────────────────────────────────────
  'order:New': {
    bg:         'var(--event-order-new-bg)',
    border:     'var(--event-order-new-border)',
    text:       'var(--event-order-new-text)',
    label:      'Заказ',
    chipLabel:  'Новый',
    chipBg:    'var(--event-order-new-chip)'
  },
  'order:Bill': {
    bg:         'var(--event-order-bill-bg)',
    border:     'var(--event-order-bill-border)',
    text:       'var(--event-order-bill-text)',
    label:      'Заказ',
    chipLabel:  'Пречек',
    chipBg:    'var(--event-order-bill-chip)',
  },
  'order:Closed': {
    bg:         'var(--event-order-closed-bg)',
    border:     'var(--event-order-closed-border)',
    text:       'var(--event-order-closed-text)',
    label:      'Заказ',
    chipLabel:  'Закрытый',
    chipBg:    'var(--event-order-closed-chip)'
  },
  'order:Banquet': {
    bg:         'var(--event-banquet-bg)',
    border:     'var(--event-banquet-border)',
    text:       'var(--event-banquet-text)',
    label:      'Банкет',
    chipLabel:  '',  // Banquet has no chip
  },

  // ── Reservations ────────────────────────────────────────────────
  'reservation:Живая очередь': {
    bg:         'var(--event-queue-bg)',
    border:     'var(--event-queue-border)',
    text:       'var(--event-queue-text)',
    label:      'Живая очередь',
    chipLabel:  'Живая очередь',
    chipBg:    'var(--event-queue-chip)'
  },
  'reservation:Новая': {
    bg:         'var(--event-res-new-bg)',
    border:     'var(--event-res-new-border)',
    text:       'var(--event-res-new-text)',
    label:      'Бронь',
    chipLabel:  'Ожидает подтверждения',
    chipBg:    'var(--event-res-new-chip)'
  },
  'reservation:Заявка': {
    bg:         'var(--event-res-request-bg)',
    border:     'var(--event-res-request-border)',
    text:       'var(--event-res-request-text)',
    label:      'Бронь',
    chipLabel:  'Ожидает',
    chipBg:    'var(--event-res-request-chip)'
  },
  'reservation:Открыт': {
    bg:         'var(--event-res-open-bg)',
    border:     'var(--event-res-open-border)',
    text:       'var(--event-res-open-text)',
    label:      'Бронь',
    chipLabel:  'В зале',
    chipBg:    'var(--event-res-open-chip)'
  },
  'reservation:Закрыт': {
    bg:         'var(--event-res-closed-bg)',
    border:     'var(--event-res-closed-border)',
    text:       'var(--event-res-closed-text)',
    label:      'Бронь',
    chipLabel:  'Отменен',
    chipBg:    'var(--event-res-closed-chip)'
  },
}

/**
 * Build the lookup key from event type + status.
 * e.g. type='order', status='New' → 'order:New'
 *
 * Why computed?
 * If the event prop changes, this recalculates automatically.
 * Vue tracks the dependency on props.event.type and props.event.status.
 */
const style = computed<EventStyle>(() => {
  const key = `${props.event.type}:${props.event.status}`
  return styleMap[key] ?? {
    // Fallback for unknown statuses — should never happen
    bg: 'var(--color-bg-elevated)',
    border: 'var(--color-border)',
    text: 'var(--color-text-primary)',
    label: props.event.status,
    chipLabel: '',
    chipBg: ''
  }
});

/**
 * Formats a Date into "HH:MM" string.
 */
const formatTime = (date: Date): string => format(date, 'HH:mm');

// The time range string shown at the bottom of the card
const timeRange = computed(() => `${formatTime(props.event.startTime)}-${formatTime(props.event.endTime)}`);

// ------ Display Mode -----------
/**
 * Cards can be very small when many events overlap.
 * We adapt the content based on available height.
 *
 * Three display modes:
 *
 * FULL    (heightPercent >= 6%)  — show everything
 * COMPACT (heightPercent >= 2%)  — show label + time only
 * MINI    (heightPercent < 2%)   — show label only
 */
const isMini    = computed(() => props.heightPercent < 2);
const isCompact = computed(() => props.heightPercent >= 2 && props.heightPercent < 6);
const isFull    = computed(() => props.heightPercent >= 6);

/**
 * Phone display — last 4 digits only.
 * "+79991234567" → "4567"
 */
const phoneLast4 = computed(() => props.event.phone ? props.event.phone.slice(-4) : null);
</script>

<template>
  <div
    class="event-block"
    :style="{
      backgroundColor: style.bg,
      borderLeftColor: style.border,
      color: style.text,
    }"
  >
    <template v-if="isMini">
      <span class="event-block__label">{{ style.label }}</span>
    </template>
    <template v-else-if="isCompact">
      <div class="flex flex-col">
      <span class="event-block__label">{{ style.label }}</span>
      <span class="event-block__time">{{ timeRange }}</span>
      </div>
    </template>
    <template v-else-if="isFull">
      <template v-if="event.type === 'reservation'">
        <div class="event-block__id">№{{ event.id }}</div>
        <div class="event-block__name">
          {{ event.name }};
          <span class="event-block__people">
          <strong>{{ event.numPeople }}</strong> чел
          </span>
        </div>
        <div
          v-if="style.chipLabel"
          class="event-block__chip"
          :style="{
            backgroundColor: style.chipBg
          }"
        >
          {{ style.chipLabel }}
        </div>
        <div v-if="phoneLast4" class="event-block__phone">
          <PhoneFilled class="icon" /> 
          <p>{{ phoneLast4 }}</p>
        </div>
        <div class="event-block__time">{{ timeRange }}</div>
      </template>
      <template v-else>
        <div class="event-block__label">{{ style.label }}</div>
        <div
          v-if="style.chipLabel"
          class="event-block__chip"
          :style="{ 
            backgroundColor: style.chipBg,
          }"
        >
          {{ style.chipLabel }}
        </div>
        <div class="event-block__time">{{ timeRange }}</div>
      </template>
   </template>
  </div>
</template>

<style scoped>
.event-block {
  width: 100%;
  height: 100%;
  position: relative;
  border-left: 3px solid;
  border-radius: 3px;
  padding: 2px;
  overflow: hidden;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.35;
  box-sizing: border-box;
}

.event-block:hover {
  width: max-content;
  min-width: 100%;
  overflow-x: visible;
  overflow-y: hidden;
  z-index: 100;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
}

.event-block:hover::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 3px;
  pointer-events: none;
  z-index: 1;
}

.event-block__id,
.event-block__label,
.event-block__name,
.event-block__chip,
.event-block__phone,
.event-block__time {
  position: relative;
  z-index: 2;
}

.event-block__id {
  font-size: 10px;
  opacity: 0.7;
  margin-bottom: 1px;
}

.event-block__label {
  font-weight: 700;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-block__name {
  font-weight: 700;
  font-size: 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.event-block__people {
  white-space: nowrap;
  font-weight: 400;
  font-size: 11px;
}

.event-block__chip {
  display: inline-flex;
  align-items: center;
  font-size: 10px;
  border-radius: 3px;
  padding: 0 4px;
  white-space: nowrap;
}

.event-block__phone {
  display: flex;
  align-items: center;
  font-size: 11px;
  font-weight: 400;
  opacity: 0.8;
  margin-top: 1px;
}

.icon {
  width: 12px;
  height: 12px;
}

.event-block__time {
  font-size: 11px;
  font-weight: 400;
  line-height: 14px;
  opacity: 0.85;
  margin-top: 1px;
  white-space: nowrap;
}

.event-block__compact {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  height: 100%;
}
</style>

