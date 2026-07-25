import { cache } from 'react';
import api from './axios';

export const fetchSingleProject_client = cache(async (projectID: string) => {
    const response = await api.get(`/projects/${projectID}`);
    if (!response.data.success) throw new Error("Failed to fetch project data!");

    return response.data
});


export const fetchUserProfile_client = cache(async (id = "0", parl = "0"): Promise<{ success: boolean, profileData: partialUserInfo | fullUserInfo }> => {
    const response = await api.get(`/socials/profile?id=${id}&parl=${parl}`, { withCredentials: true });
    if (!response.data.success) throw new Error("Failed to fetch profile data!");

    return response.data
})