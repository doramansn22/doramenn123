import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://172.20.10.4:5055";

type RegisterData = {
  name: string;
  email: string;
  phone?: string;
  password: string;
};

type LoginData = {
  email: string;
  password: string;
};

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

export async function registerUser(data: RegisterData) {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return handleResponse(
    response,
    "Registration failed."
  );
}

export async function loginUser(data: LoginData) {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  return handleResponse(
    response,
    "Login failed."
  );
}