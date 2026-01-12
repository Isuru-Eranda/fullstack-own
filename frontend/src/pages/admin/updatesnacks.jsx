import { useState, useContext, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import MediaUpload from "../../utils/mediaupload";
import { AuthContext } from "../../context/AuthContext";
import { API_BASE_URL } from "../../utils/api";






export default function UpdateSnacks() {
    const { id } = useParams();
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const [productId, setProductId] = useState(location.state?.ProductId );
    const [productName, setProductName] = useState(location.state?.ProductName );
    const [labelledPrice, setLabelledPrice] = useState(location.state?.labelledPrice );
    const [productPrice, setProductPrice] = useState(location.state?.ProductPrice );
    const [productQuantity, setProductQuantity] = useState(location.state?.ProductQuantity );
    const [productCategory, setProductCategory] = useState(location.state?.ProductCategory );
    const [productImage, setProductImage] = useState([]);
    const [existingImages, setExistingImages] = useState(location.state?.ProductImage || []);
    const [productDescription, setProductDescription] = useState(location.state?.ProductDescription );
    const [isAvailable, setIsAvailable] = useState(location.state?.isAvailable);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true); // Start as true to show loading initially
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    // Fetch snack data if not provided via location.state
    useEffect(() => {
        const fetchSnackData = async () => {
            if (!location.state && id) {
                setLoading(true);
                try {
                    const response = await axios.get(`${API_BASE_URL}/snacks/${id}`, {
                        withCredentials: true
                    });
                    const snack = response.data.snack;
                    setProductId(snack.ProductId);
                    setProductName(snack.ProductName);
                    setLabelledPrice(snack.labelledPrice);
                    setProductPrice(snack.ProductPrice);
                    setProductQuantity(snack.ProductQuantity);
                    setProductCategory(snack.ProductCategory);
                    setProductDescription(snack.ProductDescription);
                    setIsAvailable(snack.isAvailable);
                    setExistingImages(snack.ProductImage || []);
                } catch (error) {
                    console.error('Error fetching snack:', error);
                    setError('Failed to load snack data');
                    toast.error('Failed to load snack data');
                } finally {
                    setLoading(false);
                }
            } else if (location.state) {
                // If data is provided via location.state, no need to fetch
                setLoading(false);
            }
        };
        fetchSnackData();
    }, [id, location.state]);

   async function handleSubmit(e) {
        e.preventDefault();
        setUploading(true);

        try {
            // Basic validation
            if (!productId || !productName || !productPrice || !labelledPrice || !productQuantity) {
                toast.error('Please fill in all required fields (ID, Name, Price, Label Price, Quantity)');
                setUploading(false);
                return;
            }

            // Check if images are selected or if we have existing images
            const hasNewImages = productImage && productImage.length > 0 && productImage[0] !== null;
            
            if (!hasNewImages) {
                // No new images selected, check if we have existing images
                if (!existingImages || existingImages.length === 0) {
                    toast.error("Please select at least one image");
                    setUploading(false);
                    return;
                }
                // We have existing images, so we'll use those
                console.log("No new images selected, will use existing images");
            } else {
                console.log("New images selected:", productImage.length);
            }

            // Validate description length
            if (!productDescription || productDescription.length < 10) {
                toast.error("Description must be at least 10 characters");
                setUploading(false);
                return;
            }

            // Validate numeric fields
            if (isNaN(productPrice) || parseFloat(productPrice) <= 0) {
                toast.error('Please enter a valid product price (greater than 0)');
                setUploading(false);
                return;
            }

            if (isNaN(labelledPrice) || parseFloat(labelledPrice) <= 0) {
                toast.error('Please enter a valid labelled price (greater than 0)');
                setUploading(false);
                return;
            }

            if (isNaN(productQuantity) || parseInt(productQuantity) <= 0) {
                toast.error('Please enter a valid quantity (greater than 0)');
                setUploading(false);
                return;
            }

            // Check if user is authenticated
            if (!user) {
                toast.error('Please log in to continue');
                navigate('/login');
                setUploading(false);
                return;
            }

            toast.info("Processing images...");

            // Upload each image file and collect URLs
            const promisesArray = [];

            if (hasNewImages) {
                for (let i = 0; i < productImage.length; i++) {
                    if (!productImage[i]) continue; // Skip null or undefined files
                    promisesArray.push(MediaUpload(productImage[i]));
                }
            }

            let finalImages = [];

            if (promisesArray.length > 0) {
                // Upload new images
                const responses = await Promise.all(promisesArray);
                finalImages = responses;
                console.log("Uploaded new image URLs:", responses);
            } else {
                // No new images to upload, use existing images
                finalImages = existingImages || [];
                console.log("Using existing images:", finalImages);
            }

            const snackData = {
                ProductId: productId.trim(),
                ProductName: productName.trim(),
                labelledPrice: parseFloat(labelledPrice),
                ProductPrice: parseFloat(productPrice),
                ProductQuantity: parseInt(productQuantity),
                ProductCategory: productCategory,
                ProductImage: finalImages,
                ProductDescription: productDescription.trim(),
                isAvailable: isAvailable,
            };

            // Loading toast for API call
            toast.info('Updating snack...');
            
            let response;
            
            // Try with credentials first (httpOnly cookies)
            try {
                response = await fetch(`${API_BASE_URL}/snacks/${id}`, {
                    method: 'PUT',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(snackData),
                });
                
                const responseData = await response.json();
                
                if (!response.ok) {
                    console.log('Fetch response:', responseData);
                    throw new Error(`HTTP ${response.status}: ${responseData.message || 'Unknown error'}`);
                }
                
                console.log("Snack updated successfully with cookies");
                toast.success('Snack updated successfully!');
                
            } catch (cookieError) {
                console.log('Cookie auth failed, trying with token:', cookieError.message);
                
                // Fallback to localStorage token
                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error('Authentication required. Please login again.');
                    navigate('/login');
                    setUploading(false);
                    return;
                }
                
                try {
                    response = await axios.put(`${API_BASE_URL}/snacks/${id}`, snackData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    
                    console.log("Snack updated successfully with token");
                    toast.success('Snack updated successfully!');
                    
                } catch (tokenError) {
                    console.error('Token auth failed:', tokenError);
                    
                    if (tokenError.response?.status === 403) {
                        toast.error('Access denied. Admin privileges required.');
                    } else if (tokenError.response?.status === 401) {
                        toast.error('Session expired. Please log in again.');
                        navigate('/login');
                    } else {
                        toast.error(`Update failed: ${tokenError.response?.data?.message || tokenError.message}`);
                    }
                    setUploading(false);
                    return;
                }
            }

            
            // Clear form after successful update
            setProductId('');
            setProductName('');
            setLabelledPrice('');
            setProductPrice('');
            setProductQuantity('');
            setProductCategory('chips');
            setProductImage([]);
            setProductDescription('');
            setIsAvailable('true');
            
            navigate('/admin-dashboard/concession-management');
            
        } catch (error) {
            toast.dismiss();
            console.error('Error updating snack:', error);
            
            if (error.response) {
                if (error.response.status === 401) {
                    toast.error('Session expired. Please log in again.');
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 2000);
                } else if (error.response.status === 400) {
                    toast.error('Invalid data provided. Please check your inputs.');
                } else {
                    toast.error('Server error occurred. Please try again.');
                }
            } else {
                toast.error('Cannot connect to server. Please check if backend is running.');
            }
        } finally {
            setUploading(false);
        }
    }


    if (loading) {
        return (
            <div className="min-h-screen bg-background-900 text-text-primary flex justify-center items-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="mt-4 text-lg">Loading snack data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background-900 text-text-primary flex justify-center items-center">
                <div className="text-center">
                    <p className="text-red-500 text-lg">{error}</p>
                    <Link to="/concession-management" className="mt-4 inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
                        Back to Management
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-900 text-text-primary flex justify-center items-center">
            
            <div className="w-[900px]  bottom-60 bg-background-800 rounded-lg mt-20 p-6">
                <div className="w-full mb-4 flex flex-col">
                    <label className="text-text-primary text-lg font-semibold">Snack ID</label>
                    <input
                     disabled
                     onChange={
                        (e) => {setProductId(e.target.value)}
                    } value={productId}
                    type="text" className="w-full p-2 mt-2 mb-4 bg-background-700 text-text-primary rounded"/>
                </div>
                <div className="w-full mb-4 flex flex-col">
                    <label className="text-text-primary text-lg font-semibold">Snack Name</label>
                    <input
                     onChange={(e) => {setProductName(e.target.value)}}
                     value={productName}
                     type="text" className="w-full p-2 mt-2 mb-4 bg-background-700 text-text-primary rounded"/>
                </div>
                <div className="w-full mb-4 flex flex-col">
                    <label className="text-text-primary text-lg font-semibold">Snack Label Price</label>
                    <input 
                    onChange={(e) => {setLabelledPrice(e.target.value)}}
                    value={labelledPrice}
                    type="number" className="w-full p-2 mt-2 mb-4 bg-background-700 text-text-primary rounded"/>
                </div>
                <div className="w-full mb-4 flex flex-col">
                    <label className="text-text-primary text-lg font-semibold">Snack price</label>
                    <input
                     onChange={(e) => {setProductPrice(e.target.value)}}
                        value={productPrice}
                     type="number" className="w-full p-2 mt-2 mb-4 bg-background-700 text-text-primary rounded"/>
                </div>
                <div className="w-full mb-4 flex flex-col">
                    <label className="text-text-primary text-lg font-semibold">Quantity</label>
                    <input
                     onChange={(e) => {setProductQuantity(e.target.value)}}
                        value={productQuantity}
                     type="number" className="w-full p-2 mt-2 mb-4 bg-background-700 text-text-primary rounded"/>
                </div>
                <div className="w-full mb-4 flex flex-col">
                    <label className="text-text-primary text-lg font-semibold">Category</label>
                    <select 
                    onChange={(e) => {setProductCategory(e.target.value)}}
                        value={productCategory}
                    className="w-full p-2 mt-2 mb-4 bg-background-700 text-text-primary rounded">
                        <option value="chips">Chips</option>
                        <option value="chocolate">Chocolate</option>
                        <option value="drinks">Drinks</option>
                        <option value="candy">Candy</option>
                    </select>
                </div>
                <div className="w-full mb-4 flex flex-col">
                    <label className="text-text-primary text-lg font-semibold">Current Images</label>
                    {existingImages && existingImages.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2 mt-2 mb-4">
                            {existingImages.map((imageUrl, index) => (
                                <img 
                                    key={index}
                                    src={imageUrl}
                                    alt={`Current image ${index + 1}`}
                                    className="w-full h-24 object-cover rounded border border-gray-600"
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-sm mt-2 mb-4">No current images</p>
                    )}
                </div>
                <div className="w-full mb-4 flex flex-col">
                    <label className="text-text-primary text-lg font-semibold">Upload New Images (Optional)</label>
                    <p className="text-gray-400 text-sm mb-2">Leave empty to keep current images</p>
                    <input 
                    onChange={(e) => {setProductImage(e.target.files)}}
                    
                    type="file"
                    multiple
                    accept="image/*"
                     className="w-full p-2 mt-2 mb-4 bg-background-700 text-text-primary rounded"/>
                </div>
                <div className="w-full mb-4 flex flex-col">
                    <label className="text-text-primary text-lg font-semibold">Description</label>
                    <textarea 
                    onChange={(e) => {setProductDescription(e.target.value)}}
                    value={productDescription}
                    className="w-full p-2 mt-2 mb-4 bg-background-700 text-text-primary rounded"/>
                </div>
                <div className="w-full mb-4 flex flex-col">
                    <label className="text-text-primary text-lg font-semibold">isavailable</label>
                    <select 
                    onChange={(e) => {setIsAvailable(e.target.value)}} 
                    value={isAvailable}
                    className="w-full p-2 mt-2 mb-4 bg-background-700 text-text-primary rounded">
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
                </div>
                
                <div className="flex justify-end gap-4">
                    <Link to="/concession-management" className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                        Cancel
                    </Link>
                    <button 
                        onClick={handleSubmit} 
                        disabled={uploading}
                        className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded flex items-center gap-2"
                    >
                        {uploading && (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        )}
                        {uploading ? 'Updating...' : 'Update Snack'}
                    </button>
                </div>
                
                
            

            </div>
            
        </div>
    );
}