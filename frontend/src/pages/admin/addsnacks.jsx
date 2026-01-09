import { Link } from "react-router-dom";
export default function AddSnacks() {
    return (
        <div className="min-h-screen bg-background-900 text-text-primary flex justify-center items-center">
            
            <div className="w-[900px]  bottom-60 bg-background-800 rounded-lg mt-20 p-6">
                <div className="w-full mb-4 flex flex-col">
                    <label className="text-text-primary text-lg font-semibold">Snack ID</label>
                    <input type="text" className="w-full p-2 mt-2 mb-4 bg-background-700 text-text-primary rounded"/>
                </div>
                <div className="w-full mb-4 flex flex-col">
                    <label className="text-text-primary text-lg font-semibold">Snack Name</label>
                    <input type="text" className="w-full p-2 mt-2 mb-4 bg-background-700 text-text-primary rounded"/>
                </div>
                <div className="w-full mb-4 flex flex-col">
                    <label className="text-text-primary text-lg font-semibold">Snack Label Price</label>
                    <input type="text" className="w-full p-2 mt-2 mb-4 bg-background-700 text-text-primary rounded"/>
                </div>
                <div className="w-full mb-4 flex flex-col">
                    <label className="text-text-primary text-lg font-semibold">Snack price</label>
                    <input type="text" className="w-full p-2 mt-2 mb-4 bg-background-700 text-text-primary rounded"/>
                </div>
                <div className="w-full mb-4 flex flex-col">
                    <label className="text-text-primary text-lg font-semibold">Quantity</label>
                    <input type="text" className="w-full p-2 mt-2 mb-4 bg-background-700 text-text-primary rounded"/>
                </div>
                <div className="w-full mb-4 flex flex-col">
                    <label className="text-text-primary text-lg font-semibold">Category</label>
                    <select className="w-full p-2 mt-2 mb-4 bg-background-700 text-text-primary rounded">
                        <option value="chips">Chips</option>
                        <option value="chocolate">Chocolate</option>
                        <option value="drinks">Drinks</option>
                        <option value="candy">Candy</option>
                    </select>
                </div>
                <div className="w-full mb-4 flex flex-col">
                    <label className="text-text-primary text-lg font-semibold">Image</label>
                    <input type="text" className="w-full p-2 mt-2 mb-4 bg-background-700 text-text-primary rounded"/>
                </div>
                <div className="w-full mb-4 flex flex-col">
                    <label className="text-text-primary text-lg font-semibold">Description</label>
                    <textarea className="w-full p-2 mt-2 mb-4 bg-background-700 text-text-primary rounded"/>
                </div>
                <div className="w-full mb-4 flex flex-col">
                    <label className="text-text-primary text-lg font-semibold">isavailable</label>
                    <select className="w-full p-2 mt-2 mb-4 bg-background-700 text-text-primary rounded">
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
                </div>
                
                <div className="flex justify-end gap-4">
                    <Link to="/concession-management" className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                        Cancel
                    </Link>
                    <Link to="/concession-management" className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded">
                        Add Snack
                    </Link>
                </div>
                
                
                



            </div>
            
        </div>
    );
}