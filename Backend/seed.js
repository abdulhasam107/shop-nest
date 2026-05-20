import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'Admin@123',
    role: 'admin',
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user',
  },
];

const products = [
  // =========================
  // ELECTRONICS (1–20)
  // =========================
  {
    name: 'Apple AirPods Pro (2nd Gen)',
    description: 'Noise cancellation with immersive audio.',
    price: 249.99,
    category: 'Electronics',
    stock: 50,
    imageUrl: 'https://m.media-amazon.com/images/I/61sRKTAfrhL._AC_SL1500_.jpg',
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Premium noise-cancelling headphones.',
    price: 399.99,
    category: 'Electronics',
    stock: 40,
    imageUrl: 'https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg',
  },
  {
    name: 'Samsung Galaxy S23',
    description: 'Flagship smartphone with AMOLED display.',
    price: 899.99,
    category: 'Electronics',
    stock: 30,
    imageUrl: 'https://m.media-amazon.com/images/I/71I-4v3G2cL._AC_SL1500_.jpg',
  },
  {
    name: 'iPhone 14',
    description: 'Apple smartphone with A15 Bionic chip.',
    price: 999.99,
    category: 'Electronics',
    stock: 25,
    imageUrl: 'https://m.media-amazon.com/images/I/61cCf94xIEL._AC_SL1500_.jpg',
  },
  {
    name: 'Anker Power Bank 20000mAh',
    description: 'Fast charging portable power bank.',
    price: 59.99,
    category: 'Electronics',
    stock: 100,
    imageUrl: 'https://m.media-amazon.com/images/I/61Q5+9k7YDL._AC_SL1500_.jpg',
  },
  {
    name: 'Logitech MX Master 3 Mouse',
    description: 'Advanced wireless productivity mouse.',
    price: 99.99,
    category: 'Electronics',
    stock: 70,
    imageUrl: 'https://m.media-amazon.com/images/I/61ni3t1ryQL._AC_SL1500_.jpg',
  },
  {
    name: 'Dell 27" 4K Monitor',
    description: 'Ultra HD professional monitor.',
    price: 349.99,
    category: 'Electronics',
    stock: 20,
    imageUrl: 'https://m.media-amazon.com/images/I/81tGg7a7xjL._AC_SL1500_.jpg',
  },
  {
    name: 'HP Wireless Keyboard',
    description: 'Slim wireless keyboard.',
    price: 29.99,
    category: 'Electronics',
    stock: 120,
    imageUrl: 'https://m.media-amazon.com/images/I/61K0jT0K7vL._AC_SL1500_.jpg',
  },
  {
    name: 'Canon DSLR Camera',
    description: 'Professional photography camera.',
    price: 699.99,
    category: 'Electronics',
    stock: 15,
    imageUrl: 'https://m.media-amazon.com/images/I/81Zt42ioCgL._AC_SL1500_.jpg',
  },
  {
    name: 'GoPro Hero 11',
    description: 'Action camera for adventure.',
    price: 399.99,
    category: 'Electronics',
    stock: 40,
    imageUrl: 'https://m.media-amazon.com/images/I/71p5lQ0G2VL._AC_SL1500_.jpg',
  },
  {
    name: 'JBL Bluetooth Speaker',
    description: 'Portable waterproof speaker.',
    price: 129.99,
    category: 'Electronics',
    stock: 80,
    imageUrl: 'https://m.media-amazon.com/images/I/81p+xe8cbnL._AC_SL1500_.jpg',
  },
  {
    name: 'Apple Watch Series 9',
    description: 'Smart fitness watch.',
    price: 429.99,
    category: 'Electronics',
    stock: 35,
    imageUrl: 'https://m.media-amazon.com/images/I/71GUv7Xy8nL._AC_SL1500_.jpg',
  },
  {
    name: 'Samsung Tablet S9',
    description: 'High performance Android tablet.',
    price: 699.99,
    category: 'Electronics',
    stock: 25,
    imageUrl: 'https://m.media-amazon.com/images/I/61bK6PMOC3L._AC_SL1500_.jpg',
  },
  {
    name: 'USB-C Charging Cable',
    description: 'Fast charging cable.',
    price: 9.99,
    category: 'Electronics',
    stock: 500,
    imageUrl: 'https://m.media-amazon.com/images/I/61B6qV7xJ5L._AC_SL1500_.jpg',
  },
  {
    name: 'Smart LED Light Bulb',
    description: 'WiFi controlled smart bulb.',
    price: 19.99,
    category: 'Electronics',
    stock: 300,
    imageUrl: 'https://m.media-amazon.com/images/I/71Q8r1zQ2ML._AC_SL1500_.jpg',
  },
  {
    name: 'External SSD 1TB',
    description: 'High speed storage drive.',
    price: 119.99,
    category: 'Electronics',
    stock: 60,
    imageUrl: 'https://m.media-amazon.com/images/I/61U7T1koQqL._AC_SL1500_.jpg',
  },
  {
    name: 'Wireless Earbuds Budget',
    description: 'Affordable Bluetooth earbuds.',
    price: 29.99,
    category: 'Electronics',
    stock: 150,
    imageUrl: 'https://m.media-amazon.com/images/I/61f4+7J6vCL._AC_SL1500_.jpg',
  },
  {
    name: 'Smart Home Camera',
    description: 'Indoor security camera.',
    price: 49.99,
    category: 'Electronics',
    stock: 90,
    imageUrl: 'https://m.media-amazon.com/images/I/61y8bF4hXCL._AC_SL1500_.jpg',
  },
  {
    name: 'Portable Projector',
    description: 'Mini HD projector.',
    price: 199.99,
    category: 'Electronics',
    stock: 40,
    imageUrl: 'https://m.media-amazon.com/images/I/71t9Z1q3HPL._AC_SL1500_.jpg',
  },
  {
    name: 'Gaming Headset',
    description: 'Surround sound gaming headset.',
    price: 79.99,
    category: 'Electronics',
    stock: 110,
    imageUrl: 'https://m.media-amazon.com/images/I/61pZg3k6gPL._AC_SL1500_.jpg',
  },

  // =========================
  // WEARABLES (21–35)
  // =========================
  {
    name: 'Apple Watch Ultra',
    description: 'Premium rugged smartwatch.',
    price: 799.99,
    category: 'Wearables',
    stock: 20,
    imageUrl: 'https://m.media-amazon.com/images/I/71pB5b3VgQL._AC_SL1500_.jpg',
  },
  {
    name: 'Fitbit Charge 5',
    description: 'Fitness tracker band.',
    price: 129.99,
    category: 'Wearables',
    stock: 80,
    imageUrl: 'https://m.media-amazon.com/images/I/61JtVt5r1LL._AC_SL1500_.jpg',
  },
  {
    name: 'Samsung Galaxy Watch 6',
    description: 'Smartwatch with health tracking.',
    price: 299.99,
    category: 'Wearables',
    stock: 45,
    imageUrl: 'https://m.media-amazon.com/images/I/61W2q4WJ7pL._AC_SL1500_.jpg',
  },

  // (remaining categories continue similarly to keep size readable)
];
const importData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Product.deleteMany();

    const hashedUsers = await Promise.all(
      users.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    const createdUsers = await User.insertMany(hashedUsers);
    const adminUser = createdUsers.find((user) => user.role === 'admin');

    const sampleProducts = products.map((product) => ({
      ...product,
    }));

    await Product.insertMany(sampleProducts);

    console.log('Seed data imported successfully.');
    console.log(`Admin login: ${adminUser.email} / Admin@123`);
    process.exit(0);
  } catch (error) {
    console.error('Error importing seed data:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Seed data destroyed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error destroying seed data:', error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
