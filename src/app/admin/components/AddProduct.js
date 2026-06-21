import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, X, Bold, Italic, Underline, List, Link as LinkIcon, Loader2
} from 'lucide-react';
import Image from 'next/image';

export default function AddProduct() {
  const fileInputRef = useRef(null);

  // --- FORM STATE (Empty defaults as requested) ---
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    shortDescription: '',
    fullDescription: '',
    price: '',
    discountPrice: '',
    categoryId: '', 
  });

  const [categories, setCategories] = useState([]);
  const [localImages, setLocalImages] = useState([]); // Array of { file, preview }
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  // Inputs for dynamic Size and Color additions
  const [sizeInput, setSizeInput] = useState('');
  const [colorInput, setColorInput] = useState('#000000'); // Default color picker value

  // --- LOADING STATES ---
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  // --- FETCH CATEGORIES ON MOUNT ---
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Optional: Get token if required by your API
        // const token = localStorage.getItem('token');
        const response = await fetch('/api/admin/categories?page=1&limit=50', {
          // headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const result = await response.json();
          // Extract array based on the API format discussed earlier
          let fetchedArray = [];
          if (Array.isArray(result)) fetchedArray = result;
          else if (result?.data?.data) fetchedArray = result.data.data;
          else if (result?.categories) fetchedArray = result.categories;
          else if (result?.data) fetchedArray = result.data;
          
          setCategories(fetchedArray);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Size Handlers
  const handleSizeKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission
      if (sizeInput.trim() && !sizes.includes(sizeInput.trim())) {
        setSizes([...sizes, sizeInput.trim()]);
      }
      setSizeInput('');
    }
  };

  const removeSize = (sizeToRemove) => {
    setSizes((prev) => prev.filter((size) => size !== sizeToRemove));
  };

  // Color Handlers
  const handleAddColor = () => {
    if (!colors.includes(colorInput)) {
      setColors([...colors, colorInput]);
    }
  };

  const removeColor = (colorToRemove) => {
    setColors((prev) => prev.filter((c) => c !== colorToRemove));
  };

  // Image Handlers
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (localImages.length + files.length > 4) {
      alert('You can only upload up to 4 images.');
      return;
    }

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setLocalImages(prev => [...prev, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (indexToRemove) => {
    setLocalImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // Main Save Handler
  const handleSaveProduct = async () => {
    if (!formData.name || !formData.categoryId || !formData.price) {
      alert('Please fill the required fields: Name, Category, and Price.');
      return;
    }

    setIsSaving(true);
    setUploadProgress('Uploading images...');
    const uploadedUrls = [];

    try {
      // Step 1: Upload images to Cloudinary
      for (let i = 0; i < localImages.length; i++) {
        const item = localImages[i];
        const uploadData = new FormData();
        uploadData.append('file', item.file);
        uploadData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: uploadData }
        );

        const data = await response.json();
        if (data.secure_url) {
          uploadedUrls.push(data.secure_url);
        } else {
          throw new Error('Cloudinary upload failed for an image');
        }
      }

      // Step 2: Prepare payload
      setUploadProgress('Saving product details...');
      
      const payload = {
        name: formData.name,
        sku: formData.sku,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        price: Number(formData.price),
        discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
        categoryId: Number(formData.categoryId),
        images: uploadedUrls,
        colors: colors,
        sizes: sizes,
      };

      // Step 3: Save to Backend
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Product saved successfully!');
        // Optional: Reset form
        // setFormData({ name: '', sku: '', shortDescription: '', fullDescription: '', price: '', discountPrice: '', categoryId: '' });
        // setLocalImages([]); setColors([]); setSizes([]);
      } else {
        const errorData = await response.json();
        alert(`Failed to save product: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Submission Error:', error);
      alert('An error occurred during submission.');
    } finally {
      setIsSaving(false);
      setUploadProgress('');
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-xs text-gray-500 mb-1">
            Dashboard &gt; Products &gt; <span className="text-black font-semibold">Add Product</span>
          </p>
          <h1 className="text-2xl font-bold text-gray-900">Add Product</h1>
          <p className="text-sm text-gray-500 mt-1">Add a new product to your store</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 border border-gray-300 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleSaveProduct}
            disabled={isSaving}
            className="px-5 py-2.5 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center gap-2"
          >
            {isSaving && <Loader2 size={16} className="animate-spin" />}
            {isSaving ? uploadProgress || 'Processing...' : 'Save Product'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- LEFT COLUMN --- */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Images */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-1">
              <h2 className="font-bold text-gray-900">Product Images</h2>
              <span className="text-xs font-semibold text-gray-500">{localImages.length} / 4</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">Upload up to 4 images.</p>
            
            <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageSelect} />

            <div className="flex flex-wrap gap-4">
              {localImages.map((item, index) => (
                <div key={index} className="relative w-24 h-24 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                  <Image src={item.preview} alt={`Preview ${index}`} fill className="object-cover" />
                  <button onClick={() => removeImage(index)} disabled={isSaving} className="absolute top-1 right-1 w-5 h-5 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 shadow-sm z-10 disabled:opacity-50">
                    <X size={12} />
                  </button>
                </div>
              ))}
              {localImages.length < 4 && (
                <button onClick={() => fileInputRef.current?.click()} disabled={isSaving} className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:border-black hover:text-black transition-colors bg-gray-50 disabled:opacity-50">
                  <Plus size={20} className="mb-1" />
                  <span className="text-xs font-medium">Add Image</span>
                </button>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Product Name <span className="text-red-500">*</span></label>
                <input name="name" value={formData.name} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-black outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">SKU</label>
                <input name="sku" value={formData.sku} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-black outline-none" />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Short Description</label>
              <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} rows="2" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-black outline-none resize-none"></textarea>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Full Description</label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50 text-gray-600">
                  <button className="p-1 hover:bg-gray-200 rounded"><Bold size={16} /></button>
                  <button className="p-1 hover:bg-gray-200 rounded"><Italic size={16} /></button>
                  <button className="p-1 hover:bg-gray-200 rounded"><Underline size={16} /></button>
                  <div className="w-px h-4 bg-gray-300 mx-1"></div>
                  <button className="p-1 hover:bg-gray-200 rounded"><List size={16} /></button>
                  <div className="w-px h-4 bg-gray-300 mx-1"></div>
                  <button className="p-1 hover:bg-gray-200 rounded"><LinkIcon size={16} /></button>
                </div>
                <textarea name="fullDescription" value={formData.fullDescription} onChange={handleChange} rows="6" className="w-full px-3 py-3 text-sm focus:outline-none resize-none leading-relaxed"></textarea>
              </div>
            </div>

            <div className="mb-2 w-full sm:w-1/2 pr-0 sm:pr-2">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Category <span className="text-red-500">*</span></label>
              <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-black outline-none bg-white">
                <option value="" disabled>Select a Category</option>
                {categories.map((cat) => (
                  <option key={cat.id || cat._id} value={cat.id || cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="flex flex-col gap-6">
          
          {/* Pricing */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4">Pricing</h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Price (₹) <span className="text-red-500">*</span></label>
                <input name="price" value={formData.price} onChange={handleChange} type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-black outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Discount Price (₹)</label>
                <input name="discountPrice" value={formData.discountPrice} onChange={handleChange} type="number" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-black outline-none" />
              </div>
            </div>
          </div>

          {/* Product Options (Colors & Sizes) */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4">Product Options</h2>
            
            {/* Color Input */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-700 mb-2">Select Color</label>
              <div className="flex items-center gap-3 mb-3">
                <input 
                  type="color" 
                  value={colorInput} 
                  onChange={(e) => setColorInput(e.target.value)} 
                  className="w-10 h-10 p-0 border-0 rounded cursor-pointer"
                />
                <button 
                  onClick={handleAddColor} 
                  className="bg-black text-white px-4 py-2 text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Add Color
                </button>
              </div>
              
              {/* Display Added Colors */}
              <div className="flex flex-wrap gap-3">
                {colors.map((color, index) => (
                  <div key={index} className="relative group">
                    <div className="w-8 h-8 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: color }}></div>
                    <button 
                      onClick={() => removeColor(color)}
                      className="absolute -top-2 -right-2 w-4 h-4 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
              {colors.length === 0 && <p className="text-[10px] text-gray-400">No colors added yet.</p>}
            </div>
            
            {/* Size Input */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Add Size</label>
              <input 
                type="text" 
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                onKeyDown={handleSizeKeyDown}
                placeholder="Type size and press Enter (e.g., 9)"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-black outline-none mb-3"
              />

              {/* Display Added Sizes */}
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <span key={size} className="flex items-center gap-1 bg-gray-100 border border-gray-200 px-2 py-1 rounded-md text-xs text-gray-700">
                    {size} 
                    <X onClick={() => removeSize(size)} size={12} className="text-gray-400 hover:text-black cursor-pointer"/>
                  </span>
                ))}
              </div>
              {sizes.length === 0 && <p className="text-[10px] text-gray-400 mt-1">No sizes added yet.</p>}
            </div>
          </div>

        </div>
        
      </div>
    </>
  );
}