import apiClient from './apiClient'
import {
  IEmissionFromStationaryCombustion,
  IFuelInfo,
  IOrganization
} from './interfaces/retrieveInterfaces'
import {ListResponse, PaginatedResponse, PaginationParams, Response} from './type'

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

export async function getStationaryActivityData() {
  return await apiClient.get<ListResponse<IFuelInfo>>(`/activity-data/stationary`, {
    withAuth: true
  })
}

export async function getMobileActivityData() {
  return await apiClient.get<ListResponse<IFuelInfo>>(`/activity-data/mobile`, {
    withAuth: true
  })
}

export async function getElectricityActivityData() {
  return await apiClient.get<ListResponse<IFuelInfo>>(`/activity-data/electricity`, {
    withAuth: true
  })
}

export async function getSteamActivityData() {
  return await apiClient.get<ListResponse<IFuelInfo>>(`/activity-data/steam`, {
    withAuth: true
  })
}
