'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Box, Users, Star, Tag, BarChart2, 
  Settings, Truck, CreditCard, Bell, Search, Menu, Plus, X, 
  Bold, Italic, Underline, List, Link as LinkIcon, Headphones
} from 'lucide-react';
import AddProduct from '../components/AddProduct';
import CategoriesPage from '../components/CategoriesPage';
import ProductsPage from '../components/ProductsPage';

// ============================================================================
// 1. MAIN DASHBOARD LAYOUT COMPONENT
// ============================================================================
export default function AdminDashboard() {
  // State to track which page is currently active
  const [activePage, setActivePage] = useState('Add Product');
  
  // State to toggle the "Products" dropdown menu in sidebar
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(true);

  // Sidebar menu items
  const managementLinks = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'Orders', icon: ShoppingCart },
    { name: 'Products', icon: Box }, // Products has a submenu
    { name: 'Customers', icon: Users },
    { name: 'Reviews', icon: Star },
    { name: 'Coupons', icon: Tag },
    { name: 'Reports', icon: BarChart2 },
  ];

  const settingsLinks = [
    { name: 'Settings', icon: Settings },
    { name: 'Shipping', icon: Truck },
    { name: 'Payments', icon: CreditCard },
    { name: 'Notifications', icon: Bell },
  ];

  // Function to render the correct component based on activePage state
  const renderActivePage = () => {
    switch (activePage) {
      case 'Add Product':
        return <AddProduct />;
      case 'Dashboard':
        return <DashboardHome />;   CategoriesPage
      case 'Orders':
        return <OrdersPage />;
        case 'Orders':
        return <OrdersPage />;
        case 'Categories':
        return <CategoriesPage />;
      case 'All Products':
        return <ProductsPage />;
      // Add more cases here as you build new components...
      default:
        return <PlaceholderPage pageName={activePage} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f4f5f7] font-sans overflow-hidden text-sm text-gray-800">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-[#0a0a0a] text-white flex flex-col h-full overflow-y-auto shrink-0 transition-all">
        {/* Logo */}
        <div className="px-6 py-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-white flex items-center justify-center rounded">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2"><path d="M2 2L12 22L22 2H16L12 12L8 2H2Z" fill="black" /></svg>
          </div>
          <span className="text-xl font-bold tracking-wide">Viazo</span>
        </div>

        {/* Menu Links */}
        <div className="px-4 pb-6 flex-1">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">Management</p>
          <ul className="flex flex-col gap-1 mb-8">
            {managementLinks.map((link, idx) => (
              <li key={idx}>
                {link.name === 'Products' ? (
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => setIsProductsMenuOpen(!isProductsMenuOpen)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-white hover:bg-gray-800 transition-colors ${activePage.includes('Product') ? 'bg-gray-800' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <link.icon size={18} className="text-gray-400" />
                        <span className="font-medium">{link.name}</span>
                      </div>
                      <ChevronUpIcon size={16} className={`text-gray-500 transition-transform ${isProductsMenuOpen ? '' : 'rotate-180'}`} />
                    </button>
                    
                    {/* Submenu for Products */}
                    {isProductsMenuOpen && (
                      <div className="pl-11 pr-3 flex flex-col gap-1">
                        <button onClick={() => setActivePage('All Products')} className={`py-2 text-left transition-colors ${activePage === 'All Products' ? 'text-white font-medium' : 'text-gray-400 hover:text-white'}`}>All Products</button>
                        <button onClick={() => setActivePage('Add Product')} className={`py-2 text-left rounded-lg transition-colors ${activePage === 'Add Product' ? 'text-white bg-white/10 px-3 font-medium' : 'text-gray-400 hover:text-white'}`}>Add Product</button>
                        <button onClick={() => setActivePage('Categories')} className={`py-2 text-left transition-colors ${activePage === 'Categories' ? 'text-white font-medium' : 'text-gray-400 hover:text-white'}`}>Categories</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button 
                    onClick={() => setActivePage(link.name)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activePage === link.name ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                  >
                    <link.icon size={18} className={activePage === link.name ? 'text-white' : 'text-gray-400'} />
                    <span className="font-medium">{link.name}</span>
                  </button>
                )}
              </li>
            ))}
          </ul>

          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 px-2">Store Settings</p>
          <ul className="flex flex-col gap-1">
            {settingsLinks.map((link, idx) => (
              <li key={idx}>
                <button 
                  onClick={() => setActivePage(link.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activePage === link.name ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
                >
                  <link.icon size={18} />
                  <span className="font-medium">{link.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4 w-full max-w-md">
            <Menu size={20} className="text-gray-500 cursor-pointer" />
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search anything..." className="w-full bg-gray-100 border-transparent focus:border-gray-300 focus:bg-white rounded-lg py-2 pl-10 pr-12 text-sm outline-none transition-all" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative"><Bell size={20} className="text-gray-600" /><span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white">5</span></button>
            <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-xs">A</div>
              <div className="hidden sm:block"><p className="text-sm font-bold leading-tight">Admin</p><p className="text-[10px] text-gray-500">Super Admin</p></div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content Rendered Here */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {renderActivePage()}
        </main>

      </div>
    </div>
  );
}

// ============================================================================
// 2. SEPARATED COMPONENTS (These can be moved to separate files later)
// ============================================================================

// Component 1: Add Product Form (Your original code extracted)


// Component 2: Dummy Page for "Dashboard"
function DashboardHome() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Overview</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"><p className="text-gray-500">Total Sales</p><h2 className="text-3xl font-bold">₹1,24,500</h2></div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"><p className="text-gray-500">Total Orders</p><h2 className="text-3xl font-bold">142</h2></div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm"><p className="text-gray-500">Active Products</p><h2 className="text-3xl font-bold">48</h2></div>
      </div>
    </div>
  );
}

// Component 3: Dummy Page for "Orders"
function OrdersPage() {
  return <div><h1 className="text-2xl font-bold text-gray-900">Orders List</h1><p>Orders table will go here.</p></div>;
}

// Component 4: Dummy Page for "All Products"
function AllProductsPage() {
  return <div><h1 className="text-2xl font-bold text-gray-900">All Products</h1><p>Products table will go here.</p></div>;
}

// Component 5: Fallback Page for empty routes
function PlaceholderPage({ pageName }) {
  return <div><h1 className="text-2xl font-bold text-gray-900">{pageName}</h1><p>This page is under construction.</p></div>;
}

// Helper Icons
function ChevronUpIcon(props) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
}