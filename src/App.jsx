import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  Leaf, 
  Sprout, 
  Globe2, 
  CheckCircle, 
  CreditCard, 
  Lock, 
  Plus, 
  Minus, 
  Trash2,
  ArrowRight,
  Edit,
  Save,
  Settings,
  FileText,
  Download
} from 'lucide-react';

// --- Data ---
const INITIAL_PRODUCTS = [
  {
    id: 'p1',
    name: 'Native Base',
    description: 'A premium, biologically active substrate designed to kickstart your ecological growing journey and build robust fungal networks.',
    price: 18.95,
    category: 'Products',
    image: 'https://www.nativebiota.com/product-page/nativebase'
  },
  {
    id: 'p2',
    name: 'Native Guard Pest Repellent',
    description: 'Contains diatomaceous earth and activated biochar producing a sharp crystallised surface to repel soft bodied insects.',
    price: 14.95,
    category: 'Products',
    image: 'https://www.nativebiota.com/product-page/nativebase'
  },
  {
    id: 'p3',
    name: 'Winter Cover Crop (200g)',
    description: 'Diverse cover crop seeds to protect bare soil, increase organic matter and build fungal dominance over winter.',
    price: 4.95,
    category: 'Seeds',
    image: 'https://www.nativebiota.com/product-page/nativebase'
  },
  {
    id: 'p4',
    name: 'Worm Castings (5L)',
    description: 'Premium vermicompost teeming with beneficial microbes. The perfect bio-amendment for living soil.',
    price: 13.95,
    category: 'Minerals',
    image: 'https://www.nativebiota.com/product-page/nativebase'
  },
  {
    id: 'c1',
    name: 'Composting 101',
    description: 'An introduction to the many ways of composting. Learn how to convert waste into rich organic fertilizer.',
    price: 25.00,
    category: 'Courses',
    image: 'https://www.nativebiota.com/product-page/nativebase'
  },
  {
    id: 'c2',
    name: 'Worm Farming Masterclass',
    description: 'Composting with worms - A microbial revolution. Perfect for home and garden ecological growers.',
    price: 25.00,
    category: 'Courses',
    image: 'https://www.nativebiota.com/product-page/nativebase'
  }
];

const RESOURCES = [
  {
    id: 'r1',
    title: 'Biological Application Protocol',
    description: 'A comprehensive guide on when and how to apply bio-amendments for maximum microbial retention.',
    url: 'https://www.nativebiota.com/_files/ugd/c171a3_c31e143a9a7d438ea60e9a50050d6449.pdf'
  },
  {
    id: 'r2',
    title: 'Living Soil Transition Guide',
    description: 'Step-by-step instructions for transitioning from conventional fertilizers to ecological growing.',
    url: 'https://www.nativebiota.com/_files/ugd/c171a3_16553604f1594057a8d3a1d5c08ec520.pdf'
  },
  {
    id: 'r3',
    title: 'Soil Food Web Analysis',
    description: 'Detailed insights and microscopic analysis of healthy native biota structures.',
    url: 'https://www.nativebiota.com/_files/ugd/c171a3_f60721c15b054a4ab1ce9d3c5779f0b4.pdf'
  }
];

export default function App() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activePdf, setActivePdf] = useState(null); 

  // --- Admin Logic ---
  const handleSaveProduct = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = {
      id: editingProduct?.id || 'p' + Date.now(),
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      category: formData.get('category'),
      image: formData.get('image') || 'https://www.nativebiota.com/product-page/nativebase'
    };

    if (editingProduct?.id) {
      setProducts(prev => prev.map(p => p.id === productData.id ? productData : p));
      setCart(prev => prev.map(item => item.id === productData.id ? { ...item, ...productData } : item));
    } else {
      setProducts(prev => [...prev, productData]);
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    removeFromCart(id);
  };

  // --- Cart Logic ---
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Lock body scroll when modals are open
  useEffect(() => {
    if (isCartOpen || isCheckoutOpen || isMobileMenuOpen || isProductModalOpen || activePdf) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isCartOpen, isCheckoutOpen, isMobileMenuOpen, isProductModalOpen, activePdf]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-emerald-200">
      {/* --- Navigation --- */}
      <nav className="fixed top-0 w-full bg-stone-50/90 backdrop-blur-md z-40 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <Leaf className="h-8 w-8 text-emerald-700" />
              <span className="font-bold text-xl tracking-widest text-emerald-900 uppercase">
                Native Biota
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#ethos" className="text-stone-600 hover:text-emerald-700 font-medium transition-colors">Our Ethos</a>
              <a href="#shop" className="text-stone-600 hover:text-emerald-700 font-medium transition-colors">Shop</a>
              <a href="#projects" className="text-stone-600 hover:text-emerald-700 font-medium transition-colors">Projects</a>
              <a href="#resources" className="text-stone-600 hover:text-emerald-700 font-medium transition-colors">Resources</a>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-stone-600 hover:text-emerald-700 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-emerald-600 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-4">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-stone-600"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-emerald-600 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-stone-600 hover:text-emerald-700 focus:outline-none"
              >
                <Menu className="h-7 w-7" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex justify-end">
          <div className="w-64 bg-stone-50 h-full p-6 shadow-2xl flex flex-col">
            <button onClick={() => setIsMobileMenuOpen(false)} className="self-end p-2 mb-8 text-stone-500 hover:text-stone-800">
              <X className="h-6 w-6" />
            </button>
            <a href="#ethos" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-stone-800 py-4 border-b border-stone-200">Our Ethos</a>
            <a href="#shop" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-stone-800 py-4 border-b border-stone-200">Shop</a>
            <a href="#projects" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-stone-800 py-4 border-b border-stone-200">Projects</a>
            <a href="#resources" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-stone-800 py-4 border-b border-stone-200">Resources</a>
          </div>
        </div>
      )}

      {/* --- Hero Section --- */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1466692476877-2410be520ee4?auto=format&fit=crop&q=80&w=2000" 
            alt="Ecological farming" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-50/80 to-stone-50"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-emerald-700 font-semibold tracking-wider uppercase text-sm mb-4 block">
            Welcome to Native Biota
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-stone-900 tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
            Ecological Growing for <br className="hidden md:block"/> Healthy Microbiomes
          </h1>
          <p className="mt-4 text-xl text-stone-600 max-w-2xl mx-auto mb-10">
            For soil. For plants. For people. For the planet. We provide sustainable inputs, education, and community tools to regenerate the earth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#shop" 
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Shop Bio-Amendments
            </a>
            <a 
              href="#ethos" 
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-full transition-all"
            >
              Read Our Ethos
            </a>
          </div>
        </div>
      </section>

      {/* --- Ethos Section --- */}
      <section id="ethos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-stone-900 mb-4">Why Ecological Growing?</h2>
            <div className="w-24 h-1 bg-emerald-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe2 className="h-8 w-8 text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-stone-800">Planetary Health</h3>
              <p className="text-stone-600 leading-relaxed">
                Modern agriculture has broken the relationship between soil and plant. We aim to restore carbon cycles, improve water retention, and protect biodiversity.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sprout className="h-8 w-8 text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-stone-800">Fungal Dominance</h3>
              <p className="text-stone-600 leading-relaxed">
                We foster diverse microbial communities and intact soil structures, supporting plants in expressing their full genetic potential without chemicals.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="h-8 w-8 text-emerald-700" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-stone-800">Earth Positive</h3>
              <p className="text-stone-600 leading-relaxed">
                From our hemp-derived soaps to vermicompost, our inputs are designed to regenerate ecosystems while producing truly nourishing results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Shop Section --- */}
      <section id="shop" className="py-24 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-stone-900 mb-2">Sustainable Retail</h2>
              <p className="text-stone-600">Bio amendments, education & ecological tools.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {isAdmin && (
              <div 
                onClick={() => { setEditingProduct({}); setIsProductModalOpen(true); }}
                className="bg-stone-100 border-2 border-dashed border-stone-300 rounded-2xl flex flex-col items-center justify-center text-stone-500 hover:text-emerald-700 hover:border-emerald-500 hover:bg-emerald-50 transition-all cursor-pointer min-h-[400px] shadow-sm hover:shadow-xl"
              >
                <Plus className="w-12 h-12 mb-4" />
                <span className="font-bold text-lg">Add New Product</span>
              </div>
            )}
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col relative">
                {isAdmin && (
                  <div className="absolute top-4 right-4 z-20 flex gap-2">
                    <button 
                      onClick={() => { setEditingProduct(product); setIsProductModalOpen(true); }}
                      className="p-2 bg-white/90 hover:bg-white text-stone-700 rounded-full shadow-md transition-colors backdrop-blur-sm"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 bg-white/90 hover:bg-red-50 text-red-600 rounded-full shadow-md transition-colors backdrop-blur-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className="relative h-64 overflow-hidden bg-stone-200">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-emerald-800 rounded-full">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-stone-900 mb-2 leading-tight">{product.name}</h3>
                  <p className="text-stone-600 text-sm mb-6 flex-grow">{product.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-extrabold text-stone-900">£{product.price.toFixed(2)}</span>
                    <button 
                      onClick={() => addToCart(product)}
                      className="flex items-center gap-2 bg-stone-900 hover:bg-emerald-700 text-white px-4 py-2 rounded-full font-medium transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Resources Section --- */}
      <section id="resources" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-stone-900 mb-4">Grower Resources</h2>
            <div className="w-24 h-1 bg-emerald-600 mx-auto rounded-full mb-6"></div>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Access our free protocols, research, and guides to help you transition to ecological growing methods and build a thriving microbiome.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {RESOURCES.map((resource) => (
              <button 
                key={resource.id} 
                onClick={() => setActivePdf(resource)}
                className="group flex flex-col text-left p-8 bg-stone-50 border border-stone-200 rounded-2xl hover:border-emerald-500 hover:shadow-xl transition-all duration-300 w-full"
              >
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <FileText className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">{resource.title}</h3>
                <p className="text-stone-600 mb-8 flex-grow">{resource.description}</p>
                <div className="flex items-center text-emerald-700 font-semibold group-hover:text-emerald-800 mt-auto">
                  <FileText className="w-5 h-5 mr-2" />
                  Read Document
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-stone-900 text-stone-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Leaf className="h-6 w-6 text-emerald-500" />
              <span className="font-bold text-xl tracking-widest text-white uppercase">Native Biota</span>
            </div>
            <p className="text-stone-400 mb-6 max-w-sm">
              Supporting the transition from extractive growing to ecological growing, from simplified systems to living complexity.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Home</a></li>
              <li><a href="#ethos" className="hover:text-emerald-400 transition-colors">Our Ethos</a></li>
              <li><a href="#shop" className="hover:text-emerald-400 transition-colors">Shop</a></li>
              <li><a href="#resources" className="hover:text-emerald-400 transition-colors">Resources</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Refund Policy</a></li>
              <li>
                <button onClick={() => setIsAdmin(!isAdmin)} className="hover:text-emerald-400 transition-colors flex items-center gap-2 mt-4 text-stone-500 hover:text-stone-300">
                  <Settings className="w-4 h-4"/> {isAdmin ? 'Exit Admin Mode' : 'Admin Login'}
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-stone-800 text-sm text-stone-500 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Native Biota. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <CreditCard className="w-6 h-6 opacity-50" />
            <Lock className="w-6 h-6 opacity-50" />
          </div>
        </div>
      </footer>

      {/* --- Cart Sidebar Drawer --- */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-md w-full flex">
            <div className="w-full h-full bg-white shadow-2xl flex flex-col animate-slide-in-right">
              {/* Cart Header */}
              <div className="px-6 py-6 border-b border-stone-100 flex items-center justify-between bg-stone-50">
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-emerald-700" />
                  Your Cart ({cartItemCount})
                </h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-stone-500 space-y-4">
                    <Sprout className="w-16 h-16 text-stone-200" />
                    <p className="text-lg">Your cart is currently empty.</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="text-emerald-700 font-medium hover:underline"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-6">
                    {cart.map((item) => (
                      <li key={item.id} className="flex gap-4">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=800";
                          }}
                          className="w-20 h-20 object-cover rounded-lg border border-stone-100" 
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="text-sm font-bold text-stone-900 leading-tight">{item.name}</h3>
                            <p className="text-stone-500 text-sm mt-1">£{item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-stone-200 rounded-md">
                              <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-stone-100 text-stone-600 rounded-l-md"><Minus className="w-4 h-4" /></button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-stone-100 text-stone-600 rounded-r-md"><Plus className="w-4 h-4" /></button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="border-t border-stone-100 p-6 bg-stone-50">
                  <div className="flex justify-between text-base font-medium text-stone-900 mb-4">
                    <p>Subtotal</p>
                    <p>£{cartTotal.toFixed(2)}</p>
                  </div>
                  <p className="text-sm text-stone-500 mb-6">Shipping and taxes calculated at checkout.</p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-colors shadow-lg shadow-emerald-700/20"
                  >
                    Checkout <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- Admin Product Modal --- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative my-8 animate-slide-in-right" style={{ animationName: 'none', transform: 'scale(1)' }}>
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                {editingProduct?.id ? <Edit className="w-5 h-5 text-emerald-700" /> : <Plus className="w-5 h-5 text-emerald-700" />}
                {editingProduct?.id ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button 
                onClick={() => { setIsProductModalOpen(false); setEditingProduct(null); }}
                className="p-2 text-stone-400 hover:text-stone-600 rounded-full hover:bg-stone-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Product Name</label>
                <input required name="name" defaultValue={editingProduct?.name} type="text" className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                <textarea required name="description" defaultValue={editingProduct?.description} rows="3" className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 outline-none"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Price (£)</label>
                  <input required name="price" defaultValue={editingProduct?.price} type="number" step="0.01" min="0" className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Category</label>
                  <input required name="category" defaultValue={editingProduct?.category} type="text" className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Image URL</label>
                <input required name="image" defaultValue={editingProduct?.image || 'https://www.nativebiota.com/product-page/nativebase'} type="url" className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg font-medium transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-medium transition-colors flex items-center gap-2"><Save className="w-4 h-4"/> Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Dynamic PDF Viewer Modal --- */}
      {activePdf && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6 bg-stone-900/80 backdrop-blur-sm">
          <div className="bg-white w-full h-full max-w-5xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-in-right" style={{ animationName: 'none', transform: 'scale(1)' }}>
            <div className="px-4 sm:px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <h2 className="text-lg sm:text-xl font-bold text-stone-900 flex items-center gap-2 truncate pr-4">
                <FileText className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                <span className="truncate">{activePdf.title}</span>
              </h2>
              <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                <a 
                  href={activePdf.url} 
                  download 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </a>
                <button 
                  onClick={() => setActivePdf(null)}
                  className="p-2 text-stone-500 hover:text-stone-800 rounded-full hover:bg-stone-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-stone-200 w-full relative">
              {/* Fallback link for mobile browsers that don't support inline PDFs well */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-stone-100 z-0 sm:hidden">
                <FileText className="w-16 h-16 text-stone-300 mb-4" />
                <p className="text-stone-600 mb-4">Your browser might not support inline PDF viewing.</p>
                <a 
                  href={activePdf.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-emerald-700 text-white font-medium rounded-lg shadow-md"
                >
                  Open PDF in New Tab
                </a>
              </div>
              
              <iframe 
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(activePdf.url)}&embedded=true`}
                className="w-full h-full border-0 relative z-10 bg-white"
                title={activePdf.title}
              />
            </div>
          </div>
        </div>
      )}

      {/* --- Stripe Checkout Simulation Modal --- */}
      {isCheckoutOpen && (
        <StripeCheckoutMock 
          total={cartTotal} 
          onClose={() => setIsCheckoutOpen(false)} 
          onSuccess={() => {
            setCart([]);
            setIsCheckoutOpen(false);
          }}
        />
      )}

      {/* Basic global styles for animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
}

// --- Stripe Checkout Simulated Component ---
function StripeCheckoutMock({ total, onClose, onSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePay = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative my-8">
        
        {!isProcessing && !isSuccess && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 z-10"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        {isSuccess ? (
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-600">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mb-2">Payment Successful</h2>
            <p className="text-stone-600 mb-6">Thank you for supporting Native Biota. Your order is confirmed.</p>
          </div>
        ) : (
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2 justify-center mb-8">
              <Leaf className="w-6 h-6 text-emerald-700" />
              <span className="font-bold text-lg text-emerald-900 uppercase tracking-widest">Native Biota</span>
            </div>
            
            <div className="text-center mb-8">
              <p className="text-stone-500 text-sm mb-1">Pay Native Biota</p>
              <h2 className="text-4xl font-extrabold text-stone-900">£{total.toFixed(2)}</h2>
            </div>

            <form onSubmit={handlePay} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                  <input required type="email" placeholder="customer@example.com" className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Card Information</label>
                  <div className="border border-stone-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-shadow bg-white">
                    <div className="px-4 py-3 border-b border-stone-200 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-stone-400" />
                      <input required type="text" placeholder="Card number" className="w-full outline-none placeholder-stone-400" />
                    </div>
                    <div className="flex">
                      <input required type="text" placeholder="MM / YY" className="w-1/2 px-4 py-3 outline-none border-r border-stone-200 placeholder-stone-400" />
                      <input required type="text" placeholder="CVC" className="w-1/2 px-4 py-3 outline-none placeholder-stone-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Name on card</label>
                  <input required type="text" placeholder="Full name" className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow" />
                </div>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-colors disabled:bg-stone-400"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <>Pay £{total.toFixed(2)} <Lock className="w-4 h-4 ml-1" /></>
                  )}
                </button>
              </div>
              <p className="text-center text-xs text-stone-400 mt-4 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" /> Powered by Stripe Simulation
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
