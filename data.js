// Authentic Restaurant Mock Data & Zaika India Signature Menu by Cuisine
const RESTAURANT_DATA = {
  name: "Zaika India",
  tagline: "Authentic Royal Flavours & Legendary Indian Dining",
  address: "Waterfront District, The Grand Heritage Boulevard",
  phone: "+91 22 6665 3366",
  email: "reservations@zaikaindia.com",
  currency: "₹",
  menuImages: [
    {
      id: "img-1",
      title: "Zaika India — Menu Card Page 1 (Breakfast, Curries & Heritage Classics)",
      src: "zaika_menu_page1.jpg"
    },
    {
      id: "img-2",
      title: "Zaika India — Menu Card Page 2 (Grills, Beverages, Teas & Desserts)",
      src: "zaika_menu_page2.jpg"
    }
  ],
  zones: [
    { id: "all", name: "All Areas", icon: "layout-grid" },
    { id: "window", name: "Harbour Window View", icon: "sun" },
    { id: "main", name: "Central Heritage Hall", icon: "utensils" },
    { id: "booth", name: "Private Velvet Booths", icon: "sofa" },
    { id: "patio", name: "Garden Verandah / Patio", icon: "trees" },
    { id: "vip", name: "The Royal Suite", icon: "crown" }
  ],
  tables: [
    { id: "T-01", name: "Table 1", zone: "window", capacity: 2, shape: "round", x: 12, y: 18, status: "available", features: ["Waterfront View", "Cozy Two-Top"] },
    { id: "T-02", name: "Table 2", zone: "window", capacity: 2, shape: "round", x: 12, y: 45, status: "available", features: ["Waterfront View", "Romantic Corner"] },
    { id: "T-03", name: "Table 3", zone: "window", capacity: 4, shape: "square", x: 12, y: 75, status: "reserved", features: ["Waterfront View", "Spacious 4-Top"] },
    { id: "T-04", name: "Table 4", zone: "main", capacity: 4, shape: "square", x: 38, y: 22, status: "available", features: ["Chandelier View", "Center Stage"] },
    { id: "T-05", name: "Table 5", zone: "main", capacity: 4, shape: "square", x: 38, y: 50, status: "available", features: ["Wine Cellar View", "Quiet Ambience"] },
    { id: "T-06", name: "Table 6", zone: "main", capacity: 6, shape: "rectangle", x: 38, y: 78, status: "available", features: ["Family Friendly", "Large Table"] },
    { id: "T-07", name: "Booth A", zone: "booth", capacity: 4, shape: "booth", x: 64, y: 20, status: "available", features: ["Plush Velvet Seating", "High Privacy"] },
    { id: "T-08", name: "Booth B", zone: "booth", capacity: 6, shape: "booth", x: 64, y: 50, status: "reserved", features: ["Acoustic Privacy", "Celebration Favorite"] },
    { id: "T-09", name: "Booth C", zone: "booth", capacity: 4, shape: "booth", x: 64, y: 80, status: "available", features: ["Plush Velvet Seating", "Dim Ambient Glow"] },
    { id: "T-10", name: "Patio P1", zone: "patio", capacity: 2, shape: "round", x: 86, y: 20, status: "available", features: ["Open Sky", "Heated Umbrella", "Pet Friendly"] },
    { id: "T-11", name: "Patio P2", zone: "patio", capacity: 4, shape: "square", x: 86, y: 48, status: "available", features: ["Fountain View", "Surrounded by Foliage"] },
    { id: "T-12", name: "Royal VIP Room", zone: "vip", capacity: 10, shape: "rectangle", x: 86, y: 80, status: "available", features: ["Dedicated Sommelier", "Sound System", "Private Bar Access"] }
  ],
  timeSlots: {
    lunch: ["12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM"],
    dinner: ["06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM", "09:00 PM", "09:30 PM", "10:00 PM"]
  },
  occasions: [
    { id: "casual", label: "Casual Dining", icon: "smile" },
    { id: "birthday", label: "Birthday Celebration", icon: "cake" },
    { id: "anniversary", label: "Romantic Anniversary", icon: "heart" },
    { id: "date", label: "First / Intimate Date", icon: "sparkles" },
    { id: "business", label: "Business Lunch / Dinner", icon: "briefcase" },
    { id: "family", label: "Family Gathering", icon: "users" }
  ],

  // CUISINES OF ZAIKA INDIA
  cuisines: [
    { id: "all", label: "All Cuisines", icon: "sparkles" },
    { id: "north-indian", label: "North Indian & Mughlai", icon: "utensils" },
    { id: "parsi-bombay", label: "Parsi & Bombay Heritage", icon: "flame" },
    { id: "south-indian", label: "South Indian & Breakfast", icon: "sun" },
    { id: "tandoor-grills", label: "Tandoori & Grills", icon: "drumstick" },
    { id: "coastal-seafood", label: "Coastal & Seafood", icon: "fish" },
    { id: "mumbai-street", label: "Street Food & Chaat", icon: "sandwich" },
    { id: "continental-fast", label: "Continental & Quick Bites", icon: "pizza" },
    { id: "beverages-drinks", label: "Artisanal Beverages & Teas", icon: "coffee" },
    { id: "desserts-sweets", label: "Mithai & Desserts", icon: "cake" }
  ],

  menuItems: [
    // --- NORTH INDIAN & MUGHLAI CUISINE ---
    {
      id: "zi-01",
      name: "Paneer Butter Masala",
      cuisine: "north-indian",
      price: 1300,
      isVeg: true,
      portion: "632 gms",
      calories: "650.33 kcal",
      description: "Soft malai cottage cheese simmered in a rich, buttery tomato and cashew gravy flavored with dried kasoori methi.",
      dietary: ["Veg", "North Indian Classic"],
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=700&q=80"
    },
    {
      id: "zi-02",
      name: "Murgh Makhanwala",
      cuisine: "north-indian",
      price: 1550,
      isVeg: false,
      portion: "513 gms",
      calories: "779.25 kcal",
      description: "Charred clay-oven chicken morsels slow-cooked in a velvet spiced tomato, cashew nut, and churned butter gravy.",
      dietary: ["Non-Veg", "Mughlai Heritage"],
      image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=700&q=80"
    },
    {
      id: "zi-03",
      name: "Qalia Mutton",
      cuisine: "north-indian",
      price: 1750,
      isVeg: false,
      portion: "691 gms",
      calories: "771.85 kcal",
      description: "Awadhi heritage slow-cooked tender mutton infused with saffron, cardamom, and brown onion stock, served with naan.",
      dietary: ["Non-Veg", "Awadhi Royal"],
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80"
    },
    {
      id: "zi-04",
      name: "Malai Kofta",
      cuisine: "north-indian",
      price: 1300,
      isVeg: true,
      portion: "653 gms",
      calories: "1244.42 kcal",
      description: "Melt-in-mouth cottage cheese and potato dumplings stuffed with raisins, in a fragrant golden saffron cream gravy.",
      dietary: ["Veg", "Royal North Indian"],
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=700&q=80"
    },
    {
      id: "zi-05",
      name: "Chonka Mutter Palak",
      cuisine: "north-indian",
      price: 1250,
      isVeg: true,
      portion: "612 gms",
      calories: "852.52 kcal",
      description: "Tempered fresh farm spinach and sweet green peas with garlic, cumin, and artisanal clarified butter.",
      dietary: ["Veg", "Healthy Choice"],
      image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=700&q=80"
    },

    // --- PARSI & BOMBAY HERITAGE CUISINE ---
    {
      id: "zi-06",
      name: "Patra Ni Machi",
      cuisine: "parsi-bombay",
      price: 2400,
      isVeg: false,
      portion: "335 gms",
      calories: "824.64 kcal",
      description: "Steamed whole pomfret slathered with freshly ground coriander, mint, green chilli and coconut chutney, wrapped in banana leaf.",
      dietary: ["Non-Veg", "Parsi Signature"],
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=700&q=80"
    },
    {
      id: "zi-07",
      name: "Jardaloo Salli Boti",
      cuisine: "parsi-bombay",
      price: 2050,
      isVeg: false,
      portion: "388 gms",
      calories: "465.21 kcal",
      description: "Slow-braised lamb chunks in a sweet, sour, and spicy apricot gravy, garnished with mountain-high crisp potato straws.",
      dietary: ["Non-Veg", "Parsi Heritage"],
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80"
    },
    {
      id: "zi-08",
      name: "Patra ma Paneer",
      cuisine: "parsi-bombay",
      price: 1300,
      isVeg: true,
      portion: "367 gms",
      calories: "736.63 kcal",
      description: "Steamed cottage cheese slabs layered with spicy mint-coriander coconut chutney, sealed and steamed in tender banana leaves.",
      dietary: ["Veg", "Gluten-Free"],
      image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=700&q=80"
    },
    {
      id: "zi-09",
      name: "Parsi Pulao with Lamb Kebab",
      cuisine: "parsi-bombay",
      price: 2650,
      isVeg: false,
      portion: "670 gms",
      calories: "1028.25 kcal",
      description: "Caramelized basmati rice simmered in aromatic saffron broth, served with spiced minced lamb kebabs and rich brown gravy.",
      dietary: ["Non-Veg", "Royal Banquet"],
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80"
    },

    // --- SOUTH INDIAN & BREAKFAST CUISINE ---
    {
      id: "zi-10",
      name: "Thatte Idli",
      cuisine: "south-indian",
      price: 1150,
      isVeg: true,
      portion: "391 gms",
      calories: "385.57 kcal",
      description: "Classic Karnataka giant steamed fluffy rice cakes served with bubbling piping-hot Sambhar, podi gun powder, and coconut chutney.",
      dietary: ["Veg", "Traditional South Indian"],
      image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=700&q=80"
    },
    {
      id: "zi-11",
      name: "Bedmi Puri Raseele Aloo",
      cuisine: "south-indian",
      price: 1250,
      isVeg: true,
      portion: "487 gms",
      calories: "952.57 kcal",
      description: "Crisp puffed urad dal stuffed puris served with spicy, tangy fenugreek potato curry and sweet mango pickle.",
      dietary: ["Veg", "Heritage Breakfast"],
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80"
    },
    {
      id: "zi-12",
      name: "Shamiana Bread Omelette",
      cuisine: "south-indian",
      price: 1100,
      isVeg: false,
      portion: "310 gms",
      calories: "520.49 kcal",
      description: "Spiced beaten egg omelette folded with fresh herbs, cheese, artisanal sliced bread, green chutney, and thecha ketchup.",
      dietary: ["Non-Veg", "All-Day Special"],
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=700&q=80"
    },

    // --- TANDOOR & INDIAN GRILLS CUISINE ---
    {
      id: "zi-13",
      name: "Jaitooni Pudina Paneer Tikka",
      cuisine: "tandoor-grills",
      price: 1100,
      isVeg: true,
      portion: "353 gms",
      calories: "517.15 kcal",
      description: "Charcoal-tandoor roasted cottage cheese cubes marinated in crushed Mediterranean olives, fresh mint, and toasted pepitas.",
      dietary: ["Veg", "Tandoori Special"],
      image: "https://images.unsplash.com/photo-1701579231320-cc2f7acad3cd?auto=format&fit=crop&w=700&q=80"
    },
    {
      id: "zi-14",
      name: "Ajwaini Chicken Tikka",
      cuisine: "tandoor-grills",
      price: 1250,
      isVeg: false,
      portion: "307 gms",
      calories: "265.95 kcal",
      description: "Smoked tender chicken morsels steeped in aromatic carom seeds (ajwain), hung yogurt, mustard oil, and kachumber.",
      dietary: ["Non-Veg", "High Protein", "Gluten-Free"],
      image: "https://images.unsplash.com/photo-1755090154782-5215189b4083?auto=format&fit=crop&w=700&q=80"
    },
    {
      id: "zi-15",
      name: "Kasundi Salmon Tikka",
      cuisine: "tandoor-grills",
      price: 3100,
      isVeg: false,
      portion: "346 gms",
      calories: "455.68 kcal",
      description: "Wild salmon fillets marinated in fiery Bengali kasundi mustard relish, clay-roasted with crispy quinoa salad.",
      dietary: ["Non-Veg", "Chef's Masterpiece"],
      image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=80"
    },

    // --- COASTAL & SEAFOOD CUISINE ---
    {
      id: "zi-16",
      name: "Goan Pomfret Curry",
      cuisine: "coastal-seafood",
      price: 2400,
      isVeg: false,
      portion: "688 gms",
      calories: "771.52 kcal",
      description: "Coastal pomfret simmered in fresh coconut milk curry infused with sour kokum (garcinia indica), served with steamed rice.",
      dietary: ["Non-Veg", "Goan Heritage"],
      image: "https://images.unsplash.com/photo-1652954008429-ce394eacbd7f?auto=format&fit=crop&w=700&q=80"
    },

    // --- STREET FOOD & CHAAT CUISINE ---
    {
      id: "zi-17",
      name: "Zaika Special Pav Bhaji",
      cuisine: "mumbai-street",
      price: 1250,
      isVeg: true,
      portion: "387 gms",
      calories: "391.33 kcal",
      description: "Slow-simmered spiced vegetable mash cooked with dollops of golden butter, served with hot toasted pillowy pavs.",
      dietary: ["Veg", "Legendary Street Food"],
      image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=700&q=80"
    },
    {
      id: "zi-18",
      name: "Bombay Tawa Pulao",
      cuisine: "mumbai-street",
      price: 1250,
      isVeg: true,
      portion: "566 gms",
      calories: "598.26 kcal",
      description: "Long-grain basmati rice seared on a cast-iron tawa with crunchy bell peppers, onions, tomatoes, and boondi raita.",
      dietary: ["Veg", "Street Tawa Special"],
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80"
    },
    {
      id: "zi-19",
      name: "Spicy Kheema Mutter",
      cuisine: "mumbai-street",
      price: 1500,
      isVeg: false,
      portion: "369 gms",
      calories: "1820.17 kcal",
      description: "Spiced minced mutton braised with sweet green peas, whole cinnamon, black cardamom, and buttered pav.",
      dietary: ["Non-Veg", "Irani Cafe Classic"],
      image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=700&q=80"
    },

    // --- CONTINENTAL & QUICK BITES CUISINE ---
    {
      id: "zi-20",
      name: "Spicy Chicken Sizzler & Fried Rice",
      cuisine: "continental-fast",
      price: 700,
      isVeg: false,
      portion: "420 gms",
      calories: "620 kcal",
      description: "Wok-tossed spicy chicken tossed in house chili sauce, served with aromatic vegetable egg fried rice.",
      dietary: ["Non-Veg", "Continental Fast"],
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80"
    },
    {
      id: "zi-21",
      name: "Grilled Salmon Fish with Greens",
      cuisine: "continental-fast",
      price: 900,
      isVeg: false,
      portion: "360 gms",
      calories: "490 kcal",
      description: "Pan-grilled Norwegian salmon steak served with steamed beans, lemon herb butter, and herb roasted baby potatoes.",
      dietary: ["Non-Veg", "Healthy Continental"],
      image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=80"
    },
    {
      id: "zi-22",
      name: "Creamy Spaghetti Pasta & Avocado Toast",
      cuisine: "continental-fast",
      price: 600,
      isVeg: true,
      portion: "340 gms",
      calories: "510 kcal",
      description: "Al dente spaghetti tossed in rich garlic parmesan cream sauce, served alongside toasted sourdough with crushed Hass avocado.",
      dietary: ["Veg", "Continental Favorite"],
      image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=700&q=80"
    },

    // --- ARTISANAL BEVERAGES & TEAS ---
    {
      id: "zi-23",
      name: "Rose Falooda Royal",
      cuisine: "beverages-drinks",
      price: 700,
      isVeg: true,
      portion: "375 gms",
      calories: "246.45 kcal",
      description: "Chilled organic rose milk loaded with silky vermicelli noodles, sabja basil seeds, and handmade saffron kulfi.",
      dietary: ["Sweet Beverage", "Heritage Treat"],
      image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=700&q=80"
    },
    {
      id: "zi-24",
      name: "Forest Fire Signature Mocktail",
      cuisine: "beverages-drinks",
      price: 500,
      isVeg: true,
      portion: "310 ml",
      calories: "145.86 kcal",
      description: "Fresh crushed sweet basil, wild tart raspberries, sweet-sour tamarind extract, and cold-pressed watermelon juice.",
      dietary: ["Mocktail", "Non-Alcoholic"],
      image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=700&q=80"
    },
    {
      id: "zi-25",
      name: "Rose Latte & Artisanal Matcha",
      cuisine: "beverages-drinks",
      price: 550,
      isVeg: true,
      portion: "300 ml",
      calories: "228.37 kcal",
      description: "Single-origin Arabica espresso, steamed milk, fragrant rose essence and dried organic Persian rose petals.",
      dietary: ["Artisanal Coffee"],
      image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=700&q=80"
    },

    // --- MITHAI & DESSERTS ---
    {
      id: "zi-26",
      name: "Authentic Kesar Rasmalai",
      cuisine: "desserts-sweets",
      price: 800,
      isVeg: true,
      portion: "172 gms",
      calories: "224.34 kcal",
      description: "Spongy cottage cheese discs soaked in chilled saffron-pistachio clotted milk, dusted with edible silver vark.",
      dietary: ["Veg", "Royal Indian Sweet"],
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=80"
    },
    {
      id: "zi-27",
      name: "Bombay Ice Cream (Tasting Trio)",
      cuisine: "desserts-sweets",
      price: 950,
      isVeg: true,
      portion: "155 gms",
      calories: "451.24 kcal",
      description: "Trio of sugar-free keto chocolate, espresso shotgun coffee, and winter nolen gur (date palm jaggery).",
      dietary: ["Veg", "Ice Cream Trio"],
      image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=700&q=80"
    },
    {
      id: "zi-28",
      name: "Spanish Basque Cheese Cake",
      cuisine: "desserts-sweets",
      price: 1150,
      isVeg: true,
      portion: "149 gms",
      calories: "462.97 kcal",
      description: "Classic caramelized burnt cheesecake with tart cherry compote and vanilla Chantilly cream.",
      dietary: ["Veg", "European Patisserie"],
      image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=700&q=80"
    }
  ]
};
