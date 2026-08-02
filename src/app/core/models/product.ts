// ---------------------------------------------------------------------------
// Domain models for the collection / catalog domain.
// Mirrors the Shopify-style data Powerlook exposes on its collection page.
// ---------------------------------------------------------------------------

export type ProductCategory = 'Shirts' | 'T-Shirts' | 'Bottoms' | 'Jackets' | 'Bags' | 'Belts';

export type ProductBadge = 'NEW ARRIVAL' | 'BESTSELLER' | 'LIMITED' | 'BACK IN STOCK';

export interface ProductVariant {
  /** Size label, e.g. "S", "M", "32", "OneSize" */
  size: string;
  /** Variant id used by a cart API. */
  id: string;
  /** Whether the variant is purchasable. */
  available: boolean;
}

export interface ProductImage {
  /** Original (no width) CDN url, e.g. https://www.powerlook.in/cdn/shop/files/x.jpg?v=123 */
  src: string;
  alt: string;
}

export interface ProductRating {
  /** Average rating 0..5 or null when not rated. */
  average: number | null;
  count: number;
}

export interface ProductPrice {
  /** Current selling price in INR. */
  current: number;
  /** Compare-at (MRP) price. null when there is no discount. */
  compareAt: number | null;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  category: ProductCategory;
  badge: ProductBadge | null;
  price: ProductPrice;
  rating: ProductRating;
  images: ProductImage[];
  /** Primary color bucket used by the Color filter. */
  color: string;
  variants: ProductVariant[];
  /** Facets. All optional because not every product exposes every facet. */
  sleeves?: string;
  pattern?: string;
  fit?: string;
  collar?: string;
  material?: string;
  /** Epoch ms used by date based sorting. */
  publishedAt: number;
}

export interface FacetOption {
  value: string;
  label: string;
  count: number;
}

export type FacetGroupId = 'color' | 'size' | 'sleeves' | 'pattern' | 'fit' | 'collar' | 'material';

export interface FacetGroup {
  id: FacetGroupId;
  label: string;
  options: FacetOption[];
}

export type SortKey =
  | 'featured'
  | 'best-selling'
  | 'title-asc'
  | 'title-desc'
  | 'price-asc'
  | 'price-desc'
  | 'date-old'
  | 'date-new';

export interface CollectionFilters {
  [groupId: string]: string[];
}

export interface CollectionState {
  /** Selected facets keyed by group id. */
  filters: CollectionFilters;
  /** Active category tab. */
  category: ProductCategory | 'All';
  sortBy: SortKey;
  priceMin: number | null;
  priceMax: number | null;
  search: string;
}

export const FACET_GROUP_IDS: readonly FacetGroupId[] = [
  'color',
  'size',
  'sleeves',
  'pattern',
  'fit',
  'collar',
  'material',
];

export const FACET_GROUP_LABELS: Record<FacetGroupId, string> = {
  color: 'Color',
  size: 'Size',
  sleeves: 'Sleeves',
  pattern: 'Pattern',
  fit: 'Fit',
  collar: 'Collar',
  material: 'Material',
};
