import React from 'react';

export default function SearchBar({ onSearch })
{
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      <input
        type="text"
        placeholder="Search by country name..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full bg-white text-gray-700 border border-gray-200 focus:border-blue-500 rounded-lg py-3 pl-11 pr-4 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">

      </div>
    </div>
  );
}