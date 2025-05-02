import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CountryCard({ country })
{
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  // Function to handle keyboard navigation for accessibility
  const handleKeyPress = (e) =>
  {
    if (e.key === 'Enter' || e.key === ' ')
    {
      navigate(`/country/${country.cca3}`);
    }
  };

  return (
    <div
      onClick={() => navigate(`/country/${country.cca3}`)}
      onKeyDown={handleKeyPress}
      tabIndex="0"
      role="button"
      aria-label={`View details for ${country.name.common}`}
      className="cursor-pointer bg-white rounded-xl overflow-hidden transition duration-300 transform hover:-translate-y-2 focus:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 shadow-lg hover:shadow-xl border-0"
    >
      {/* Flag container with modern rounded corners */}
      <div className="relative">
        {/* Loading placeholder */}
        <div className={`w-full h-56 bg-gray-100 transition-opacity duration-700 ${isLoaded ? 'opacity-0' : 'opacity-100'} absolute inset-0 animate-pulse`}>
          <div className="flex items-center justify-center h-full">
            <div className="rounded-full bg-gray-200 w-12 h-12 animate-pulse"></div>
          </div>
        </div>

        {/* Country flag */}
        <img
          src={country.flags.png}
          alt={`Flag of ${country.name.common}`}
          className={`w-full h-56 object-cover transition-all duration-500 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
          onLoad={() => setIsLoaded(true)}
        />

        {/* Modern floating card for country name */}
        <div className="absolute bottom-4 left-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-md">
          <h2 className="font-bold text-xl text-gray-800 truncate">{country.name.common}</h2>
        </div>
      </div>

      {/* Country information with modern styling */}
      <div className="p-5 text-gray-700 bg-gradient-to-b from-gray-50 to-white">
        <div className="space-y-3">
          <div className="flex items-baseline group">
            <div className="w-24 flex-shrink-0">
              <span className="text-sm font-semibold uppercase tracking-wider text-gray-500 group-hover:text-blue-500 transition-colors">Capital</span>
            </div>
            <span className="font-medium text-gray-800 ml-2">{country.capital?.[0] || 'N/A'}</span>
          </div>

          <div className="flex items-baseline group">
            <div className="w-24 flex-shrink-0">
              <span className="text-sm font-semibold uppercase tracking-wider text-gray-500 group-hover:text-blue-500 transition-colors">Region</span>
            </div>
            <span className="font-medium text-gray-800 ml-2">{country.region}</span>
          </div>

          <div className="flex items-baseline group">
            <div className="w-24 flex-shrink-0">
              <span className="text-sm font-semibold uppercase tracking-wider text-gray-500 group-hover:text-blue-500 transition-colors">Population</span>
            </div>
            <span className="font-medium text-gray-800 ml-2">{country.population.toLocaleString()}</span>
          </div>
        </div>

        {/* Modern call-to-action button */}
        <div className="mt-6 flex justify-center">
          <div className="transition-all duration-300 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg w-full text-center font-medium flex items-center justify-center group">
            Explore Country
            <svg
              className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5-5 5"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h12"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}