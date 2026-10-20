const budgetTiers = [
  {
    amount: 9,
    minimumPrice: 1,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80',
    names: [
      'Mini Star Sticker Sheet', 'Birthday Candle Pair', 'Balloon Ribbon Bundle', 'Paper Party Hat',
      'Mini Confetti Pouch', 'Gift Tag Set', 'Cake Sprinkle Topper', 'Party Favor Sticker Pack',
      'Tiny Thank You Card', 'Number Candle',
    ],
  },
  {
    amount: 19,
    minimumPrice: 9,
    category: 'Tableware',
    image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=900&q=80',
    names: [
      'Printed Paper Napkin Set', 'Mini Treat Bag', 'Pastel Paper Cup', 'Birthday Badge',
      'Colorful Paper Straw Pack', 'Small Balloon Pack', 'Party Invitation Card', 'Foil Star Sticker Pack',
      'Cake Topper Pick', 'Paper Streamer Roll',
    ],
  },
  {
    amount: 29,
    minimumPrice: 19,
    category: 'Decorations',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=900&q=80',
    names: [
      'Mini Birthday Banner', 'Metallic Balloon Pair', 'Confetti Balloon Set', 'Paper Garland Strand',
      'Cake Candle Set', 'Party Photo Prop', 'Decorative Favor Box', 'Birthday Cupcake Topper Set',
      'Foil Letter Decoration', 'Table Scatter Confetti',
    ],
  },
  {
    amount: 49,
    minimumPrice: 29,
    category: 'Balloons',
    image: 'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=900&q=80',
    names: [
      'Pastel Balloon Trio', 'Metallic Balloon Bouquet', 'Mini Balloon Garland Pack', 'Birthday Balloon Banner',
      'Number Balloon Decoration', 'Confetti Balloon Bundle', 'Balloon Knotter Tool', 'Balloon Ribbon Set',
      'Party Balloon Mix', 'Foil Balloon Weight',
    ],
  },
  {
    amount: 59,
    minimumPrice: 49,
    category: 'Return Gifts',
    image: 'https://images.unsplash.com/photo-1513883049090-d0b7439799bf?auto=format&fit=crop&w=900&q=80',
    names: [
      'Mini Return Gift Pouch', 'Coloring Activity Pack', 'Kids Party Favor Set', 'Mini Gift Box Duo',
      'Thank You Favor Bundle', 'Birthday Treat Bag Set', 'Small Craft Activity Kit', 'Party Prize Pack',
      'Character Eraser Gift Set', 'Mini Stationery Favor Kit',
    ],
  },
  {
    amount: 99,
    minimumPrice: 59,
    category: 'Cake Toppers',
    image: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?auto=format&fit=crop&w=900&q=80',
    names: [
      'Glitter Birthday Cake Topper', 'Pastel Candle and Topper Set', 'Celebration Cake Decoration Kit',
      'Gold Star Cake Topper Set', 'Rainbow Cupcake Decoration Pack', 'Birthday Number Candle Bundle',
      'Mini Cake Banner Set', 'Metallic Cake Sprinkle Kit', 'Birthday Cupcake Topper Collection',
      'Sparkle Party Cake Kit',
    ],
  },
  {
    amount: 149,
    minimumPrice: 99,
    category: 'Return Gifts',
    image: 'https://images.unsplash.com/photo-1513883049090-d0b7439799bf?auto=format&fit=crop&w=900&q=80',
    names: [
      'Deluxe Birthday Favor Pouch', 'Mini Art and Craft Gift Set', 'Colorful Treat Box Collection',
      'Party Thank You Gift Bundle', 'Kids Celebration Activity Kit', 'Personalized Favor Tag Set',
      'Bright Birthday Goodie Bag', 'Premium Mini Gift Box Set', 'Creative Party Favor Pack',
      'Celebration Keepsake Bundle',
    ],
  },
];

export const budgetProducts = budgetTiers.flatMap((tier, tierIndex) => {
  const priceRange = tier.amount - tier.minimumPrice;

  return tier.names.map((name, itemIndex) => {
    const price = Math.max(2, tier.minimumPrice + ((itemIndex * 3) % priceRange));
    return {
      id: `budget-${tier.amount}-${itemIndex + 1}`,
      name,
      sku: `BUD-${tierIndex + 1}${String(itemIndex + 1).padStart(2, '0')}`,
      category: tier.category,
      price,
      wholesalePrice: Math.max(1, Math.floor(price * 0.75)),
      description: `${name} for birthdays, party tables, and cheerful celebrations.`,
      stock: 12 + itemIndex,
      rating: 4.3 + (itemIndex % 7) / 10,
      image: tier.image,
      budgetAmount: tier.amount,
      available: true,
    };
  });
});
