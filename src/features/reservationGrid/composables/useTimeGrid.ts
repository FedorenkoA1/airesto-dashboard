// Pure math utilities for converting wall-clock times into
// percentage positions within the restaurant's open hours
/**
 * We parse HH:MM into total minutes since midnight
 */
export function parseTimeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

/**
 * We parse minutes since midnoght from the Date object
 * Like new Date('2025-04-04T13:30:00+10:00') -> 810
 */
export function dateToMinutes(date: Date) : number {
    return date.getHours() * 60 + date.getMinutes();
}

/**
 * This function provide as the threshold to avoid negative values or values that are greater than 100%
 * @param raw - raw percentage value before clamping 
 */
function clampPercent(raw: number): number {
    return Math.max(0, Math.min(100, raw));
}

/**
 * Common function
 * We excute here our main colculations (calculate the percents)
 */
function calcPercent(minutes: number, openMinutes: number, totalMinutes: number): number {
  return clampPercent(((minutes - openMinutes) / totalMinutes) * 100)
}

/**
 * Converts a Date into a percentage position within the restaurant's
 * operating hours timeline.
 *
 * Example:
 * Restaurant hours: 11:00–23:40
 * Event time: 13:00
 * Result: 15.79
 *
 * The returned value is typically used for CSS positioning
 * (e.g. `top: 15.79%`).
 *
 * @param date Event date/time to position on the timeline.
 * @param openMinutes Restaurant opening time in minutes since midnight.
 * @param totalMinutes Total restaurant operating duration in minutes.
 * @returns Percentage position (0–100) relative to the restaurant timeline.
 */
export function dateToPercent(date: Date, openMinutes: number, totalMinutes: number): number {
  return calcPercent(dateToMinutes(date), openMinutes, totalMinutes)
}

/**
 * Converts a time expressed as minutes since midnight into a percentage
 * position within the restaurant's operating hours timeline.
 *
 * Useful when a time has already been converted to minutes and creating
 * a Date object would be unnecessary.
 *
 * Common use cases:
 * - Time axis labels
 * - Current time indicator
 * - Timeline markers
 *
 * @param minutes Time in minutes since midnight (e.g. 13:00 → 780).
 * @param openMinutes Restaurant opening time in minutes since midnight.
 * @param totalMinutes Total restaurant operating duration in minutes.
 * @returns Percentage position (0–100) relative to the restaurant timeline.
 */
export function minutesToPercent(minutes: number, openMinutes: number, totalMinutes: number): number {
  return calcPercent(minutes, openMinutes, totalMinutes)
}

/**
 * Generates 30-minute timeline labels between the restaurant's
 * opening and closing times.
 *
 * Each label includes:
 * - `label`: formatted time (e.g. "13:30")
 * - `percent`: vertical position (0–100) within the timeline
 *
 * @param openingTime Restaurant opening time in HH:mm format.
 * @param closingTime Restaurant closing time in HH:mm format.
 * @returns Array of timeline labels with their relative positions.
 */
export function generateTimeLabelsForGrid(
    openingTime: string,
    closingTime: string
): Array<{ label: string; percent: number}> {
    const openMinutes = parseTimeToMinutes(openingTime);
    const closeMinutes = parseTimeToMinutes(closingTime);
    const total = closeMinutes - openMinutes;

    const labels: Array<{ label: string; percent: number}> = [];

    // We start building at the opening time, step every 30 minutes
    let current = openMinutes;

    while (current <= closeMinutes) {
        const hours = Math.floor(current / 60);
        const minutes = current % 60;

        // We pad with leading zero: 9 -> '09'
        const label = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        const percent = ((current - openMinutes) / total) * 100;

        labels.push({ label, percent});
        
        current += 30;
    }

    return labels;
}




