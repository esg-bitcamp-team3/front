import apiClient from './apiClient'
import {IOrganizationInfo, IUserInfo} from './interfaces/retrieveInterfaces'
import {Response} from './type'

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
