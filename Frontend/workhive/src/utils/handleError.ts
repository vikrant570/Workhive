import axios, { AxiosError } from "axios"

interface Res {
    success: false,
    message: string
}

const handleAxiosError = (error: any) => {
    if (axios.isAxiosError(error)) {
        const data = (error as AxiosError).response?.data;

        if (typeof data === "string") return data;
        return (data as Res)?.message || error.message;
    }

    return (error as Error).message || "Something Went Wrong!";
}

const handleProxyError = (error: any) => {
    return {
        message: error.response?.data || "Proxy Error",
        status: error.response?.status || 500
    }
}

export default function handleError(error: any, errType: "axios" | "proxy" | "unknown") {

    switch (errType) {
        case "axios":
            const errMessage: string = handleAxiosError(error);
            if (errMessage.startsWith("<") || errMessage.slice(0, 10).includes("<")) {
                return "Some internal error occured! Please try again later."
            }
            else {
                return errMessage
            }
        case "proxy":
            return handleProxyError(error);
        default:
            return "Something Wen't Wrong Try Again Later !"
    }
}