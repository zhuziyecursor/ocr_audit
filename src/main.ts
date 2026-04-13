import { createApp } from 'vue'
import { createPinia } from 'pinia'
import {
  create,
  NButton,
  NInput,
  NSelect,
  NDataTable,
  NDropdown,
  NInputGroup,
  type GlobalThemeOverrides,
} from 'naive-ui'
import App from './App.vue'
import router from './router'
import './assets/globals.css'

// Professional Audit System Theme Overrides
const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#2563EB',
    primaryColorHover: '#3B82F6',
    primaryColorPressed: '#1D4ED8',
    primaryColorSuppl: '#60A5FA',
    borderRadius: '6px',
    borderRadiusSmall: '4px',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '14px',
  },
  Button: {
    colorPrimary: '#2563EB',
    colorHoverPrimary: '#3B82F6',
    colorPressedPrimary: '#1D4ED8',
    textColorPrimary: '#FFFFFF',
    fontWeight: '500',
    heightMedium: '36px',
    paddingMedium: '0 16px',
  },
  Input: {
    color: '#FFFFFF',
    colorFocus: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderHover: '1px solid #CBD5E1',
    borderFocus: '1px solid #3B82F6',
    boxShadowFocus: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    heightMedium: '36px',
  },
  Select: {
    peers: {
      InternalSelection: {
        color: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderHover: '1px solid #CBD5E1',
        borderFocus: '1px solid #3B82F6',
        boxShadowFocus: '0 0 0 3px rgba(59, 130, 246, 0.1)',
        heightMedium: '36px',
      },
    },
  },
  DataTable: {
    thColor: '#F8FAFC',
    thColorHover: '#F1F5F9',
    tdColor: '#FFFFFF',
    tdColorHover: '#F8FAFC',
    borderColor: '#E2E8F0',
    thFontWeight: '600',
    fontSizeMedium: '14px',
  },
  Card: {
    color: '#FFFFFF',
    borderColor: '#E2E8F0',
    borderRadius: '8px',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
  },
}

const naive = create({
  components: [
    NButton,
    NInput,
    NSelect,
    NDataTable,
    NDropdown,
    NInputGroup,
  ],
  themeOverrides,
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(naive)

app.mount('#app')
