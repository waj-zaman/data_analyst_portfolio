import api from "./api.js";

export async function checkLoggedin() {
    console.trace("checkLoggedin() was called");
    try {
        const res = await api.get("/auth/session", { withCredentials: true });
        
        // Ensure backend returns a clear indicator, e.g. { loggedIn: true, user: {...} }
        if (res.data && res.data.loggedIn) {
            return true;
        }
        return false;
    } catch (err) {
        console.error("Session check failed:", err.message);
        return false;
    }
}
