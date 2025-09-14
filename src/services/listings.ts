import { Listing } from '../types';

const API_URL = 'http://localhost:5000/api/listings';

export const fetchListings = async (): Promise<Listing[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch listings');
    }
    return response.json();
};

export const createListing = async (listing: Listing): Promise<Listing> => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(listing),
    });
    if (!response.ok) {
        throw new Error('Failed to create listing');
    }
    return response.json();
};

export const updateListing = async (id: string, listing: Listing): Promise<Listing> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(listing),
    });
    if (!response.ok) {
        throw new Error('Failed to update listing');
    }
    return response.json();
};

export const deleteListing = async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete listing');
    }
};