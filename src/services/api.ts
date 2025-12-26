import { API_BASE } from "../constants";
export async function fetchSSHKey(token: string): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/me/ssh/public`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch SSH key:", res.statusText);
      return null;
    }

    const data = await res.json();
    return data.ssh_key || null;
  } catch (err) {
    console.error("Error fetching SSH key:", err);
    return null;
  }
}
