import type { PartialEvent, NormalizedEvent } from "@/features/reservationGrid/types";
import { detectEventConflict } from "./conflict";

/**
 * Here we will assin sub-column indices to events withim a single cluster
 * using greedy graph coloring algorithm
 * 
 * 1) Find all events it conflicts with
 * 2) Collect their already-assigned column numbers
 * 3) Assign the smallest column number NOT in that set
 * 
 * For instance:
 * Example:
 * Cluster: [A, B, C]
 * A conflicts with B
 * B conflicts with A and C
 * C conflicts with B only
 *
 * Process A → usedColumns = {}      → assign col 0
 * Process B → usedColumns = {0}     → assign col 1
 * Process C → usedColumns = {1}     → assign col 0
 * 
 * @returns total number of sub-columns needed for this cluster
 */
export const assignColumnsInCluster = (
  clusterIndices: number[],
  events: PartialEvent[],
  result: NormalizedEvent[]
): number => {
  let maxColumn = 0;

  clusterIndices.forEach(currentEventIndex =>  {
    const conflictingEventIndexesArray = clusterIndices.filter(
      otherEventIndex => otherEventIndex !== currentEventIndex && 
      detectEventConflict(
        events[currentEventIndex],
        events[otherEventIndex])
    );


   // occupiedColumns is for pointing 'Which columns are already occupied by conflicting events?'
   const occupiedColumns = new Set(
     conflictingEventIndexesArray.map(conflictingEventIndex =>
       result[conflictingEventIndex].column
    )
   )

   let availableColumn = 0;

   while (occupiedColumns.has(availableColumn)) {
     availableColumn++;
   }

   result[currentEventIndex].column = availableColumn;
   maxColumn = Math.max(maxColumn, availableColumn);
  });

  return maxColumn + 1;
}


