import React from 'react';

const Messages: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Messages</h1>
            <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-500 text-center">No messages available</p>
            </div>
        </div>
    );
};

export default Messages;