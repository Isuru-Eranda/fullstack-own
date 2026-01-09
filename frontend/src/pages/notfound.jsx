import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-background-900 to-background-800 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
            <div className="text-center max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
                {/* 404 Text */}
                <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-16">
                    <h1 className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem] font-bold text-primary-500 opacity-80 leading-none">
                        404
                    </h1>
                </div>

                {/* Error Message */}
                <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-16">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold text-text-primary mb-2 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6">
                        Page Not Found
                    </h2>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-text-secondary leading-relaxed">
                        Oops! The page you're looking for seems to have vanished into the digital void.
                        <br className="hidden sm:block" />
                        <span className="block sm:inline mt-1 sm:mt-0">
                            Don't worry, even the best movies have missing scenes.
                        </span>
                    </p>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 justify-center items-center">
                    <Link 
                        to="/"
                        className="w-full sm:w-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-2 sm:py-3 md:py-4 lg:py-5 xl:py-6 bg-primary-600 hover:bg-primary-700 text-white font-medium text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl rounded-md sm:rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                        Back to Home
                    </Link>
                    
                    <Link 
                        to="/movies"
                        className="w-full sm:w-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-2 sm:py-3 md:py-4 lg:py-5 xl:py-6 border-2 border-primary-600 text-secondary-600 hover:bg-primary-600 hover:text-white font-medium text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl rounded-md sm:rounded-lg md:rounded-xl transition-all duration-300 transform hover:scale-105"
                    >
                        Browse Movies
                    </Link>
                </div>

                {/* Decorative Element */}
                <div className="mt-8 sm:mt-10 md:mt-12 lg:mt-16 xl:mt-20 opacity-50">
                    <div className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-text-secondary">
                        🎬 🍿 🎭 🎪 🎨
                    </div>
                </div>
            </div>
        </div>
    );
}