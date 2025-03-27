import apiClient from './apiClient'
import {
  IEmissionFromStationaryCombustion,
  IEmissionInfo,
  IFuelInfo,
  IMonthlyEmissionData,
  IMothlyData,
  IOrganization,
  ISubsidiary,
  IYearlyEmissionData,
  IScopeData
} from './interfaces/retrieveInterfaces'
import {ListResponse, PaginatedResponse, PaginationParams, Response} from './type'

// export async function getOrganizaionList(params?: PaginationParams) {
//   return await apiClient.get<PaginatedResponse<IOrganization>>(`/organizations`, {
//     params: params,
//     withAuth: true
//   })
// }

export async function getOrganizaionById(id: string) {
  return await apiClient.get<Response<IOrganization>>(`/organizations/${id}`, {
    withAuth: true
  })
}

export async function getSubsidiaryList(params?: PaginationParams) {
  return await apiClient.get<PaginatedResponse<Partial<ISubsidiary>>>(`/subsidiaries`, {
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

export async function getSubsidiaryById(id: string) {
  return await apiClient.get<Response<ISubsidiary>>(`/subsidiaries/${id}`, {
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

export async function getStationaryCombustion(id: string, year?: string, page?: number) {
  return await apiClient.get<PaginatedResponse<IEmissionInfo>>(
    `/data/stationary-combustion/subsidiary/${id}`,
    {
      withAuth: true,
      params: {
        ...(year && {year}),
        ...(page && {page})
      }
    }
  )
}
export async function getMobileCombustion(id: string, year?: string, page?: number) {
  return await apiClient.get<PaginatedResponse<IEmissionInfo>>(
    `/data/mobile-combustion/subsidiary/${id}`,
    {
      withAuth: true,
      params: {
        ...(year && {year}),
        ...(page && {page})
      }
    }
  )
}

export async function getCalculatedEmissionOfOrganiation(id: string, year?: string) {
  return await apiClient.get<Response<IScopeData>>(`/calculate/organization/${id}`, {
    withAuth: true,
    params: {
      ...(year && {year})
    }
  })
}

export async function getCalculatedMonthlyEmissionOfOrganiation(
  id: string,
  year?: string
) {
  return await apiClient.get<Response<IMonthlyEmissionData>>(
    `/calculate/monthly/organization/${id}`,
    {
      withAuth: true,
      params: {
        ...(year && {year})
      }
    }
  )
}

export async function getCalculatedYearlyEmissionOfOrganiation(id: string) {
  return await apiClient.get<Response<IYearlyEmissionData>>(
    `/calculate/yearly/organization/${id}`,
    {
      withAuth: true
    }
  )
}

export async function getCalculatedYearlyEmissionOfSubsidiary(id: string) {
  return await apiClient.get<Response<IYearlyEmissionData>>(
    `/calculate/yearly/subsidiary/${id}`,
    {
      withAuth: true
    }
  )
}

export async function getCalculatedMothlyTotal(id: string, year?: string) {
  return await apiClient.get<Response<IMothlyData>>(
    `/calculate/monthly/subsidiary/${id}`,
    {
      withAuth: true,
      params: {
        ...(year && {year})
      }
    }
  )
}
