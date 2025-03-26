import apiClient from './apiClient'
import {
  IEmissionFromStationaryCombustion,
  IOrganization
} from './interfaces/retrieveInterfaces'
import {PaginatedResponse, PaginationParams, Response} from './type'

export async function getOrganizaionList(params?: PaginationParams) {
  return await apiClient.get<PaginatedResponse<IOrganization>>(`/organizations`, {
    params: params,
    withAuth: true
  })
}

export async function getOrganizaionById(id: string) {
  return await apiClient.get<Response<IOrganization>>(`/organizations/${id}`, {
    withAuth: true
  })
}

export async function getStationaryData(id: string) {
  return await apiClient.get<Response<IEmissionFromStationaryCombustion>>(
    `/data/stationary-combustion/${id}`,
    {
      withAuth: true
    }
  )
}
