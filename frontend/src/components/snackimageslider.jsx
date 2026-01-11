import { useState } from 'react';


export default function SnackImageSlider(props) {
    const { images } = props;
    const [activeIndex, setActiveIndex] = useState(0);
    
    // Safety check for images array
    if (!images || images.length === 0) {
        return (
            <div className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] flex justify-center items-center bg-gray-800 rounded-lg">
                <div className="text-white text-center">
                    <div className="text-2xl sm:text-3xl md:text-4xl mb-2">📷</div>
                    <p className="text-sm sm:text-base">No images available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px]">
            <img
                src={images[activeIndex]} 
                alt={`Product image ${activeIndex + 1}`}
                className="w-full h-[300px] sm:h-[380px] md:h-[480px] lg:h-[580px] xl:h-[600px] object-cover rounded-lg"
            />
            <div className="w-full h-[80px] sm:h-[90px] md:h-[100px] flex flex-row justify-center items-center gap-1 sm:gap-2">
                {images.map((image, index) => (
                    <img
                        src={image} 
                        key={index}
                        alt={`Thumbnail ${index + 1}`}
                        className={`w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] md:w-[70px] md:h-[70px] lg:w-[80px] lg:h-[80px] object-cover border-2 rounded cursor-pointer transition-all duration-200 ${activeIndex === index ? 'border-purple-500 scale-110' : 'border-transparent hover:border-gray-400'}`}  
                        onClick={() => setActiveIndex(index)}
                    />
                ))}
            </div>
        </div>
    )
}
    