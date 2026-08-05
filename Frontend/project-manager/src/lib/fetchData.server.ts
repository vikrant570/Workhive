import { cache } from 'react';
import { cookies } from 'next/headers';
import api from './axios';
import handleError from '@/utils/handleError';

const fetchCookies = async () => {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    return cookieHeader;
}

// --- Projects ---
export const fetchSingleProject_server = cache(async (projectID: string) => {
    try {
        const cookieHeader = await fetchCookies();
        const response = await api.get(`/projects/${projectID}`, { headers: { Cookie: cookieHeader } });
        return response.data;

    } catch (error) {
        return { success: false, message: handleError(error, "axios") };
    }
});

export const fetchProjectsList_server = cache(async (view: string) => {
    try {
        const cookieHeader = await fetchCookies();
        const response = await api.get(`/projects?view=${view}`, { headers: { Cookie: cookieHeader } });
        return response.data;

    } catch (error) {
        return { success: false, message: handleError(error, "axios") };
    }
})

// --- Profile ---
export const fetchUserProfile_server = cache(async (id = "0", parl = "0") => {
    try {
        const cookieHeader = await fetchCookies();
        const response = await api.get(`/socials/profile?id=${id}&parl=${parl}`, { headers: { Cookie: cookieHeader } });
        return response.data;

    } catch (error) {
        return { success: false, message: handleError(error, "axios") };
    }
});