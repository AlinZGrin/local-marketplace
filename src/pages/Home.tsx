import React from 'react';

const Home: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <main>
                <h1 className="text-4xl font-bold text-center mb-8">Welcome to the Local Marketplace</h1>
                <p className="text-lg text-center text-gray-600 mb-12">Buy and sell items in your local area.</p>
                <section>
                    <h2 className="text-2xl font-semibold mb-6">Featured Listings</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-gray-100 p-6 rounded-lg text-center">
                            <p className="text-gray-500">No featured listings available</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;