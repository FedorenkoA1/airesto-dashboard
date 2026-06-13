import type { Order, Reservation, NormalizedEventType, PartialEvent } from "@/features/reservationGrid/types";
import { parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export const normalizeOrder = (order: Order, timezone: string): PartialEvent => ({
    id: order.id,
    type: 'order' as NormalizedEventType,
    status: order.status,
    startTime: toZonedTime(parseISO(order.start_time), timezone),
    endTime: toZonedTime(parseISO(order.end_time), timezone)
});

export const normalizeReservation = (reservation: Reservation, timezone: string): PartialEvent => ({
    id: reservation.id,
    type: 'reservation' as NormalizedEventType,
    status: reservation.status,
    startTime: toZonedTime(parseISO(reservation.seating_time), timezone),
    endTime: toZonedTime(parseISO(reservation.end_time), timezone),
    name: reservation.name_for_reservation,
    numPeople: reservation.num_people,
    phone: reservation.phone_number
});