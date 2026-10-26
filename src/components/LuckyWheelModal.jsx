import React, { useState, useRef, useEffect } from 'react';
import { X, Gift } from 'lucide-react';

const prizes = [
  "Voucher 500k",
  "iPhone 16 Pro",
  "Tai nghe Bluetooth",
  "Củ sạc 20W",
  "Ốp lưng cao cấp",
  "Chúc may mắn!"
];
const colors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];

export default function LuckyWheelModal({ isOpen, onClose, validLuckyCodes, setValidLuckyCodes }) {
  const [inputCode, setInputCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [msg, setMsg] = useState({ text: 'Mua bất kỳ đơn hàng nào để có cơ hội nhận mã quay thưởng!', color: 'text-gray-500' });
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState('');

  const canvasRef = useRef(null);
  const startAngleRef = useRef(0);
  const arc = (2 * Math.PI) / prizes.length;

  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const outsideRadius = 135;
    const textRadius = 95;
    const insideRadius = 30;

    ctx.clearRect(0, 0, 300, 300);

    for (let i = 0; i < prizes.length; i++) {
      const angle = startAngleRef.current + i * arc;
      ctx.fillStyle = colors[i % colors.length];

      ctx.beginPath();
      ctx.arc(150, 150, outsideRadius, angle, angle + arc, false);
      ctx.arc(150, 150, insideRadius, angle + arc, angle, true);
      ctx.fill();

      ctx.save();
      ctx.fillStyle = "white";
      ctx.font = "bold 12px sans-serif";
      ctx.translate(150 + Math.cos(angle + arc / 2) * textRadius, 150 + Math.sin(angle + arc / 2) * textRadius);
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      const text = prizes[i];
      ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
      ctx.restore();
    }
  };

  useEffect(() => {
    if (isOpen) drawWheel();
  }, [isOpen]);

  const verifyCode = () => {
    const formattedCode = inputCode.trim().toUpperCase();
    if (validLuckyCodes.includes(formattedCode)) {
      setIsVerified(true);
      setMsg({ text: '✅ Mã xác thực thành công! Nhấn NÚT QUAY ở tâm bánh xe ngay.', color: 'text-green-600 font-bold' });
    } else {
      setIsVerified(false);
      setMsg({ text: '❌ Mã không hợp lệ hoặc đã sử dụng! Vui lòng đặt hàng để nhận mã mới.', color: 'text-red-600 font-bold' });
    }
  };

  const spinWheel = () => {
    if (!isVerified || isSpinning) return;

    setIsSpinning(true);
    setResult('');

    const spinAngleStart = Math.random() * 10 + 10;
    let spinTime = 0;
    const spinTimeTotal = Math.random() * 3000 + 4000;

    const rotate = () => {
      spinTime += 30;
      if (spinTime >= spinTimeTotal) {
        stopRotate();
        return;
      }
      const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
      startAngleRef.current += (spinAngle * Math.PI / 180);
      drawWheel();
      requestAnimationFrame(rotate);
    };

    rotate();
  };

  const stopRotate = () => {
    // Tính toán góc chuẩn cho Mũi tên ở đỉnh bánh xe (Góc 270 độ / -Math.PI / 2)
    const currentAngle = startAngleRef.current % (2 * Math.PI);
    // Mũi tên ở đỉnh tương ứng góc 1.5 * Math.PI (270 độ)
    let pointerAngle = (1.5 * Math.PI - currentAngle) % (2 * Math.PI);
    if (pointerAngle < 0) pointerAngle += 2 * Math.PI;

    const index = Math.floor(pointerAngle / arc);
    const prize = prizes[index % prizes.length];

    setResult(prize);
    setIsSpinning(false);
    setIsVerified(false);

    const codeUsed = inputCode.trim().toUpperCase();
    setValidLuckyCodes(prev => prev.filter(c => c !== codeUsed));
    setMsg({ text: '🎉 Bạn đã sử dụng lượt quay của mã này!', color: 'text-yellow-600 font-bold' });
  };

  const easeOut = (t, b, c, d) => {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
  };

  if (!isOpen) return null;

  return (
    <div translate="no" className="notranslate fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
        <div className="p-4 bg-gradient-to-r from-red-600 to-orange-500 text-white flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2"><Gift className="text-yellow-300" /> Vòng Quay May Mắn</h3>
          <button onClick={onClose} className="text-white hover:text-yellow-300 text-2xl font-bold"><X /></button>
        </div>
        <div className="p-6 flex flex-col items-center space-y-4 text-center">
          <div className="w-full bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nhập Mã Dự Thưởng (Nhận sau khi mua hàng):</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={inputCode} 
                onChange={e => setInputCode(e.target.value)} 
                placeholder="VD: LUCKY-1234" 
                className="flex-1 border rounded-lg px-3 py-2 text-sm uppercase font-bold text-center focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button onClick={verifyCode} className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition">Xác thực</button>
            </div>
            <p className={`text-xs mt-2 ${msg.color}`}>{msg.text}</p>
          </div>

          <div className="relative w-72 h-72 my-2">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-yellow-400 drop-shadow"></div>
            <canvas ref={canvasRef} width="300" height="300" className="w-full h-full rounded-full shadow-lg border-4 border-yellow-400"></canvas>
            <button 
              disabled={!isVerified || isSpinning} 
              onClick={spinWheel} 
              translate="no"
              className={`notranslate absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 bg-gradient-to-r from-yellow-400 to-amber-500 text-red-900 font-extrabold rounded-full border-4 border-white shadow-xl flex items-center justify-center text-sm uppercase transition ${(!isVerified || isSpinning) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}`}
            >
              QUAY
            </button>
          </div>

          {result && (
            <div className="p-3 bg-yellow-100 text-yellow-900 font-bold rounded-lg text-sm border border-yellow-300 w-full animate-pulse">
              🎉 Chúc mừng bạn đã trúng: <span className="text-red-600 uppercase">{result}</span>!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}