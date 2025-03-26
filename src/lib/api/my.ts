import apiClient from "./apiClient";
import { IOrganizationInfo } from "./interfaces/retrieveInterfaces";
import { Response } from "./type";

export async function getMyOrganizations() {
  return await apiClient.get<Response<IOrganizationInfo>>(`/my/organizations`, {
    withAuth: true,
  });
}
