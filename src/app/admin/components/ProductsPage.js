'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Plus, Pencil, Trash2, Loader2, Search, Filter, Image as ImageIcon, ChevronLeft, ChevronRight, X
} from 'lucide-react';

export default function ProductsPage() {
  // --- STATE MANAGEMENT ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchInput, setSearchInput] = useState(''); // For typing delay

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState(null);

  // Fake Token (Replace with your actual auth token logic)
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicm9sZSI6InN1cGVyX2FkbWluIiwiZXhwIjoxNzgwMjIzMDI1fQ.XMSzOp3oLfYkzU_OpyUBI69q44Ah6YsIelORyJHcWOI";

  // --- FETCH CATEGORIES FOR FILTER DROPDOWN ---
  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/admin/categories?page=1&limit=50`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const result = await response.json();
        let fetchedArray = [];
        if (Array.isArray(result)) fetchedArray = result;
        else if (result?.data?.data) fetchedArray = result.data.data;
        else if (result?.categories) fetchedArray = result.categories;
        else if (result?.data) fetchedArray = result.data;
        
        setCategories(fetchedArray);
      }
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  // --- FETCH PRODUCTS (GET with Query Params) ---
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      // Build dynamic URL based on filters
      const params = new URLSearchParams({
        page: page,
        limit: limit,
      });
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('categoryId', selectedCategory);

      const response = await fetch(`/api/admin/products?${params.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const result = await response.json();
        
        // Safe Array Extraction
        let fetchedArray = [];
        if (Array.isArray(result)) fetchedArray = result;
        else if (result?.data?.data) fetchedArray = result.data.data;
        else if (result?.products) fetchedArray = result.products;
        else if (result?.data) fetchedArray = result.data;

        setProducts(fetchedArray); 
        setTotalPages(result?.meta?.totalPages || result?.data?.meta?.totalPages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Run on mount and when filters/page change
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, searchQuery, selectedCategory]);

  // Handle Search Typing (Simple Debounce)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  // --- DELETE PRODUCT ---
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchProducts(); // Refresh list
      } else {
        alert('Failed to delete product.');
      }
    } catch (error) {
      console.error('Delete error', error);
    }
  };

  // --- EDIT PRODUCT HANDLERS ---
  const openEditModal = (product) => {
    // Populate form with existing data
    setEditForm({
      id: product.id || product._id,
      name: product.name || '',
      shortDescription: product.shortDescription || '',
      price: product.price || '',
      discountPrice: product.discountPrice || '',
      categoryId: product.categoryId || '',
      images: product.images || [],
      colors: product.colors?.join(', ') || '', // Convert array to comma-separated string for easy editing
      sizes: product.sizes?.join(', ') || ''
    });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Convert comma-separated strings back to arrays
    const payload = {
      name: editForm.name,
      shortDescription: editForm.shortDescription,
      price: Number(editForm.price),
      discountPrice: editForm.discountPrice ? Number(editForm.discountPrice) : null,
      categoryId: Number(editForm.categoryId),
      images: editForm.images,
      colors: editForm.colors.split(',').map(c => c.trim()).filter(Boolean),
      sizes: editForm.sizes.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      const response = await fetch(`/api/admin/products/${editForm.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setIsEditModalOpen(false);
        fetchProducts(); // Refresh list
      } else {
        const errorData = await response.json();
        alert(`Failed to update: ${errorData.message || 'Error'}`);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('An error occurred while updating.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f4f5f7]">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs text-gray-500 mb-1">
            Dashboard &gt; <span className="text-black font-semibold">Products</span>
          </p>
          <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
        </div>
        {/* Is button par click karne se aap apne AddProduct component ko render karwa sakte hain */}
       
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
        
        {/* Search & Filters */}
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <div className="relative w-full sm:max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..." 
              className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:border-black transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={16} className="text-gray-400" />
            <select 
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-auto border border-gray-300 rounded-lg py-2 px-3 text-sm outline-none focus:border-black bg-white"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id || cat._id} value={cat.id || cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Category ID</th>
                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-gray-500">
                    <Loader2 size={24} className="mx-auto animate-spin mb-2" />
                    Loading products...
                  </td>
                </tr>
              ) : (!Array.isArray(products) || products.length === 0) ? (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-gray-500">No products found.</td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod.id || prod._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center relative shrink-0">
                          {prod.images && prod.images.length > 0 ? (
                            <Image src={prod.images[0]} alt={prod.name} fill className="object-cover" />
                          ) : (
                            <ImageIcon size={16} className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{prod.name}</p>
                          <p className="text-xs text-gray-500">{prod.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-gray-600">{prod.categoryId}</td>
                    <td className="py-3 px-6">
                      <span className="font-bold text-gray-900">₹{prod.price}</span>
                      {prod.discountPrice && <span className="text-xs text-green-600 ml-2">(₹{prod.discountPrice})</span>}
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(prod)} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all" title="Edit">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(prod.id || prod._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-white">
          <p className="text-xs text-gray-500">Page {page} of {totalPages}</p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* EDIT PRODUCT MODAL                         */}
      {/* ========================================== */}
      {isEditModalOpen && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-gray-900">Edit Product</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Product Name</label>
                  <input type="text" name="name" value={editForm.name} onChange={handleEditChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-black outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Category ID</label>
                  <input type="number" name="categoryId" value={editForm.categoryId} onChange={handleEditChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-black outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Short Description</label>
                <textarea name="shortDescription" value={editForm.shortDescription} onChange={handleEditChange} rows="2" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-black outline-none resize-none"></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Price</label>
                  <input type="number" name="price" value={editForm.price} onChange={handleEditChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-black outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Discount Price</label>
                  <input type="number" name="discountPrice" value={editForm.discountPrice} onChange={handleEditChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-black outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Colors (Comma separated)</label>
                  <input type="text" name="colors" value={editForm.colors} onChange={handleEditChange} placeholder="black, white, grey" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-black outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Sizes (Comma separated)</label>
                  <input type="text" name="sizes" value={editForm.sizes} onChange={handleEditChange} placeholder="7, 8, 9, 10" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-black outline-none" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 mt-2 border-t border-gray-100">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} className="px-5 py-2 text-sm font-bold bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center gap-2">
                  {isSaving && <Loader2 size={14} className="animate-spin" />}
                  {isSaving ? 'Updating...' : 'Update Product'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}