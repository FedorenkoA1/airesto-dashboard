import type { OrderStatus, ReservationStatus, TableZoneStatus, NormalizedEventType } from "@/features/reservationGrid/types/enums";

export interface ApiResponse {
    available_days: string[];
    current_day: string;
    restaurant: {
        id: number;
        timezone: string;
        restaurant_name: string;
        opening_time: string;
        closing_time: string;
    };
   tables: Table[]
};

export interface Order {
    id: string;
    status: OrderStatus;
    start_time: string;
    end_time: string;
};

export interface Reservation {
  id: number;
  name_for_reservation: string;
  num_people: number;
  phone_number: string;
  status: ReservationStatus;
  seating_time: string;
  end_time: string;
};

export interface Table {
  id: string;
  capacity: number;
  number: string;
  zone: TableZoneStatus;
  orders: Order[];
  reservations: Reservation[];
};

export interface NormalizedEvent {
  id: string | number;
  type: NormalizedEventType;
  status: string;
  startTime: Date;
  endTime: Date;
  name?: string;
  numPeople?: number;
  phone?: string;
  column: number;
  totalColumns: number;
};

// type for nomalisation of either reservation or order to the equal shape
export type PartialEvent = Omit<NormalizedEvent, 'column' | 'totalColumns'>;