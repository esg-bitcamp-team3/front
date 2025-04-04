import apiClient from './apiClient'
import {
  ILogByDate,
  IOrganizationInfo,
  ISubsidiary,
  IUserInfo
} from './interfaces/retrieveInterfaces'
import {ListResponse, Response} from './type'

export async function getMyOrganizations() {
  return await apiClient.get<Response<IOrganizationInfo>>(`/my/organizations`, {
    withAuth: true
  })
}
export async function getMyUser() {
  return await apiClient.get<Response<IUserInfo>>(`/my/user`, {
    withAuth: true
  })
}

export async function getMyChangeLogs() {
  return await apiClient.get<Response<ILogByDate>>(`/my/change-logs`, {
    withAuth: true
  })
}

export async function searchMyOrganizations({
  search,
  criteria
}: {
  search?: string
  criteria?: string
}) {
  return await apiClient.get<ListResponse<ISubsidiary>>(`/my/search/subsidiaries`, {
    withAuth: true,
    params: {
      ...(search && {search}),
      ...(criteria && {criteria})
    }
  })
}
