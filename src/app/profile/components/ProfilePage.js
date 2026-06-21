'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  User, Package, MapPin, LogOut, 
  Edit2, Plus, ChevronRight, X
} from 'lucide-react';

const sidebarLinks = [
  { name: 'My Profile', icon: User },
  { name: 'My Orders', icon: Package },
  { name: 'My Addresses', icon: MapPin },
  { name: 'Logout', icon: LogOut },
];

export default function ProfilePage() {
  const router = useRouter();
  const [token, setToken] = useState('');
  
  // UI States
  const [activeTab, setActiveTab] = useState('My Profile'); // Controls which section is visible
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  
  // Data States
  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: '', phone: '' });
  const [addresses, setAddresses] = useState([]);
  const [addressForm, setAddressForm] = useState({ id: null, label: 'Home', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false });
  const [orders, setOrders] = useState([]);

  const API_BASE = '/api/user';

  // --- 1. INITIALIZE & FETCH DATA ---
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      console.log("xxxxx",storedToken);
      setToken(storedToken);
    } else {
      // If no token is found, redirect to login page
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (!token) return;

    const fetchAllData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // Fetch Profile
        const profileRes = await fetch(`${API_BASE}/profile`, { headers });
        const profileData = await profileRes.json();
        if (profileData.success) {
          setProfile(profileData.data);
          setProfileForm({ name: profileData.data.name, phone: profileData.data.phone });
        }

        // Fetch Addresses
        const addressRes = await fetch(`${API_BASE}/addresses`, { headers });
        const addressData = await addressRes.json();
        setAddresses(addressData.data || addressData || []);

        // Fetch Orders
        const ordersRes = await fetch(`${API_BASE}/orders?page=1&limit=10`, { headers });
        const ordersData = await ordersRes.json();
        
        let fetchedOrders = [];
        if (Array.isArray(ordersData.data)) {
          fetchedOrders = ordersData.data;
        } else if (ordersData.data && Array.isArray(ordersData.data.orders)) {
          fetchedOrders = ordersData.data.orders;
        } else if (Array.isArray(ordersData)) {
          fetchedOrders = ordersData;
        }
        setOrders(fetchedOrders);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [token]);

  // --- 2. PROFILE ACTIONS ---
  const handleProfileUpdate = async () => {
    try {
      const res = await fetch(`${API_BASE}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileForm)
      });
      
      if (res.ok) {
        setProfile({ ...profile, ...profileForm });
        setIsEditingProfile(false);
      }
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  // --- 3. ADDRESS ACTIONS ---
  const openAddressModal = (address = null) => {
    if (address) {
      setAddressForm(address);
    } else {
      setAddressForm({ id: null, label: 'Home', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false });
    }
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const isEditing = !!addressForm.id;
    const url = isEditing ? `${API_BASE}/addresses/${addressForm.id}` : `${API_BASE}/addresses`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(addressForm)
      });
      
      if (res.ok) {
        const updatedRes = await fetch(`${API_BASE}/addresses`, { headers: { 'Authorization': `Bearer ${token}` } });
        const updatedData = await updatedRes.json();
        setAddresses(updatedData.data || updatedData || []);
        setIsAddressModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to save address", error);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch(`${API_BASE}/addresses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setAddresses(addresses.filter(addr => addr.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete address", error);
    }
  };

  // --- 4. LOGOUT ACTION ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-sans">Loading Profile...</div>;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-black pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <p className="text-[11px] font-semibold tracking-widest text-gray-500 uppercase mb-4">
            HOME / MY ACCOUNT
          </p>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">{activeTab}</h1>
          <p className="text-sm text-gray-500 mt-2">Manage your personal information and account settings</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Sidebar Navigation */}
          <div className="w-full lg:w-64 flex-shrink-0 bg-white border border-gray-200">
            <ul className="flex flex-col">
              {sidebarLinks.map((link, idx) => {
                const Icon = link.icon;
                const isActive = activeTab === link.name;

                return (
                  <li key={idx} className={`${idx !== sidebarLinks.length - 1 ? 'border-b border-gray-100' : ''}`}>
                    <button 
                      onClick={() => {
                        if (link.name === 'Logout') {
                          handleLogout();
                        } else {
                          setActiveTab(link.name);
                        }
                      }}
                      className={`w-full flex items-center text-left gap-4 px-6 py-4 text-sm font-semibold transition-colors ${
                        isActive ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-black'
                      }`}
                    >
                      <Icon size={18} strokeWidth={isActive ? 2.5 : 1.5} />
                      {link.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right Main Content Area (Conditionally Rendered based on Active Tab) */}
          <div className="flex-1 w-full flex flex-col gap-8">
            
            {/* 1. Profile Information Box */}
            {activeTab === 'My Profile' && (
              <div className="bg-white border border-gray-200 p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-base font-bold uppercase tracking-wide">PROFILE INFORMATION</h2>
                  {!isEditingProfile ? (
                    <button onClick={() => setIsEditingProfile(true)} className="text-[11px] font-bold uppercase flex items-center gap-2 hover:text-gray-500">
                      <Edit2 size={14} /> EDIT PROFILE
                    </button>
                  ) : (
                    <div className="flex gap-4">
                      <button onClick={() => setIsEditingProfile(false)} className="text-[11px] font-bold uppercase text-gray-500 hover:text-black">CANCEL</button>
                      <button onClick={handleProfileUpdate} className="text-[11px] font-bold uppercase bg-black text-white px-4 py-2 hover:bg-gray-800">SAVE</button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-300">
                      <User size={64} className="text-white" strokeWidth={1.5} />
                    </div>
                
                  </div>

                  {/* Info Details Section */}
                  <div className="flex-1 w-full grid grid-cols-1 gap-6">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                      <div className="w-full">
                        <p className="text-[11px] text-gray-500 mb-1">Full Name</p>
                        {isEditingProfile ? (
                          <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({...profileForm, name: e.target.value})} className="w-full border p-2 text-sm outline-none mt-1" />
                        ) : (
                          <p className="text-sm font-semibold text-black">{profile?.name || '-'}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                      <div className="w-full">
                        <p className="text-[11px] text-gray-500 mb-1">Email Address</p>
                        <p className="text-sm font-semibold text-gray-400">{profile?.email || '-'} (Cannot edit)</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                      <div className="w-full">
                        <p className="text-[11px] text-gray-500 mb-1">Phone Number</p>
                        {isEditingProfile ? (
                          <input type="text" value={profileForm.phone} onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} className="w-full border p-2 text-sm outline-none mt-1" />
                        ) : (
                          <p className="text-sm font-semibold text-black">+91 {profile?.phone || '-'}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                      <div className="w-full">
                        <p className="text-[11px] text-gray-500 mb-1">Member Since</p>
                        <p className="text-sm font-semibold text-black">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Address Book Box */}
            {activeTab === 'My Addresses' && (
              <div className="bg-white border border-gray-200 p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-base font-bold uppercase tracking-wide">ADDRESS BOOK</h2>
                  <button onClick={() => openAddressModal()} className="border border-gray-300 text-black text-[10px] font-bold uppercase tracking-widest px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition-colors">
                    <Plus size={14} strokeWidth={2} /> ADD NEW ADDRESS
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.length === 0 ? (
                    <p className="text-sm text-gray-500 col-span-2">No addresses found.</p>
                  ) : (
                    addresses.map((address) => (
                      <div key={address.id} className="border border-gray-200 p-6 flex flex-col justify-between">
                        <div>
                          <span className="bg-black text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1 mb-4 inline-block">{address.label || 'ADDRESS'}</span>
                          <h3 className="text-sm font-bold text-black mb-2">{profile?.name}</h3>
                          <p className="text-xs text-gray-500 leading-relaxed mb-4 max-w-xs">
                            {address.line1}, <br />
                            {address.line2 && <>{address.line2},<br /></>}
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                          <p className="text-xs font-semibold">Phone: +91 {profile?.phone}</p>
                        </div>
                        <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-100">
                          <button onClick={() => openAddressModal(address)} className="text-[11px] font-bold tracking-widest uppercase hover:text-gray-500">EDIT</button>
                          <button onClick={() => handleDeleteAddress(address.id)} className="text-[11px] font-bold tracking-widest uppercase hover:text-red-500">DELETE</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 3. Order History Box */}
            {activeTab === 'My Orders' && (
              <div className="bg-white border border-gray-200 p-0 overflow-hidden">
                <div className="flex justify-between items-center p-8 border-b border-gray-100">
                  <h2 className="text-base font-bold uppercase tracking-wide">ORDER HISTORY</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-[#f9f9f9] text-[10px] font-bold uppercase tracking-widest text-gray-500 border-b border-gray-200">
                        <th className="py-4 px-8 font-semibold">ORDER ID</th>
                        <th className="py-4 px-8 font-semibold">DATE</th>
                        <th className="py-4 px-8 font-semibold">TOTAL</th>
                        <th className="py-4 px-8 font-semibold">STATUS</th>
                        <th className="py-4 px-8 font-semibold text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {!Array.isArray(orders) || orders.length === 0 ? (
                        <tr><td colSpan="5" className="py-6 px-8 text-center text-sm text-gray-500">No orders found.</td></tr>
                      ) : (
                        orders.map((order, idx) => (
                          <tr key={order.id || idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-6 px-8 font-semibold">#{order.id}</td>
                            <td className="py-6 px-8 text-gray-500">{new Date(order.createdAt || order.date).toLocaleDateString()}</td>
                            <td className="py-6 px-8 font-bold text-xs">₹{order.total || order.amount}</td>
                            <td className="py-6 px-8">
                              <span className={`text-[9px] font-bold uppercase px-2 py-1 tracking-wider ${
                                (order.status || '').toUpperCase() === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {order.status || 'PROCESSING'}
                              </span>
                            </td>
                            <td className="py-6 px-8 text-right">
                              <Link href={`/orders/${order.id}`} className="text-[11px] font-bold uppercase tracking-widest flex items-center justify-end hover:text-gray-500 transition-colors">
                                VIEW ORDER <ChevronRight size={14} className="ml-1" strokeWidth={2} />
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Address Form Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 max-w-lg w-full relative">
            <button onClick={() => setIsAddressModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-black">
              <X size={20} />
            </button>
            <h2 className="text-lg font-black uppercase tracking-tight mb-6">{addressForm.id ? 'Edit Address' : 'Add New Address'}</h2>
            
            <form onSubmit={handleSaveAddress} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Label (e.g., Home, Office)</label>
                <input type="text" required value={addressForm.label} onChange={e => setAddressForm({...addressForm, label: e.target.value})} className="w-full border border-gray-300 p-3 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Line 1</label>
                <input type="text" required value={addressForm.line1} onChange={e => setAddressForm({...addressForm, line1: e.target.value})} className="w-full border border-gray-300 p-3 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Line 2</label>
                <input type="text" value={addressForm.line2} onChange={e => setAddressForm({...addressForm, line2: e.target.value})} className="w-full border border-gray-300 p-3 text-sm outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">City</label>
                  <input type="text" required value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="w-full border border-gray-300 p-3 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">State</label>
                  <input type="text" required value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} className="w-full border border-gray-300 p-3 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Pincode</label>
                <input type="text" required value={addressForm.pincode} onChange={e => setAddressForm({...addressForm, pincode: e.target.value})} className="w-full border border-gray-300 p-3 text-sm outline-none" />
              </div>
              
              <button type="submit" className="w-full bg-black text-white text-xs font-bold uppercase tracking-widest py-4 mt-4 hover:bg-gray-800 transition-colors">
                SAVE ADDRESS
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}