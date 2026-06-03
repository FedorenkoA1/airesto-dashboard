import type { Order, Reservation, NormalizedEventType, PartialEvent } from "@/features/reservationGrid/types";
import { parseISO } from "date-fns";

export const normalizeOrder = (order: Order): PartialEvent => ({
    id: order.id,
    type: 'order' as NormalizedEventType,
    status: order.status,
    startTime: parseISO(order.start_time),
    endTime: parseISO(order.end_time)
});

export const normalizeReservation = (reservation: Reservation): PartialEvent => ({
    id: reservation.id,
    type: 'reservation' as NormalizedEventType,
    status: reservation.status,
    startTime: parseISO(reservation.seating_time),
    endTime: parseISO(reservation.end_time),
    name: reservation.name_for_reservation,
    numPeople: reservation.num_people,
    phone: reservation.phone_number
});