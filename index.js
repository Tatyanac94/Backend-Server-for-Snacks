const express = require('express');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(cors()); 
app.use(express.json()); 

const snacks = [
  { id: 1, name: "Chips", description: "Crunchy and salty potato chips.", price: 2.99, category: "Salty Snacks", inStock: true },
  { id: 2, name: "Chocolate Bar", description: "Rich and creamy milk chocolate bar.", price: 1.49, category: "Sweet Snacks", inStock: true },
  { id: 3, name: "Popcorn", description: "Buttery and fluffy popcorn.", price: 3.49, category: "Salty Snacks", inStock: false },
  { id: 4, name: "Gummy Bears", description: "Colorful and chewy gummy bears.", price: 2.19, category: "Sweet Snacks", inStock: true },
  { id: 5, name: "Pretzels", description: "Crispy and twisted pretzels.", price: 2.79, category: "Salty Snacks", inStock: true },
  { id: 6, name: "Granola Bar", description: "Healthy and crunchy granola bar.", price: 1.99, category: "Healthy Snacks", inStock: true },
  { id: 7, name: "Fruit Snacks", description: "Sweet and fruity gummy snacks.", price: 2.49, category: "Sweet Snacks", inStock: false },
  { id: 8, name: "Nuts Mix", description: "A mix of roasted and salted nuts.", price: 4.99, category: "Healthy Snacks", inStock: true },
  { id: 9, name: "Energy Bar", description: "High-protein energy bar.", price: 2.59, category: "Healthy Snacks", inStock: true },
  { id: 10, name: "Rice Crackers", description: "Light and crispy rice crackers.", price: 3.19, category: "Healthy Snacks", inStock: false }
];


app.get('/', (req, res) => {
  res.json(snacks);
});

app.post("/items", (req, res) => {
  const { name, description, price, category, inStock } = req.body;

  if (!name || !description || typeof price !== 'number' || !category || inStock === undefined) {
    return res.status(400).json({ message: 'All fields are required and price must be a number' });
  }

  const newId = snacks.length ? Math.max(snacks.map(s => s.id)) + 1 : 1;
  const newSnack = { id: newId, name, description, price, category, inStock };

  snacks.push(newSnack);
  res.status(201).json(newSnack);
});

app.get("/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const snack = snacks.find(s => s.id === id);
  if (snack) {
    res.json(snack);
  } else {
    res.status(404).json({ message: 'Snack not found' });
  }
});

app.put("/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = snacks.findIndex(s => s.id === id);

  if (index !== -1) {
    const { name, description, price, category, inStock } = req.body;
    const updatedSnack = { ...snacks[index], ...req.body };

    if (price !== undefined && typeof price !== 'number') {
      return res.status(400).json({ message: 'Price must be a number' });
    }

    if (!updatedSnack.name || !updatedSnack.description || !updatedSnack.category || updatedSnack.inStock === undefined) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    snacks[index] = updatedSnack;
    res.json(updatedSnack);
  } else {
    res.status(404).json({ message: 'Snack not found' });
  }
});

app.delete("/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = snacks.findIndex(s => s.id === id);
  if (index !== -1) {
    snacks.splice(index, 1);
    res.status(204).end();
  } else {
    res.status(404).json({ message: 'Snack not found' });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
