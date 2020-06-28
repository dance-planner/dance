export interface ILocationOnEarthSurface {
    latitude: number
    longitude: number
}

export interface IDanceEvent {

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