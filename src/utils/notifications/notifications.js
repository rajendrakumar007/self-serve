import db from "../../../db.json";

const API_URL = "http://localhost:4000/notifications";
/**
 * 1. READ: Fetch notifications for a specific user from the API
 * UPDATED: Handles both 'sentDate' AND 'date' fields to mix types correctly.
 */
export async function getNotificationsFromApi(userId) {
  try {
    const url = userId ? `${API_URL}?userId=${userId}` : API_URL;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch notifications");
    
    const data = await response.json();

    // STRICT CLIENT-SIDE SORT
    return data.sort((a, b) => {
      // 1. Normalize Date: Check 'sentDate' first, then 'date', else 0
      const getTime = (item) => {
        if (item.sentDate) return new Date(item.sentDate).getTime();
        if (item.date) return new Date(item.date).getTime();
        return 0;
      };

      const timeA = getTime(a);
      const timeB = getTime(b);

      // 2. Sort by Time Descending (Newest -> Oldest)
      if (timeB !== timeA) {
        return timeB - timeA;
      }

      // 3. Fallback: If times are identical (or both are just "2026-01-16"),
      // use ID to ensure newer items appear first.
      const idA = a.notificationId || "";
      const idB = b.notificationId || "";
      return idB.localeCompare(idA);
    });

  } catch (error) {
    console.error("Error in getNotificationsFromApi:", error);
    return [];
  }
}
/**
 * 2. UPDATE: Persist the "read" status to db.json via PATCH
 * Used by Navbar.jsx: markNotificationAsRead(id)
 */
export async function markNotificationAsRead(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: true }),
    });

    if (!response.ok) throw new Error("Failed to update notification");
    return await response.json();
  } catch (error) {
    console.error("Error in markNotificationAsRead:", error);
    return null;
  }
}

/**
 * 3. CREATE: Add a new notification to the database
 * Generates a unique ID and sets initial state
 */
export async function createNotification({ userId, type, message }) {
  try {
    // Fetch current list to determine the next ID number
    // We fetch raw list to ensure we get accurate count
    const currentNotifications = await getNotificationsFromApi(userId);
    
    // Generate simple numeric ID part
    const count = currentNotifications.length + 1;
    const notificationId = `NTF-${new Date().getFullYear()}-${String(count).padStart(4, "0")}`;

    const newNotif = {
      notificationId,
      userId,
      type,
      message,
      read: false,
      sentDate: new Date().toISOString(), // Vital for sorting
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNotif),
    });

    return response.ok ? await response.json() : null;
  } catch (error) {
    console.error("Error in createNotification:", error);
    return null;
  }
}

/**
 * 4. STATIC FALLBACK: Keep the old one for backwards compatibility
 * if other components still use the non-API version.
 */
export function getNotifications(opts = {}) {
  const { userId, type } = opts;
  const notifications = Array.isArray(db.notifications) ? db.notifications : [];
  return notifications.filter((n) => {
    if (userId && n.userId !== userId) return false;
    if (type && n.type !== type) return false;
    return true;
  });
}