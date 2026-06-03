import type { PartialEvent } from "@/features/reservationGrid/types";
import { detectEventConflict } from "./conflict";

/**
 * Events that don't conflict with anyone should be full width.
 * We only split width between events that actually conflict.
 * Clusters let us process each conflict group independently.
 */

export const buildClusters = (events: PartialEvent[]): number[][] => {
    const clusters: number[][] = [];

    events.forEach((clusterEvent, clusterEventIndex) => {
        const matchingCluster = clusters.find(cluster => 
            cluster.some(eventInCluster => detectEventConflict(clusterEvent, events[eventInCluster]))
        );

        if (matchingCluster) {
          matchingCluster.push(clusterEventIndex);
        } else {
          clusters.push([clusterEventIndex]);
        }
    })

    return clusters;
}