import type { PartialEvent } from "@/features/reservationGrid/types";

const INTERSECTION_WINDOW_MS = 30 * 60 * 1000;

/**
 * Two events conflict if EITHER:
 *
 * 1. OVERLAP — one starts before the other ends:
 *    A: 13:00 ────────── 14:30
 *    B:          14:00 ────── 15:00
 *    B starts before A ends → conflict
 *
 * 2. INTERSECTION — they start within ±30 minutes:
 *    A: 13:00 ──── 14:00
 *    B: 13:25 ──── 14:30
 *    Only 25min apart → conflict
 * */

export const detectEventConflict = (eventA: PartialEvent, eventB: PartialEvent): boolean => {
    const isOverlapped = eventA.startTime < eventB.endTime && eventB.startTime < eventA.endTime;

    const startDiff = Math.abs(eventA.startTime.getTime() - eventB.startTime.getTime());
    const isIntersected = startDiff <= INTERSECTION_WINDOW_MS;

    return isIntersected;
}