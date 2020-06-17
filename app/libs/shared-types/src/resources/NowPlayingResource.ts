export interface NowPlayingResource {
  position: number
  current: {
    id: string
    offset: number
    title: string
    url: string
  }
  next: {
    id: string
    title: string
    url: string
  }
}
