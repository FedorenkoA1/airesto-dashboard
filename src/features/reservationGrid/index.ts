// ── Public API of the reservationGrid feature ──────────────────────────────
//
// Every import from outside this feature goes through this file.
// Internal files import directly from each other.

// Store
export { useReservationsStore } from "./store/reservations";

// Composables
export { computeTableLayout } from "./composables/useEventLayout";
export { useRestaurantTime } from "./composables/useRestaurantTime";
export {
  generateTimeLabelsForGrid,
  parseTimeToMinutes,
  dateToPercent,
  minutesToPercent,
} from "./composables/useTimeGrid";

// Types
export type {
  ApiResponse,
  Table,
  Order,
  Reservation,
  NormalizedEvent,
  PartialEvent,
} from "./types";