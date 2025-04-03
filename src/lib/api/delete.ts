import apiClient from './apiClient'
import {IOrganization, ISubsidiary} from './interfaces/retrieveInterfaces'
import {PaginatedResponse, PaginationParams, Response} from './type'

export async function deleteSubsidiary(id: string) {
  return await apiClient.delete<Response<string>>(`/subsidiaries/${id}`, {
    withAuth: true
  })
}

export async function deleteEmissionDataFromElectricity(id: string) {
  return await apiClient.delete<Response<string>>(`/data/electricity/${id}`, {
    withAuth: true
  })
}

export async function deleteEmissionDataFromSteam(id: string) {
  return await apiClient.delete<Response<string>>(`/data/steam/${id}`, {
    withAuth: true
  })
}

export async function deleteEmissionDataFromMobileCombustion(id: string) {
  return await apiClient.delete<Response<string>>(`/data/mobile-combustion/${id}`, {
    withAuth: true
  })
}

export async function deleteEmissionDataFromStationaryCombustion(id: string) {
  return await apiClient.delete<Response<string>>(`/data/stationary-combustion/${id}`, {
    withAuth: true
  })
}
