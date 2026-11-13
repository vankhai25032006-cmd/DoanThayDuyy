import React, { useState } from 'react';
import { X, Lock, Mail, User, AlertCircle } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isForgot, setIsForgot] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (isForgot) {
      if (!email) {
        setError('Vui lòng nhập email để khôi phục mật khẩu!');
        return;
      }
      setSuccessMsg('Link khôi phục mật khẩu đã được gửi vào email của bạn!');
      return;
    }

    if (!email || !password || (!isLogin && !name)) {
      setError('Vui lòng điền đầy đủ thông tin các trường!');
      return;
    }

    // Giả lập tài khoản đăng nhập mẫu
    if (isLogin) {
      if (email === 'admin@techstore.com' || password.length >= 6) {
        onLoginSuccess({ name: name || 'Khách hàng TechStore', email });
        onClose();
      } else {
        setError('Sai mật khẩu hoặc email không tồn tại! (Mật khẩu từ 6 ký tự trở lên)');
      }
    } else {
      setSuccessMsg('Đăng ký tài khoản thành công! Hãy đăng nhập lại.');
      setIsLogin(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {isForgot ? 'Quên Mật Khẩu' : isLogin ? 'Đăng Nhập TechStore' : 'Đăng Ký Tài Khoản'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/40 text-red-600 text-sm rounded-lg border border-red-200 dark:border-red-900">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-green-50 dark:bg-green-950/40 text-green-600 text-sm rounded-lg border border-green-200 dark:border-green-900">
              {successMsg}
            </div>
          )}

          {!isLogin && !isForgot && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Họ và Tên</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Nhập họ tên của bạn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Địa chỉ Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {!isForgot && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          )}

          {isLogin && !isForgot && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsForgot(true)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Quên mật khẩu?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition-all"
          >
            {isForgot ? 'Gửi Yêu Cầu Khôi Phục' : isLogin ? 'Đăng Nhập Ngay' : 'Đăng Ký Tài Khoản'}
          </button>

          <div className="text-center pt-2">
            {isForgot ? (
              <button
                type="button"
                onClick={() => { setIsForgot(false); setError(''); setSuccessMsg(''); }}
                className="text-sm text-slate-600 dark:text-slate-400 hover:underline"
              >
                Quay lại đăng nhập
              </button>
            ) : (
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMsg(''); }}
                className="text-sm text-slate-600 dark:text-slate-400 hover:underline"
              >
                {isLogin ? 'Chưa có tài khoản? Đăng ký ngay' : 'Đã có tài khoản? Đăng nhập'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}