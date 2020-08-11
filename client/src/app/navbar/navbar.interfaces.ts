export interface INavbarData {
  appTitle?: string
  menuEntries: IMenuEntry[]
}

export interface IMenuEntry {
  text: string
  href: string
  isActive: boolean
}
