const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");   // na hashovanie hesiel

const prisma = new PrismaClient();
const app = express();

app.use(express.json()); // aby vedel spracovať JSON body

app.get("/", (req, res) => {
  res.send("API beží 🚀");
});

app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post("/api/users", async (req, res) => {
  const { name, email, role, password } = req.body;

  if (!name || !email || !role || !password) {
    return res.status(400).json({ error: "Chýbajú povinné polia" });
  }

  try {
    // zahashuj heslo
    const passwordHash = await bcrypt.hash(password, 10);

    // vytvor používateľa
    const user = await prisma.user.create({
      data: { name, email, role, passwordHash },
    });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Nepodarilo sa vytvoriť používateľa" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server beží na porte ${PORT}`);
});

