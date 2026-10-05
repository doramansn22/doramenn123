const API_BASE_URL = "http://172.20.10.4:5055";

type HomeProfileData = {
  homeName: string;
  address: string;
  homeType: string;
  bedrooms: string;
  bathrooms: string;
  people: string;
};

async function getAuthToken() {
  return await (await import("@react-native-async-storage/async-storage")).default.getItem(
    "homeai_auth_token"
  );
}

export async function getHomeProfileFromServer() {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("Authentication required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/home-profile`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message || "Unable to load home profile."
    );
  }

  return result.homeProfile || null;
}

export async function saveHomeProfileToServer(
  homeProfile: HomeProfileData
) {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("Authentication required.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/home-profile`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(homeProfile),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message || "Unable to save home profile."
    );
  }

  return result.homeProfile;
}
