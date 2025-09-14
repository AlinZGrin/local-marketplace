import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchListings = async () => {
    const response = await axios.get(`${API_BASE_URL}/listings`);
    return response.data;
};

export const fetchListingById = async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/listings/${id}`);
    return response.data;
};

export const createListing = async (listingData: any) => {
    const response = await axios.post(`${API_BASE_URL}/listings`, listingData);
    return response.data;
};

export const updateListing = async (id: string, listingData: any) => {
    const response = await axios.put(`${API_BASE_URL}/listings/${id}`, listingData);
    return response.data;
};

export const deleteListing = async (id: string) => {
    const response = await axios.delete(`${API_BASE_URL}/listings/${id}`);
    return response.data;
};