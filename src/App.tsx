import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { MapPin, RotateCw, Navigation, Sparkles, Compass, ExternalLink, Trophy } from "lucide-react";

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
  { id: "1", name: "Phở Bò Tái Nạm", category: "Bún / Phở", emoji: "🍜", desc: "Nước dùng đậm đà thơm mùi quế hồi, thịt bò tái lăn mềm mọng.", rarity: "SSR", searchKeyword: "phở bò", color: "#f59e0b", bgGradient: "linear-gradient(135deg, #78350f 0%, #b45309 50%, #f59e0b 100%)" },
  { id: "2", name: "Bún Chả Hà Nội", category: "Bún / Phở", emoji: "🥗", desc: "Chả nướng than hoa thơm lừng ăn kèm nước mắm đu đủ vắt tắc.", rarity: "SSR", searchKeyword: "bún chả", color: "#f59e0b", bgGradient: "linear-gradient(135deg, #78350f 0%, #b45309 50%, #f59e0b 100%)" },
  { id: "3", name: "Bún Đậu Mắm Tôm", category: "Bún / Phở", emoji: "🍱", desc: "Đậu hũ rán giòn rụm, chả cốm nướng thơm béo mắm tôm Dầy.", rarity: "SSR", searchKeyword: "bún đậu mắm tôm", color: "#f59e0b", bgGradient: "linear-gradient(135deg, #78350f 0%, #b45309 50%, #f59e0b 100%)" },
  { id: "4", name: "Cơm Tấm Sườn Bì Chả", category: "Cơm", emoji: "🍛", desc: "Sườn nướng mật ong óng ả, chả trứng béo ngậy, bì giòn sần sật.", rarity: "SSR", searchKeyword: "cơm tấm", color: "#f59e0b", bgGradient: "linear-gradient(135deg, #78350f 0%, #b45309 50%, #f59e0b 100%)" },
  { id: "5", name: "Lẩu Thái Hải Sản", category: "Lẩu / Nướng", emoji: "🍲", desc: "Chua cay chuẩn vị Thái, tôm mực tươi ngon cùng nấm kim châm.", rarity: "SSR", searchKeyword: "lẩu thái hải sản", color: "#f59e0b", bgGradient: "linear-gradient(135deg, #78350f 0%, #b45309 50%, #f59e0b 100%)" },
  { id: "6", name: "Bánh Mì Kẹp Thịt", category: "Cơm", emoji: "🥖", desc: "Vỏ giòn rụm, pate béo ngậy đậm đà, đồ chua thanh mát.", rarity: "SR", searchKeyword: "bánh mì thịt", color: "#8b5cf6", bgGradient: "linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #8b5cf6 100%)" },
  { id: "7", name: "Bún Bò Huế", category: "Bún / Phở", emoji: "🍲", desc: "Đậm đà hương mắm ruốc, giò heo béo ngậy cùng chả cua.", rarity: "SR", searchKeyword: "bún bò huế", color: "#8b5cf6", bgGradient: "linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #8b5cf6 100%)" },
  { id: "8", name: "Bò Né Trứng Opla", category: "Lẩu / Nướng", emoji: "🥩", desc: "Bò bít tết chảo nóng xèo xèo, xíu mại, pate ăn kèm bánh mì.", rarity: "SR", searchKeyword: "bò né", color: "#8b5cf6", bgGradient: "linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #8b5cf6 100%)" },
  { id: "9", name: "Mì Quảng Tôm Thịt", category: "Bún / Phở", emoji: "🍜", desc: "Sợi mì vàng óng, nước dùng đậm đà xấp xấp, bánh tráng nướng giòn.", rarity: "SR", searchKeyword: "mì quảng", color: "#8b5cf6", bgGradient: "linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #8b5cf6 100%)" },
  { id: "10", name: "Gà Nướng Mật Ong", category: "Lẩu / Nướng", emoji: "🍗", desc: "Da gà vàng giòn óng ánh mật ong, thịt bên trong ngọt mềm.", rarity: "SR", searchKeyword: "gà nướng mật ong", color: "#8b5cf6", bgGradient: "linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #8b5cf6 100%)" },
  { id: "11", name: "Trà Sữa Trân Châu", category: "Ăn Vặt / Tiệm Trà", emoji: "🧋", desc: "Trà đậm đà béo ngậy, trân châu đen đường đen dẻo giòn.", rarity: "R", searchKeyword: "trà sữa", color: "#10b981", bgGradient: "linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)" },
  { id: "12", name: "Bánh Tráng Trộn", category: "Ăn Vặt / Tiệm Trà", emoji: "🥗", desc: "Bánh tráng dẻo thấm vị muối tôm, bò khô, trứng cút, xoài bào.", rarity: "R", searchKeyword: "bánh tráng trộn", color: "#10b981", bgGradient: "linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)" },
  { id: "13", name: "Ốc Mỡ Xào Bơ Tỏi", category: "Ăn Vặt / Tiệm Trà", emoji: "🐚", desc: "Ốc giòn sần sật bơi trong sốt bơ tỏi béo ngậy chấm bánh mì.", rarity: "SR", searchKeyword: "quán ốc", color: "#8b5cf6", bgGradient: "linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #8b5cf6 100%)" },
  { id: "14", name: "Cơm Gà Hải Nam", category: "Cơm", emoji: "🍗", desc: "Cơm dẻo nấu nước luộc gà thơm nức, gà luộc da giòn mọng nước.", rarity: "SR", searchKeyword: "cơm gà hải nam", color: "#8b5cf6", bgGradient: "linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #8b5cf6 100%)" },
  { id: "15", name: "Hủ Tếu Nam Vang", category: "Bún / Phở", emoji: "🍜", desc: "Nước dùng ngọt từ xương, tôm tươi, gan heo, thịt băm thơm nức.", rarity: "R", searchKeyword: "hủ tiếu nam vang", color: "#10b981", bgGradient: "linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)" },
];

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
      const cardWidth = 140;
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
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(circle at top, #1e1b4b 0%, #0f172a 60%, #020617 100%)",
      color: "#f8fafc",
      fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
      padding: "2rem 1rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      boxSizing: "border-box"
    }}>
      <header style={{ textAlign: "center", maxWidth: 640, width: "100%", marginBottom: "1.5rem" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(245, 158, 11, 0.15)",
          border: "1px solid #f59e0b",
          padding: "6px 20px",
          borderRadius: 30,
          color: "#fbbf24",
          fontWeight: 700,
          fontSize: "0.85rem",
          marginBottom: 14,
          boxShadow: "0 0 20px rgba(245, 158, 11, 0.25)"
        }}>
          <Sparkles size={18} /> GACHA CHEST OPENING ROULETTE x GOOGLE MAPS
        </div>
        <h1 style={{
          fontSize: "2.6rem",
          fontWeight: 900,
          margin: "0 0 10px 0",
          background: "linear-gradient(90deg, #fcd34d, #f97316, #ef4444)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "-0.5px"
        }}>
          🎰 HÔM NAY ĂN GÌ?
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "0.95rem", margin: 0, lineHeight: 1.5 }}>
          Quay hòm báu vật Gacha mở món ăn ngẫu nhiên & Tự động tìm vị trí quán <strong>đánh giá trên 4 sao</strong> gần bạn nhất!
        </p>

        <div style={{
          marginTop: 14,
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(15, 23, 42, 0.8)",
          border: "1px solid rgba(255,255,255,0.12)",
          padding: "6px 16px",
          borderRadius: 20,
          fontSize: "0.82rem",
          color: "#cbd5e1"
        }}>
          <MapPin size={15} color="#ef4444" />
          <span>Vị trí GPS: <strong style={{ color: "#38bdf8" }}>{locationName}</strong></span>
          <button onClick={getUserLocation} style={{ background: "transparent", border: "none", color: "#38bdf8", cursor: "pointer", padding: 2, display: "inline-flex", alignItems: "center" }} title="Cập nhật GPS">
            <Compass size={15} />
          </button>
        </div>
      </header>
      <div style={{
        display: "flex",
        gap: 8,
        overflowX: "auto",
        maxWidth: 640,
        width: "100%",
        paddingBottom: 10,
        marginBottom: "1.5rem"
      }}>
        {["Tất Cả", "Cơm", "Bún / Phở", "Món Nước", "Lẩu / Nướng", "Ăn Vặt / Tiệm Trà"].map(cat => (
          <button
            key={cat}
            onClick={() => !spinning && setSelectedCategory(cat)}
            style={{
              padding: "8px 18px",
              borderRadius: 20,
              border: selectedCategory === cat ? "1px solid #38bdf8" : "1px solid rgba(255,255,255,0.1)",
              background: selectedCategory === cat ? "linear-gradient(135deg, rgba(56, 189, 248, 0.25) 0%, rgba(3, 105, 161, 0.4) 100%)" : "rgba(30, 41, 59, 0.6)",
              color: selectedCategory === cat ? "#38bdf8" : "#94a3b8",
              fontWeight: selectedCategory === cat ? 700 : 500,
              fontSize: "0.85rem",
              cursor: spinning ? "not-allowed" : "pointer",
              whiteSpace: "nowrap"
            }}>
            {cat}
          </button>
        ))}
      </div>
      <main style={{
        maxWidth: 580,
        width: "100%",
        background: "rgba(15, 23, 42, 0.85)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.15)",
        borderRadius: 28,
        padding: "2rem 1.5rem",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
        textAlign: "center",
        boxSizing: "border-box"
      }}>
        <div 
          ref={containerRef}
          style={{
            position: "relative",
            width: "100%",
            height: "190px",
            margin: "0 auto",
            overflow: "hidden",
            borderRadius: "20px",
            border: "2px solid rgba(245, 158, 11, 0.6)",
            background: "linear-gradient(180deg, #090d16 0%, #131927 100%)",
            boxShadow: "inset 0 0 30px rgba(0,0,0,0.9), 0 0 25px rgba(245, 158, 11, 0.25)"
          }}>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "70px", background: "linear-gradient(90deg, #090d16 0%, transparent 100%)", zIndex: 8, pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: "70px", background: "linear-gradient(-90deg, #090d16 0%, transparent 100%)", zIndex: 8, pointerEvents: "none" }} />

          <div style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "4px",
            background: "linear-gradient(180deg, #ef4444 0%, #f59e0b 50%, #ef4444 100%)",
            zIndex: 10,
            boxShadow: "0 0 15px #ef4444, 0 0 30px #f59e0b",
            pointerEvents: "none"
          }}>
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderTop: "16px solid #ef4444" }} />
            <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderBottom: "16px solid #ef4444" }} />
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            transform: "translateX(-" + reelTranslate + "px)",
            transition: isTransitioning ? "transform 4.8s cubic-bezier(0.08, 0.82, 0.17, 1)" : "none",
            willChange: "transform"
          }}>
            {reelItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  minWidth: "140px",
                  maxWidth: "140px",
                  height: "160px",
                  marginRight: "12px",
                  borderRadius: "18px",
                  background: item.bgGradient,
                  border: "2px solid " + item.color,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px 8px",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.6), inset 0 0 12px " + item.color + "44",
                  userSelect: "none",
                  flexShrink: 0,
                  boxSizing: "border-box",
                  position: "relative",
                  overflow: "hidden"
                }}>
                <div style={{
                  position: "absolute",
                  top: 6,
                  right: 8,
                  fontSize: "0.65rem",
                  fontWeight: 900,
                  color: "#fff",
                  background: "rgba(0,0,0,0.5)",
                  padding: "2px 6px",
                  borderRadius: 8,
                  border: "1px solid " + item.color
                }}>
                  {item.rarity}
                </div>

                <span style={{
                  fontSize: "3.2rem",
                  filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.5))"
                }}>
                  {item.emoji}
                </span>
                
                <span style={{
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  marginTop: 6,
                  color: "#fff",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  width: "100%",
                  textAlign: "center"
                }}>
                  {item.name}
                </span>
                <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={handleSpin}
          disabled={spinning}
          style={{
            marginTop: "1.8rem",
            width: "100%",
            padding: "1.2rem",
            borderRadius: 20,
            border: "none",
            background: spinning
              ? "#334155"
              : "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #ef4444 100%)",
            color: "#fff",
            fontSize: "1.25rem",
            fontWeight: 900,
            cursor: spinning ? "not-allowed" : "pointer",
            boxShadow: spinning ? "none" : "0 12px 30px rgba(245, 158, 11, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12
          }}>
          <RotateCw size={24} />
          {spinning ? "ĐANG MỞ HÒM BÁU VẬT..." : "🎁 MỞ HÒM GACHA MÓN ĂN!"}
        </button>

        {winningItem && !spinning && (
          <div style={{
            marginTop: "1.8rem",
            background: "linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)",
            padding: "1.6rem 1.4rem",
            borderRadius: 24,
            border: "2px solid " + winningItem.color,
            boxShadow: "0 20px 40px rgba(0,0,0,0.6), 0 0 25px " + winningItem.color + "55",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "5rem", marginBottom: 4 }}>
              {winningItem.emoji}
            </div>
            
            <div style={{
              display: "inline-block",
              alignItems: "center",
              gap: 6,
              fontSize: "0.82rem",
              fontWeight: 900,
              padding: "5px 16px",
              borderRadius: 16,
              background: winningItem.color,
              color: "#fff",
              marginBottom: 12
            }}>
              <Trophy size={16} />
              {winningItem.rarity === "SSR" ? "🌟 THẦN THOẠI (SSR)" : winningItem.rarity === "SR" ? "✨ PHỔ BIẾN (SR)" : "🍕 QUEN THUỘC (R)"}
            </div>

            <h2 style={{ fontSize: "2rem", fontWeight: 900, margin: "6px 0 10px 0", color: "#fff" }}>
              {winningItem.name}
            </h2>
            
            <p style={{ fontSize: "0.92rem", color: "#cbd5e1", margin: "0 0 1.4rem 0", lineHeight: 1.6 }}>
              {winningItem.desc}
            </p>

            <button
              onClick={() => openGoogleMapsSearch(winningItem)}
              style={{
                width: "100%",
                padding: "14px 20px",
                borderRadius: 16,
                border: "none",
                background: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
                color: "#fff",
                fontWeight: 800,
                fontSize: "1rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                boxShadow: "0 8px 20px rgba(2, 132, 199, 0.45)"
              }}>
              <Navigation size={22} /> TÌM QUÁN {winningItem.name.toUpperCase()} TRÊN 4 SAO GẦN ĐÂY <ExternalLink size={18} />
            </button>
          </div>
        )}
      </main>

      <footer style={{ marginTop: "auto", paddingTop: "3rem", textAlign: "center", color: "#64748b", fontSize: "0.85rem" }}>
        🍜 <strong>Food Gacha App</strong> - Chest Opening Animation & Google Maps GPS Search
      </footer>
    </div>
  );
}
