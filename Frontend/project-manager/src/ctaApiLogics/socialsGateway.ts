import api from "@/lib/axios";
import handleError from "@/utils/handleError";

export const handleIncomingConnReqs = async (
    action: "accept" | "ignore",
    userToBeActedUpon: string
): Promise<{ success: boolean, message: string }> => {
    try {
        const connection = { action, userToBeActedUpon }
        const response = await api.post("/socials/handleConnectionRequest", connection, { withCredentials: true });

        const { success } = response.data;
        return { success: success, message: success ? "Action Performed" : "Action Failed" }
    }
    catch (error) {
        return { success: false, message: handleError(error, "axios") as string }
    }
}

// Send | Withdraw
export const socialActionsHandle = async (
    action: "request" | "withdraw" | "block" | "remove" | "unblock",
    userToBeActedUpon: string
): Promise<{ success: boolean, message: string }> => {

    try {
        const connection = { action, userToBeActedUpon }
        const response = await api.post("/socials/handleConnectionRequest", connection, { withCredentials: true });

        const { success } = response.data;

        if (success && action == 'request') {
            const tone = new Audio("/sounds/send_request_web.mp3");
            tone && tone.play()
        }

        return { success: success, message: success ? "Action Performed" : "Action Failed" }

    } catch (error) {
        return { success: false, message: handleError(error, "axios") as string }
    }
}