export const initialRange = 20

export interface ILinkDancesDatesLocation {
  link: string
  dancesCommaSeparated: string
  date: string
  location: string
}

export interface IEvent {
  id: string
  title: string
  imageName: string
  dances: string
  countryCode: string
  city: string
  street: string
  housenumber: string
  startDate: string
  startTime: string
  link: string
  lat: number
  lon: number
}

export interface ICityGroup {
  groupName: string
  countryCode: string
  cityName: string
  telegramInvitationLink: string
  completeLink?: string
}

export interface IServiceEndpoints {
  eventImages: string
  events: string
  ipLocation: string
}

export interface IReport {
  eventId: string
  date: string
  reportedBecause
}

export interface IDanceGroup {
  city: string,
  groupType: EGroupType,
  dance: string
  id: string
}

export enum EGroupType {
  'Telegram' = 'Telegram',
  'Facebook' = 'Facebook',
  'WhatsApp' = 'WhatsApp',
}
