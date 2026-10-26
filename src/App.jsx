import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, Search, Store, Disc3, User, LogOut, CheckCircle2, 
  ShieldCheck, Truck, RefreshCw, X, Heart, Moon, Sun, Scale, Plus, Trash2, 
  DollarSign, ShoppingBag, Package, TrendingUp, ClipboardList, Loader2, RotateCcw, QrCode, Wallet, MessageSquare, Send
} from 'lucide-react';
import LuckyWheelModal from './components/LuckyWheelModal';

export default function App() {
  // --- STATE QUẢN LÝ CƠ BẢN & GIAO DIỆN ---
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [darkMode, setDarkMode] = useState(false);

  // --- STATE MODALS, VÒNG QUAY & CHATBOT ---
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWheelOpen, setIsWheelOpen] = useState(false); // Vòng quay
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isOrdersUserOpen, setIsOrdersUserOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // Chatbot
  const [adminTab, setAdminTab] = useState('stats');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // --- STATE TIN NHẮN CHATBOT ---
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Dạ chào bạn! TechStore có thể hỗ trợ tư vấn điện thoại, laptop hay phụ kiện gì cho bạn ạ?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // --- STATE YÊU THÍCH, SO SÁNH & VOUCHER ---
  const [wishlist, setWishlist] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // --- STATE DỮ LIỆU ĐƠN HÀNG & MÃ VÒNG QUAY ---
  const [orderHistory, setOrderHistory] = useState([
    {
      id: 'HD-883921',
      date: '18/10/2026',
      customer: 'Trần Văn Khải',
      phone: '0905123456',
      address: 'Đà Nẵng',
      total: 37990000,
      itemCount: 1,
      luckyCode: 'LUCKY-9921',
      status: 'completed',
      paymentMethod: 'COD',
      returnReason: ''
    }
  ]);

  const [validLuckyCodes, setValidLuckyCodes] = useState(['LUCKY-9921']);
  const [myCodes, setMyCodes] = useState([{ code: 'LUCKY-9921', used: false }]);

  const [cart, setCart] = useState([]);
  const [checkoutInfo, setCheckoutInfo] = useState({ 
    name: 'Trần Văn Khải', 
    phone: '0905123456', 
    address: 'Thanh Khê, Đà Nẵng',
    paymentMethod: 'COD' 
  });

  const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  // GỌI API CÔNG NGHỆ DUMMYJSON
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('https://dummyjson.com/products/category/smartphones?limit=0').then(r => r.json()),
      fetch('https://dummyjson.com/products/category/laptops?limit=0').then(r => r.json()),
      fetch('https://dummyjson.com/products/category/mobile-accessories?limit=0').then(r => r.json())
    ])
    .then(([phonesData, laptopsData, accsData]) => {
      const mapItem = (item, cat) => ({
        id: item.id,
        name: item.title,
        price: Math.round(item.price * 25000),
        oldPrice: Math.round(item.price * 28000),
        category: cat,
        image: item.thumbnail,
        badge: item.rating > 4.5 ? 'Bán chạy' : 'Mới'
      });

      const phones = (phonesData.products || []).map(p => mapItem(p, 'phone'));
      const laptops = (laptopsData.products || []).map(p => mapItem(p, 'laptop'));
      const accs = (accsData.products || []).map(p => mapItem(p, 'accessory'));

      setProductList([...phones, ...laptops, ...accs]);
      setLoading(false);
    })
    .catch(err => {
      console.error("Lỗi gọi API Công nghệ:", err);
      setLoading(false);
    });
  }, []);

  // CHATBOT TỰ ĐỘNG
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    const newMessages = [...chatMessages, { sender: 'user', text: userText }];
    setChatMessages(newMessages);
    setInputMessage('');

    setTimeout(() => {
      let botReply = "Dạ, hiện tại TechStore có rất nhiều mẫu điện thoại, laptop chính hãng giá tốt. Bạn có thể bấm vào từng danh mục phía trên để xem chi tiết ạ!";
      const lower = userText.toLowerCase();
      if (lower.includes('iphone') || lower.includes('điện thoại') || lower.includes('phone')) {
        botReply = "Bên shop có rất nhiều dòng Smartphone cao cấp như iPhone, Samsung, OPPO... Bạn chọn danh mục 'Điện thoại' ở phía trên nhé!";
      } else if (lower.includes('laptop') || lower.includes('máy tính')) {
        botReply = "Các dòng Laptop học tập và gaming cấu hình mạnh đang có sẵn giá rất ưu đãi kèm bảo hành 12 tháng ạ!";
      } else if (lower.includes('giảm giá') || lower.includes('mã') || lower.includes('voucher')) {
        botReply = "Bạn có thể sử dụng mã giảm giá 'TECH10' (giảm 10%) hoặc 'FREESHIP' (giảm 50k) khi thanh toán giỏ hàng nhé!";
      } else if (lower.includes('bảo hành') || lower.includes('đổi trả')) {
        botReply = "TechStore cam kết bảo hành chính hãng 12 tháng và hỗ trợ 1 đổi 1 trong 30 ngày nếu có lỗi từ nhà sản xuất ạ!";
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 600);
  };

  // TÍNH TỔNG DOANH THU THỰC TẾ
  const activeOrders = orderHistory.filter(o => o.status !== 'returned');
  const totalRevenue = activeOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrdersCount = activeOrders.length;
  const totalProductsSold = activeOrders.reduce((sum, order) => sum + order.itemCount, 0);

  // Lọc sản phẩm
  let filteredProducts = productList.filter(item => {
    const matchCat = currentCategory === 'all' || item.category === currentCategory;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  if (sortOption === 'asc') filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  else if (sortOption === 'desc') filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);

  // GIỎ HÀNG
  const addToCart = (product) => {
    setCart(prev => {
      const exist = prev.find(item => item.id === product.id);
      if (exist) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const rawCartPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalCartPrice = Math.max(0, rawCartPrice - discount);

  // ĐẶT HÀNG & TẠO MÃ VÒNG QUAY MAY MẮN
  const handleConfirmOrder = (e) => {
    e.preventDefault();
    if (!checkoutInfo.name || !checkoutInfo.phone || !checkoutInfo.address) return alert("Vui lòng điền đủ thông tin!");

    const newCode = 'LUCKY-' + Math.floor(1000 + Math.random() * 9000);
    setValidLuckyCodes(prev => [...prev, newCode]);
    setMyCodes(prev => [...prev, { code: newCode, used: false }]);

    const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
    const orderId = 'HD-' + Math.floor(100000 + Math.random() * 900000);

    const newOrder = {
      id: orderId,
      date: new Date().toLocaleDateString('vi-VN'),
      customer: checkoutInfo.name,
      phone: checkoutInfo.phone,
      address: checkoutInfo.address,
      total: totalCartPrice,
      itemCount: totalItems,
      luckyCode: newCode,
      status: 'completed',
      paymentMethod: checkoutInfo.paymentMethod,
      returnReason: ''
    };

    setOrderHistory(prev => [newOrder, ...prev]);
    alert(`ĐẶT HÀNG THÀNH CÔNG!\n\nMã đơn: ${orderId}\nSố tiền: ${formatCurrency(totalCartPrice)}\nBạn nhận được 1 Mã Vòng Quay May Mắn: ${newCode}`);

    setCart([]);
    setDiscount(0);
    setCouponCode('');
    setIsCheckoutOpen(false);
  };

  // TRẢ HÀNG HOÀN TIỀN
  const handleRequestReturn = (orderId) => {
    const reason = prompt("Vui lòng nhập lý do bạn muốn trả hàng:");
    if (!reason) return;
    setOrderHistory(prev => prev.map(o => o.id === orderId ? { ...o, status: 'return_requested', returnReason: reason } : o));
    alert("Yêu cầu trả hàng đã được gửi đến Admin!");
  };

  const handleApproveReturn = (orderId) => {
    if (confirm("Xác nhận duyệt TRẢ HÀNG & HOÀN TIỀN?")) {
      setOrderHistory(prev => prev.map(o => o.id === orderId ? { ...o, status: 'returned' } : o));
      alert("Đã duyệt hoàn tiền thành công!");
    }
  };

  return (
    <div translate="no" className={`notranslate ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} min-h-screen font-sans transition-colors duration-300 relative pb-12`}>
      {/* HEADER */}
      <header className="bg-red-600 text-white sticky top-0 z-40 shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <a href="#" className="text-2xl font-black tracking-wider flex items-center gap-2">
            <Store /> TECH<span className="text-yellow-300">STORE</span>
          </a>

          {/* Ô TÌM KIẾM CÓ NỀN TRẮNG CHUẨN ĐẸP */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
            <input 
              type="text" 
              placeholder="Bạn cần tìm điện thoại, laptop, phụ kiện...?" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-4 pr-10 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-sm"
            />
            <Search className="absolute right-3 top-2.5 text-gray-500 w-5 h-5" />
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 bg-red-700 hover:bg-red-800 rounded-lg text-yellow-300 transition">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button onClick={() => setIsOrdersUserOpen(true)} className="bg-red-700 hover:bg-red-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1 border border-red-500">
              <Package className="w-4 h-4 text-yellow-300" /> Đơn Hàng Của Tôi
            </button>

            <button onClick={() => setIsAdminOpen(true)} className="bg-yellow-400 text-red-900 font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-yellow-300 transition flex items-center gap-1 shadow">
              <TrendingUp className="w-4 h-4" /> Báo Cáo Admin
            </button>

            <div onClick={() => setIsCartOpen(true)} className="relative flex items-center gap-2 bg-red-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-red-800 transition">
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Giỏ hàng</span>
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-900 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* DANH MỤC */}
      <nav className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-sm border-b`}>
        <div className="container mx-auto px-4 flex overflow-x-auto space-x-6 py-3 text-sm font-semibold whitespace-nowrap">
          {[
            { id: 'all', label: 'Tất cả đồ công nghệ' },
            { id: 'phone', label: 'Điện thoại (Smartphones)' },
            { id: 'laptop', label: 'Laptops & Máy tính' },
            { id: 'accessory', label: 'Phụ kiện công nghệ' },
          ].map(cat => (
            <button 
              key={cat.id} 
              onClick={() => setCurrentCategory(cat.id)}
              className={`pb-1 transition ${currentCategory === cat.id ? 'text-red-600 border-b-2 border-red-600' : 'hover:text-red-600'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="container mx-auto px-4 py-6">
        {/* THANH THÔNG BÁO VÍ MÃ VÒNG QUAY NẾU CÓ */}
        {myCodes.length > 0 && (
          <div className="mb-6 bg-gradient-to-r from-amber-500 to-red-500 p-4 rounded-xl text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg flex items-center gap-2">Ví Mã Vòng Quay May Mắn của bạn</h3>
              <p className="text-xs text-yellow-100 mt-1">Bấm vào nút Vòng Quay ở góc dưới để quay trúng thưởng!</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {myCodes.map((item, idx) => (
                <div key={idx} className={`px-3 py-1.5 rounded-lg font-mono font-bold text-sm bg-white text-red-600 shadow flex items-center gap-1 ${item.used ? 'line-through opacity-50' : ''}`}>
                  {item.code} {item.used && <CheckCircle2 className="w-4 h-4 text-gray-400"/>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold border-l-4 border-red-600 pl-3">Danh Sách Sản Phẩm Công Nghệ</h2>
          <select value={sortOption} onChange={e => setSortOption(e.target.value)} className={`${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-800'} border rounded-lg px-3 py-1.5 text-sm`}>
            <option value="default">Sắp xếp mặc định</option>
            <option value="asc">Giá: Thấp đến Cao</option>
            <option value="desc">Giá: Cao đến Thấp</option>
          </select>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-red-600" />
            <p className="text-sm font-semibold text-gray-500">Đang tải toàn bộ kho sản phẩm công nghệ...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-sm border p-4 flex flex-col justify-between hover:-translate-y-1 transition duration-200 relative group`}>
                <div className="cursor-pointer" onClick={() => setSelectedProduct(product)}>
                  <div className="relative overflow-hidden rounded-lg mb-3 bg-gray-50 dark:bg-gray-900 flex items-center justify-center h-48 p-2">
                    <img src={product.image} alt={product.name} className="h-44 w-full object-contain group-hover:scale-105 transition duration-300" />
                    {product.badge && <span className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg uppercase shadow">{product.badge}</span>}
                  </div>
                  <h3 className="font-semibold text-sm h-10 line-clamp-2 group-hover:text-red-600 transition">{product.name}</h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <p className="text-red-600 font-bold text-base">{formatCurrency(product.price)}</p>
                    {product.oldPrice && <p className="text-gray-400 text-xs line-through">{formatCurrency(product.oldPrice)}</p>}
                  </div>
                </div>
                <button onClick={() => addToCart(product)} className="mt-4 w-full bg-red-50 text-red-600 font-semibold py-2 rounded-lg hover:bg-red-600 hover:text-white transition text-xs">Thêm vào giỏ</button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* --- NÚT BẬT VÒNG QUAY MAY MẮN (ĐÃ KHÔI PHỤC CHUẨN GÓC DƯỚI) --- */}
      <div onClick={() => setIsWheelOpen(true)} className="fixed left-4 bottom-4 z-40 flex flex-col items-center cursor-pointer group">
        <div className="bg-yellow-400 text-red-900 font-bold text-xs px-2.5 py-1 rounded-full shadow-lg mb-1 animate-bounce border border-white">Quay Trúng Quà!</div>
        <div className="w-14 h-14 bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-2xl border-4 border-white group-hover:scale-110 transition duration-300">
          <Disc3 className="w-8 h-8 animate-spin" />
        </div>
      </div>

      {/* --- NÚT BẬT CHATBOT GÓC DƯỚI BÊN PHẢI --- */}
      <div className="fixed right-4 bottom-4 z-50">
        {!isChatOpen ? (
          <button 
            onClick={() => setIsChatOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2 transition duration-300 hover:scale-105 border-2 border-white"
          >
            <MessageSquare className="w-6 h-6 animate-pulse" />
            <span className="text-xs font-bold hidden sm:inline">Hỗ trợ trực tuyến</span>
          </button>
        ) : (
          <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white w-80 sm:w-96 rounded-2xl shadow-2xl border dark:border-gray-700 flex flex-col h-[450px] overflow-hidden">
            <div className="bg-red-600 text-white p-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                <h4 className="font-bold text-sm">Trợ lý ảo TechStore</h4>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-white hover:text-yellow-300 font-bold text-lg">&times;</button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs bg-gray-50 dark:bg-gray-900">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-2.5 rounded-xl max-w-[80%] leading-relaxed ${msg.sender === 'user' ? 'bg-red-600 text-white rounded-br-none' : 'bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm rounded-bl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2 border-t dark:border-gray-700 bg-white dark:bg-gray-800 flex gap-1 overflow-x-auto text-[10px]">
              <button onClick={() => setInputMessage("Tư vấn điện thoại")} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded whitespace-nowrap hover:bg-red-100 hover:text-red-600">📱 Điện thoại</button>
              <button onClick={() => setInputMessage("Tìm laptop")} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded whitespace-nowrap hover:bg-red-100 hover:text-red-600">💻 Laptop</button>
              <button onClick={() => setInputMessage("Mã giảm giá")} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded whitespace-nowrap hover:bg-red-100 hover:text-red-600">🎁 Mã giảm giá</button>
            </div>

            <form onSubmit={handleSendMessage} className="p-2 border-t dark:border-gray-700 bg-white dark:bg-gray-800 flex gap-2">
              <input 
                type="text" 
                placeholder="Nhập tin nhắn..." 
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                className="flex-1 border dark:border-gray-700 dark:bg-gray-900 px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-red-600"
              />
              <button type="submit" className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition"><Send className="w-4 h-4" /></button>
            </form>
          </div>
        )}
      </div>

      {/* MODAL VÒNG QUAY MAY MẮN (LUCKY WHEEL) */}
      <LuckyWheelModal isOpen={isWheelOpen} onClose={() => setIsWheelOpen(false)} validLuckyCodes={validLuckyCodes} setValidLuckyCodes={setValidLuckyCodes} />

      {/* MODAL CHI TIẾT SẢN PHẨM */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative flex flex-col md:flex-row max-h-[90vh]">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-3 right-3 z-10 bg-gray-100 dark:bg-gray-700 rounded-full p-1.5"><X className="w-5 h-5" /></button>
            <div className="md:w-1/2 p-6 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
              <img src={selectedProduct.image} className="max-h-64 object-contain" />
            </div>
            <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
              <div>
                <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
                <div className="my-3 flex items-baseline gap-3">
                  <span className="text-2xl font-black text-red-600">{formatCurrency(selectedProduct.price)}</span>
                </div>
                <div className="space-y-2 border-t border-b py-3 text-xs text-gray-500 dark:text-gray-300">
                  <p className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-green-600" /> Bảo hành 12 tháng chính hãng</p>
                  <p className="flex items-center gap-2"><Truck className="w-4 h-4 text-blue-600" /> Giao hàng toàn quốc trong 24h</p>
                </div>
              </div>
              <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="mt-4 w-full bg-red-600 text-white font-bold py-2.5 rounded-xl hover:bg-red-700 transition">Thêm vào giỏ hàng</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ĐƠN HÀNG CỦA TÔI */}
      {isOrdersUserOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button onClick={() => setIsOrdersUserOpen(false)} className="absolute top-3 right-3 text-xl font-bold">&times;</button>
            <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2"><Package /> Đơn Hàng Của Tôi ({orderHistory.length})</h3>

            <div className="space-y-3">
              {orderHistory.map(order => (
                <div key={order.id} className="p-4 border dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-red-600 text-sm">{order.id} <span className="text-gray-400 font-normal">({order.date})</span></p>
                    <p className="font-semibold mt-1">Tổng tiền: <span className="text-green-600 text-sm">{formatCurrency(order.total)}</span></p>
                    <p className="text-gray-500">Thanh toán: <span className="font-bold text-blue-600">{order.paymentMethod === 'QR' ? 'Chuyển khoản QR' : 'Tiền mặt (COD)'}</span></p>
                    <div className="mt-2">
                      {order.status === 'completed' && <span className="bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded">Giao thành công</span>}
                      {order.status === 'return_requested' && <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">Chờ duyệt trả hàng</span>}
                      {order.status === 'returned' && <span className="bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded">Đã hoàn tiền</span>}
                    </div>
                  </div>
                  {order.status === 'completed' && (
                    <button onClick={() => handleRequestReturn(order.id)} className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow transition">
                      <RotateCcw className="w-4 h-4"/> Yêu cầu Trả hàng
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL ADMIN */}
      {isAdminOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white w-full max-w-3xl rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsAdminOpen(false)} className="absolute top-3 right-3 text-xl font-bold">&times;</button>
            <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2"><TrendingUp /> Bảng Quản Trị Admin</h3>

            <div className="flex border-b dark:border-gray-700 mb-6 gap-4">
              <button onClick={() => setAdminTab('stats')} className={`pb-2 font-bold text-sm flex items-center gap-1 ${adminTab === 'stats' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-400'}`}><DollarSign className="w-4 h-4"/> Thống kê</button>
              <button onClick={() => setAdminTab('orders')} className={`pb-2 font-bold text-sm flex items-center gap-1 ${adminTab === 'orders' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-400'}`}><ClipboardList className="w-4 h-4"/> Quản lý đơn & Trả hàng</button>
            </div>

            {adminTab === 'stats' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-500 to-emerald-700 text-white p-4 rounded-xl shadow">
                  <p className="text-xs font-semibold text-green-100 flex items-center gap-1"><DollarSign /> TỔNG DOANH THU</p>
                  <p className="text-2xl font-black mt-2">{formatCurrency(totalRevenue)}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-indigo-700 text-white p-4 rounded-xl shadow">
                  <p className="text-xs font-semibold text-blue-100 flex items-center gap-1"><ShoppingBag /> ĐƠN THÀNH CÔNG</p>
                  <p className="text-2xl font-black mt-2">{totalOrdersCount} Đơn</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-amber-700 text-white p-4 rounded-xl shadow">
                  <p className="text-xs font-semibold text-orange-100 flex items-center gap-1"><Package /> SẢN PHẨM ĐÃ BÁN</p>
                  <p className="text-2xl font-black mt-2">{totalProductsSold} Cái</p>
                </div>
              </div>
            )}

            {adminTab === 'orders' && (
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-gray-700 dark:text-gray-300">Danh sách đơn hàng & Xử lý trả hàng:</h4>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {orderHistory.map((order) => (
                    <div key={order.id} className="p-3 border dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-red-600">{order.id} ({order.date}) - <span className="text-blue-500">{order.paymentMethod === 'QR' ? 'Chuyển khoản QR' : 'Tiền mặt'}</span></p>
                        <p className="font-semibold mt-0.5">Khách: {order.customer} - {order.phone}</p>
                        <p className="text-gray-500">Tiền: {formatCurrency(order.total)}</p>
                      </div>
                      <div className="text-right">
                        {order.status === 'return_requested' && (
                          <button onClick={() => handleApproveReturn(order.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg shadow">Duyệt hoàn tiền</button>
                        )}
                        {order.status === 'returned' && <span className="text-red-500 font-bold">Đã hoàn tiền</span>}
                        {order.status === 'completed' && <span className="text-green-600 font-bold">Thành công</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL GIỎ HÀNG */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
          <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white w-full max-w-md h-full flex flex-col shadow-2xl p-4">
            <div className="flex justify-between items-center border-b dark:border-gray-700 pb-3"><h3 className="font-bold text-lg">Giỏ hàng</h3><button onClick={() => setIsCartOpen(false)} className="text-xl font-bold">&times;</button></div>
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                  <div><h4 className="text-sm font-semibold">{item.name}</h4><p className="text-xs text-red-600 font-bold">{formatCurrency(item.price)}</p></div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, -1)} className="px-2 bg-gray-200 rounded font-bold">-</button>
                    <span className="text-sm font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="px-2 bg-gray-200 rounded font-bold">+</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t dark:border-gray-700 pt-3 space-y-2">
              <p className="font-bold text-lg flex justify-between"><span>Tổng thanh toán:</span> <span className="text-red-600">{formatCurrency(totalCartPrice)}</span></p>
              <button disabled={cart.length === 0} onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} className="w-full bg-red-600 text-white py-2.5 rounded-lg font-bold">Thanh toán</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL THANH TOÁN */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleConfirmOrder} className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-lg border-b dark:border-gray-700 pb-2 text-red-600">Thanh Toán Đơn Hàng</h3>
            
            <div><label className="block text-xs font-semibold mb-1">Họ và tên</label><input type="text" required value={checkoutInfo.name} onChange={e => setCheckoutInfo({...checkoutInfo, name: e.target.value})} className="w-full border p-2 rounded text-sm dark:bg-gray-900" /></div>
            <div><label className="block text-xs font-semibold mb-1">Số điện thoại</label><input type="text" required value={checkoutInfo.phone} onChange={e => setCheckoutInfo({...checkoutInfo, phone: e.target.value})} className="w-full border p-2 rounded text-sm dark:bg-gray-900" /></div>
            <div><label className="block text-xs font-semibold mb-1">Địa chỉ giao hàng</label><textarea required value={checkoutInfo.address} onChange={e => setCheckoutInfo({...checkoutInfo, address: e.target.value})} className="w-full border p-2 rounded text-sm dark:bg-gray-900" /></div>

            <div>
              <label className="block text-xs font-semibold mb-2">Phương thức thanh toán</label>
              <div className="grid grid-cols-2 gap-3">
                <div 
                  onClick={() => setCheckoutInfo({...checkoutInfo, paymentMethod: 'COD'})}
                  className={`p-3 rounded-xl border cursor-pointer flex flex-col items-center justify-center text-center transition ${checkoutInfo.paymentMethod === 'COD' ? 'border-red-600 bg-red-50 dark:bg-red-900/20 text-red-600 font-bold' : 'border-gray-300 dark:border-gray-700'}`}
                >
                  <Wallet className="w-6 h-6 mb-1" />
                  <span className="text-xs">Tiền mặt (COD)</span>
                </div>
                <div 
                  onClick={() => setCheckoutInfo({...checkoutInfo, paymentMethod: 'QR'})}
                  className={`p-3 rounded-xl border cursor-pointer flex flex-col items-center justify-center text-center transition ${checkoutInfo.paymentMethod === 'QR' ? 'border-red-600 bg-red-50 dark:bg-red-900/20 text-red-600 font-bold' : 'border-gray-300 dark:border-gray-700'}`}
                >
                  <QrCode className="w-6 h-6 mb-1" />
                  <span className="text-xs">Quét Mã QR Chuyển khoản</span>
                </div>
              </div>
            </div>

            {checkoutInfo.paymentMethod === 'QR' && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border dark:border-gray-700 text-center space-y-2">
                <p className="text-xs font-bold text-red-600">Quét mã QR bằng App Ngân hàng bất kỳ:</p>
                <div className="bg-white p-2 inline-block rounded-lg shadow">
                  <img 
                    src={`https://img.vietqr.io/image/VCB-0041000123456-compact2.png?amount=${totalCartPrice}&addInfo=TECHSTORE%20THANH%20TOAN`} 
                    alt="QR Chuyển khoản" 
                    className="w-40 h-40 mx-auto object-contain"
                  />
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Số tiền: <b className="text-red-600">{formatCurrency(totalCartPrice)}</b></p>
                <p className="text-[10px] text-gray-400">Nội dung CK: TECHSTORE THANH TOAN</p>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setIsCheckoutOpen(false)} className="flex-1 bg-gray-200 py-2.5 rounded font-bold dark:bg-gray-700">Hủy</button>
              <button type="submit" className="flex-1 bg-red-600 text-white py-2.5 rounded font-bold hover:bg-red-700 transition">Hoàn tất đặt hàng</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}