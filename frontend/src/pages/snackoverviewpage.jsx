import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import SnackImageSlider from "../components/snackimageslider";
import Navbar from "../components/Navbar";
import BackButton from "../components/BackButton";

export default function SnackOverviewPage() {
    const params = useParams();
    const [snack, setSnack] = useState(null);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        if (status === 'loading') {
            const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5008';
            const apiUrl = `${apiBaseUrl}/api/snacks/${params.snackid}`;
            console.log('API URL:', apiUrl);
            axios.get(apiUrl)
                .then((response) => {
                    console.log('Snack data:', response.data); // Debug log
                    setSnack(response.data.snack); // Extract snack from nested response
                    setStatus('loaded');
                }).catch((error) => {
                    console.error('Error fetching snack details:', error);
                    console.error('Error response:', error.response);
                    setStatus('error');
                });
        }
    }, [status, params.snackid]);

    if (status === 'loading') {
        return <div className="w-full h-screen flex justify-center items-center text-white">Loading...</div>;
    }

    if (status === 'error' || !snack) {
        return <div className="w-full h-screen flex justify-center items-center text-white">Error loading snack details</div>;
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <Navbar />
            <div className="pt-4 px-4">
                <BackButton to="/concessions" showText={true} text="Back to Concessions" />
            </div>
            <div className="w-full h-screen flex flex-row justify-center items-center bg-gray-900"> 
        
            <div className="w-[49%] h-full flex justify-center items-center">
                <SnackImageSlider images={snack.ProductImage || []} />
            </div>
            <div className="w-[49%] h-full flex flex-col justify-center items-start p-8 text-white ">
                <h1 className="text-4xl font-bold mb-4">{snack.ProductName}</h1>
                <p className="text-gray-400 text-lg mb-2">{snack.ProductCategory}</p>
                
                
                <div className="mb-6">
                    {snack.labelledPrice > snack.ProductPrice ? (
                        <>
                            <span className="line-through text-gray-500 text-xl">Rs {snack.labelledPrice?.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> 
                            <span className="text-purple-400 ml-3 font-semibold text-3xl">Rs {snack.ProductPrice?.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </>
                    ) : (
                        <span className="text-purple-400 font-semibold text-3xl">Rs {snack.ProductPrice?.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    )}
                </div>
                
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">{snack.ProductDescription || 'No description available'}</p>
                
               
                
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg">
                    Add to Cart
                </button>
                
            </div>
            </div>
        </div>

    );
}