import { Link } from "react-router-dom";

export default function SnackCard({ snack }) {
    return (
        <Link to={`/snacksoverview/${snack._id}`} className="bg-gray-900 border border-gray-700 rounded-lg shadow-md w-full max-w-[300px] sm:max-w-[350px] md:max-w-[350px] lg:max-w-[380px] xl:max-w-[400px] h-auto min-h-[400px] sm:min-h-[450px] md:min-h-[480px] lg:min-h-[500px] flex flex-col items-center transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/25 hover:scale-105 hover:bg-gray-800 hover:border-purple-500 cursor-pointer">
            <img 
                src={snack.ProductImage && snack.ProductImage[0] ? snack.ProductImage[0] : '/placeholder-snack.jpg'} 
                alt={snack.ProductName || 'Snack'}
                className="w-full object-cover h-[250px] sm:h-[240px] md:h-[260px] lg:h-[280px] xl:h-[300px] rounded-t-lg transition-transform duration-300 hover:scale-110"
            />
            <div className="mt-2 gap-2 sm:gap-3 md:gap-4 p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col items-center flex-grow justify-center">
                <h3 className="text-white text-sm sm:text-base md:text-lg lg:text-xl font-bold text-center">{snack.ProductName}</h3>
                <p className="text-gray-400 text-xs sm:text-sm md:text-base">{snack.ProductCategory}</p>
                <span className="text-center">
                    {snack.labelledPrice > snack.ProductPrice ? 
                        <>
                            <span className="line-through text-gray-500 text-xs sm:text-sm md:text-base">Rs {snack.labelledPrice.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> 
                            <span className="text-purple-400 ml-2 font-semibold text-sm sm:text-base md:text-lg">Rs {snack.ProductPrice.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </> : 
                        <span className="text-purple-400 font-semibold text-sm sm:text-base md:text-lg">Rs {snack.ProductPrice.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    }
                </span>
            </div>
        </Link>
    );
}