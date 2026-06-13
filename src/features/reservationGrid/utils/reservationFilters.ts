import { getStatusLabel } from "@/features/reservationGrid/constants/reservationsMap";
import { matches } from "@/utils/helpers";
import type { Order, Reservation, Table, SearchMode } from "@/features/reservationGrid/types";

/**
 * Filtering functions
 */
// search for Table Number
const matchesByTableNumber = (table: Table, query: string): boolean => matches(table.number, query);

// search for Reservation Name / Status
const matchesByReservationName = (reservation: Reservation, query: string): boolean => matches(reservation.name_for_reservation, query);
const matchesByReservationStatus = (reservation: Reservation, query: string): boolean => matches(reservation.status, query) || matches(getStatusLabel(reservation.status), query);

// search for Order Status
const matchesByOrderStatus = (order: Order, query: string): boolean => matches(getStatusLabel(order.status), query);


/**
 * Checks if table should be visible based on search query and mode
 */
export const tableMatchesSearch = (
    table: Table,
    query: string,
    mode: SearchMode
): boolean => {
    if (!query.trim()) return true;
    switch (mode) {
        case 'table':
          return matchesByTableNumber(table, query);

        case 'name': 
          return table.reservations.some(reservation => matchesByReservationName(reservation, query));

        case 'status':
          return (
            table.orders.some(order => matchesByOrderStatus(order, query)
            ) ||
            table.reservations.some(reservation => matchesByReservationStatus(reservation, query))
          );

        case 'all':
        default:
          return (
            matchesByTableNumber(table, query) ||
            table.reservations.some(reservation => matchesByReservationName(reservation, query) || matchesByReservationStatus(reservation, query)) ||
            table.orders.some(order => matchesByOrderStatus(order, query))
          );
    }
}

/**
 * Filters orders based on search query and mode
 * Used in Table Column
 */
export const filterOrders = (
  orders: Order[],
  query: string,
  mode: SearchMode
): Order[] => {
  if (!query.trim()) return orders;

  switch (mode) {
    case 'name': return [];
    case 'table': return orders;
    case 'status': return orders.filter(order => matchesByOrderStatus(order, query));
    default: return orders.filter(order => matchesByOrderStatus(order, query));
  }
}

/**
 * Filters reservations based on search query and mode.
 * Used in TableColumn.
 */
export const filterReservations = (
  reservations: Reservation[],
  query: string,
  mode: SearchMode
): Reservation[] => {
  if (!query.trim()) return reservations;

  switch (mode) {
    case 'name': return reservations.filter(reservation => matchesByReservationName(reservation, query));
    case 'table': return reservations;
    case 'status': return reservations.filter(reservation => matchesByReservationStatus(reservation, query));
    default: return reservations.filter(reservation => 
      matchesByReservationName(reservation, query) || matchesByReservationStatus(reservation, query));
  }
}