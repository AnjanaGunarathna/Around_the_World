import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { fetchByCode } from "../api/countries";
import { Mail, Phone, MapPin, Globe, Heart, ExternalLink, XCircle } from "lucide-react";
import Navbar from "../components/Navbar";

export default function Profile()
{
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() =>
    {
        const fetchDetails = async () =>
        {
            try
            {
                setLoading(true);
                const res = await API.get("/auth/getuserdetails");
                const userData = res.data.userdetails;
                setUser(userData);

                // Fetch details of favorite countries
                if (userData.favorites && userData.favorites.length > 0)
                {
                    const favoritesData = await Promise.all(
                        userData.favorites.map(code =>
                            fetchByCode(code).then(data => data[0])
                        )
                    );
                    setFavorites(favoritesData);
                }
                setLoading(false);
            } catch (err)
            {
                console.error("Error fetching user details:", err);
                alert("Session expired");
                navigate("/login");
            }
        };

        fetchDetails();
    }, [navigate]);


    const removeFavorite = async (countryCode) =>
    {
        try
        {
            await API.post("/auth/toggle-favorite", { countryCode });
            // Remove from local state
            setFavorites(favorites.filter(country => country.cca3 !== countryCode));
        } catch (err)
        {
            console.error("Error removing favorite:", err);
        }
    };

    if (loading)
    {
        return (
            <div className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-50 to-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-700 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Profile Header */}
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 mb-8 transform transition duration-500 hover:scale-101">
                        <div className="relative p-8 pb-24 bg-gradient-to-r from-blue-500 to-indigo-600">
                            <h1 className="text-4xl font-bold text-white mb-2">
                                {user?.firstName} {user?.lastName}
                            </h1>
                            <div className="opacity-90 text-blue-100">
                                <div className="flex items-center mb-1">
                                    <Mail size={16} className="mr-2" />
                                    <p>{user?.email}</p>
                                </div>
                                <div className="flex items-center">
                                    <Phone size={16} className="mr-2" />
                                    <p>{user?.contactno}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-8 pt-0 -mt-16">
                            <div className="bg-white rounded-lg shadow-md p-6 transform transition duration-500 hover:-translate-y-1 border border-gray-100">
                                <h2 className="text-xl font-semibold text-blue-600 mb-3">User Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-500 text-sm">Email</p>
                                        <div className="flex items-center text-gray-800 font-medium">
                                            <Mail size={16} className="mr-2 text-blue-500" />
                                            {user?.email}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm">Contact</p>
                                        <div className="flex items-center text-gray-800 font-medium">
                                            <Phone size={16} className="mr-2 text-blue-500" />
                                            {user?.contactno}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Favorites Section */}
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 animate-fadeIn">
                        <div className="p-8">
                            <div className="flex items-center mb-6">
                                <Heart size={24} className="text-blue-500 mr-2" />
                                <h2 className="text-2xl font-bold text-gray-800">Your Favorite Countries</h2>
                            </div>

                            {favorites.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {favorites.map((country) => (
                                        <div
                                            key={country.cca3}
                                            className="bg-white rounded-lg overflow-hidden shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl border border-gray-100"
                                        >
                                            <div className="relative h-32">
                                                <img
                                                    src={country.flags.png}
                                                    alt={country.name.common}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-gray-800 to-transparent opacity-50"></div>
                                                <h3 className="absolute bottom-2 left-3 text-white font-bold">{country.name.common}</h3>
                                            </div>
                                            <div className="p-4">
                                                <div className="flex items-center text-sm mb-1">
                                                    <MapPin size={14} className="text-blue-500 mr-1" />
                                                    <span className="text-gray-600">Capital:</span>
                                                    <span className="ml-1 text-gray-800">{country.capital?.[0] || 'N/A'}</span>
                                                </div>
                                                <div className="flex items-center text-sm">
                                                    <Globe size={14} className="text-blue-500 mr-1" />
                                                    <span className="text-gray-600">Region:</span>
                                                    <span className="ml-1 text-gray-800">{country.region}</span>
                                                </div>

                                                <div className="mt-3 flex justify-between items-center">
                                                    <button
                                                        onClick={() => navigate(`/country/${country.cca3}`)}
                                                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                    >
                                                        <ExternalLink size={14} className="mr-1" />
                                                        View Details
                                                    </button>
                                                    <button
                                                        onClick={() => removeFavorite(country.cca3)}
                                                        className="flex items-center text-red-500 hover:text-red-700 text-sm font-medium"
                                                    >
                                                        <XCircle size={14} className="mr-1" />
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-gray-50 p-8 rounded-lg text-center border border-gray-100">
                                    <p className="text-lg text-gray-600">You haven't marked any countries as favorites yet.</p>
                                    <button
                                        onClick={() => navigate('/home')}
                                        className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white font-medium transition duration-300 shadow-md"
                                    >
                                        Explore Countries
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}