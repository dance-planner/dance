export interface INavbarData {
  appTitle?: string
  logoURL?: string
  menuEntries: IMenuEntry[]
}

export interface IMenuEntry {
  text: string
  href: string
  isActive: boolean
}
