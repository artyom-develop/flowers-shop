export interface MapType {
  id: string,
  name: string,
  types: {
    id: string,
    name: string,
    url: string
  }[],
  url: string,
  typesUrl?: string[];
}
