// apps/web/src/pages/api/inzeraty.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    const { profession, location, minRating } = req.query;

    const ads = await prisma.ad.findMany({
      where: {
        ...(profession ? { profession: { contains: profession, mode: "insensitive" } } : {}),
        ...(location ? { location: { contains: location, mode: "insensitive" } } : {}),
        ...(minRating ? { rating: { gte: Number(minRating) } } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(ads);
  } catch (error) {
    console.error("API error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
