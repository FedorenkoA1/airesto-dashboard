import type { ApiResponse, Table, Order, Reservation } from "@/features/reservationGrid/types";

const BASE_DAY = '2025-04-04'
const TZ_OFFSET = '+03:00'

function t(time: string, day = BASE_DAY): string {
  return `${day}T${time}:00.000${TZ_OFFSET}`
}

export const mockData: ApiResponse = {
  available_days: [
    '2025-04-04',
    '2025-04-05',
    '2025-04-06',
    '2025-04-07',
    '2025-04-08',
  ],
  current_day: BASE_DAY,
  restaurant: {
    id: 11100,
    timezone: 'Asia/Vladivostok',
    restaurant_name: 'Супра',
    opening_time: '11:00',
    closing_time: '23:40',
  },
  tables: [

    // --- 1 ЭТАЖ --------------------------------------------------

    {
      id: 'table-5',
      capacity: 2,
      number: '5',
      zone: '1 этаж',
      orders: [
        { id: 'o-5-1', status: 'New',    start_time: t('13:00'), end_time: t('14:00') },
        { id: 'o-5-2', status: 'Closed', start_time: t('13:31'), end_time: t('16:00') },
        { id: 'o-5-3', status: 'Closed', start_time: t('18:00'), end_time: t('19:00') },
      ],
      reservations: [
        {
          id: 1,
          name_for_reservation: 'Банкет',
          num_people: 8,
          phone_number: '+79991112233',
          status: 'Открыт',
          seating_time: t('16:30'),
          end_time: t('17:45'),
        },
      ],
    },

    {
      id: 'table-8',
      capacity: 4,
      number: '8',
      zone: '1 этаж',
      orders: [
        { id: 'o-8-1', status: 'New',    start_time: t('13:30'), end_time: t('14:30') },
        { id: 'o-8-2', status: 'Closed', start_time: t('15:00'), end_time: t('16:00') },
        { id: 'o-8-3', status: 'Closed', start_time: t('18:00'), end_time: t('19:00') },
      ],
      reservations: [
        {
          id: 2,
          name_for_reservation: 'Иван',
          num_people: 3,
          phone_number: '+79992223344',
          status: 'Живая очередь',
          seating_time: t('14:30'),
          end_time: t('15:30'),
        },
      ],
    },

    {
      id: 'table-155',
      capacity: 4,
      number: '155',
      zone: '1 этаж',
      orders: [
        { id: 'o-155-1', status: 'Closed', start_time: t('13:00'), end_time: t('14:00') },
        { id: 'o-155-2', status: 'Closed', start_time: t('15:00'), end_time: t('16:00') },
        { id: 'o-155-3', status: 'Closed', start_time: t('16:10'), end_time: t('17:10') },
        { id: 'o-155-4', status: 'Closed', start_time: t('18:00'), end_time: t('19:00') },
      ],
      reservations: [],
    },

    {
      id: 'table-191',
      capacity: 4,
      number: '191',
      zone: '1 этаж',
      orders: [
        { id: 'o-191-1', status: 'New', start_time: t('13:00'), end_time: t('14:00') },
      ],
      reservations: [
        {
          id: 3,
          name_for_reservation: 'Алина',
          num_people: 6,
          phone_number: '+79993334455',
          status: 'Новая',
          seating_time: t('13:00'),
          end_time: t('14:00'),
        },
      ],
    },

    // --- 2 ЭТАЖ --------------------------------------------

    {
      id: 'table-20',
      capacity: 4,
      number: '20',
      zone: '2 этаж',
      orders: [
        { id: 'o-20-1', status: 'Banquet', start_time: t('13:00'), end_time: t('14:00') },
      ],
      reservations: [
        {
          id: 4,
          name_for_reservation: 'Миша',
          num_people: 4,
          phone_number: '+79994445566',
          status: 'Живая очередь',
          seating_time: t('13:00'),
          end_time: t('14:00'),
        },
        {
          id: 5,
          name_for_reservation: 'Алина',
          num_people: 6,
          phone_number: '+79994445566',
          status: 'Новая',
          seating_time: t('13:00'),
          end_time: t('14:00'),
        },
        {
          id: 6,
          name_for_reservation: 'Алина',
          num_people: 8,
          phone_number: '+79994445566',
          status: 'Заявка',
          seating_time: t('13:00'),
          end_time: t('14:00'),
        },
        {
          id: 7,
          name_for_reservation: 'Алина',
          num_people: 4,
          phone_number: '+79994445566',
          status: 'Открыт',
          seating_time: t('13:00'),
          end_time: t('14:00'),
        },
      ],
    },

    {
      id: 'table-21',
      capacity: 4,
      number: '21',
      zone: '2 этаж',
      orders: [
        { id: 'o-21-1', status: 'Closed', start_time: t('12:30'), end_time: t('13:20') },
        { id: 'o-21-2', status: 'New',    start_time: t('14:30'), end_time: t('16:00') },
      ],
      reservations: [
        {
          id: 8,
          name_for_reservation: 'Петр',
          num_people: 2,
          phone_number: '+79995556677',
          status: 'Открыт',
          seating_time: t('17:00'),
          end_time: t('18:00'),
        },
      ],
    },

    {
      id: 'table-22',
      capacity: 4,
      number: '22',
      zone: '2 этаж',
      orders: [
        { id: 'o-22-1', status: 'Closed', start_time: t('12:30'), end_time: t('13:10') },
        { id: 'o-22-2', status: 'Closed', start_time: t('13:00'), end_time: t('14:30') },
        { id: 'o-22-3', status: 'New',    start_time: t('15:00'), end_time: t('16:00') },
      ],
      reservations: [],
    },

    {
      id: 'table-23',
      capacity: 4,
      number: '23',
      zone: '2 этаж',
      orders: [
        { id: 'o-23-1', status: 'Closed', start_time: t('12:30'), end_time: t('13:10') },
        { id: 'o-23-2', status: 'New',    start_time: t('13:30'), end_time: t('14:40') },
      ],
      reservations: [
        {
          id: 9,
          name_for_reservation: 'Алина',
          num_people: 6,
          phone_number: '+79996667788',
          status: 'Новая',
          seating_time: t('13:30'),
          end_time: t('14:40'),
        },
      ],
    },

    {
      id: 'table-24',
      capacity: 4,
      number: '24',
      zone: '2 этаж',
      orders: [
        { id: 'o-24-1', status: 'Banquet', start_time: t('14:45'), end_time: t('16:00') },
        { id: 'o-24-2', status: 'Closed',  start_time: t('16:00'), end_time: t('16:25') },
        { id: 'o-24-3', status: 'Closed',  start_time: t('16:10'), end_time: t('16:25') },
      ],
      reservations: [],
    },

    {
      id: 'table-25',
      capacity: 4,
      number: '25',
      zone: '2 этаж',
      orders: [
        { id: 'o-25-1', status: 'Closed', start_time: t('12:00'), end_time: t('13:10') },
        { id: 'o-25-2', status: 'Closed', start_time: t('13:00'), end_time: t('14:30') },
        { id: 'o-25-3', status: 'Closed', start_time: t('13:30'), end_time: t('14:40') },
        { id: 'o-25-4', status: 'Bill',   start_time: t('15:00'), end_time: t('16:00') },
        { id: 'o-25-5', status: 'New',    start_time: t('17:00'), end_time: t('19:00') },
        { id: 'o-25-6', status: 'Closed', start_time: t('20:00'), end_time: t('21:30') },
      ],
      reservations: [],
    },

    // --- БАНКЕТНЫЙ ЗАЛ-----------------------------------------

    {
      id: 'table-27',
      capacity: 4,
      number: '27',
      zone: 'Банкетный зал',
      orders: [
        { id: 'o-27-1', status: 'Closed', start_time: t('12:15'), end_time: t('12:51') },
        { id: 'o-27-2', status: 'New',    start_time: t('13:17'), end_time: t('14:12') },
        { id: 'o-27-3', status: 'Bill',   start_time: t('14:42'), end_time: t('15:22') },
      ],
      reservations: [
        {
          id: 10,
          name_for_reservation: 'Самера',
          num_people: 5,
          phone_number: '+79997778899',
          status: 'Открыт',
          seating_time: t('20:00'),
          end_time: t('22:00'),
        },
        {
          id: 11,
          name_for_reservation: 'Залей',
          num_people: 4,
          phone_number: '+79997778899',
          status: 'Новая',
          seating_time: t('20:09'),
          end_time: t('22:30'),
        },
      ],
    },

    {
      id: 'table-28',
      capacity: 4,
      number: '28',
      zone: 'Банкетный зал',
      orders: [
        { id: 'o-28-1', status: 'Closed', start_time: t('12:01'), end_time: t('13:05') },
        { id: 'o-28-2', status: 'Closed', start_time: t('13:28'), end_time: t('14:39') },
        { id: 'o-28-3', status: 'Closed', start_time: t('15:33'), end_time: t('20:27') },
      ],
      reservations: [
        {
          id: 12,
          name_for_reservation: 'Иванов',
          num_people: 2,
          phone_number: '+79998889900',
          status: 'Закрыт',
          seating_time: t('21:26'),
          end_time: t('22:47'),
        },
      ],
    },

    {
      id: 'table-29',
      capacity: 4,
      number: '29',
      zone: 'Банкетный зал',
      orders: [
        { id: 'o-29-1', status: 'Closed', start_time: t('13:59'), end_time: t('16:07') },
        { id: 'o-29-2', status: 'Closed', start_time: t('15:47'), end_time: t('17:19') },
      ],
      reservations: [
        {
          id: 13,
          name_for_reservation: 'Аня',
          num_people: 4,
          phone_number: '+79999990011',
          status: 'Новая',
          seating_time: t('17:15'),
          end_time: t('18:45'),
        },
      ],
    },

    {
      id: 'table-30',
      capacity: 4,
      number: '30',
      zone: 'Банкетный зал',
      orders: [
        { id: 'o-30-1', status: 'Closed', start_time: t('12:00'), end_time: t('14:00') },
        { id: 'o-30-2', status: 'Closed', start_time: t('13:30'), end_time: t('16:00') },
        { id: 'o-30-3', status: 'Closed', start_time: t('17:00'), end_time: t('20:00') },
      ],
      reservations: [
        {
          id: 14,
          name_for_reservation: 'Банкет VIP',
          num_people: 12,
          phone_number: '+79990001122',
          status: 'Открыт',
          seating_time: t('18:45'),
          end_time: t('23:00'),
        },
      ],
    },

  ],
}

// --- Day Switcher -------------------------------

export function getMockDataForDay(day: string): ApiResponse {
    if (day === BASE_DAY) return mockData;

    const cloned = JSON.parse(JSON.stringify(mockData));

    cloned.tables.forEach((table: Table) => {
      table?.orders.forEach((order: Order) => {
        order.start_time = order.start_time.replace(BASE_DAY, day);
        order.end_time = order.end_time.replace(BASE_DAY, day)
      });
      
      table?.reservations.forEach((reservation: Reservation) => {
        reservation.seating_time = reservation.seating_time.replace(BASE_DAY, day);
        reservation.end_time = reservation.end_time.replace(BASE_DAY, day);
      });
    });

    return cloned;
}