import React, { useState, useRef, useCallback } from 'react';

interface ImageViewerProps {
  children: React.ReactNode;
  title: string;
  color: 'green' | 'red';
  pros: string[];
  cons?: string[];
}

const ImageViewer: React.FC<ImageViewerProps> = ({ children, title, color, pros, cons }) => {
  const [scale, setScale] = useState(200);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -20 : 20;
    setScale(prev => Math.max(50, Math.min(800, prev + delta)));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // 左クリック
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      setPan(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, lastPanPoint]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const resetView = useCallback(() => {
    setScale(200);
    setPan({ x: 0, y: 0 });
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <span className={`w-3 h-3 ${color === 'green' ? 'bg-green-500' : 'bg-red-500'} rounded-full mr-2`}></span>
          {title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{scale}%</span>
          <button
            onClick={resetView}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            リセット
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 relative"
        style={{ height: '400px', cursor: isPanning ? 'grabbing' : 'grab' }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="absolute"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale / 100})`,
            transformOrigin: '0 0',
            transition: isPanning ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          {children}
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <div className="mb-2 text-xs text-gray-500">
          マウスホイール: 拡大縮小 | 左クリック+ドラッグ: 移動
        </div>
        {pros.map((pro, index) => (
          <div key={index} className="flex items-center mb-1">
            <span className={`font-medium ${color === 'green' ? 'text-green-600' : 'text-blue-600'}`}>✓</span>
            <span className="ml-2">{pro}</span>
          </div>
        ))}
        {cons && cons.map((con, index) => (
          <div key={index} className="flex items-center mb-1">
            <span className="font-medium text-red-600">×</span>
            <span className="ml-2">{con}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ImageComparisonApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ベクター vs ラスター画像 拡大比較
          </h1>
        </div>

        {/* 画像比較エリア（横並び） */}
        <div className="flex gap-6 mb-8">
          {/* SVG画像 */}
          <ImageViewer
            title="ベクター画像（SVG）"
            color="green"
            pros={[
              "どれだけ拡大してもシャープ",
              "文字や線がくっきり",
              "ファイルサイズが小さい"
            ]}
          >
            <svg
              width="400"
              height="300"
              viewBox="0 0 400 300"
              className="border border-gray-300"
            >
              {/* 背景 */}
              <rect width="400" height="500" fill="#f8f9fa" />

              {/* グラデーション定義 */}
              <defs>
                <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#1e40af', stopOpacity: 1 }} />
                </linearGradient>
                <radialGradient id="redGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#dc2626', stopOpacity: 1 }} />
                </radialGradient>
                <pattern id="stripes" patternUnits="userSpaceOnUse" width="8" height="8">
                  <rect width="8" height="8" fill="#fbbf24" />
                  <rect width="4" height="8" fill="#f59e0b" />
                </pattern>
              </defs>

              {/* タイトルテキスト */}
              <text x="200" y="30" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" textAnchor="middle" fill="#1f2937">
                画質比較テスト
              </text>

              {/* 細い線と太い線 */}
              <line x1="20" y1="50" x2="380" y2="50" stroke="#374151" strokeWidth="1" />
              <line x1="20" y1="60" x2="380" y2="60" stroke="#374151" strokeWidth="3" />

              {/* 幾何学図形 */}
              <circle cx="80" cy="120" r="30" fill="url(#blueGradient)" stroke="#1e40af" strokeWidth="2" />
              <rect x="140" y="90" width="60" height="60" fill="url(#redGradient)" stroke="#dc2626" strokeWidth="2" />
              <polygon points="250,90 280,120 250,150 220,120" fill="#10b981" stroke="#059669" strokeWidth="2" />

              {/* 小さなテキスト */}
              <text x="50" y="180" fontFamily="Arial, sans-serif" fontSize="12" fill="#374151">
                小さなテキスト 12px
              </text>
              <text x="50" y="200" fontFamily="Arial, sans-serif" fontSize="10" fill="#374151">
                更に小さなテキスト 10px
              </text>
              <text x="50" y="220" fontFamily="Arial, sans-serif" fontSize="8" fill="#374151">
                極小テキスト 8px
              </text>

              {/* 複雑なパス */}
              <path d="M 300 180 Q 350 150 380 180 T 380 220" stroke="#8b5cf6" strokeWidth="3" fill="none" />

              {/* パターンとテクスチャ */}
              <rect x="300" y="100" width="60" height="40" fill="url(#stripes)" stroke="#d97706" strokeWidth="1" />

              {/* アイコン風図形 */}
              <g transform="translate(50, 240)">
                <circle cx="20" cy="20" r="18" fill="#6366f1" stroke="#4f46e5" strokeWidth="2" />
                <path d="M 12 20 L 18 26 L 28 14" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </g>

              {/* 星形 */}
              <g transform="translate(150, 240)">
                <path d="M 20 5 L 24 16 L 35 16 L 26 24 L 30 35 L 20 28 L 10 35 L 14 24 L 5 16 L 16 16 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
              </g>
            </svg>
          </ImageViewer>

          {/* ラスター画像 */}
          <ImageViewer
            title="ラスター画像（PNG）"
            color="red"
            pros={[]}
            cons={[
              "拡大するとピクセレーションが発生",
              "文字や細い線がぼやける"
            ]}
          >
            <img
              src="/images/svg_compare_test.png"
              alt="ラスター画像比較"
              style={{ width: 400, height: 300 }}
              className="border border-gray-300"
              onError={(e) => {
                console.error('画像の読み込みに失敗しました');
                e.currentTarget.style.display = 'none';
              }}
            />
          </ImageViewer>
        </div>
      </div>
    </div>
  );
};

export default ImageComparisonApp;
