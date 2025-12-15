const express = require('express');
const bodyParser = require('body-parser');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Import route
const userRoute = require('./routes/user');
app.use('/api/user', userRoute);

// 🔒 Login route
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

app.post('/api/login', async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid input', details: parsed.error.errors });
    }

    const { email, password } = parsed.data;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'supersecret',
      { expiresIn: '1h' }
    );

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Zoznam inzerátov s filtrami
app.get('/api/inzeraty', async (req, res) => {
  const { profession, location, minRating } = req.query;

  const where = {
    profession: profession || undefined,
    location: location || undefined,
    ...(minRating
      ? { reviews: { some: { rating: { gte: Number(minRating) } } } }
      : {})
  };

  const ads = await prisma.ad.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, role: true } },
      reviews: true
    },
    orderBy: { createdAt: 'desc' }
  });

  res.json(ads);
});

// Detail inzerátu
app.get('/api/inzeraty/:id', async (req, res) => {
  const id = Number(req.params.id);
  const ad = await prisma.ad.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, role: true } },
      reviews: true
    }
  });
  if (!ad) return res.status(404).json({ error: 'Inzerát nenájdený' });
  res.json(ad);
});

// Vytvorenie inzerátu
app.post('/api/inzeraty', async (req, res) => {
  const { title, description, profession, location, userId } = req.body;
  if (!title || !description || !profession || !location || !userId) {
    return res.status(400).json({ error: 'Chýbajú povinné polia' });
  }
  const ad = await prisma.ad.create({
    data: { title, description, profession, location, userId }
  });
  res.status(201).json(ad);
});

// Úprava inzerátu
app.put('/api/inzeraty/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { title, description, profession, location } = req.body;
  const ad = await prisma.ad.update({
    where: { id },
    data: { title, description, profession, location }
  });
  res.json(ad);
});

// Zmazanie inzerátu
app.delete('/api/inzeraty/:id', async (req, res) => {
  const id = Number(req.params.id);
  await prisma.ad.delete({ where: { id } });
  res.status(204).send();
});

// Pridanie hodnotenia
app.post('/api/inzeraty/:id/reviews', async (req, res) => {
  const adId = Number(req.params.id);
  const { rating, comment } = req.body;
  if (!rating) return res.status(400).json({ error: 'Chýba rating' });

  const review = await prisma.review.create({
    data: { adId, rating: Number(rating), comment: comment || null }
  });
  res.status(201).json(review);
});

// Vytvorenie používateľa
app.post('/api/users', async (req, res) => {
  const { name, email, role, password } = req.body;
  if (!name || !email || !role || !password) {
    return res.status(400).json({ error: 'Chýbajú povinné polia' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, role, passwordHash }
    });
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Nepodarilo sa vytvoriť používateľa' });
  }
});

// Detail používateľa
app.get('/api/users/:id', async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id },
    include: { ads: true, reviews: true }
  });
  if (!user) return res.status(404).json({ error: 'Používateľ nenájdený' });
  res.json(user);
});

// Filter route
app.get('/api/filter', async (req, res) => {
  const { role, city } = req.query;

  const users = await prisma.user.findMany({
    where: {
      ...(role ? { role } : {}),
      ...(city ? { city } : {})
    }
  });

  if (users.length > 0) {
    return res.json({ type: 'users', data: users });
  }

  const ads = await prisma.ad.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  return res.json({ type: 'inzeraty', data: ads });
});

// Spustenie servera
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API beží na porte ${PORT}`);
});
