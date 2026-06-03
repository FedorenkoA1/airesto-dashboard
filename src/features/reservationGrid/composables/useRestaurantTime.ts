import { ref, computed, onUnmounted } from "vue";
import { toZonedTime , format} from "date-fns-tz";

/**
 * Returns reactive current time in the restaurant's timezone.
 * 
 * @param timezone - IANA timezone e.g. 'Asia/Vladivostok'
 */
export function useRestaurantTime(timezone: string) {
    /**
     * Returns the current moment represented in the restaurant's timezone.
     */
    const getRestaurantCurrentTime = (): Date => toZonedTime(new Date(), timezone);

    const now = ref<Date>(getRestaurantCurrentTime());

    const nowFormatted = computed(() => 
      format(now.value, 'HH:mm', {
        timeZone: timezone
      })
    );

    const timer = setInterval(() => {
        now.value = getRestaurantCurrentTime();
    }, 30_000);

    onUnmounted(() => clearInterval(timer));

    return {
        now,
        nowFormatted
    }
}
