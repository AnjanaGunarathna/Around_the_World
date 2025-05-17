import React, { useEffect, useState } from 'react';
import { fetchAllCountries, fetchByRegion } from '../api/countries';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import CountryCard from '../components/CountryCard';
import Navbar from '../components/Navbar';


export default function Home()
{
  const [countries, setCountries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fadeIn, setFadeIn] = useState(false);

  const [selectedRegion, setSelectedRegion] = useState(() => sessionStorage.getItem('selectedRegion') || 'All');

  useEffect(() =>
  {
    setLoading(true);
    fetchAllCountries()
      .then((data) =>
      {
        setCountries(data);
        setFiltered(data);
        setLoading(false);
        // Trigger fade-in animation after data loads
        setTimeout(() => setFadeIn(true), 100);
      })
      .catch(err =>
      {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() =>
  {
    const savedRegion = sessionStorage.getItem('selectedRegion') || 'All';

    if (savedRegion !== 'All')
    {
      fetchByRegion(savedRegion)
        .then(data =>
        {
          setFiltered(data);
        })
        .catch(err => console.error(err));
    }
  }, [countries]);

  const handleSearch = (query) =>
  {

    setFadeIn(false);

    const result = countries.filter((c) =>
      c.name.common.toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(result);


    setTimeout(() => setFadeIn(true), 100);
  };

  const handleRegion = async (region) =>
  {
    setSelectedRegion(region);
    sessionStorage.setItem('selectedRegion', region);
    setLoading(true);
    setFadeIn(false);

    try
    {
      if (region === 'All')
      {
        setFiltered(countries);
      } else
      {
        const data = await fetchByRegion(region);
        setFiltered(data);
      }
    } catch (err)
    {
      console.error(err);
    }

    setLoading(false);
    setTimeout(() => setFadeIn(true), 100);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 text-gray-800 py-8 px-4 transition-colors duration-500">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center transition-all duration-300 hover:scale-105">
            Explore Countries
          </h1>

          <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
            <div className="w-full md:w-2/3 transform transition duration-300 hover:-translate-y-1">
              <SearchBar onSearch={handleSearch} />
            </div>
            <div className="w-full md:w-1/3 md:flex md:justify-end transform transition duration-300 hover:-translate-y-1">
              <FilterDropdown onSelect={handleRegion} value={selectedRegion} />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600 animate-pulse">Loading countries...</p>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 transform transition duration-500 ease-in-out animate-bounce">
              <p className="text-xl text-gray-600">No countries found matching your criteria</p>
              <button
                onClick={() =>
                {
                  setFiltered(countries);
                  setTimeout(() => setFadeIn(true), 100);
                }}
                className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 transition-opacity duration-500 ease-in-out ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
              {filtered.map((country, index) => (
                <div
                  key={country.cca3}
                  className="transform transition duration-500 hover:-translate-y-2 hover:shadow-xl"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationName: 'slideIn',
                    animationDuration: '0.5s',
                    animationFillMode: 'both'
                  }}
                >
                  <CountryCard country={country} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add global animation styles */}
        <style jsx global>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      </div>
    </div>
  );
}
