import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchByCode } from '../api/countries';
import API from '../api';
import Navbar from './Navbar';

export default function CountryDetails()
{
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() =>
  {
    const fetchData = async () =>
    {
      try
      {
        setLoading(true);
        const countryData = await fetchByCode(code);
        setCountry(countryData[0]);
        setLoading(false);

        // Check if this country is already in user's favorites
        const res = await API.get("/auth/getuserdetails");
        const favorites = res.data.userdetails.favorites || [];
        setIsFavorite(favorites.includes(code));
      } catch (err)
      {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [code]);

  const toggleFavorite = async () =>
  {
    try
    {
      await API.post("/auth/toggle-favorite", { countryCode: code });
      setIsFavorite(!isFavorite);
    } catch (err)
    {
      console.error("Error toggling favorite:", err);
    }
  };

  const openGoogleMaps = () =>
  {
    if (country?.maps?.googleMaps)
    {
      window.open(country.maps.googleMaps, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading)
  {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (!country)
  {
    return (
      <div className="p-8 text-center bg-slate-100 h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-red-600">Error</h2>
          <p className="text-slate-700">Unable to load country data. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-slate-100 text-slate-800 py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl overflow-hidden shadow-2xl">
          <div className="relative">
            <img
              src={country.flags.png}
              alt={country.name.common}
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50"></div>
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <h1 className="text-5xl font-bold text-white drop-shadow-lg">{country.name.common}</h1>
              <p className="text-white mt-2 drop-shadow-md text-lg">{country.name.official}</p>
            </div>

            {/* Favorite Toggle Button */}
            <button
              onClick={toggleFavorite}
              className={`absolute top-6 right-6 px-5 py-2 rounded-full font-medium transition shadow-lg
              ${isFavorite ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
            >
              {isFavorite ? '♥ Remove Favorite' : '+ Add to Favorites'}
            </button>
          </div>

          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl shadow-sm border border-indigo-100">
                <h2 className="text-xl font-semibold text-indigo-700 mb-4 border-b border-indigo-100 pb-2">Basic Information</h2>
                <div className="space-y-4">
                  <p><span className="font-medium text-slate-700">Capital:</span> {country.capital?.[0] || 'N/A'}</p>
                  <p><span className="font-medium text-slate-700">Region:</span> {country.region}</p>
                  <p><span className="font-medium text-slate-700">Subregion:</span> {country.subregion || 'N/A'}</p>
                  <p><span className="font-medium text-slate-700">Population:</span> {country.population.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-xl shadow-sm border border-emerald-100">
                <h2 className="text-xl font-semibold text-emerald-700 mb-4 border-b border-emerald-100 pb-2">Additional Details</h2>
                <div className="space-y-4">
                  <p><span className="font-medium text-slate-700">Languages:</span> {country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</p>
                  <p><span className="font-medium text-slate-700">Currencies:</span> {country.currencies ? Object.values(country.currencies).map(c => c.name).join(', ') : 'N/A'}</p>
                  <p><span className="font-medium text-slate-700">Area:</span> {country.area?.toLocaleString() || 'N/A'} km²</p>
                  <p><span className="font-medium text-slate-700">Time Zones:</span> {country.timezones ? country.timezones[0] : 'N/A'}</p>
                </div>
              </div>
            </div>

            {country.borders && country.borders.length > 0 && (
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-xl shadow-sm border border-amber-100">
                <h2 className="text-xl font-semibold text-amber-700 mb-4 border-b border-amber-100 pb-2">Border Countries</h2>
                <div className="flex flex-wrap gap-2 mt-3">
                  {country.borders.map(border => (
                    <span key={border} className="px-4 py-2 bg-white text-slate-700 rounded-full text-sm border border-slate-200 shadow-sm hover:bg-slate-50 transition cursor-pointer">
                      {border}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4 mt-8">
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg transition shadow-sm font-medium"
              >
                ← Back to Countries
              </button>

              {country.maps?.googleMaps && (
                <button
                  onClick={openGoogleMaps}
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition shadow-sm font-medium"
                >
                  View on Google Maps
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}