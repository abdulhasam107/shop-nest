import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const getadminstates = async (req, res) => {
     try {
        const totalOrders = await Order.countDocuments({});
        const totalProducts = await Product.countDocuments({});
        const totalUsers = await User.countDocuments({role: 'user'});
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        res.status(200).json({
            totalOrders,
            totalProducts,
            totalUsers,
            totalRevenue: totalRevenue[0]?.total || 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Error getting admin stats', error });
    }
};
 



export { getadminstates };      
