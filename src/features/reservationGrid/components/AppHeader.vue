<script setup lang="ts">
import { computed } from "vue";
import { useReservationsStore } from "@/features/reservationGrid/store/reservations";
import { useRestaurantTime } from "@/features/reservationGrid/composables/useRestaurantTime";
import { Search, Sunny, Moon, Right } from "@element-plus/icons-vue";

const store = useReservationsStore();
const restaurant = computed(() => store.restaurant);

const { nowFormatted } = useRestaurantTime(computed(() => restaurant.value?.timezone ?? 'UTC').value);
</script>

<template>
  <header class="app-header">
    <div class="app-header__brand">
      <span class="brand-logo">AIRESTO</span>
      <span class="brand-divider">|</span>
      <span class="brand-name">{{ restaurant?.restaurant_name ?? '...' }}</span>
    </div>
    <div class="app-header__settings">
      <el-input
        placeholder="⌘+Л поиск по имени"
        class="header-search"
        :prefix-icon="Search"
      />
      <div class="header-time">
        <span class="header-time__value">{{ nowFormatted }}</span>
        <span class="header-time__tz">{{ restaurant?.timezone }}</span>
      </div>
      <el-button
        rectangle
        size="small"
        class="theme-toggle"
        :title="store.theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'"
        @click="store.toggleTheme()"
      >
        <el-icon v-if="store.theme === 'dark'">
          <Sunny />
        </el-icon>
       <span v-else>
          <el-icon>
            <Moon />
          </el-icon>
       </span>
      </el-button>

      <!--
        Выйти button.
        We don't implement real logout — just the UI.
        In production this would call an auth service.
      -->
      <el-button
        size="small"
        class="logout-btn"
      >
        <el-icon><Right /></el-icon>
        <span>Выйти</span>
      </el-button>

    </div>
  </header>
</template>

<style scoped>
.app-header {
  height: 48px;
  flex-shrink: 0;
  background-color: var(--color-bg-app-header);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  gap: 16px;
}

.app-header__brand {
  display: flex;
  gap: 8px;
  flex-shrink: 0;  /* never compress brand */
}

.brand-logo {
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.05em;
  color: var(--color-text-primary);
}

.brand-divider {
  color: var(--color-text-light);
}

.brand-name {
  font-size: 14px;
  color: var(--color-text-light);
}

.app-header__settings {         
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 10px;
}

.header-search :deep(.el-input__wrapper) {
  width: 258px;
  height: 28px;
  border-width: 1px;
  border-radius: 8px;
  padding-block: 8px;
  background-color: var(--color-bg-elevated);
  border-color: var(--color-border);
  box-shadow: none;
}

.header-search :deep(.el-input__inner) {
  color: var(--color-text-primary);
  font-size: 12px;
}

.header-search :deep(.el-input__inner::placeholder) {
  color: var(--color-text-muted);
}

.app-header__right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.header-time {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: var(--color-text-secondary);
  font-variant-numeric: tabular-nums;
}

.header-time__tz {
  font-size: 10px;
  color: var(--color-text-muted);
}

.theme-toggle {
  width: 24px;
  height: 24px;
  padding-block: 6px;
  background: transparent !important;
  border-color: var(--color-border) !important;
  color: var(--color-text-primary) !important;
}

.logout-btn {
  display: flex;
  background: transparent !important;
  border-color: var(--color-border) !important;
  color: var(--color-text-secondary) !important;
  font-size: 12px;
}

.logout-btn.el-button {
    margin-left: 0 !important;
}
</style>