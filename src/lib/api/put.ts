import apiClient from './apiClient'
import {ISubsidiary} from './interfaces/retrieveInterfaces'
import {Response} from './type'

export async function updateSubsidiary(data: Partial<ISubsidiary>) {
  return await apiClient.put<Response<ISubsidiary>, Partial<ISubsidiary>>(
    `/subsidiarie`,
    {
      body: data,
      withAuth: true
    }
  )
}
