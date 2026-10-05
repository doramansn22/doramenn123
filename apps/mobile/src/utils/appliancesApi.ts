import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://172.20.10.4:5055";

export type ApplianceData = {
  id: string;
  type: string;
  name: string;
  brand: string;
  model: string;
  purchaseYear: string;
  warranty: string;
};

async function getAuthToken() {
  return await AsyncStorage.getItem(
    "homeai_auth_token"
  );
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

export async function getAppliancesFromServer(): Promise<
  ApplianceData[]
> {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("Authentication required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/appliances`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await handleResponse(
    response,
    "Unable to load appliances."
  );

  return result.appliances || [];
}

export async function saveApplianceToServer(
  appliance: ApplianceData
) {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("Authentication required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/appliances`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(appliance),
    }
  );

  const result = await handleResponse(
    response,
    "Unable to save appliance."
  );

  return result.appliance;
}

export async function deleteApplianceFromServer(
  id: string
) {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("Authentication required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/appliances/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return handleResponse(
    response,
    "Unable to delete appliance."
  );
}