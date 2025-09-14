import React from 'react';
import { User, Listing } from '../../types';

interface UserProfileProps {
  user: User;
  listings: Listing[];
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, listings }) => {
  return (
    <div className="user-profile bg-white rounded-lg shadow p-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{user.name}&apos;s Profile</h1>
        <p className="text-gray-600">Email: {user.email}</p>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.length > 0 ? (
            listings.map((listing) => (
              <div key={listing.id} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium">{listing.title}</h3>
                <p className="text-green-600 font-semibold">${listing.price}</p>
                <p className="text-sm text-gray-500">{listing.condition}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No listings found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;