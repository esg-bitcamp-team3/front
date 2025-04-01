import apiClient from './apiClient'
import {IEmissionInfo, ISubsidiary} from './interfaces/retrieveInterfaces'
import {IEmissionForm} from './interfaces/updateForm'
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

export async function updateEmissionDataFromElectricity({
  id,
  data
}: {
  id: string
  data: Partial<IEmissionForm>
}) {
  return await apiClient.put<Response<IEmissionInfo>, Partial<IEmissionForm>>(
    `/data/electricity/${id}`,
    {
      withAuth: true,
      body: data
    }
  )
}
