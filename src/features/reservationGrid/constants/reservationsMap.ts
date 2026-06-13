export const STATUS_LABELS: Record<string, string> = {
  // Orders
  'New':     'Новый',
  'Bill':    'Пречек',
  'Closed':  'Закрытый',
  'Banquet': 'Банкет',
  // Reservations
  'Живая очередь': 'Живая очередь',
  'Новая':         'Ожидает подтверждения',
  'Заявка':        'Ожидает',
  'Открыт':        'В зале',
  'Закрыт':        'Отменен',
}

export const getStatusLabel = (status: string): string => STATUS_LABELS[status] ?? status;