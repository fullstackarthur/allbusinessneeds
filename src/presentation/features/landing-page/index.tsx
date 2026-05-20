import { Link } from 'react-router-dom'
import { useAuthStore } from '@/presentation/stores/auth-store'
import { useUiStore } from '@/presentation/stores/ui-store'
import { useRandomProducts } from '@/shared/hooks/use-supabase-data'
import { formatCurrency } from '@/core/utils/helpers'
import { ArrowRight, Search, FileText, Sparkles, Package, ClipboardCheck, Truck, Layers, BarChart3, Settings, Zap, Globe } from 'lucide-react'
import type { Product } from '@/domain/entities'

function LandingPage() {
  const { products, loading } = useRandomProducts(8)

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <Header />
      <HeroSection />
      <WorkflowSection />
      <AiSourcingSection />
      <ProductDiscoverySection products={products} loading={loading} />
      <QuotationSection />
      <ReliabilitySection />
      <TrustSection />
      <CtaSection />
      <Footer />
    </div>
  )
}

function AuthNavButton() {
  const { user, isInitialized } = useAuthStore()

  if (!isInitialized) {
    return <div className="w-24 h-8" />
  }

  if (user) {
    return (
      <Link
        to="/experience"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0033a0] hover:text-[#002a85] transition-colors px-4 py-2 rounded-md bg-[#0033a0]/5 border border-[#0033a0]/20 hover:border-[#0033a0]/40"
      >
        Access Experiences
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    )
  }

  return (
    <Link
      to="/whoami/customer"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0033a0] hover:text-[#002a85] transition-colors px-4 py-2 rounded-md bg-[#0033a0]/5 border border-[#0033a0]/20 hover:border-[#0033a0]/40"
    >
      Sign In / Register
    </Link>
  )
}

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#faf9f7]/90 backdrop-blur-md border-b border-[#e2e0dc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <img src="/favicon.svg" alt="ABN" className="h-7 w-7" />
            <span className="text-base font-semibold text-[#0a1628] tracking-tight">All Business Needs</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#workflow" className="text-sm text-[#4a5568] hover:text-[#0a1628] transition-colors">Workflow</a>
            <a href="#catalog" className="text-sm text-[#4a5568] hover:text-[#0a1628] transition-colors">Catalog</a>
            <a href="#quotation" className="text-sm text-[#4a5568] hover:text-[#0a1628] transition-colors">Quotation</a>
          </nav>
          <AuthNavButton />
        </div>
      </div>
    </header>
  )
}

function AuthLink({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) {
  const { user } = useAuthStore()
  const href = user ? to : '/whoami/customer'

  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  )
}

function HeroSection() {
  return (
    <section className="min-h-screen flex items-center pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#e6eaf5] text-xs font-medium text-[#0033a0] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#0033a0]" />
              Procurement Platform
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#0a1628] leading-[1.15] tracking-tight">
              Corporate stationery procurement, restructured for speed and clarity.
            </h1>
            <p className="mt-5 text-base lg:text-lg text-[#4a5568] leading-relaxed max-w-xl">
              allbusinessneeds enables businesses to source office and operational supplies through a structured procurement workflow designed for purchasing teams. Product discovery, quotation requests, AI-assisted sourcing, procurement coordination, and operational efficiency — unified in one platform.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <AuthLink
                to="/experience"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0033a0] text-white text-base font-medium rounded-lg hover:bg-[#002a85] transition-colors"
              >
                Access Experiences
                <ArrowRight className="h-4 w-4" />
              </AuthLink>
              <AuthLink
                to="/experience/categories"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#e2e0dc] text-base font-medium text-[#0a1628] rounded-lg hover:border-[#c5c3be] transition-colors"
              >
                Browse Catalog
              </AuthLink>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-xl border border-[#e2e0dc] bg-white shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-[#e2e0dc] flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#e2e0dc]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#e2e0dc]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#e2e0dc]" />
                </div>
                <div className="flex-1 h-7 bg-[#f5f4f2] rounded-md text-xs text-[#718096] flex items-center px-3">
                  allbusinessneeds/experience
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2.5">
                  <Search className="h-4 w-4 text-[#718096]" />
                  <div className="flex-1 h-8 bg-[#f5f4f2] rounded-md text-xs text-[#718096] flex items-center px-3">
                    Search products, SKUs, specifications...
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'A4 Copy Paper', spec: '80gsm, 500 sheets' },
                    { name: 'Ballpoint Pens', spec: 'Blue, Box of 50' },
                    { name: 'File Folders', spec: 'A4, Manila, Pack 25' },
                    { name: 'Sticky Notes', spec: '76x76mm, Yellow' },
                  ].map((item, i) => (
                    <div key={i} className="p-3 border border-[#e2e0dc] rounded-lg">
                      <div className="h-12 bg-[#f5f4f2] rounded-md mb-2" />
                      <div className="text-xs font-medium text-[#0a1628]">{item.name}</div>
                      <div className="text-[11px] text-[#718096] mt-0.5">{item.spec}</div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-[#0033a0]" />
                  <div className="flex-1 h-7 bg-[#e6eaf5] rounded-md text-xs text-[#0033a0] flex items-center px-3">
                    AI sourcing: 3 related variants found
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function WorkflowSection() {
  const steps = [
    { icon: Search, title: 'Search', desc: 'Discover products through specification-first catalog browsing' },
    { icon: FileText, title: 'Build RFQ', desc: 'Compile items into a structured procurement request' },
    { icon: ClipboardCheck, title: 'Procurement Review', desc: 'Review quantities, specifications, and sourcing notes' },
    { icon: Package, title: 'Quotation Coordination', desc: 'Coordinate vendor quotations and pricing alignment' },
    { icon: Truck, title: 'Fulfillment', desc: 'Track fulfillment and maintain procurement records' },
  ]

  return (
    <section id="workflow" className="py-16 lg:py-24 border-t border-[#e2e0dc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <h2 className="text-2xl lg:text-3xl font-semibold text-[#0a1628] tracking-tight">
            Built for structured procurement workflows.
          </h2>
          <p className="mt-3 text-base text-[#4a5568]">
            Every interaction within the platform is designed to reduce sourcing friction for operational purchasing teams.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <div className="p-4 rounded-xl border border-[#e2e0dc] bg-white h-full">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#e6eaf5] flex items-center justify-center shrink-0">
                    <step.icon className="h-4 w-4 text-[#0033a0]" />
                  </div>
                  <span className="text-xs font-mono text-[#718096]">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="text-sm font-semibold text-[#0a1628]">{step.title}</h3>
                <p className="mt-2 text-xs text-[#718096] leading-relaxed">{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-2 w-4 text-[#e2e0dc] -translate-y-1/2">
                  <ArrowRight className="h-3 w-3" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AiSourcingSection() {
  return (
    <section className="py-16 lg:py-24 border-t border-[#e2e0dc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-2">
            <h2 className="text-2xl lg:text-3xl font-semibold text-[#0a1628] tracking-tight">
              AI-assisted sourcing without conversational clutter.
            </h2>
            <p className="mt-4 text-base text-[#4a5568] leading-relaxed">
              The sourcing copilot understands procurement context, recommends related products, assists with quotation preparation, maintains sourcing continuity, and accelerates structured purchasing workflows.
            </p>
            <div className="mt-6 space-y-3">
              {[
                'Context-aware product recommendations',
                'Specification matching and variant discovery',
                'Quotation preparation assistance',
                'Sourcing continuity across sessions',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0033a0] mt-2 shrink-0" />
                  <span className="text-sm text-[#4a5568]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 rounded-xl border border-[#e2e0dc] bg-white shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-[#e2e0dc] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#0033a0]" />
                <span className="text-sm font-semibold text-[#0a1628]">Sourcing Intelligence</span>
              </div>
              <div className="text-xs text-[#718096]">Active</div>
            </div>
            <div className="p-4 space-y-3">
              <div className="p-3 bg-[#f5f4f2] rounded-lg text-sm text-[#4a5568]">
                Based on your RFQ for A4 copy paper, 3 alternatives match your specifications.
              </div>
              <div className="space-y-2">
                {[
                  { name: 'Premium A4 80gsm', match: '98%', spec: '500 sheets/ream' },
                  { name: 'Standard A4 75gsm', match: '94%', spec: '500 sheets/ream' },
                  { name: 'Economy A4 70gsm', match: '89%', spec: '500 sheets/ream' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-[#e2e0dc] rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-[#0a1628]">{item.name}</div>
                      <div className="text-xs text-[#718096]">{item.spec}</div>
                    </div>
                    <div className="text-xs font-semibold text-[#0033a0]">{item.match} match</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product }: { product: Product }) {
  const { user, profile } = useAuthStore()
  const showPrices = useUiStore((s) => s.showPrices)
  const isAuthed = user && profile?.status === 'approved'
  const stockLabel = product.stock === 0 ? 'Out of stock' : product.stock <= 5 ? 'Low stock' : product.stock <= 20 ? 'Limited' : 'In stock'
  const stockColor = product.stock === 0 ? 'text-[#c41e3a]' : product.stock <= 5 ? 'text-[#b8860b]' : 'text-[#2d7a4f]'

  return (
    <Link to={isAuthed ? `/experience/products/${product.id}` : '/whoami/customer'} className="group block">
      <div className="rounded-xl border border-[#e2e0dc] bg-white p-4 transition-all hover:border-[#c5c3be] hover:shadow-sm h-full flex flex-col">
        <div className="aspect-square bg-[#f5f4f2] rounded-lg mb-3 overflow-hidden">
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-full object-cover transition-transform group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
        <div className="text-sm font-semibold text-[#0a1628] line-clamp-2 leading-snug min-h-[2.5rem]">{product.name}</div>
        <div className="text-xs text-[#718096] mt-1 truncate">SKU: {product.sku}</div>
        <div className="flex items-center justify-between mt-auto pt-3">
          {showPrices ? (
            <span className="text-sm font-semibold text-[#0a1628]">{formatCurrency(product.price, product.currency)}</span>
          ) : (
            <span />
          )}
          <span className={`text-xs font-medium ${stockColor}`}>{stockLabel}</span>
        </div>
      </div>
    </Link>
  )
}

function ProductDiscoverySection({ products, loading }: { products: Product[]; loading: boolean }) {
  return (
    <section id="catalog" className="py-16 lg:py-24 border-t border-[#e2e0dc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl lg:text-3xl font-semibold text-[#0a1628] tracking-tight">
              Designed for procurement-grade product discovery.
            </h2>
            <p className="mt-3 text-base text-[#4a5568]">
              The catalog system is optimized for fast scanning, specification visibility, structured sourcing, and procurement clarity.
            </p>
          </div>
          <AuthLink
            to="/experience/categories"
            className="hidden sm:flex items-center gap-1.5 text-sm text-[#0033a0] hover:text-[#002a85] transition-colors shrink-0 ml-4"
          >
            View catalog
            <ArrowRight className="h-4 w-4" />
          </AuthLink>
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-[#e2e0dc] bg-white p-4 animate-pulse">
                  <div className="aspect-square bg-[#f5f4f2] rounded-lg mb-3" />
                  <div className="h-4 bg-[#f5f4f2] rounded w-3/4 mb-2" />
                  <div className="h-3 bg-[#f5f4f2] rounded w-1/2" />
                </div>
              ))
            : products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>

        <div className="mt-6 sm:hidden">
          <AuthLink
            to="/experience/categories"
            className="flex items-center gap-1.5 text-sm text-[#0033a0] hover:text-[#002a85] transition-colors"
          >
            View full catalog
            <ArrowRight className="h-4 w-4" />
          </AuthLink>
        </div>
      </div>
    </section>
  )
}

function QuotationSection() {
  return (
    <section id="quotation" className="py-16 lg:py-24 border-t border-[#e2e0dc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-2">
            <h2 className="text-2xl lg:text-3xl font-semibold text-[#0a1628] tracking-tight">
              Built around quotation-first purchasing.
            </h2>
            <p className="mt-4 text-base text-[#4a5568] leading-relaxed">
              Procurement requests are structured around quotation coordination workflows, enabling volume-based sourcing, operational flexibility, vendor communication, and procurement review before pricing is finalized.
            </p>
            <div className="mt-6 space-y-3">
              {[
                'Group products by category and vendor',
                'Edit quantities and add procurement notes',
                'Attach specifications and requirements',
                'Submit structured quotation requests',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0033a0] mt-2 shrink-0" />
                  <span className="text-sm text-[#4a5568]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 rounded-xl border border-[#e2e0dc] bg-white shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-[#e2e0dc] flex items-center justify-between">
              <span className="text-sm font-semibold text-[#0a1628]">RFQ Summary</span>
              <span className="text-xs text-[#718096]">Draft</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="space-y-2">
                {[
                  { cat: 'Paper Products', items: 3, qty: '45 units' },
                  { cat: 'Writing Instruments', items: 2, qty: '28 units' },
                  { cat: 'Filing & Storage', items: 4, qty: '62 units' },
                ].map((group, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-[#e2e0dc] rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-[#0a1628]">{group.cat}</div>
                      <div className="text-xs text-[#718096]">{group.items} items · {group.qty}</div>
                    </div>
                    <div className="text-xs text-[#0033a0]">Edit</div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-[#f5f4f2] rounded-lg">
                <div className="text-xs text-[#718096] mb-1">Procurement Notes</div>
                <div className="text-sm text-[#4a5568]">Priority delivery required. Office relocation in progress.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ReliabilitySection() {
  const capabilities = [
    { icon: Layers, title: 'Structured Workflows', desc: 'Procurement processes designed for operational teams' },
    { icon: BarChart3, title: 'Inventory Visibility', desc: 'Real-time stock indicators and availability tracking' },
    { icon: Settings, title: 'Variant-Aware Sourcing', desc: 'Specification-driven product discovery and comparison' },
    { icon: Sparkles, title: 'AI-Assisted Recommendations', desc: 'Intelligent product matching and sourcing continuity' },
    { icon: FileText, title: 'Specification-First Catalog', desc: 'Technical details prioritized over promotional content' },
    { icon: ClipboardCheck, title: 'Procurement Coordination', desc: 'Multi-vendor quotation management and alignment' },
    { icon: Zap, title: 'RFQ Lifecycle Management', desc: 'End-to-end request tracking and fulfillment oversight' },
    { icon: Globe, title: 'Global Sourcing Support', desc: 'International procurement workflows and vendor networks' },
  ]

  return (
    <section className="py-16 lg:py-24 border-t border-[#e2e0dc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <h2 className="text-2xl lg:text-3xl font-semibold text-[#0a1628] tracking-tight">
            Operational reliability, built in.
          </h2>
          <p className="mt-3 text-base text-[#4a5568]">
            Infrastructure-grade procurement capabilities designed for teams that require precision and consistency.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {capabilities.map((cap, i) => (
            <div key={i} className="p-4 rounded-xl border border-[#e2e0dc] bg-white">
              <div className="w-9 h-9 rounded-lg bg-[#e6eaf5] flex items-center justify-center mb-3">
                <cap.icon className="h-4 w-4 text-[#0033a0]" />
              </div>
              <h3 className="text-sm font-semibold text-[#0a1628]">{cap.title}</h3>
              <p className="mt-2 text-xs text-[#718096] leading-relaxed">{cap.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TrustSection() {
  return (
    <section className="py-16 lg:py-24 border-t border-[#e2e0dc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-2xl lg:text-3xl font-semibold text-[#0a1628] tracking-tight">
            Designed for serious procurement operations.
          </h2>
          <p className="mt-4 text-base text-[#4a5568] leading-relaxed">
            Built for operational purchasing teams, administrative procurement departments, distributed office procurement workflows, international sourcing operations, and corporate stationery coordination.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-2xl mx-auto">
          {[
            { label: 'Operational Teams', desc: 'Purchasing workflows' },
            { label: 'Admin Departments', desc: 'Procurement oversight' },
            { label: 'Distributed Offices', desc: 'Multi-location sourcing' },
            { label: 'Global Operations', desc: 'International procurement' },
          ].map((item, i) => (
            <div key={i} className="text-center p-4">
              <div className="text-sm font-semibold text-[#0a1628]">{item.label}</div>
              <div className="mt-1.5 text-xs text-[#718096]">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaSection() {
  return (
    <section className="py-20 lg:py-28 border-t border-[#e2e0dc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-2xl lg:text-3xl font-semibold text-[#0a1628] tracking-tight">
            Procurement workflows should feel operational, not chaotic.
          </h2>
          <p className="mt-4 text-base text-[#4a5568] leading-relaxed">
            allbusinessneeds combines structured sourcing, AI-assisted procurement workflows, and quotation-first coordination into a calmer procurement experience for modern operational teams.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <AuthLink
              to="/experience"
              className="inline-flex items-center gap-2 px-7 py-3 bg-[#0033a0] text-white text-base font-medium rounded-lg hover:bg-[#002a85] transition-colors"
            >
              Begin Sourcing
              <ArrowRight className="h-4 w-4" />
            </AuthLink>
            <AuthLink
              to="/experience/categories"
              className="inline-flex items-center gap-2 px-7 py-3 border border-[#e2e0dc] text-base font-medium text-[#0a1628] rounded-lg hover:border-[#c5c3be] transition-colors"
            >
              Browse Catalog
            </AuthLink>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const { user, profile } = useAuthStore()
  const experienceLink = user && profile?.status === 'approved' ? '/experience' : '/whoami/customer'

  return (
    <footer className="border-t border-[#e2e0dc] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="ABN" className="h-5 w-5" />
            <span className="text-sm font-semibold text-[#0a1628] tracking-tight">All Business Needs</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-5 sm:gap-6">
            <Link to={experienceLink} className="text-xs text-[#718096] hover:text-[#0a1628] transition-colors">Catalog</Link>
            <Link to={experienceLink} className="text-xs text-[#718096] hover:text-[#0a1628] transition-colors">Categories</Link>
            <a href="#workflow" className="text-xs text-[#718096] hover:text-[#0a1628] transition-colors">Procurement Support</a>
            <a href="#quotation" className="text-xs text-[#718096] hover:text-[#0a1628] transition-colors">RFQ Workflow</a>
            <a href="#" className="text-xs text-[#718096] hover:text-[#0a1628] transition-colors">Terms</a>
            <a href="#" className="text-xs text-[#718096] hover:text-[#0a1628] transition-colors">Contact</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export { LandingPage }
