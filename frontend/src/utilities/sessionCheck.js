import api from "./api.js";


export async function checkLoggedin() {
    try {
        await api.get("/auth/session", { withCredentials: true });
        return true;
    } catch  {
        return false;
    }
}