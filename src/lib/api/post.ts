import apiClient from './apiClient'
import {
  IEmissionFromMobileCombustion,
  IEmissionFromStationaryCombustion,
  IIndirectEmissionFromElectricity,
  IIndirectEmissionFromSteam,
  IOrganization,
  ISubsidiary
} from './interfaces/retrieveInterfaces'
import {PaginatedResponse, PaginationParams, Response} from './type'

export async function createSubsidiary(data: Partial<ISubsidiary>) {
  return await apiClient.post<Response<ISubsidiary>, Partial<ISubsidiary>>(
    `/subsidiaries`,
    {
      body: data,
      withAuth: true
    }
  )
}

export async function createStationaryCombustion(
  data: Partial<IEmissionFromStationaryCombustion>
) {
  return await apiClient.post<
    Response<IEmissionFromStationaryCombustion>,
    Partial<IEmissionFromStationaryCombustion>
  >(`/data/stationary-combustion/`, {
    body: data,
    withAuth: true
  })
}

export async function createMobileCombustion(
  data: Partial<IEmissionFromMobileCombustion>
) {
  return await apiClient.post<
    Response<IEmissionFromMobileCombustion>,
    Partial<IEmissionFromMobileCombustion>
  >(`/data/mobile-combustion/`, {
    body: data,
    withAuth: true
  })
}

export async function createElectricity(data: Partial<IIndirectEmissionFromElectricity>) {
  return await apiClient.post<
    Response<IIndirectEmissionFromElectricity>,
    Partial<IIndirectEmissionFromElectricity>
  >(`/data/electricity`, {
    body: data,
    withAuth: true
  })
}

export async function createSteam(data: Partial<IIndirectEmissionFromSteam>) {
  return await apiClient.post<
    Response<IIndirectEmissionFromSteam>,
    Partial<IIndirectEmissionFromSteam>
  >(`/data/steam`, {
    body: data,
    withAuth: true
  })
}
