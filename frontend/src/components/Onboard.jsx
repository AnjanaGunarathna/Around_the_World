import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Header from './Header';
import { fetchAllCountries } from '../api/countries';

export default function HomePage()
{
    const [popularCountries, setPopularCountries] = useState([]);
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCountries, setFilteredCountries] = useState([]);

    useEffect(() =>
    {
        const fetchData = async () =>
        {
            try
            {
                const countries = await fetchAllCountries();

                // Get popular countries (using population as a metric)
                const popular = [...countries]
                    .sort((a, b) => b.population - a.population)
                    .slice(0, 6);
                setPopularCountries(popular);

                // Extract unique regions
                const uniqueRegions = [...new Set(countries.map(country => country.region))]
                    .filter(region => region) // Remove empty regions
                    .sort();
                setRegions(uniqueRegions);

                // Initialize filtered countries
                setFilteredCountries(countries);

                setLoading(false);
            } catch (err)
            {
                console.error('Error fetching data:', err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() =>
    {
        if (searchTerm.trim() === '')
        {
            setFilteredCountries([]);
            return;
        }

        const fetchSearchResults = async () =>
        {
            try
            {
                const countries = await fetchAllCountries();
                const filtered = countries.filter(country =>
                    country.name.common.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (country.name.official && country.name.official.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    (country.capital && country.capital[0] && country.capital[0].toLowerCase().includes(searchTerm.toLowerCase()))
                );
                setFilteredCountries(filtered.slice(0, 5)); // Limit to 5 results
            } catch (err)
            {
                console.error('Error searching countries:', err);
            }
        };

        const timer = setTimeout(() =>
        {
            fetchSearchResults();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleSearchChange = (e) =>
    {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="min-h-screen bg-slate-100">
            <Navbar />

            <Header
                title="Explore the World"
                subtitle="Discover fascinating details about countries across the globe"
            >
                <div className="relative w-full">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search for a country..."
                        className="w-full px-4 py-3 border border-indigo-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    {searchTerm && filteredCountries.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
                            {filteredCountries.map(country => (
                                <Link
                                    key={country.cca3}
                                    to={`/country/${country.cca3}`}
                                    className="block px-4 py-2 hover:bg-indigo-50 border-b border-gray-100 last:border-b-0 flex items-center"
                                >
                                    <img
                                        src={country.flags.png}
                                        alt={country.name.common}
                                        className="w-8 h-6 mr-3 object-cover"
                                    />
                                    <div>
                                        <div className="font-medium">{country.name.common}</div>
                                        <div className="text-xs text-gray-500">{country.capital?.[0] || ''}, {country.region}</div>
                                    </div>
                                </Link>
                            ))}
                            <Link
                                to={`/country?search=${searchTerm}`}
                                className="block px-4 py-2 text-indigo-600 hover:bg-indigo-50 font-medium text-center"
                            >
                                View all results
                            </Link>
                        </div>
                    )}
                </div>
            </Header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                    </div>
                ) : (
                    <>
                        {/* Featured Country Section */}
                        {popularCountries.length > 0 && (
                            <section className="mb-16">
                                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl overflow-hidden shadow-xl">
                                    <div className="md:flex">
                                        <div className="md:w-1/2">
                                            <img
                                                src={popularCountries[0].flags.png}
                                                alt={popularCountries[0].name.common}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                                            <div className="inline-block px-3 py-1 bg-indigo-200 text-indigo-800 rounded-full text-sm font-semibold mb-4">
                                                Featured Country
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                                {popularCountries[0].name.common}
                                            </h2>
                                            <p className="text-indigo-100 mb-6">
                                                {popularCountries[0].capital?.[0] ? `Capital: ${popularCountries[0].capital[0]}` : ''} •
                                                Region: {popularCountries[0].region} •
                                                Population: {popularCountries[0].population.toLocaleString()}
                                            </p>
                                            <Link
                                                to={`/country/${popularCountries[0].cca3}`}
                                                className="inline-block px-6 py-3 bg-white text-indigo-700 rounded-lg font-medium shadow hover:bg-indigo-50 transition"
                                            >
                                                Explore {popularCountries[0].name.common}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Popular Countries Section */}
                        <section className="mb-16">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-3xl font-bold text-gray-900">Popular Countries</h2>
                                <Link to="/home" className="text-indigo-600 hover:text-indigo-800 font-medium">
                                    View All →
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {popularCountries.slice(1).map(country => (
                                    <Link
                                        key={country.cca3}
                                        to={`/country/${country.cca3}`}
                                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 group"
                                    >
                                        <div className="h-48 overflow-hidden">
                                            <img
                                                src={country.flags.png}
                                                alt={country.name.common}
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{country.name.common}</h3>
                                            <div className="text-gray-600 mb-4">
                                                <p><span className="font-medium">Capital:</span> {country.capital?.[0] || 'N/A'}</p>
                                                <p><span className="font-medium">Region:</span> {country.region}</p>
                                                <p><span className="font-medium">Population:</span> {country.population.toLocaleString()}</p>
                                            </div>
                                            <div className="mt-4 text-indigo-600 font-medium group-hover:text-indigo-800 transition duration-300">
                                                Explore details →
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>

                        {/* Did You Know Section */}
                        <section className="mb-16 bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Did You Know?</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                                        <div className="text-blue-600 mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Country Count</h3>
                                        <p className="text-gray-600">There are 195 recognized countries in the world today, including 193 UN member states.</p>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-6 border border-green-100">
                                        <div className="text-green-600 mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Largest & Smallest</h3>
                                        <p className="text-gray-600">Russia is the largest country by area, while Vatican City is the smallest at just 0.49 km².</p>
                                    </div>
                                    <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
                                        <div className="text-purple-600 mb-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Languages</h3>
                                        <p className="text-gray-600">There are over 7,100 languages spoken around the world, with English being the most widespread.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Call to Action */}
                        <section className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl overflow-hidden shadow-xl">
                            <div className="max-w-5xl mx-auto px-6 py-12 text-center">
                                <h2 className="text-3xl font-bold text-white mb-4">Ready to Explore the World?</h2>
                                <p className="text-indigo-100 text-lg mb-8 max-w-3xl mx-auto">
                                    Create an account to save your favorite countries and track your explorations.
                                </p>
                                <div className="space-x-4">
                                    <Link
                                        to="/register"
                                        className="inline-block px-6 py-3 bg-white text-indigo-700 font-medium rounded-lg shadow hover:bg-indigo-50 transition duration-300"
                                    >
                                        Sign Up Now
                                    </Link>
                                    <Link
                                        to="/home"
                                        className="inline-block px-6 py-3 bg-indigo-800 text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition duration-300"
                                    >
                                        Browse Countries
                                    </Link>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-12 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">Country Explorer</h3>
                            <p className="mb-4">Discover the world's countries, cultures, and geography in one place.</p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <span className="sr-only">Facebook</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <span className="sr-only">Twitter</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <span className="sr-only">GitHub</span>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li><Link to="/" className="hover:text-white">Home</Link></li>
                                <li><Link to="/home" className="hover:text-white">All Countries</Link></li>
                                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">Contact</h3>
                            <p className="mb-2">Have questions or suggestions?</p>
                            <p className="mb-2">Email: info@aroundtheworld.com</p>
                            <p>Phone: (+94)713259819</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
                        <p>© {new Date().getFullYear()} Country Explorer. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}