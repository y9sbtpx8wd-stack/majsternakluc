const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ✅ GET /api/user – ukážkový endpoint (demo)
router.get("/", (req, res) => {
  res.json({
    id: 123,
    name: "Jozef",
    paid: true
  });
});

// ✅ GET /api/user/:id – detail používateľa z DB
router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { ads: true, reviews: true }
    });
    if (!user) return res.status(404).json({ error: "Používateľ nenájdený" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ PUT /api/user/:id – update používateľa
router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { name, email, role, paid } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { name, email, role, paid }
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Nepodarilo sa upraviť používateľa" });
  }
});

module.exports = router;
