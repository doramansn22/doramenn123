import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://172.20.10.4:5055";

export type ServiceRecordData = {
  id: string;
  serviceType: string;
  date: string;
  description: string;
  professional: string;
  cost: string;
};

async function getAuthToken() {
  return await AsyncStorage.getItem("homeai_auth_token");
}

async function handleResponse(
  response: Response,
  fallbackMessage: string
) {
  let result: any = null;

  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (response.status === 401) {
    await AsyncStorage.removeItem("homeai_auth_token");
    await AsyncStorage.removeItem("homeai_user");

    throw new Error(
      "Your session has expired. Please sign in again."
    );
  }

  if (!response.ok) {
    throw new Error(
      result?.message || fallbackMessage
    );
  }

  return result;
}

export async function getServiceHistoryFromServer(
  applianceId: string
): Promise<ServiceRecordData[]> {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("Authentication required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/service-history/${encodeURIComponent(
      applianceId
    )}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await handleResponse(
    response,
    "Unable to load service history."
  );

  return result.records || [];
}

export async function saveServiceRecordToServer(
  applianceId: string,
  record: ServiceRecordData
) {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("Authentication required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/service-history/${encodeURIComponent(
      applianceId
    )}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(record),
    }
  );

  const result = await handleResponse(
    response,
    "Unable to save service record."
  );

  return result.record;
}

export async function deleteServiceRecordFromServer(
  applianceId: string,
  id: string
) {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("Authentication required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/service-history/${encodeURIComponent(
      applianceId
    )}/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return handleResponse(
    response,
    "Unable to delete service record."
  );
}
