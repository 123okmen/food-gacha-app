import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { MapPin, RotateCw, Sparkles, Compass, Trophy, Navigation, ExternalLink } from "lucide-react";

interface FoodItem {
  id: string;
  name: string;
  category: string;
  emoji: string;
  desc: string;
  rarity: "SSR" | "SR" | "R";
  searchKeyword: string;
  color: string;
  bgGradient: string;
}

const FOOD_DATABASE: FoodItem[] = [
  { id: "1", name: "Phở Bò Tái Nạm", category: "Bún / Phở", emoji: "🍜", desc: "Nước dùng đậm đà thơm mùi quế hồi, thịt bò tái lăn mềm mọng.", rarity: "SSR", searchKeyword: "phở bò", color: "#f59e0b", bgGradient: "#78350f" },
  { id: "2", name: "Bún Chả Hà Nội", category: "Bún / Phở", emoji: "🥗", desc: "Chả nướng than hoa thơm lừng ăn kèm nước mắm đu đủ vắt tắc.", rarity: "SSR", searchKeyword: "bún chả", color: "#f59e0b", bgGradient: "#78350f" },
  { id: "3", name: "Bún Đậu Mắm Tôm", category: "Bún / Phở", emoji: "🍱", desc: "Đậu hũ rán giòn rụm, chả cốm nướng thơm béo mắm tôm Dầy.", rarity: "SSR", searchKeyword: "bún đậu mắm tôm", color: "#f59e0b", bgGradient: "#78350f" },
  { id: "4", name: "Cơm Tấm Sườn Bì Chả", category: "Cơm", emoji: "🍛", desc: "Sườn nướng mật ong óng ả, chả trứng béo ngậy, bì giòn sần sật.", rarity: "SSR", searchKeyword: "cơm tấm", color: "#f59e0b", bgGradient: "#78350f" },
  { id: "5", name: "Lẩu Thái Hải Sản", category: "Lẩu / Nướng", emoji: "🍲", desc: "Chua cay chuẩn vị Thái, tôm mực tươi ngon cùng nấm kim châm.", rarity: "SSR", searchKeyword: "lẩu thái hải sản", color: "#f59e0b", bgGradient: "#78350f" },
  { id: "6", name: "Bánh Mì Kẹp Thịt", category: "Cơm", emoji: "🥖", desc: "Vỏ giòn rụm, pate béo ngậy đậm đà, đồ chua thanh mát.", rarity: "SR", searchKeyword: "bánh mì thịt", color: "#8b5cf6", bgGradient: "#4c1d95" },
  { id: "7", name: "Bún Bò Huế", category: "Bún / Phở", emoji: "🍲", desc: "Đậm đà hương mắm ruốc, giò heo béo ngậy cùng chả cua.", rarity: "SR", searchKeyword: "bún bò huế", color: "#8b5cf6", bgGradient: "#4c1d95" },
  { id: "8", name: "Bò Né Trứng Opla", category: "Lẩu / Nướng", emoji: "🥩", desc: "Bò bít tết chảo nóng xèo xèo, xíu mại, pate ăn kèm bánh mì.", rarity: "SR", searchKeyword: "bò né", color: "#8b5cf6", bgGradient: "#4c1d95" },
  { id: "9", name: "Mì Quảng Tôm Thịt", category: "Bún / Phở", emoji: "🍜", desc: "Sợi mì vàng óng, nước dùng đậm đà xấp xấp, bánh tráng nướng giòn.", rarity: "SR", searchKeyword: "mì quảng", color: "#8b5cf6", bgGradient: "#4c1d95" },
  { id: "10", name: "Gà Nướng Mật Ong", category: "Lẩu / Nướng", emoji: "🍗", desc: "Da gà vàng giòn óng ánh mật ong, thịt bên trong ngọt mềm.", rarity: "SR", searchKeyword: "gà nướng mật ong", color: "#8b5cf6", bgGradient: "#4c1d95" },
  { id: "11", name: "Trà Sữa Trân Châu", category: "Ăn Vặt / Tiệm Trà", emoji: "🧋", desc: "Trà đậm đà béo ngậy, trân châu đen đường đen dẻo giòn.", rarity: "R", searchKeyword: "trà sữa", color: "#10b981", bgGradient: "#064e3b" },
  { id: "12", name: "Bánh Tráng Trộn", category: "Ăn Vặt / Tiệm Trà", emoji: "🥗", desc: "Bánh tráng dẻo thấm vị muối tôm, bò khô, trứng cút, xoài bào.", rarity: "R", searchKeyword: "bánh tráng trộn", color: "#10b981", bgGradient: "#064e3b" },
  { id: "13", name: "Ốc Mỡ Xào Bơ Tỏi", category: "Ăn Vặt / Tiệm Trà", emoji: "🐚", desc: "Ốc giòn sần sật bơi trong sốt bơ tỏi béo ngậy chấm bánh mì.", rarity: "SR", searchKeyword: "quán ốc", color: "#8b5cf6", bgGradient: "#4c1d95" },
  { id: "14", name: "Cơm Gà Hải Nam", category: "Cơm", emoji: "🍗", desc: "Cơm dẻo nấu nước luộc gà thơm nức, gà luộc da giòn mọng nước.", rarity: "SR", searchKeyword: "cơm gà hải nam", color: "#8b5cf6", bgGradient: "#4c1d95" },
  { id: "15", name: "Hủ Tếu Nam Vang", category: "Bún / Phở", emoji: "🍜", desc: "Nước dùng ngọt từ xương, tôm tươi, gan heo, thịt băm thơm nức.", rarity: "R", searchKeyword: "hủ tiếu nam vang", color: "#10b981", bgGradient: "#064e3b" },
];

const CATEGORIES = ["Tất Cả", "Cơm", "Bún / Phở", "Món Nước", "Lẩu / Nướng", "Ăn Vặt / Tiệm Trà"];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất Cả");
  const [spinning, setSpinning] = useState<boolean>(false);
  const [winningItem, setWinningItem] = useState<FoodItem | null>(null);
  const [locationName, setLocationName] = useState<string>("Đang lấy vị trí GPS...");
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [reelItems, setReelItems] = useState<FoodItem[]>([]);
  const [reelTranslate, setReelTranslate] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getUserLocation();
    generateInitialReel();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setUserCoords({ lat, lng });
          setLocationName(lat.toFixed(3) + ", " + lng.toFixed(3) + " (Vị trí hiện tại)");
        },
        () => {
          setLocationName("KDC Conic, Bình Chánh, TP.HCM");
        }
      );
    } else {
      setLocationName("KDC Conic, Bình Chánh, TP.HCM");
    }
  };

  const generateInitialReel = () => {
    const list: FoodItem[] = [];
    for (let i = 0; i < 30; i++) {
      const randomFood = FOOD_DATABASE[i % FOOD_DATABASE.length];
      list.push(randomFood);
    }
    setReelItems(list);
  };

  const handleSpin = () => {
    if (spinning) return;

    setSpinning(true);
    setWinningItem(null);

    const pool = selectedCategory === "Tất Cả"
      ? FOOD_DATABASE
      : FOOD_DATABASE.filter(item => item.category === selectedCategory);

    const availablePool = pool.length > 0 ? pool : FOOD_DATABASE;
    const winner = availablePool[Math.floor(Math.random() * availablePool.length)];

    const totalReelLength = 60;
    const targetIndex = 48;
    const newReel: FoodItem[] = [];

    for (let i = 0; i < totalReelLength; i++) {
      if (i === targetIndex) {
        newReel.push(winner);
      } else {
        const randomItem = availablePool[Math.floor(Math.random() * availablePool.length)];
        newReel.push(randomItem);
      }
    }

    setReelItems(newReel);
    setIsTransitioning(false);
    setReelTranslate(0);

    setTimeout(() => {
      setIsTransitioning(true);
      const cardWidth = 200;
      const gap = 12;
      const step = cardWidth + gap;
      const containerWidth = containerRef.current ? containerRef.current.clientWidth : 540;

      const centerOffset = (containerWidth / 2) - (cardWidth / 2);
      const targetPos = targetIndex * step - centerOffset;
      const jitter = (Math.random() - 0.5) * 45;
      setReelTranslate(targetPos + jitter);
    }, 50);

    setTimeout(() => {
      setSpinning(false);
      setWinningItem(winner);

      confetti({
        particleCount: winner.rarity === "SSR" ? 160 : 90,
        spread: 90,
        origin: { y: 0.6 }
      });
    }, 5000);
  };

  const openGoogleMapsSearch = (item: FoodItem) => {
    let query = encodeURIComponent(item.searchKeyword + " quán ngon trên 4 sao");
    let url = "https://www.google.com/maps/search/" + query;
    if (userCoords) {
      url += "/@" + userCoords.lat + "," + userCoords.lng + ",14z";
    }
    window.open(url, "_blank");
  };

  return (
    <div className="app">
      <a className="skip-link" href="#main">Đi tới nội dung</a>

      <header className="header">
        <div className="tag">
          <Sparkles size={18} />
          Quay Gacha Món Ăn &amp; Tìm Quán 4★
        </div>
        <h1 className="hero-title">
          🎰 HÔM NAY ĂN GÌ?
        </h1>
        <p className="hero-sub">
          Quay hòm gacha để nhận món ăn ngẫu nhiên, kèm kết quả tìm ngay quán ăn có
          đánh giá trên 4★ gần bạn nhất.
        </p>

        <div className="gps">
          <MapPin size={15} />
          <span className="gps__loc">
            Vị trí GPS: <strong>{locationName}</strong>
          </span>
          <button
            className="gps__action"
            onClick={getUserLocation}
            title="Cập nhật GPS"
            aria-label="Cập nhật vị trí GPS"
          >
            <Compass size={15} />
          </button>
        </div>
      </header>

      <main id="main" className="main">
        <section className="section reveal">
          <p className="section-label">Danh Mục</p>
          <div className="category-row">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={[
                  "category-button",
                  selectedCategory === cat ? "pill--active" : ""
                ].join(" ")}
                onClick={() => !spinning && setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <section className="section reveal">
          <p className="section-label">Món Ăn</p>
          <div className="reel" ref={containerRef}>
            <div className="reel__mask reel__mask--left" />
            <div className="reel__mask reel__mask--right" />
            <div className="reel__indicator" />

            <div
              className={[
                "reel__track",
                isTransitioning ? "is-transitioning" : ""
              ].join(" ")}
              style={{ transform: "translateX(-" + reelTranslate + "px)" }}
            >
              {reelItems.map((item, idx) => (
                <div
                  key={idx}
                  className="reel__card"
                  style={{
                    background: item.color,
                    borderColor: item.color
                  }}
                >
                  <div className="reel__card__rarity">{item.rarity}</div>
                  <span className="reel__card__emoji">{item.emoji}</span>
                  <span className="reel__card__name">{item.name}</span>
                  <span className="reel__card__cat">{item.category}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            className="spin-btn"
            onClick={handleSpin}
            disabled={spinning}
          >
            <RotateCw size={24} />
            {spinning ? "ĐANG MỞ HÒM BÁU VẬT..." : "🎁 MỬA VÀNG HÒM GACHA NGAY"}
          </button>
        </section>

        {winningItem && !spinning && (
          <section className="section reveal">
            <div className="result-card">
              <div className="result-emoji">{winningItem.emoji}</div>

              <div className="result-badge">
                <Trophy size={16} />
                {winningItem.rarity === "SSR" ? "🌟 THẦN THOẠI (SSR)" : winningItem.rarity === "SR" ? "✨ PHỔ BIẾN (SR)" : "🍕 QUEN THUỘC (R)"}
              </div>

              <h2 className="result-name">{winningItem.name}</h2>

              <p className="result-desc">{winningItem.desc}</p>

              <button
                className="result-btn"
                onClick={() => openGoogleMapsSearch(winningItem)}
              >
                <Navigation size={22} />
                TÌM QUÁN {winningItem.name.toUpperCase()} TRÊN 4★
                <ExternalLink size={18} />
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className="footer">
        <p className="footer__text">
          🍜 Food Gacha · Món ăn ngẫu nhiên, quán 4★ gần bạn nhất
        </p>
      </footer>
    </div>
  );
}
