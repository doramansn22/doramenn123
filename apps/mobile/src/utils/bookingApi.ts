import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://172.20.10.4:5055";

export type Booking = {
  bookingId: string;
  service: string;
  option: string;
  date: string;
  time: string;
  address: string;
  professionalName: string;
  rating: string;
  price: string;
  status: string;
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

export async function getBookingFromServer(): Promise<Booking | null> {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("Authentication required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/bookings`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await handleResponse(
    response,
    "Unable to load booking."
  );

  return result?.booking || null;
}

export async function saveBookingToServer(
  booking: Booking
) {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("Authentication required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/bookings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(booking),
    }
  );

  return handleResponse(
    response,
    "Unable to save booking."
  );
}

export async function deleteBookingFromServer(
  bookingId: string
) {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("Authentication required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/bookings/${encodeURIComponent(
      bookingId
    )}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return handleResponse(
    response,
    "Unable to cancel booking."
  );
}
