import apiClient from "./apiClient";
import { IOrganization, ISubsidiary } from "./interfaces/retrieveInterfaces";
import { PaginatedResponse, PaginationParams, Response } from "./type";

export async function getOrganizaionList(params?: PaginationParams) {
  return await apiClient.get<PaginatedResponse<IOrganization>>(
    `/organizations`,
    {
      params: params,
      withAuth: true,
    }
  );
}

export async function getOrganizaionById(id: string) {
  return await apiClient.get<Response<IOrganization>>(`/organizations/${id}`, {
    withAuth: true,
  });
}

export async function getSubsidiaryList(params?: PaginationParams) {
  return await apiClient.get<PaginatedResponse<ISubsidiary>>(`/subsidiaries`, {
    withAuth: true,
  });
}

export async function getSubsidiary(organizations: string) {
  return await apiClient.get<Response<ISubsidiary>>(`/subsidiaries/`, {
    withAuth: true,
  });
}
