import * as React from 'react'
import type { Product } from '@/domain/entities'

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium A4 Copy Paper - 80gsm (Box of 5 Reams)',
    description: 'High-quality white copy paper for everyday office use. Acid-free, suitable for all printers and copiers.',
    sku: 'PPR-A4-80-5R',
    category: 'paper',
    brand: 'PaperPro',
    price: 24.99,
    currency: 'USD',
    stock: 150,
    minOrderQuantity: 1,
    images: [
      'https://placehold.co/600x600/f5f4f2/4a5568?text=A4+Paper+Front',
      'https://placehold.co/600x600/f5f4f2/4a5568?text=A4+Paper+Side',
      'https://placehold.co/600x600/f5f4f2/4a5568?text=A4+Paper+Box',
    ],
    thumbnail: 'https://placehold.co/400x400/f5f4f2/4a5568?text=A4+Paper',
    attributes: { weight: '80gsm', size: 'A4', sheets: '2500', whiteness: '165 CIE' },
    rating: 4.7,
    reviewCount: 89,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Ballpoint Pen - Blue Ink (Box of 50)',
    description: 'Smooth-writing ballpoint pens with comfortable grip. Ideal for high-volume office use.',
    sku: 'PEN-BP-BL-50',
    category: 'writing',
    brand: 'WriteWell',
    price: 12.50,
    currency: 'USD',
    stock: 3,
    minOrderQuantity: 1,
    images: [
      'https://placehold.co/600x600/f5f4f2/4a5568?text=Pen+Front',
      'https://placehold.co/600x600/f5f4f2/4a5568?text=Pen+Detail',
    ],
    thumbnail: 'https://placehold.co/400x400/f5f4f2/4a5568?text=Ballpoint+Pen',
    attributes: { color: 'Blue', type: 'Ballpoint', tip: '1.0mm', length: '14cm' },
    rating: 4.5,
    reviewCount: 156,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Desktop Organizer - Bamboo',
    description: 'Sustainable bamboo desk organizer with multiple compartments for pens, notes, and accessories.',
    sku: 'ORG-DSK-BB',
    category: 'organization',
    brand: 'EcoDesk',
    price: 34.00,
    currency: 'USD',
    stock: 0,
    minOrderQuantity: 1,
    images: [
      'https://placehold.co/600x600/f5f4f2/4a5568?text=Organizer',
    ],
    thumbnail: 'https://placehold.co/400x400/f5f4f2/4a5568?text=Organizer',
    attributes: { material: 'Bamboo', compartments: '6', dimensions: '30x15x10cm' },
    rating: 4.8,
    reviewCount: 42,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Sticky Notes Assorted - 12 Pads',
    description: 'Colorful sticky notes in various sizes. Strong adhesive, clean removal.',
    sku: 'STK-AST-12',
    category: 'paper',
    brand: 'NoteMaster',
    price: 8.99,
    currency: 'USD',
    stock: 200,
    minOrderQuantity: 2,
    images: [
      'https://placehold.co/600x600/f5f4f2/4a5568?text=Sticky+Notes',
    ],
    thumbnail: 'https://placehold.co/400x400/f5f4f2/4a5568?text=Sticky+Notes',
    attributes: { count: '12 pads', sizes: '3x3, 4x6, 2x2', colors: '6' },
    rating: 4.3,
    reviewCount: 201,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    name: 'Binder Clips - Assorted Sizes (120 Pack)',
    description: 'Durable steel binder clips in small, medium, and large sizes. Non-slip grip.',
    sku: 'CLP-BND-AST',
    category: 'clips',
    brand: 'ClipPro',
    price: 6.75,
    currency: 'USD',
    stock: 500,
    minOrderQuantity: 1,
    images: [
      'https://placehold.co/600x600/f5f4f2/4a5568?text=Binder+Clips',
    ],
    thumbnail: 'https://placehold.co/400x400/f5f4f2/4a5568?text=Binder+Clips',
    attributes: { material: 'Steel', count: '120', sizes: 'Small/Medium/Large' },
    rating: 4.6,
    reviewCount: 78,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '6',
    name: 'Whiteboard Markers - Assorted Colors (Set of 12)',
    description: 'Vibrant, low-odor whiteboard markers with fine tips. Quick-drying formula.',
    sku: 'MRK-WB-12',
    category: 'writing',
    brand: 'MarkIt',
    price: 15.99,
    currency: 'USD',
    stock: 75,
    minOrderQuantity: 1,
    images: [
      'https://placehold.co/600x600/f5f4f2/4a5568?text=Markers',
    ],
    thumbnail: 'https://placehold.co/400x400/f5f4f2/4a5568?text=Markers',
    attributes: { colors: '12', tip: 'Fine', type: 'Low-odor' },
    rating: 4.4,
    reviewCount: 93,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '7',
    name: 'A3 Copier Paper - 75gsm (Ream of 500)',
    description: 'Standard A3 copier paper for large format printing and copying.',
    sku: 'PPR-A3-75-500',
    category: 'paper',
    brand: 'PaperPro',
    price: 14.50,
    currency: 'USD',
    stock: 89,
    minOrderQuantity: 2,
    images: [
      'https://placehold.co/600x600/f5f4f2/4a5568?text=A3+Paper',
    ],
    thumbnail: 'https://placehold.co/400x400/f5f4f2/4a5568?text=A3+Paper',
    attributes: { weight: '75gsm', size: 'A3', sheets: '500' },
    rating: 4.2,
    reviewCount: 45,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '8',
    name: 'Mechanical Pencils - 0.5mm (Pack of 12)',
    description: 'Precision mechanical pencils with comfortable rubber grip. Includes eraser refills.',
    sku: 'PNC-MEC-05-12',
    category: 'writing',
    brand: 'WriteWell',
    price: 18.00,
    currency: 'USD',
    stock: 120,
    minOrderQuantity: 1,
    images: [
      'https://placehold.co/600x600/f5f4f2/4a5568?text=Pencils',
    ],
    thumbnail: 'https://placehold.co/400x400/f5f4f2/4a5568?text=Pencils',
    attributes: { lead: '0.5mm', grip: 'Rubber', includes: 'Eraser refills' },
    rating: 4.6,
    reviewCount: 67,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '9',
    name: 'Lever Arch Files - A4 (Pack of 10)',
    description: 'Heavy-duty lever arch files with 75mm spine capacity. Assorted colors.',
    sku: 'FIL-LVR-A4-10',
    category: 'organization',
    brand: 'FilePro',
    price: 22.00,
    currency: 'USD',
    stock: 45,
    minOrderQuantity: 1,
    images: [
      'https://placehold.co/600x600/f5f4f2/4a5568?text=Files',
    ],
    thumbnail: 'https://placehold.co/400x400/f5f4f2/4a5568?text=Files',
    attributes: { size: 'A4', spine: '75mm', pack: '10', colors: 'Assorted' },
    rating: 4.5,
    reviewCount: 34,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '10',
    name: 'Correction Tape - 5mm x 8m (Pack of 6)',
    description: 'Instant dry correction tape. No waiting, no mess. Smooth application.',
    sku: 'COR-TPE-5X8-6',
    category: 'desk',
    brand: 'CorrectIt',
    price: 9.50,
    currency: 'USD',
    stock: 180,
    minOrderQuantity: 1,
    images: [
      'https://placehold.co/600x600/f5f4f2/4a5568?text=Correction+Tape',
    ],
    thumbnail: 'https://placehold.co/400x400/f5f4f2/4a5568?text=Correction+Tape',
    attributes: { width: '5mm', length: '8m', pack: '6', type: 'Instant dry' },
    rating: 4.1,
    reviewCount: 56,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '11',
    name: 'Recycled Envelopes - DL (Box of 500)',
    description: '100% recycled DL envelopes with self-seal closure. Window and non-window options.',
    sku: 'ENV-REC-DL-500',
    category: 'shipping',
    brand: 'EcoMail',
    price: 19.99,
    currency: 'USD',
    stock: 250,
    minOrderQuantity: 1,
    images: [
      'https://placehold.co/600x600/f5f4f2/4a5568?text=Envelopes',
    ],
    thumbnail: 'https://placehold.co/400x400/f5f4f2/4a5568?text=Envelopes',
    attributes: { size: 'DL', material: 'Recycled', closure: 'Self-seal', count: '500' },
    rating: 4.4,
    reviewCount: 28,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '12',
    name: 'Stapler - Heavy Duty (200 Sheet Capacity)',
    description: 'Professional heavy-duty stapler with anti-jam mechanism. Includes 1000 staples.',
    sku: 'STP-HD-200',
    category: 'desk',
    brand: 'StapleMax',
    price: 28.50,
    currency: 'USD',
    stock: 35,
    minOrderQuantity: 1,
    images: [
      'https://placehold.co/600x600/f5f4f2/4a5568?text=Stapler',
    ],
    thumbnail: 'https://placehold.co/400x400/f5f4f2/4a5568?text=Stapler',
    attributes: { capacity: '200 sheets', mechanism: 'Anti-jam', includes: '1000 staples' },
    rating: 4.7,
    reviewCount: 91,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

const brands = [
  { id: 'paperpro', name: 'PaperPro', productCount: 23, logo: 'https://placehold.co/120x60/f5f4f2/4a5568?text=PaperPro' },
  { id: 'writewell', name: 'WriteWell', productCount: 18, logo: 'https://placehold.co/120x60/f5f4f2/4a5568?text=WriteWell' },
  { id: 'notemaster', name: 'NoteMaster', productCount: 12, logo: 'https://placehold.co/120x60/f5f4f2/4a5568?text=NoteMaster' },
  { id: 'clippro', name: 'ClipPro', productCount: 9, logo: 'https://placehold.co/120x60/f5f4f2/4a5568?text=ClipPro' },
  { id: 'ecodesk', name: 'EcoDesk', productCount: 7, logo: 'https://placehold.co/120x60/f5f4f2/4a5568?text=EcoDesk' },
  { id: 'markit', name: 'MarkIt', productCount: 15, logo: 'https://placehold.co/120x60/f5f4f2/4a5568?text=MarkIt' },
  { id: 'filepro', name: 'FilePro', productCount: 11, logo: 'https://placehold.co/120x60/f5f4f2/4a5568?text=FilePro' },
  { id: 'staplemax', name: 'StapleMax', productCount: 8, logo: 'https://placehold.co/120x60/f5f4f2/4a5568?text=StapleMax' },
]

function useProducts() {
  const [loading, setLoading] = React.useState(true)
  const [products, setProducts] = React.useState<Product[]>([])

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  return { products, loading, error: null }
}

function useProductById(id: string) {
  const [loading, setLoading] = React.useState(true)
  const [product, setProduct] = React.useState<Product | null>(null)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const found = mockProducts.find((p) => p.id === id) || null
      setProduct(found)
      setLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [id])

  return { product, loading, error: null }
}

function useBrands() {
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(timer)
  }, [])

  return { brands, loading }
}

function useRelatedProducts(productId: string, limit = 4) {
  const [loading, setLoading] = React.useState(true)
  const [related, setRelated] = React.useState<Product[]>([])

  React.useEffect(() => {
    const timer = setTimeout(() => {
      const others = mockProducts.filter((p) => p.id !== productId)
      setRelated(others.slice(0, limit))
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [productId, limit])

  return { related, loading }
}

export { useProducts, useProductById, useBrands, useRelatedProducts, mockProducts }
