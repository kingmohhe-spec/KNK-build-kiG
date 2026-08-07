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
  if (!supabase) return {};
  const { data, error } = await supabase
    .from('product_images')
    .select('category_name, product_name, image_url');
  if (error) return {};
  const map: Record<string, string> = {};
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
  if (dbError) return null;

  return publicUrl;
}
