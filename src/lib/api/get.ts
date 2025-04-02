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
  IScopeData,
  ICarbonEmissionGoal,
  ICarbonEmissionGoalsByYear,
  IOrganizationRevenueByYear,
  IOrganizationData,
  IChangeLogInfoBySubsidiary
} from './interfaces/retrieveInterfaces'
import {ListResponse, PaginatedResponse, PaginationParams, Response} from './type'

// export async function getOrganizaionList(params?: PaginationParams) {
//   return await apiClient.get<PaginatedResponse<IOrganization>>(`/organizations`, {
//     params: params,
//     withAuth: true
//   })
// }

{
  /* Activity Data */
}

export async function getActivityDataForStationaryCombustion() {
  return await apiClient.get<ListResponse<IFuelInfo>>(`/activity-data/stationary`, {
    withAuth: true
  })
}

export async function getActivityDataForMobileCombustion() {
  return await apiClient.get<ListResponse<IFuelInfo>>(`/activity-data/mobile`, {
    withAuth: true
  })
}

export async function getActivityDataForElectricity() {
  return await apiClient.get<ListResponse<IFuelInfo>>(`/activity-data/electricity`, {
    withAuth: true
  })
}

export async function getActivityDataForSteam() {
  return await apiClient.get<ListResponse<IFuelInfo>>(`/activity-data/steam`, {
    withAuth: true
  })
}

{
  /* Organization */
}

export async function getOrganizationList({
  page,
  pageSize,
  search
}: {
  page?: number
  pageSize?: number
  search?: string
}) {
  return await apiClient.get<PaginatedResponse<Partial<IOrganization>>>(
    `/organizations`,
    {
      withAuth: true,
      params: {
        ...(page && {page}),
        ...(pageSize && {pageSize}),
        ...(search && {search})
      }
    }
  )
}

{
  /* Subsidiary */
}

export async function getSubsidiaryById(id: string) {
  return await apiClient.get<Response<ISubsidiary>>(`/subsidiaries/${id}`, {
    withAuth: true
  })
}

export async function getSubsidiaryList({
  page,
  pageSize,
  search
}: {
  page?: number
  pageSize?: number
  search?: string
}) {
  return await apiClient.get<PaginatedResponse<Partial<ISubsidiary>>>(`/subsidiaries`, {
    withAuth: true,
    params: {
      ...(page && {page}),
      ...(pageSize && {pageSize}),
      ...(search && {search})
    }
  })
}

{
  /* Emission Data */
}

export async function getEmissionDataFromStationaryCombustion({
  id,
  year,
  page,
  pageSize,
  search
}: {
  id: string
  year?: string
  page?: number
  pageSize?: number
  search?: string
}) {
  return await apiClient.get<PaginatedResponse<IEmissionInfo>>(
    `/data/stationary-combustion/subsidiary/${id}`,
    {
      withAuth: true,
      params: {
        ...(year && {year}),
        ...(page && {page}),
        ...(pageSize && {pageSize}),
        ...(search && {search})
      }
    }
  )
}

export async function getEmissionDataFromMobileCombustion({
  id,
  year,
  page,
  pageSize,
  search
}: {
  id: string
  year?: string
  page?: number
  pageSize?: number
  search?: string
}) {
  return await apiClient.get<PaginatedResponse<IEmissionInfo>>(
    `/data/mobile-combustion/subsidiary/${id}`,
    {
      withAuth: true,
      params: {
        ...(year && {year}),
        ...(page && {page}),
        ...(pageSize && {pageSize}),
        ...(search && {search})
      }
    }
  )
}

export async function getEmissionDataFromElectricity({
  id,
  year,
  page,
  pageSize,
  search
}: {
  id: string
  year?: string
  page?: number
  pageSize?: number
  search?: string
}) {
  return await apiClient.get<PaginatedResponse<IEmissionInfo>>(
    `/data/electricity/subsidiary/${id}`,
    {
      withAuth: true,
      params: {
        ...(year && {year}),
        ...(page && {page}),
        ...(pageSize && {pageSize}),
        ...(search && {search})
      }
    }
  )
}

export async function getEmissionDataFromSteam({
  id,
  year,
  page,
  pageSize,
  search
}: {
  id: string
  year?: string
  page?: number
  pageSize?: number
  search?: string
}) {
  return await apiClient.get<PaginatedResponse<IEmissionInfo>>(
    `/data/steam/subsidiary/${id}`,
    {
      withAuth: true,
      params: {
        ...(year && {year}),
        ...(page && {page}),
        ...(pageSize && {pageSize}),
        ...(search && {search})
      }
    }
  )
}

{
  /* Calculated Emission Data */
}
export async function getCalculatedEmissionOfOrganiation({
  id,
  year
}: {
  id: string
  year?: string
}) {
  return await apiClient.get<Response<IOrganizationData>>(
    `/calculate/organization/${id}`,
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

export async function getCalculatedMonthlyEmissionOfOrganiation({
  id,
  year
}: {
  id: string
  year?: string
}) {
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

export async function getCalculatedMothlyEmissionOfSubsidiary({
  id,
  year
}: {
  id: string
  year?: string
}) {
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

{
  /* Carbon Emission Goal */
}

export async function getCarbonEmissionGoalsOfOrganization({id}: {id: string}) {
  return await apiClient.get<Response<ICarbonEmissionGoalsByYear>>(
    `/carbon-emission-goals/organization/${id}`,
    {
      withAuth: true
    }
  )
}

export async function getOrganizaionRevenueByYear({id}: {id: string}) {
  return await apiClient.get<Response<IOrganizationRevenueByYear>>(
    `/revenue-records/organization/${id}`,
    {
      withAuth: true
    }
  )
}

{
  // change-logs
}

export async function getLogs() {
  return await apiClient.get<ListResponse<IChangeLogInfoBySubsidiary[]>>(
    `/my/change-logs`,
    {
      withAuth: true
    }
  )
}
