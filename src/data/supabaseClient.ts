import { createClient } from '@supabase/supabase-js';
import type { CategoryProduct } from './categoryDetails';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && key ? createClient(url, key) : null;

export interface ProductImageRow {
  category_name: string;
  product_name: string;
  image_url: string;
}

export async function fetchCustomImages(): Promise<Record<string, string>> {
  const localOverrides = loadLocalImageOverrides();
  if (!supabase) return localOverrides;
  const { data, error } = await supabase
    .from('product_images')
    .select('category_name, product_name, image_url');
  const map: Record<string, string> = { ...localOverrides };
  if (error || !data) return map;
  for (const row of data as ProductImageRow[]) {
    map[`${row.category_name}::${row.product_name}`] = row.image_url;
  }
  return map;
}

export function resolveImage(
  category: string,
  product: CategoryProduct,
  customImages: Record<string, string>
): string {
  return customImages[`${category}::${product.name}`] ?? product.image;
}

export async function uploadProductImage(
  category: string,
  product: string,
  file: File
): Promise<string | null> {
  if (!supabase) return null;
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const safeCat = category.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const safeProd = product.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const filePath = `${safeCat}/${safeProd}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, { cacheControl: '3600', upsert: true });
  if (uploadError) return null;

  const { data: pub } = supabase.storage.from('product-images').getPublicUrl(filePath);
  const publicUrl = pub.publicUrl;

  const { error: dbError } = await supabase
    .from('product_images')
    .upsert(
      { category_name: category, product_name: product, image_url: publicUrl },
      { onConflict: 'category_name,product_name' }
    );

  if (dbError) {
    const localKey = 'product-image-overrides';
    let overrides: Record<string, string> = {};
    try {
      overrides = JSON.parse(localStorage.getItem(localKey) ?? '{}');
    } catch { overrides = {}; }
    overrides[`${category}::${product}`] = publicUrl;
    localStorage.setItem(localKey, JSON.stringify(overrides));
  }

  return publicUrl;
}

export function loadLocalImageOverrides(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem('product-image-overrides') ?? '{}');
  } catch {
    return {};
  }
}

export interface BrandImageRow {
  brand_name: string;
  image_url: string;
}

export async function fetchBrandImages(): Promise<Record<string, string>> {
  const localOverrides = loadLocalBrandOverrides();
  if (!supabase) return localOverrides;
  const { data, error } = await supabase
    .from('brand_images')
    .select('brand_name, image_url');
  const map: Record<string, string> = { ...localOverrides };
  if (error || !data) return map;
  for (const row of data as BrandImageRow[]) {
    map[row.brand_name] = row.image_url;
  }
  return map;
}

export async function uploadBrandImage(
  brandName: string,
  file: File
): Promise<string | null> {
  if (!supabase) return null;
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const safeName = brandName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const filePath = `${safeName}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('brand-logos')
    .upload(filePath, file, { cacheControl: '3600', upsert: true });
  if (uploadError) return null;

  const { data: pub } = supabase.storage.from('brand-logos').getPublicUrl(filePath);
  const publicUrl = pub.publicUrl;

  const { error: dbError } = await supabase
    .from('brand_images')
    .upsert(
      { brand_name: brandName, image_url: publicUrl },
      { onConflict: 'brand_name' }
    );

  if (dbError) {
    const localKey = 'brand-image-overrides';
    let overrides: Record<string, string> = {};
    try {
      overrides = JSON.parse(localStorage.getItem(localKey) ?? '{}');
    } catch { overrides = {}; }
    overrides[brandName] = publicUrl;
    localStorage.setItem(localKey, JSON.stringify(overrides));
  }

  return publicUrl;
}

export function loadLocalBrandOverrides(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem('brand-image-overrides') ?? '{}');
  } catch {
    return {};
  }
}

const MAIN_CATEGORY_KEY = '__main_category__';

export async function fetchMainCategoryImages(): Promise<Record<string, string>> {
  const localOverrides = loadLocalMainCategoryOverrides();
  if (!supabase) return localOverrides;
  const { data, error } = await supabase
    .from('product_images')
    .select('product_name, image_url')
    .eq('category_name', MAIN_CATEGORY_KEY);
  const map: Record<string, string> = { ...localOverrides };
  if (error || !data) return map;
  for (const row of data as Pick<ProductImageRow, 'product_name' | 'image_url'>[]) {
    map[row.product_name] = row.image_url;
  }
  return map;
}

export async function uploadMainCategoryImage(
  categoryName: string,
  file: File
): Promise<string | null> {
  if (!supabase) return null;
  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const safeName = categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const filePath = `main-category/${safeName}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, { cacheControl: '3600', upsert: true });
  if (uploadError) return null;

  const { data: pub } = supabase.storage.from('product-images').getPublicUrl(filePath);
  const publicUrl = pub.publicUrl;

  const { error: dbError } = await supabase
    .from('product_images')
    .upsert(
      { category_name: MAIN_CATEGORY_KEY, product_name: categoryName, image_url: publicUrl },
      { onConflict: 'category_name,product_name' }
    );

  if (dbError) {
    const localKey = 'main-category-image-overrides';
    let overrides: Record<string, string> = {};
    try {
      overrides = JSON.parse(localStorage.getItem(localKey) ?? '{}');
    } catch { overrides = {}; }
    overrides[categoryName] = publicUrl;
    localStorage.setItem(localKey, JSON.stringify(overrides));
  }

  return publicUrl;
}

export function loadLocalMainCategoryOverrides(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem('main-category-image-overrides') ?? '{}');
  } catch {
    return {};
  }
}
