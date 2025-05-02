import React from 'react';
import defaultMapImage from '../assets/map3.jpg';

export default function Header({ title, subtitle, image, children })
{
    return (
        <div className="relative bg-indigo-800 overflow-hidden">
            {/* Background image with overlay */}
            <div className="absolute inset-0 overflow-hidden">
                <img
                    src={image || defaultMapImage}
                    alt="Header background"
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-indigo-500 opacity-50"></div>
            </div>

            {/* Content */}
            <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl text-center">
                    {title || "Country Explorer"}
                </h1>
                {subtitle && (
                    <p className="mt-6 text-xl text-indigo-100 max-w-3xl text-center">
                        {subtitle}
                    </p>
                )}

                {/* Optional slot for search bar or other content */}
                <div className="mt-10 w-full max-w-xl">
                    {/* Children will be rendered here if provided */}
                    {React.Children.count(children) > 0 && children}
                </div>
            </div>

            {/* Decorative wave shape at the bottom */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1440 160"
                    className="w-full h-16 sm:h-20"
                    preserveAspectRatio="none"
                >
                    <path
                        fill="#f8fafc"
                        fillOpacity="1"
                        d="M0,128L80,117.3C160,107,320,85,480,80C640,75,800,85,960,90.7C1120,96,1280,96,1360,96L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
                    ></path>
                </svg>
            </div>
        </div>
    );
}