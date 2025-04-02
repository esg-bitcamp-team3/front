import apiClient from './apiClient'
import {
  IEmissionFromMobileCombustion,
  IEmissionFromStationaryCombustion,
  IEmissionInfo,
  IIndirectEmissionFromElectricity,
  IIndirectEmissionFromSteam,
  IOrganization,
  ISubsidiary
} from './interfaces/retrieveInterfaces'
import {IEmissionForm} from './interfaces/updateForm'
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

export async function createStationaryCombustion({data}: {data: Partial<IEmissionForm>}) {
  return await apiClient.post<Response<IEmissionInfo>, Partial<IEmissionForm>>(
    '/data/stationary-combustion',
    {
      body: data,
      withAuth: true
    }
  )
}

export async function createMobileCombustion({data}: {data: Partial<IEmissionForm>}) {
  return await apiClient.post<Response<IEmissionInfo>, Partial<IEmissionForm>>(
    `/data/mobile-combustion/`,
    {
      body: data,
      withAuth: true
    }
  )
}

export async function createElectricity({data}: {data: Partial<IEmissionForm>}) {
  return await apiClient.post<Response<IEmissionInfo>, Partial<IEmissionForm>>(
    `/data/electricity`,
    {
      body: data,
      withAuth: true
    }
  )
}

export async function createSteam({data}: {data: Partial<IEmissionForm>}) {
  return await apiClient.post<Response<IEmissionInfo>, Partial<IEmissionForm>>(
    `/data/steam`,
    {
      body: data,
      withAuth: true
    }
  )
}
