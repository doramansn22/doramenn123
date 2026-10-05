import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://172.20.10.4:5055";

export type MaintenanceTask = {
  id: string;
  task: string;
  dueDate: string;
  notes: string;
  notificationId?: string | null;
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

export async function getMaintenanceTasksFromServer(
  applianceId: string
): Promise<MaintenanceTask[]> {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("Authentication required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/maintenance/${encodeURIComponent(applianceId)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await handleResponse(
    response,
    "Unable to load maintenance tasks."
  );

  return Array.isArray(result?.tasks)
    ? result.tasks
    : [];
}

export async function saveMaintenanceTaskToServer(
  applianceId: string,
  task: MaintenanceTask
) {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("Authentication required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/maintenance/${encodeURIComponent(applianceId)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(task),
    }
  );

  return handleResponse(
    response,
    "Unable to save maintenance task."
  );
}

export async function deleteMaintenanceTaskFromServer(
  applianceId: string,
  id: string
) {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("Authentication required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/maintenance/${encodeURIComponent(applianceId)}/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return handleResponse(
    response,
    "Unable to delete maintenance task."
  );
}
