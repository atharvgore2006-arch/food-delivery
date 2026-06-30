import React from 'react';
import { restaurants } from '../data/restaurants';
import RestaurantCard from '../components/RestaurantCard';

const Home = () => {
    return (
        <main id="main-content">
            <section className="hero">
                <div className="container">
                    <h1>Hungry? We've got you covered.</h1>
                    <p>Top restaurants in Shrirampur delivered to your doorstep.</p>
                </div>
            </section>

            <section className="restaurant-section">
                <div className="container">
                    <h2 className="section-title">Restaurants near you</h2>
                    <div className="restaurant-grid" id="restaurant-grid">
                        {restaurants.map((rest) => (
                            <RestaurantCard key={rest.id} restaurant={rest} />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;
