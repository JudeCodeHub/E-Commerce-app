import prisma from "@/lib/prisma";

export async function refillFeaturedSlots(targetCount = 5) {
  const featuredCount = await prisma.product.count({
    where: { featured: true, inStock: true, archived: false },
  });

  const needed = targetCount - featuredCount;
  if (needed <= 0) return;

  const currentFeatured = await prisma.product.findMany({
    where: { featured: true, inStock: true, archived: false },
    select: { category: true },
  });
  const usedCategories = new Set(currentFeatured.map((product) => product.category));

  const candidates = await prisma.product.findMany({
    where: { featured: false, inStock: true, archived: false },
    orderBy: { createdAt: "desc" },
  });

  candidates.sort((a, b) => {
    const aUsed = usedCategories.has(a.category) ? 1 : 0;
    const bUsed = usedCategories.has(b.category) ? 1 : 0;
    return aUsed - bUsed;
  });

  const toPromote = candidates.slice(0, needed).map((product) => product.id);

  if (toPromote.length > 0) {
    await prisma.product.updateMany({
      where: { id: { in: toPromote } },
      data: { featured: true },
    });
  }
}
