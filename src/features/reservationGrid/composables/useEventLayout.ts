import type { Order, Reservation, NormalizedEvent } from "@/features/reservationGrid/types";
import { normalizeOrder, normalizeReservation } from "@/features/reservationGrid/eventLayout/normalize";
import { buildClusters } from "@/features/reservationGrid/eventLayout/cluster";
import { assignColumnsInCluster } from "@/features/reservationGrid/eventLayout/assignColumns";

/**
 * Main entry point for layout algoritm
 * 
 * Takes raw orders and reservations from a table
 * returns a flat array of NormalisedEvent with column position
 * 
 * Flow:
 * 1. Normalize  → unify Orders + Reservations into one shape
 * 2. Sort       → by start time (required for clustering)
 * 3. Cluster    → group conflicting events together
 * 4. Assign     → give each event a column number
 *
 * Called by TableColumn.vue once per table via computed
 */
export const computeTableLayout = (
    orders: Order[],
    reservations: Reservation[],
    timezone: string
): NormalizedEvent[] => {
 // ---- Step 1: Normalize-----

  const events = [
    ...orders.map(order => normalizeOrder(order, timezone)),
    ...reservations.map(reservation => normalizeReservation(reservation, timezone))
  ]
  // ---- Step 2: Sorting-----
  .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  if (events.length === 0) return [];

  // ---- Step 3: Initialize result array-----
  const result: NormalizedEvent[] = events.map(event => ({
    ...event,
    column: 0,
    totalColumns: 1
  }));

  // ---- Step 4: Cluster-----
  const clusters = buildClusters(events);

  // ---- Step 5: AssignColumns------
  clusters.forEach(cluster => {
    const totalColumns = assignColumnsInCluster(cluster, events, result);

    cluster.forEach(clusterEventIndex => {
        result[clusterEventIndex].totalColumns = totalColumns;
    })
  })

  return result;
}




