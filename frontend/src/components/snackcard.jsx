import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function SnackCard() {
    const { user } = useContext(AuthContext);
    const isAdmin = user?.role === 'admin';

    return (
        <div className="bg-background-800 p-4 rounded-lg shadow-md">
            <h3 className="text-text-primary text-xl font-bold mb-2">Snack Name</h3>
            <p className="text-text-muted mb-4">Delicious snack description goes here.</p>
            <div className="flex items-center justify-between">
                <span className="text-text-primary font-semibold">Price: LKR 5.99</span>
                {!isAdmin && (
                  <button className="bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg">Add to Cart</button>
                )}
            </div>
        </div>
    );
}