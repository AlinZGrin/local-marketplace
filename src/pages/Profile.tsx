import React from 'react';

const Profile: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">User Profile</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500 text-center">Profile information will be displayed here</p>
            </div>
        </div>
    );
};

export default Profile;