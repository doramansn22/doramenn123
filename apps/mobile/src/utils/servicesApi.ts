import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://172.20.10.4:5055";

export type Service = {
  _id?: string;
  name: string;
  icon: string;
  title: string;
  description: string;
  options: string[];
  active: boolean;
};

async function getAuthToken() {
  return AsyncStorage.getItem("homeai_auth_token");
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
    await AsyncStorage.removeItem(
      "homeai_auth_token"
    );

    await AsyncStorage.removeItem(
      "homeai_user"
    );

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

export async function getServicesFromServer(): Promise<
  Service[]
> {
  const token = await getAuthToken();

  if (!token) {
    throw new Error(
      "Authentication required."
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/api/services`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await handleResponse(
    response,
    "Unable to load services."
  );

  return result?.services || [];
}

export async function getServiceFromServer(
  name: string
): Promise<Service | null> {
  const token = await getAuthToken();

  if (!token) {
    throw new Error(
      "Authentication required."
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/api/services/${encodeURIComponent(
      name
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
    "Unable to load service."
  );

  return result?.service || null;
}