import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Materials
  const materials = await Promise.all([
    prisma.material.upsert({
      where: { id: 'f55-silk' },
      update: {},
      create: {
        id: 'f55-silk',
        materialName: 'Rajshahi Mulberry Silk',
        origin: 'Rajshahi, Bangladesh',
        qualityGrade: 'Heritage',
        textureMap: '/textures/silk.jpg',
        surcharge: 4500,
        description: 'Premium handspun mulberry silk from the silk farms of Rajshahi. Known for its lustrous sheen and exceptional drape.'
      }
    }),
    prisma.material.upsert({
      where: { id: 'g88-linen' },
      update: {},
      create: {
        id: 'g88-linen',
        materialName: 'Organic Belgian Linen',
        origin: 'Imported / Eco-Certified',
        qualityGrade: 'Premium',
        textureMap: '/textures/linen.jpg',
        surcharge: 2000,
        description: 'Eco-certified organic linen from Belgium. Naturally breathable with a refined texture.'
      }
    }),
    prisma.material.upsert({
      where: { id: 'j22-jamdani' },
      update: {},
      create: {
        id: 'j22-jamdani',
        materialName: 'Heritage Jamdani Weave',
        origin: 'Narayanganj, Bangladesh',
        qualityGrade: 'Heritage',
        textureMap: '/textures/jamdani.jpg',
        surcharge: 6000,
        description: 'Traditional handwoven Jamdani fabric featuring intricate geometric patterns. UNESCO Intangible Heritage.'
      }
    }),
    prisma.material.upsert({
      where: { id: 'k33-cotton' },
      update: {},
      create: {
        id: 'k33-cotton',
        materialName: 'Organic Pima Cotton',
        origin: 'Gazipur, Bangladesh',
        qualityGrade: 'Organic',
        textureMap: '/textures/cotton.jpg',
        surcharge: 1500,
        description: 'GOTS-certified organic Pima cotton. Exceptionally soft and breathable for everyday luxury.'
      }
    }),
    prisma.material.upsert({
      where: { id: 'l44-chiffon' },
      update: {},
      create: {
        id: 'l44-chiffon',
        materialName: 'Pure Silk Chiffon',
        origin: 'Varanasi, India',
        qualityGrade: 'Premium',
        textureMap: '/textures/chiffon.jpg',
        surcharge: 3500,
        description: 'Lightweight pure silk chiffon with an ethereal drape. Perfect for evening occasions.'
      }
    })
  ]);

  console.log(`Created ${materials.length} materials`);

  // Create Products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: 'd16b-4e12' },
      update: {},
      create: {
        id: 'd16b-4e12',
        name: 'The Midnight Jamdani',
        basePrice: 18500,
        description: 'A heritage-grade black Jamdani featuring hand-woven silver motifs. Each piece takes 120 hours of manual loom work. The intricate patterns dance across the fabric like stars in a midnight sky.',
        category: 'Clothing',
        arModelUrl: '/models/midnight_jamdani.glb',
        isLimited: true,
        totalAllocation: 15,
        remainingStock: 3,
        imageUrl: '/products/midnight-jamdani.jpg',
        fabricOptions: JSON.stringify(['j22-jamdani', 'f55-silk']),
        featured: true
      }
    }),
    prisma.product.upsert({
      where: { id: 'e22c-9k33' },
      update: {},
      create: {
        id: 'e22c-9k33',
        name: 'Artisanal Forest Honey',
        basePrice: 2200,
        description: 'Wild-sourced, organic honey from the deep Sundarbans, filtered through traditional muslin. Each jar contains the essence of Bengal\'s mangrove forests.',
        category: 'Organic',
        isLimited: false,
        totalAllocation: 100,
        remainingStock: 47,
        imageUrl: '/products/forest-honey.jpg',
        featured: true
      }
    }),
    prisma.product.upsert({
      where: { id: 'a11b-2c33' },
      update: {},
      create: {
        id: 'a11b-2c33',
        name: 'The Nilambari Silk',
        basePrice: 24500,
        description: 'A celestial blue silk ensemble featuring hand-embroidered silver zardozi work. The Nilambari takes its name from the deep blue of the night sky, adorned with 200+ hours of artisanal embroidery.',
        category: 'Clothing',
        arModelUrl: '/models/nilambari_silk.glb',
        isLimited: true,
        totalAllocation: 10,
        remainingStock: 2,
        imageUrl: '/products/nilambari-silk.jpg',
        fabricOptions: JSON.stringify(['f55-silk', 'l44-chiffon']),
        featured: true
      }
    }),
    prisma.product.upsert({
      where: { id: 'b33d-4e55' },
      update: {},
      create: {
        id: 'b33d-4e55',
        name: 'Organic Indigo Dress',
        basePrice: 12000,
        description: 'Naturally dyed with indigo from the riverbanks of Bangladesh. Each piece is a unique shade, as the dye responds to the fabric\'s natural texture. A celebration of slow fashion.',
        category: 'Clothing',
        arModelUrl: '/models/indigo_dress.glb',
        isLimited: true,
        totalAllocation: 20,
        remainingStock: 5,
        imageUrl: '/products/indigo-dress.jpg',
        fabricOptions: JSON.stringify(['k33-cotton', 'g88-linen']),
        featured: true
      }
    }),
    prisma.product.upsert({
      where: { id: 'c44e-5f66' },
      update: {},
      create: {
        id: 'c44e-5f66',
        name: 'Saffron-Infused Rose Water',
        basePrice: 1800,
        description: 'Hand-distilled rose water from the gardens of Sylhet, infused with Kashmiri saffron. A single drop transforms your skincare ritual into a moment of luxury.',
        category: 'Organic',
        isLimited: false,
        totalAllocation: 50,
        remainingStock: 32,
        imageUrl: '/products/rose-water.jpg',
        featured: false
      }
    }),
    prisma.product.upsert({
      where: { id: 'f55g-6h77' },
      update: {},
      create: {
        id: 'f55g-6h77',
        name: 'The Ivory Linen Ensemble',
        basePrice: 16500,
        description: 'Pure Belgian linen in an elegant ivory shade. Minimalist design meets maximum comfort. Each piece is pre-washed for that perfectly lived-in feel from day one.',
        category: 'Clothing',
        arModelUrl: '/models/ivory_linen.glb',
        isLimited: false,
        totalAllocation: 30,
        remainingStock: 18,
        imageUrl: '/products/ivory-linen.jpg',
        fabricOptions: JSON.stringify(['g88-linen', 'k33-cotton']),
        featured: false
      }
    }),
    prisma.product.upsert({
      where: { id: 'g66h-7i88' },
      update: {},
      create: {
        id: 'g66h-7i88',
        name: 'Wild Turmeric Paste',
        basePrice: 950,
        description: 'Sun-dried wild turmeric ground with cold-pressed coconut oil. A traditional Bengali beauty secret now available in its purest form.',
        category: 'Organic',
        isLimited: false,
        totalAllocation: 80,
        remainingStock: 56,
        imageUrl: '/products/turmeric-paste.jpg',
        featured: false
      }
    })
  ]);

  console.log(`Created ${products.length} products`);

  // Create Reviews
  const reviews = await Promise.all([
    prisma.review.upsert({
      where: { id: 'r001' },
      update: {},
      create: {
        id: 'r001',
        productId: 'd16b-4e12',
        authorName: '@dhaka_style',
        content: 'The Midnight Jamdani exceeded all expectations. The handwork is visible in every thread. Worth every taka.',
        rating: 5,
        source: 'instagram',
        isPinned: true,
        isApproved: true
      }
    }),
    prisma.review.upsert({
      where: { id: 'r002' },
      update: {},
      create: {
        id: 'r002',
        productId: 'd16b-4e12',
        authorName: '@luxury_bengal',
        content: 'Received mine yesterday. The packaging alone made me feel like royalty. The dress is a masterpiece.',
        rating: 5,
        source: 'instagram',
        isPinned: true,
        isApproved: true
      }
    }),
    prisma.review.upsert({
      where: { id: 'r003' },
      update: {},
      create: {
        id: 'r003',
        productId: 'a11b-2c33',
        authorName: '@conscious_fashion',
        content: 'The Nilambari is not just a dress, it\'s an heirloom. My grandmother approved, and she\'s the toughest critic.',
        rating: 5,
        source: 'verified',
        isPinned: true,
        isApproved: true
      }
    }),
    prisma.review.upsert({
      where: { id: 'r004' },
      update: {},
      create: {
        id: 'r004',
        productId: 'e22c-9k33',
        authorName: '@organic_bd',
        content: 'The forest honey has become my morning ritual. You can taste the Sundarbans in every spoon.',
        rating: 5,
        source: 'instagram',
        isPinned: false,
        isApproved: true
      }
    }),
    prisma.review.upsert({
      where: { id: 'r005' },
      update: {},
      create: {
        id: 'r005',
        productId: 'b33d-4e55',
        authorName: '@slow_fashionista',
        content: 'The indigo dye variation is beautiful. Mine is slightly deeper than my sister\'s. Two unique pieces.',
        rating: 5,
        source: 'verified',
        isPinned: false,
        isApproved: true
      }
    })
  ]);

  console.log(`Created ${reviews.length} reviews`);

  // Create a guest user for demo orders
  const guestUser = await prisma.user.upsert({
    where: { id: 'guest-user' },
    update: {},
    create: {
      id: 'guest-user',
      email: 'guest@aurnik.demo',
      name: 'Guest Member',
      role: 'member'
    }
  });

  console.log(`Created guest user: ${guestUser.email}`);

  // Create a sample order for testing progress engine
  const order = await prisma.order.upsert({
    where: { orderId: 'ord-7721' },
    update: {},
    create: {
      orderId: 'ord-7721',
      userId: 'guest-user',
      productId: 'd16b-4e12',
      materialId: 'j22-jamdani',
      status: 'In_Progress',
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      targetDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
      artisanNotes: 'Currently working on the silver border motifs. Fabric tension is perfect.',
      totalPrice: 24500
    }
  });

  console.log(`Created sample order: ${order.orderId}`);

  // Create a second order for testing
  const order2 = await prisma.order.upsert({
    where: { orderId: 'ord-8832' },
    update: {},
    create: {
      orderId: 'ord-8832',
      userId: 'guest-user',
      productId: 'a11b-2c33',
      materialId: 'f55-silk',
      status: 'In_Progress',
      startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      targetDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
      artisanNotes: 'Pattern drafting complete. Beginning fabric cutting phase.',
      totalPrice: 28000
    }
  });

  console.log(`Created sample order: ${order2.orderId}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
