export interface Dashboard {
  id: number
  name: string
  collection_id: number
}

export interface GetDashcardCardParams {
  dashboardId: string
  dashcardId: string
  cardId: string
}

export interface IGetParams {
  dashboardId: string
  id: string
  query: string
}

export interface GetParamValuesParams {
  dashboardId: string
  id: string
}
