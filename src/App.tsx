import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Utensils, MapPin, Star, RotateCw, Navigation, Sparkles, Compass, ExternalLink } from "lucide-react";

interface FoodItem {
  id: string;
  name: string;
  category: string;
  emoji: string;
  desc: string;
  rarity: "SSR" | "SR" | "R";
  searchKeyword: string;
}

const FOOD_DATABASE: FoodItem[] = [
  { id: "1", name: "Phở Bò Gia Truyền", category: "Bún / Phở", emoji: "🍜", desc: "Nước dùng đậm đà thơm mùi quế hồi, thịt bò tái lăn mềm mọng.", rarity: "SSR", searchKeyword: "phở bò" },
  { id: "2", name: "Bún Chả Hà Nội", category: "Bún / Phở", emoji: "🥗", desc: "Chả nướng than hoa thơm lừng ăn kèm nước mắm đu đủ vắt tắc.", rarity: "SSR", searchKeyword: "bún chả" },
  { id: "3", name: "Bún Đậu Mắm Tôm", category: "Bún / Phở", emoji: "🍱", desc: "Đậu hũ rán giòn rụm, chả cốm nướng thơm béo mắm tôm Dầy.", rarity: "SSR", searchKeyword: "bún đậu mắm tôm" },
  { id: "4", name: "Cơm Tấm Sườn Nướng", category: "Cơm", emoji: "🍛", desc: "Sườn nướng mật ong óng ả, chả trứng béo ngậy, bì giòn sần sật.", rarity: "SSR", searchKeyword: "cơm tấm" },
  { id: "5", name: "Lẩu Thái Hải Sản", category: "Lẩu / Nướng", emoji: "🍲", desc: "Chua cay chuẩn vị Thái, tôm mực tươi ngon cùng nấm kim châm.", rarity: "SSR", searchKeyword: "lẩu thái hải sản" },
  { id: "6", name: "Bánh Mì Kẹp Thịt", category: "Cơm", emoji: "🥖", desc: "Vỏ giòn rụm, pate béo ngậy đậm đà, đồ chua thanh mát.", rarity: "SR", searchKeyword: "bánh mì" },
  { id: "7", name: "Bún Bò Huế", category: "Bún / Phở", emoji: "🍜", desc: "Nước dùng đậm đà vị mắm ruốc, giò heo béo ngậy và huyết sắn.", rarity: "SSR", searchKeyword: "bún bò huế" },
  { id: "8", name: "Bún Riêu Cua Đồng", category: "Món Nước", emoji: "🥘", desc: "Riêu cua nguyên chất thơm lừng, giò lụa và đậu hũ chiên.", rarity: "SR", searchKeyword: "bún riêu cua" },
  { id: "9", name: "Gà Rán Giòn Rụm", category: "Ăn Vặt / Tiệm Trà", emoji: "🍗", desc: "Lớp vỏ giòn tan béo ngậy, thịt gà mọng nước thơm phức.", rarity: "SR", searchKeyword: "gà rán" },
  { id: "10", name: "Bánh Xèo Miền Tây", category: "Cơm", emoji: "🥞", desc: "Vỏ bánh giòn rụm màu nghệ, nhân tôm thịt nấm và rau sống.", rarity: "SR", searchKeyword: "bánh xèo" },
  { id: "11", name: "Ốc & Hải Sản Đêm", category: "Lẩu / Nướng", emoji: "🐚", desc: "Ốc hương xào trứng muối, ốc mỡ xào me đậm đà cay nồng.", rarity: "SSR", searchKeyword: "quán ốc" },
  { id: "12", name: "Trà Sữa Matcha Trân Châu", category: "Ăn Vặt / Tiệm Trà", emoji: "🧋", desc: "Độ ngọt vừa phải, trân châu đường đen dai dẻo dừa nướng.", rarity: "R", searchKeyword: "trà sữa" },
  { id: "13", name: "Cơm Gà Xối Mỡ", category: "Cơm", emoji: "🍗", desc: "Đùi gà chiên da giòn rụm ăn cùng cơm chiên hạt vàng thơm.", rarity: "SR", searchKeyword: "cơm gà xối mỡ" },
  { id: "14", name: "Mì Quảng Tôm Thịt", category: "Món Nước", emoji: "🍜", desc: "Nước dùng sóng sánh đậm vị, bánh tráng nướng giòn rụm.", rarity: "SR", searchKeyword: "mì quảng" },
  { id: "15", name: "Chè Thái & Trái Cây", category: "Ăn Vặt / Tiệm Trà", emoji: "🍧", desc: "Sầu riêng thơm ngậy, thạch dừa và mít ngọt mát lạnh.", rarity: "R", searchKeyword: "chè thái" }
];
export default function App() {
  const [spinning, setSpinning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Tất Cả");
  const [result, setResult] = useState<FoodItem | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState("Đang lấy vị trí GPS...");

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocationName("Vị trí GPS sẵn sàng");
        },
        () => {
          setLocationName("Định vị theo khu vực hiện tại");
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      setLocationName("Định vị theo khu vực hiện tại");
    }
  };

  const filteredFoods = selectedCategory === "Tất Cả"
    ? FOOD_DATABASE
    : FOOD_DATABASE.filter(f => f.category === selectedCategory);

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    let counter = 0;
    const totalRolls = 25;
    const interval = setInterval(() => {
      const item = filteredFoods[Math.floor(Math.random() * filteredFoods.length)];
      setResult(item);
      counter++;

      if (counter >= totalRolls) {
        clearInterval(interval);
        const finalChoice = filteredFoods[Math.floor(Math.random() * filteredFoods.length)];
        setResult(finalChoice);
        setSpinning(false);
        confetti({
          particleCount: finalChoice.rarity === "SSR" ? 120 : 60,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }, 80);
  };

  const openGoogleMapsSearch = (food: FoodItem) => {
    let query = food.searchKeyword + " ngon đánh giá trên 4 sao";
    let mapsUrl = "https://www.google.com/maps/search/" + encodeURIComponent(query);
    if (userCoords) {
      mapsUrl += "/@" + userCoords.lat + "," + userCoords.lng + ",14z";
    }
    window.open(mapsUrl, "_blank");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#fff", padding: "2rem", textAlign: "center" }}>
      <h1>HÔM NAY ĂN GÌ?</h1>
      <button onClick={handleSpin} disabled={spinning}>QUAY MÓN ĂN</button>
      {result && <div><h2>{result.emoji} {result.name}</h2><button onClick={() => openGoogleMapsSearch(result)}>TÌM QUÁN TRÊN 4 SAO</button></div>}
    </div>
  );
}
