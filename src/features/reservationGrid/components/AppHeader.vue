<script setup lang="ts">
import { ref, computed } from "vue";
import { useReservationsStore } from "@/features/reservationGrid/store/reservations";
import { useRestaurantTime } from "@/features/reservationGrid/composables/useRestaurantTime";
import { useDebounce } from "@/utils/debounce";
import { Search, Sunny, Moon, Right, ArrowDown } from "@element-plus/icons-vue";

const store = useReservationsStore();
const restaurant = computed(() => store.restaurant);

const { nowFormatted } = useRestaurantTime(computed(() => restaurant.value?.timezone ?? 'UTC').value);

const localQuery = ref<string>('');

const debouncedSearch = useDebounce((value: string) => {
  store.searchQuery = value;
}, 300);

const onSearchInput = (value: string) => {
  localQuery.value = value;
  debouncedSearch(value);
}

// Search mode options
const searchModes = [
  { label: 'Все',    value: 'all'    },
  { label: 'Имя',    value: 'name'   },
  { label: 'Статус', value: 'status' },
  { label: 'Стол',   value: 'table'  },
];

// Map with search mode options
const currentModeLable = computed(() => searchModes.find(searchMode => searchMode.value === store.searchMode)?.label ?? 'Все');
</script>

<template>
  <header class="app-header">
    <div class="app-header__brand">
      <span class="brand-logo">AIRESTO</span>
      <span class="brand-divider">|</span>
      <span class="brand-name">{{ restaurant?.restaurant_name ?? '...' }}</span>
    </div>
    <div class="app-header__settings">
      <div class="header-search">
        {{ localQuery }}
        <el-input
        v-model="localQuery"
        placeholder="⌘+Л поиск по имени"
        class="header-search__input"
        :prefix-icon="Search"
        @input="onSearchInput"
      />

      <!--
        Divider between input and dropdown
        Visual separation
      -->
      <div class="header-search__divider" />

      <!--
        el-dropdown - shows options on click
        trigger="click" - opens on click not hover
      -->
      
      <el-dropdown
        trigger="click"
        @command="store.searchMode = $event"
      >
        <span class="el-dropdown-select">
          {{ currentModeLable }}
          <el-icon class="el-icon--arrow">
            <ArrowDown />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="mode in searchModes"
              :key="mode.value"
              :command="mode.value"
              :class="{ 'is-active': store.searchMode === mode.value }"
            >
              {{ mode?.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      </div>
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
  gap: 5px;
}

.header-search {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 10px;
  max-width: 380px;
}

.header-search .header-search__input :deep(.el-input__wrapper) {
  height: 28px;
  border-width: 1px;
  border-radius: 8px;
  padding-block: 8px;
  background-color: var(--color-bg-elevated);
  border-color: var(--color-border);
  box-shadow: none;
}

.header-search .header-search__input :deep(.el-input__inner) {
  color: var(--color-text-primary);
  font-size: 12px;
}

.header-search .header-search__input :deep(.el-input__inner::placeholder) {
  color: var(--color-text-muted);
}

.header-search__divider {
  width: 2px;
  height: 13px;
  background-color: var(--color-text-primary);
  flex-shrink: 0;
}

.el-dropdown-select {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 10px;
  height: 100%;
  font-size: 12px;
  color: var(--color-text-secondary);
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.3s;
  outline: none;
}

.el-dropdown-select:hover {
  color: var(--color-zone-active);
}

.el-icon-arrow {
  font-size: 10px;
  opacity: 0.6
}

.el-dropdown-menu {
  background-color: var(--color-bg-base);
  border: none !important;
}

:deep(.el-dropdown-menu__item) {
  color: var(--color-text-primary);
  /*background-color: transparent;*/
}

:deep(.el-dropdown-menu__item:hover:not(:focus)) {
  color: var(--color-text-now);
  background-color: var(--color-bg-elevated);
}

:deep(.el-dropdown-menu__item:focus:not(:hover)) {
  background-color: transparent !important;
  color: var(--color-text-primary) !important;
}

:deep(.el-dropdown-menu__item.is-active) {
  color: var(--color-text-primary);
  background-color: var(--color-zone-active);
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