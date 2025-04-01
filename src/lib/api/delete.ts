import apiClient from './apiClient'
import {IOrganization, ISubsidiary} from './interfaces/retrieveInterfaces'
import {PaginatedResponse, PaginationParams, Response} from './type'

export async function deleteSubsidiary(id: string) {
  return await apiClient.delete<Response<string>>(`/subsidiaries/${id}`, {
    withAuth: true
  })
}
