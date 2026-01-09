import { Link } from "react-router-dom";



const sampleSnacks = [
    {
        ProductId: "SNK001",
        ProductName: "Classic Butter Popcorn",
        labelledPrice: 12.99,
        ProductPrice: 9.99,
        ProductQuantity: 50,
        ProductCategory: "popcorn",
        ProductImage: ["/uploads/movies/popcorn1.jpg", "/uploads/movies/popcorn2.jpg"],
        ProductDescription: "Fresh, warm butter popcorn made with premium kernels and real butter. A classic movie theater favorite that's perfect for any film experience.",
        isAvailable: true,
    },
    {
        ProductId: "SNK002",
        ProductName: "Caramel Popcorn",
        labelledPrice: 14.99,
        ProductPrice: 12.99,
        ProductQuantity: 30,
        ProductCategory: "popcorn",
        ProductImage: ["/uploads/movies/caramel-popcorn1.jpg"],
        ProductDescription: "Sweet and crunchy caramel-coated popcorn with a perfect balance of sweetness and crunch. Made with premium caramel coating.",
        isAvailable: true,
    },
    {
        ProductId: "SNK003",
        ProductName: "Classic Nachos with Cheese",
        labelledPrice: 16.99,
        ProductPrice: 14.99,
        ProductQuantity: 25,
        ProductCategory: "nachos",
        ProductImage: ["/uploads/movies/nachos1.jpg", "/uploads/movies/nachos2.jpg"],
        ProductDescription: "Crispy tortilla chips served with our signature warm cheese sauce. Perfect for sharing during your movie experience.",
        isAvailable: true,
    },
    {
        ProductId: "SNK004",
        ProductName: "Doritos Nacho Cheese",
        labelledPrice: 6.99,
        ProductPrice: 5.49,
        ProductQuantity: 75,
        ProductCategory: "chips",
        ProductImage: ["/uploads/movies/doritos1.jpg"],
        ProductDescription: "The classic nacho cheese flavored Doritos that everyone loves. Crunchy, cheesy, and perfect for movie snacking.",
        isAvailable: true,
    },
    {
        ProductId: "SNK005",
        ProductName: "Coca-Cola",
        labelledPrice: 5.99,
        ProductPrice: 4.99,
        ProductQuantity: 100,
        ProductCategory: "beverages",
        ProductImage: ["/uploads/movies/coke1.jpg"],
        ProductDescription: "Ice-cold Coca-Cola served in a large cup with ice. The perfect refreshing drink to accompany your movie.",
        isAvailable: true,
    },
    {
        ProductId: "SNK006",
        ProductName: "Chocolate Chip Cookies",
        labelledPrice: 8.99,
        ProductPrice: 7.49,
        ProductQuantity: 40,
        ProductCategory: "sweets",
        ProductImage: ["/uploads/movies/cookies1.jpg", "/uploads/movies/cookies2.jpg"],
        ProductDescription: "Freshly baked chocolate chip cookies with real chocolate chips. Warm, soft, and absolutely delicious.",
        isAvailable: true,
    },
    {
        ProductId: "SNK007",
        ProductName: "Spicy Jalapeño Nachos",
        labelledPrice: 18.99,
        ProductPrice: 16.99,
        ProductQuantity: 20,
        ProductCategory: "nachos",
        ProductImage: ["/uploads/movies/spicy-nachos1.jpg"],
        ProductDescription: "Tortilla chips topped with cheese sauce, jalapeños, and spicy seasoning. Perfect for those who like it hot!",
        isAvailable: true,
    },
    {
        ProductId: "SNK008",
        ProductName: "Large Sprite",
        labelledPrice: 5.99,
        ProductPrice: 4.99,
        ProductQuantity: 80,
        ProductCategory: "beverages",
        ProductImage: ["/uploads/movies/sprite1.jpg"],
        ProductDescription: "Refreshing lemon-lime soda served ice-cold. Light, crisp, and perfect for quenching your thirst.",
        isAvailable: true,
    },
    {
        ProductId: "SNK009",
        ProductName: "Pretzel Bites",
        labelledPrice: 10.99,
        ProductPrice: 8.99,
        ProductQuantity: 35,
        ProductCategory: "snacks",
        ProductImage: ["/uploads/movies/pretzels1.jpg"],
        ProductDescription: "Soft, warm pretzel bites served with cheese dipping sauce. Perfectly salted and freshly baked.",
        isAvailable: false,
    },
    {
        ProductId: "SNK010",
        ProductName: "Gummy Bears",
        labelledPrice: 7.99,
        ProductPrice: 6.49,
        ProductQuantity: 60,
        ProductCategory: "sweets",
        ProductImage: ["/uploads/movies/gummy-bears1.jpg"],
        ProductDescription: "Assorted fruity gummy bears in various flavors. Chewy, sweet, and perfect for candy lovers.",
        isAvailable: true,
    },
    {
        ProductId: "SNK011",
        ProductName: "Hot Dogs",
        labelledPrice: 12.99,
        ProductPrice: 10.99,
        ProductQuantity: 15,
        ProductCategory: "hot_food",
        ProductImage: ["/uploads/movies/hotdog1.jpg", "/uploads/movies/hotdog2.jpg"],
        ProductDescription: "Grilled hot dogs served with your choice of mustard, ketchup, and relish. A classic movie theater snack.",
        isAvailable: true,
    },
    {
        ProductId: "SNK012",
        ProductName: "Pepsi",
        labelledPrice: 5.99,
        ProductPrice: 4.99,
        ProductQuantity: 90,
        ProductCategory: "beverages",
        ProductImage: ["/uploads/movies/pepsi1.jpg"],
        ProductDescription: "Ice-cold Pepsi cola served in a large cup. The perfect cola drink to enjoy with your movie.",
        isAvailable: true,
    },
    {
        ProductId: "SNK013",
        ProductName: "M&M's",
        labelledPrice: 6.99,
        ProductPrice: 5.99,
        ProductQuantity: 65,
        ProductCategory: "sweets",
        ProductImage: ["/uploads/movies/mms1.jpg"],
        ProductDescription: "Colorful chocolate candies that melt in your mouth, not in your hand. A movie classic.",
        isAvailable: true,
    },
    {
        ProductId: "SNK014",
        ProductName: "Loaded Nachos Supreme",
        labelledPrice: 22.99,
        ProductPrice: 19.99,
        ProductQuantity: 12,
        ProductCategory: "nachos",
        ProductImage: ["/uploads/movies/loaded-nachos1.jpg", "/uploads/movies/loaded-nachos2.jpg"],
        ProductDescription: "Ultimate nachos loaded with cheese, jalapeños, sour cream, guacamole, and ground beef. Perfect for sharing.",
        isAvailable: true,
    },
    {
        ProductId: "SNK015",
        ProductName: "Iced Coffee",
        labelledPrice: 7.99,
        ProductPrice: 6.49,
        ProductQuantity: 45,
        ProductCategory: "beverages",
        ProductImage: ["/uploads/movies/iced-coffee1.jpg"],
        ProductDescription: "Rich, cold-brewed coffee served over ice with optional cream and sugar. Perfect pick-me-up during long movies.",
        isAvailable: true,
    }
];  

export default function ConcessionManagement() {
    return (
       <div className="min-h-screen bg-background-900 text-text-primary w-full">
         <h1 className="text-2xl font-bold m-4">Concession Management Page</h1>
         
         <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Sample Snacks Inventory</h2>
            
            {/* Table Container */}
            <div className="overflow-x-auto bg-surface-600 rounded-lg border border-surface-400/40 m-6">
                <table className="w-full min-w-[1000px] text-[20px] text-left">
                    <thead className="bg-background-800 border-b border-surface-400/40">
                        <tr>
                            <th className="px-4 py-3 font-semibold text-text-primary">Product ID</th>
                            <th className="px-4 py-3 font-semibold text-text-primary">Product Name</th>
                            <th className="px-4 py-3 font-semibold text-text-primary">Category</th>
                            <th className="px-4 py-3 font-semibold text-text-primary">Description</th>
                            <th className="px-4 py-3 font-semibold text-text-primary">Labelled Price</th>
                            <th className="px-4 py-3 font-semibold text-text-primary">Selling Price</th>
                            <th className="px-4 py-3 font-semibold text-text-primary">Quantity</th>
                            <th className="px-4 py-3 font-semibold text-text-primary">Status</th>
                            <th className="px-4 py-3 font-semibold text-text-primary">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sampleSnacks.map((snack, index) => (
                            <tr key={snack.ProductId} className={`border-b border-surface-400/20 hover:bg-background-800/50 ${index % 2 === 0 ? 'bg-background-900/30' : 'bg-surface-600/30'}`}>
                                <td className="px-4 py-3 font-mono text-sm text-gray-300">{snack.ProductId}</td>
                                <td className="px-4 py-3 font-medium text-text-primary">{snack.ProductName}</td>
                                <td className="px-4 py-3">
                                    <span className="bg-primary-600 px-2 py-1 rounded text-xs text-white capitalize">
                                        {snack.ProductCategory}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-text-muted max-w-xs truncate" title={snack.ProductDescription}>
                                    {snack.ProductDescription}
                                </td>
                                <td className="px-4 py-3 text-gray-500 line-through">${snack.labelledPrice}</td>
                                <td className="px-4 py-3 font-bold text-green-400">${snack.ProductPrice}</td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`px-2 py-1 rounded text-xs ${snack.ProductQuantity > 50 ? 'bg-green-600 text-white' : snack.ProductQuantity > 20 ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white'}`}>
                                        {snack.ProductQuantity}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`px-2 py-1 rounded text-xs ${snack.isAvailable ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                                        {snack.isAvailable ? 'Available' : 'Out of Stock'}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex space-x-2">
                                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors">
                                            Edit
                                        </button>
                                        <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
         </div>

         <Link to="/admin/addsnack" className="fixed right-[60px] bottom-[60px] bg-primary-500 hover:bg-primary-600 text-white font-bold p-4 rounded-full shadow-lg ">
             Add New Snack
         </Link>
        </div>
    );
}


