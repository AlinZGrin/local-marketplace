import React, { useEffect, useState } from 'react';
import { fetchListings } from '../services/listings';
import { Listing } from '../types';

const Listings: React.FC = () => {
    const [listings, setListings] = useState<Listing[]>([]);

    useEffect(() => {
        const getListings = async () => {
            try {
                const data = await fetchListings();
                setListings(data);
            } catch (error) {
                console.error('Error fetching listings:', error);
            }
        };

        getListings();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Available Listings</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.length > 0 ? (
                    listings.map((listing) => (
                        <div key={listing.id} className="bg-white rounded-lg shadow p-6">
                            <h3 className="font-semibold text-lg">{listing.title}</h3>
                            <p className="text-green-600 font-bold">${listing.price}</p>
                            <p className="text-sm text-gray-500">{listing.condition}</p>
                            <p className="text-sm text-gray-600 mt-2">{listing.description}</p>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-8">
                        <p className="text-gray-500">No listings available</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Listings;