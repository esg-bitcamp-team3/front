import { FetchClient } from "./fetchClient";

const baseUrl = "http://localhost:4000";

const apiClient = new FetchClient(baseUrl || "");

export default apiClient;
