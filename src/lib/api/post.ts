import apiClient from "./apiClient";
import { IOrganization, ISubsidiary } from "./interfaces/retrieveInterfaces";
import { PaginatedResponse, PaginationParams, Response } from "./type";

export async function createSubsidiary(data: Partial<ISubsidiary>) {
  return await apiClient.post<Response<ISubsidiary>, Partial<ISubsidiary>>(
    `/subsidiaries`,
    {
      body: data,
      withAuth: true,
    }
  );
}
