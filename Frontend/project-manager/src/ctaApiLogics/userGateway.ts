import api from "@/lib/axios"
import React from "react";

// Sign In/Signup Handler
export const handleUserGatewayCall = async (
    e: React.SyntheticEvent<HTMLFormElement>,
    email: string | null,
    setEmail: React.Dispatch<React.SetStateAction<string | null>>,
    isUser: boolean
) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Checking if email exists and adding if not because we need it with the otp verification route at backend
    if (!formData.get("email") && email !== null) {
        formData.append("email", email);
    }
    const data = Object.fromEntries(formData);

    let url: string = "";

    if (data.otp) {
        url = "/auth/verify-otp"
    } else if (data.workplace) {
        url = "/auth/register"
    } else if (data.email || data.password) {
        url = "/auth/initiate"
        setEmail(String(data.email))
    }

    const response = await api.post(url, data, {
        withCredentials: true
    });

    if(!response) throw new Error("Server Isn't Responding !")

    // Send the request automatically again if the user tried to login.
    if (response.data.message === "OTP Verified Successfully." && isUser) {
        const resendReq = await api.post("/auth/login", data, {
            withCredentials: true
        })
        return resendReq
    }

    //If it was not a login request
    return response
}
