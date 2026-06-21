'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { 
  Plus, X, Pencil, Trash2, Loader2, Search, Image as ImageIcon, ChevronLeft, ChevronRight
} from 'lucide-react';

export default function CategoriesPage() {
  // --- STATE MANAGEMENT ---
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', imageUrl: '' });
  const [localImage, setLocalImage] = useState(null); // { file, preview }
  const fileInputRef = useRef(null);

  // --- FETCH CATEGORIES (GET) ---
// --- FETCH CATEGORIES (GET) ---
// --- FETCH CATEGORIES (GET) ---
  const fetchCategories = async (currentPage) => {
    setIsLoading(true);
    try {
      // Aapka JWT token (Isko aap localStorage ya cookies se bhi extract kar sakte hain)
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwicm9sZSI6InN1cGVyX2FkbWluIiwiZXhwIjoxNzgwMjIzMDI1fQ.XMSzOp3oLfYkzU_OpyUBI69q44Ah6YsIelORyJHcWOI";

      const response = await fetch(`/api/admin/categories?page=${currentPage}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        
        // Exact Response Format Mapping:
        // result -> data -> data (Yeh main categories ka array hai)
        // result -> data -> meta -> totalPages (Yeh pagination count hai)
        if (result.success && result.data) {
          setCategories(result.data.data || []); 
          setTotalPages(result.data.meta?.totalPages || 1);
        }
      } else {
        console.error('Server Error Status:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch categories', error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchCategories(page);
  }, [page]);

  // --- MODAL HANDLERS ---
  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ name: '', imageUrl: '' });
    setLocalImage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setIsEditing(true);
    setEditingId(category.id);
    setFormData({ name: category.name, imageUrl: category.imageUrl });
    setLocalImage(null); // Reset local preview
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setLocalImage(null);
  };

  // --- IMAGE HANDLERS ---
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLocalImage({
      file,
      preview: URL.createObjectURL(file)
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- SAVE HANDLER (POST / PUT & CLOUDINARY) ---
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name) return alert('Category name is required');
    
    setIsSaving(true);
    let finalImageUrl = formData.imageUrl;

    try {
      // 1. Upload new image to Cloudinary if selected
      if (localImage?.file) {
        const uploadData = new FormData();
        uploadData.append('file', localImage.file);
        uploadData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: uploadData }
        );
        const cloudinaryData = await uploadRes.json();
        if (cloudinaryData.secure_url) {
          finalImageUrl = cloudinaryData.secure_url;
        } else {
          throw new Error('Image upload failed');
        }
      }

      // 2. Prepare payload
      const payload = {
        name: formData.name,
        imageUrl: finalImageUrl
      };

      // 3. Send to Backend (POST or PUT)
      const method = isEditing ? 'PUT' : 'POST';
      const endpoint = isEditing 
        ? `/api/admin/categories/${editingId}` 
        : `/api/admin/categories`;

      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        closeModal();
        fetchCategories(page); // Refresh list
      } else {
        const err = await response.json();
        alert(`Failed to save: ${err.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Save error', error);
      alert('An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- DELETE HANDLER (DELETE) ---
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchCategories(page); // Refresh list
      } else {
        alert('Failed to delete category.');
      }
    } catch (error) {
      console.error('Delete error', error);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#f4f5f7]">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs text-gray-500 mb-1">
            Dashboard &gt; <span className="text-black font-semibold">Categories</span>
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your product categories</p>
        </div>
        <button 
          onClick={openAddModal}
          className="px-5 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 w-fit"
        >
          <Plus size={18} /> Add Category
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
        
        {/* Search & Filters */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search categories..." 
              className="w-full border border-gray-300 rounded-lg py-2 pl-10 pr-4 text-sm outline-none focus:border-black transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Image</th>
                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider w-full">Name</th>
                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="3" className="text-center py-12 text-gray-500">
                    <Loader2 size={24} className="mx-auto animate-spin mb-2" />
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-12 text-gray-500">No categories found.</td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="py-3 px-6">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center relative">
                        {cat.imageUrl ? (
                          <Image src={cat.imageUrl} alt={cat.name} fill className="object-cover" />
                        ) : (
                          <ImageIcon size={20} className="text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-6 font-semibold text-gray-900">{cat.name}</td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(cat)}
                          className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
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
      {/* ADD/EDIT CATEGORY MODAL                    */}
      {/* ========================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{isEditing ? 'Edit Category' : 'Add Category'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-900 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 flex flex-col gap-5">
              
              {/* Image Upload Area */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Category Image</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleImageSelect} 
                />
                
                <div className="flex items-center gap-4">
                  {/* Preview Box */}
                  <div className="w-20 h-20 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center relative overflow-hidden shrink-0">
                    {localImage?.preview ? (
                      <Image src={localImage.preview} alt="Preview" fill className="object-cover" />
                    ) : formData.imageUrl ? (
                      <Image src={formData.imageUrl} alt="Current" fill className="object-cover" />
                    ) : (
                      <ImageIcon size={24} className="text-gray-300" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-semibold px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full mb-1"
                    >
                      {localImage || formData.imageUrl ? 'Change Image' : 'Select Image'}
                    </button>
                    <p className="text-[10px] text-gray-400">Upload high-res square image (JPG, PNG)</p>
                  </div>
                </div>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Category Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sneakers" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:border-black outline-none" 
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 mt-2 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 text-sm font-bold bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center gap-2"
                >
                  {isSaving && <Loader2 size={14} className="animate-spin" />}
                  {isSaving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}