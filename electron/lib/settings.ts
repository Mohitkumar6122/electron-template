import Store, { type Schema } from 'electron-store'

type SettingsSchema = {
  firstRunCompleted: boolean
  autoUpdateEnabled: boolean
}

const schema: Schema<SettingsSchema> = {
  firstRunCompleted: {
    type: 'boolean',
    default: false
  },
  autoUpdateEnabled: {
    type: 'boolean',
    default: true
  }
}

export const settingsStore = new Store<SettingsSchema>({
  name: 'settings',
  schema
})
