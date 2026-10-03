import { useState, useEffect } from 'react';
import { supabase } from '../data/supabaseClient';
import { categoryDetails } from '../data/categoryDetails';
import { uploadProductImage, uploadBrandImage, uploadMainCategoryImage, loadLocalImageOverrides, loadLocalBrandOverrides, loadLocalMainCategoryOverrides } from '../data/supabaseClient';
import { fetchAllPromotions, createPromotion, updatePromotion, deletePromotion, uploadPromotionFile } from '../data/supabaseClient';
import type { UploadResult, Promotion } from '../data/supabaseClient';
import { Lock, Upload, Check, LogOut, Loader2, Image, Award, Layers, Tag, Trash2, Plus, ToggleLeft, ToggleRight, X, FileText } from 'lucide-react';

const ADMIN_PASSWORD = 'BuildBase2025!';
const SESSION_KEY = 'admin-authed';

const MAIN_CATEGORIES = [
  'Building Materials',
  'Tools & Equipment',
  'Plumbing & Essentials',
  'Roofing & Cladding',
  'Flooring & Finishes',
  'Doors & Fittings',
  'Security',
  'Garden & Decoration',
];

const DEFAULT_BRANDS = [
  'INCGO',
  'MAMBA CEMENT',
  'LIN TANK',
  'MEDAL PAINT',
  'ECO-STAR PAINTS',
  'DURAM PAINT',
  'EUREKA',
  'ACADEMY BRUSHWARE',
  'POWAFIX',
  'PPC CEMENT',
  'AFRISASM CEMENT',
];

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authed, setAuthed] = useState<boolean>(false);
  const [tab, setTab] = useState<'products' | 'brands' | 'categories' | 'promotions'>('products');
  const [customImages, setCustomImages] = useState<Record<string, string>>({});
  const [brandImages, setBrandImages] = useState<Record<string, string>>({});
  const [mainCategoryImages, setMainCategoryImages] = useState<Record<string, string>>({});
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<Record<string, string>>({});

  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoForm, setPromoForm] = useState({ title: '', description: '', fileUrl: '' as string | null, fileType: 'image' as 'image' | 'pdf' });
  const [promoUploading, setPromoUploading] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [editingPromoId, setEditingPromoId] = useState<string | null>(null);

  useEffect(() => {
    setAuthed(sessionStorage.getItem(SESSION_KEY) === '1');
  }, []);

  useEffect(() => {
    if (authed) {
      loadCustomImages();
      loadBrandImages();
      loadMainCategoryImages();
      loadPromotions();
    }
  }, [authed]);

  async function loadCustomImages() {
    const localOverrides = loadLocalImageOverrides();
    try {
      const { data } = await Promise.race([
        supabase!.from('product_images').select('category_name, product_name, image_url'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000)),
      ]);
      const map: Record<string, string> = { ...localOverrides };
      if (data) {
        for (const row of data) {
          map[`${row.category_name}::${row.product_name}`] = row.image_url;
        }
      }
      setCustomImages(map);
    } catch {
      setCustomImages(localOverrides);
    }
  }

  async function loadMainCategoryImages() {
    const localOverrides = loadLocalMainCategoryOverrides();
    try {
      const { data } = await Promise.race([
        supabase!.from('product_images')
          .select('product_name, image_url')
          .eq('category_name', '__main_category__'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000)),
      ]);
      const map: Record<string, string> = { ...localOverrides };
      if (data) {
        for (const row of data) {
          map[row.product_name] = row.image_url;
        }
      }
      setMainCategoryImages(map);
    } catch {
      setMainCategoryImages(localOverrides);
    }
  }

  async function loadBrandImages() {
    const localOverrides = loadLocalBrandOverrides();
    try {
      const { data } = await Promise.race([
        supabase!.from('brand_images').select('brand_name, image_url'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000)),
      ]);
      const map: Record<string, string> = { ...localOverrides };
      if (data) {
        for (const row of data) {
          map[row.brand_name] = row.image_url;
        }
      }
      setBrandImages(map);
    } catch {
      setBrandImages(localOverrides);
    }
  }

  async function loadPromotions() {
    setPromoLoading(true);
    try {
      const data = await fetchAllPromotions();
      setPromotions(data);
    } catch {
      setPromotions([]);
    } finally {
      setPromoLoading(false);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      setAuthed(true);
    } else {
      setAuthError('Incorrect password. Please try again.');
    }
    setLoading(false);
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  }

  async function handleUpload(category: string, product: string, file: File) {
    const key = `${category}::${product}`;
    setUploadingKey(key);
    try {
      const result: UploadResult = await uploadProductImage(category, product, file);
      if (result.url) {
        setCustomImages((prev) => ({ ...prev, [key]: result.url! }));
        const msg = result.error
          ? `Saved locally only: ${result.error}`
          : 'Image updated!';
        setUploadMessage((prev) => ({ ...prev, [key]: msg }));
        setTimeout(() => setUploadMessage((prev) => { const n = { ...prev }; delete n[key]; return n; }), 5000);
      } else {
        setUploadMessage((prev) => ({ ...prev, [key]: 'Upload failed. Try again.' }));
      }
    } catch {
      setUploadMessage((prev) => ({ ...prev, [key]: 'Upload failed. Try again.' }));
    } finally {
      setUploadingKey(null);
    }
  }

  async function handleMainCategoryUpload(categoryName: string, file: File) {
    const key = `maincat::${categoryName}`;
    setUploadingKey(key);
    try {
      const result: UploadResult = await uploadMainCategoryImage(categoryName, file);
      if (result.url) {
        setMainCategoryImages((prev) => ({ ...prev, [categoryName]: result.url! }));
        const msg = result.error
          ? `Saved locally only: ${result.error}`
          : 'Image updated!';
        setUploadMessage((prev) => ({ ...prev, [key]: msg }));
        setTimeout(() => setUploadMessage((prev) => { const n = { ...prev }; delete n[key]; return n; }), 5000);
      } else {
        setUploadMessage((prev) => ({ ...prev, [key]: 'Upload failed. Try again.' }));
      }
    } catch {
      setUploadMessage((prev) => ({ ...prev, [key]: 'Upload failed. Try again.' }));
    } finally {
      setUploadingKey(null);
    }
  }

  async function handleBrandUpload(brandName: string, file: File) {
    const key = `brand::${brandName}`;
    setUploadingKey(key);
    try {
      const result: UploadResult = await uploadBrandImage(brandName, file);
      if (result.url) {
        setBrandImages((prev) => ({ ...prev, [brandName]: result.url! }));
        const msg = result.error
          ? `Saved locally only: ${result.error}`
          : 'Logo updated!';
        setUploadMessage((prev) => ({ ...prev, [key]: msg }));
        setTimeout(() => setUploadMessage((prev) => { const n = { ...prev }; delete n[key]; return n; }), 5000);
      } else {
        setUploadMessage((prev) => ({ ...prev, [key]: 'Upload failed. Try again.' }));
      }
    } catch {
      setUploadMessage((prev) => ({ ...prev, [key]: 'Upload failed. Try again.' }));
    } finally {
      setUploadingKey(null);
    }
  }

  async function handlePromoFileUpload(file: File) {
    setPromoUploading(true);
    setPromoError('');
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    try {
      const result = await uploadPromotionFile(file);
      if (result.url) {
        setPromoForm((prev) => ({ ...prev, fileUrl: result.url, fileType: isPdf ? 'pdf' : 'image' }));
        if (result.error) {
          setPromoError(`File saved locally only: ${result.error}`);
        }
      } else {
        setPromoError('File upload failed. Try again.');
      }
    } catch {
      setPromoError('File upload failed. Try again.');
    } finally {
      setPromoUploading(false);
    }
  }

  async function handlePromoSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');

    if (!promoForm.title.trim() || !promoForm.description.trim()) {
      setPromoError('Title and description are required.');
      return;
    }

    setPromoLoading(true);
    try {
      if (editingPromoId) {
        const ok = await updatePromotion(editingPromoId, {
          title: promoForm.title.trim(),
          description: promoForm.description.trim(),
          image_url: promoForm.fileUrl || null,
          file_type: promoForm.fileType,
        });
        if (!ok) {
          setPromoError('Failed to update promotion. Try again.');
        } else {
          setPromoSuccess('Promotion updated!');
          resetPromoForm();
          await loadPromotions();
        }
      } else {
        const maxOrder = promotions.length > 0
          ? Math.max(...promotions.map(p => p.display_order))
          : 0;
        const created = await createPromotion(
          promoForm.title.trim(),
          promoForm.description.trim(),
          promoForm.fileUrl || null,
          promoForm.fileType,
          maxOrder + 1
        );
        if (!created) {
          setPromoError('Failed to create promotion. Try again.');
        } else {
          setPromoSuccess('Promotion added!');
          resetPromoForm();
          await loadPromotions();
        }
      }
    } catch {
      setPromoError('Something went wrong. Try again.');
    } finally {
      setPromoLoading(false);
      setTimeout(() => { setPromoSuccess(''); setPromoError(''); }, 4000);
    }
  }

  function resetPromoForm() {
    setPromoForm({ title: '', description: '', fileUrl: null, fileType: 'image' });
    setEditingPromoId(null);
  }

  function handleEditPromo(promo: Promotion) {
    setPromoForm({
      title: promo.title,
      description: promo.description,
      fileUrl: promo.image_url,
      fileType: promo.file_type ?? 'image',
    });
    setEditingPromoId(promo.id);
    setPromoError('');
    setPromoSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleTogglePromo(promo: Promotion) {
    const ok = await updatePromotion(promo.id, { is_active: !promo.is_active });
    if (ok) {
      await loadPromotions();
    }
  }

  async function handleDeletePromo(promo: Promotion) {
    if (!confirm(`Delete "${promo.title}"? This cannot be undone.`)) return;
    const ok = await deletePromotion(promo.id);
    if (ok) {
      await loadPromotions();
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
              <Lock className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Admin Login</h1>
          <p className="text-gray-500 text-center mb-8 text-sm">Sign in to manage product images, brand logos, and promotions</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
              required
              autoFocus
            />
            {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>
          <a href="#" className="block text-center mt-6 text-sm text-gray-500 hover:text-orange-600 transition-colors">
            &larr; Back to website
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Image Manager</h1>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-gray-500 hover:text-orange-600 transition-colors">View site</a>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition-colors">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setTab('products')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${tab === 'products' ? 'bg-orange-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'}`}
          >
            <Image className="h-4 w-4" /> Product Images
          </button>
          <button
            onClick={() => setTab('brands')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${tab === 'brands' ? 'bg-orange-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'}`}
          >
            <Award className="h-4 w-4" /> Brand Logos
          </button>
          <button
            onClick={() => setTab('categories')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${tab === 'categories' ? 'bg-orange-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'}`}
          >
            <Layers className="h-4 w-4" /> Main Categories
          </button>
          <button
            onClick={() => setTab('promotions')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${tab === 'promotions' ? 'bg-orange-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'}`}
          >
            <Tag className="h-4 w-4" /> Promotions
          </button>
        </div>

        {tab === 'products' && (
          <>
            <p className="text-gray-600 mb-8">Upload a photo for any product. The new image will appear on the website immediately.</p>
            {Object.entries(categoryDetails).map(([category, products]) => (
              <div key={category} className="mb-10">
                <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">{category}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => {
                    const key = `${category}::${product.name}`;
                    const currentImage = customImages[key] ?? product.image;
                    const isUploading = uploadingKey === key;
                    return (
                      <div key={product.name} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                        <div className="h-40 overflow-hidden bg-gray-200 relative">
                          <img src={currentImage} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-900 text-sm mb-1">{product.name}</h3>
                          <p className="text-gray-500 text-xs mb-3 line-clamp-2">{product.description}</p>
                          <label className={`flex items-center justify-center gap-2 w-full border border-gray-200 rounded-lg py-2 text-sm font-medium cursor-pointer transition-all ${isUploading ? 'opacity-50 cursor-wait' : 'hover:border-orange-400 hover:text-orange-600'}`}>
                            {isUploading ? (
                              <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
                            ) : (
                              <><Upload className="h-4 w-4" /> Upload photo</>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={isUploading}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUpload(category, product.name, file);
                                e.target.value = '';
                              }}
                            />
                          </label>
                          {uploadMessage[key] && (
                            <p className={`text-xs mt-2 flex items-center gap-1 ${uploadMessage[key].includes('updated') ? 'text-green-600' : uploadMessage[key].includes('locally') ? 'text-amber-600' : 'text-red-500'}`}>
                              {uploadMessage[key].includes('updated') && <Check className="h-3 w-3" />}
                              {uploadMessage[key]}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}

        {tab === 'categories' && (
          <>
            <p className="text-gray-600 mb-8">Upload a photo for any main category card. The new image will appear on the website immediately.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {MAIN_CATEGORIES.map((catName) => {
                const key = `maincat::${catName}`;
                const currentImage = mainCategoryImages[catName];
                const isUploading = uploadingKey === key;
                return (
                  <div key={catName} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="h-40 overflow-hidden bg-gray-200 relative flex items-center justify-center">
                      {currentImage ? (
                        <img src={currentImage} alt={catName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-gray-400 text-sm">No custom image uploaded yet</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-sm mb-3">{catName}</h3>
                      <label className={`flex items-center justify-center gap-2 w-full border border-gray-200 rounded-lg py-2 text-sm font-medium cursor-pointer transition-all ${isUploading ? 'opacity-50 cursor-wait' : 'hover:border-orange-400 hover:text-orange-600'}`}>
                        {isUploading ? (
                          <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
                        ) : (
                          <><Upload className="h-4 w-4" /> Upload photo</>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isUploading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleMainCategoryUpload(catName, file);
                            e.target.value = '';
                          }}
                        />
                      </label>
                      {uploadMessage[key] && (
                        <p className={`text-xs mt-2 flex items-center gap-1 ${uploadMessage[key].includes('updated') ? 'text-green-600' : uploadMessage[key].includes('locally') ? 'text-amber-600' : 'text-red-500'}`}>
                          {uploadMessage[key].includes('updated') && <Check className="h-3 w-3" />}
                          {uploadMessage[key]}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === 'brands' && (
          <>
            <p className="text-gray-600 mb-8">Upload a logo for any trusted brand. The new logo will appear on the website immediately.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {DEFAULT_BRANDS.map((brandName) => {
                const key = `brand::${brandName}`;
                const currentLogo = brandImages[brandName];
                const isUploading = uploadingKey === key;
                return (
                  <div key={brandName} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="h-40 overflow-hidden bg-gray-100 relative flex items-center justify-center">
                      {currentLogo ? (
                        <img src={currentLogo} alt={brandName} className="w-full h-full object-contain" />
                      ) : (
                        <div className="text-gray-400 text-sm">No logo uploaded yet</div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 text-sm mb-3">{brandName}</h3>
                      <label className={`flex items-center justify-center gap-2 w-full border border-gray-200 rounded-lg py-2 text-sm font-medium cursor-pointer transition-all ${isUploading ? 'opacity-50 cursor-wait' : 'hover:border-orange-400 hover:text-orange-600'}`}>
                        {isUploading ? (
                          <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
                        ) : (
                          <><Upload className="h-4 w-4" /> Upload logo</>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isUploading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleBrandUpload(brandName, file);
                            e.target.value = '';
                          }}
                        />
                      </label>
                      {uploadMessage[key] && (
                        <p className={`text-xs mt-2 flex items-center gap-1 ${uploadMessage[key].includes('updated') ? 'text-green-600' : uploadMessage[key].includes('locally') ? 'text-amber-600' : 'text-red-500'}`}>
                          {uploadMessage[key].includes('updated') && <Check className="h-3 w-3" />}
                          {uploadMessage[key]}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === 'promotions' && (
          <>
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  {editingPromoId ? 'Edit Promotion' : 'Add New Promotion'}
                </h2>
                {editingPromoId && (
                  <button
                    onClick={resetPromoForm}
                    className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm"
                  >
                    <X className="h-4 w-4" /> Cancel edit
                  </button>
                )}
              </div>
              <form onSubmit={handlePromoSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={promoForm.title}
                    onChange={(e) => setPromoForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. 20% Off All Cement This Month"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Short Description (optional)</label>
                  <textarea
                    value={promoForm.description}
                    onChange={(e) => setPromoForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="A brief note about this special (shown below the flyer)..."
                    rows={2}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload Special Flyer (Photo or PDF)</label>
                  {promoForm.fileUrl && (
                    <div className="mb-3 relative inline-block">
                      {promoForm.fileType === 'pdf' ? (
                        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-4 pr-8">
                          <FileText className="h-10 w-10 text-red-500" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">PDF document uploaded</p>
                            <a href={promoForm.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">Click to preview</a>
                          </div>
                        </div>
                      ) : (
                        <img src={promoForm.fileUrl} alt="Preview" className="h-40 rounded-lg border border-gray-200 object-cover" />
                      )}
                      <button
                        type="button"
                        onClick={() => setPromoForm(prev => ({ ...prev, fileUrl: null }))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <label className={`flex items-center justify-center gap-2 w-full border border-gray-200 rounded-lg py-2 text-sm font-medium cursor-pointer transition-all ${promoUploading ? 'opacity-50 cursor-wait' : 'hover:border-orange-400 hover:text-orange-600'}`}>
                    {promoUploading ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
                    ) : (
                      <><Upload className="h-4 w-4" /> {promoForm.fileUrl ? 'Change file' : 'Upload photo or PDF'}</>
                    )}
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      disabled={promoUploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePromoFileUpload(file);
                        e.target.value = '';
                      }}
                    />
                  </label>
                  <p className="text-xs text-gray-400 mt-1">Accepted formats: JPG, PNG, GIF, WebP, or PDF</p>
                </div>
                {promoError && <p className="text-sm text-red-500">{promoError}</p>}
                {promoSuccess && <p className="text-sm text-green-600 flex items-center gap-1"><Check className="h-4 w-4" /> {promoSuccess}</p>}
                <button
                  type="submit"
                  disabled={promoLoading}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50"
                >
                  {promoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {editingPromoId ? 'Update Promotion' : 'Add Promotion'}
                </button>
              </form>
            </div>

            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">Existing Promotions</h2>
              <p className="text-sm text-gray-500">Toggle promotions on or off, edit details, or delete.</p>
            </div>

            {promotions.length === 0 && !promoLoading && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                No promotions yet. Add your first one above.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.map((promo) => (
                <div key={promo.id} className={`bg-white rounded-2xl shadow-md border overflow-hidden ${promo.is_active ? 'border-orange-100' : 'border-gray-200 opacity-60'}`}>
                  {promo.image_url && (
                    <div className="h-32 overflow-hidden bg-gray-100 flex items-center justify-center">
                      {promo.file_type === 'pdf' ? (
                        <div className="flex items-center gap-2 text-red-500">
                          <FileText className="h-8 w-8" />
                          <span className="text-sm font-medium">PDF Flyer</span>
                        </div>
                      ) : (
                        <img src={promo.image_url} alt={promo.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-bold text-gray-900 text-sm">{promo.title}</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${promo.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                        {promo.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                    {promo.description && (
                      <p className="text-gray-500 text-xs mb-3 line-clamp-2">{promo.description}</p>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTogglePromo(promo)}
                        className="flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-orange-600 transition-colors px-2 py-1 rounded hover:bg-orange-50"
                        title={promo.is_active ? 'Hide promotion' : 'Show promotion'}
                      >
                        {promo.is_active ? <ToggleRight className="h-5 w-5 text-green-600" /> : <ToggleLeft className="h-5 w-5" />}
                        {promo.is_active ? 'Active' : 'Hidden'}
                      </button>
                      <button
                        onClick={() => handleEditPromo(promo)}
                        className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors px-2 py-1 rounded hover:bg-blue-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePromo(promo)}
                        className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-red-50 ml-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
