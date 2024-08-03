// index.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conectar ao MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("Conectado ao MongoDB Atlas"))
  .catch((err) => console.error("Erro ao conectar ao MongoDB Atlas:", err));

// Definir o esquema e o modelo para Attractions
const attractionSchema = new mongoose.Schema({
  id: Number,
  name: String,
  type: String,
  description: String,
  tips: String,
  image_url: String,
  destination_id: Number,
  created_at: String,
  updated_at: String,
  latitude: Number,
  longitude: Number,
});

const Attraction = mongoose.model("Attraction", attractionSchema);

// Definir o esquema e o modelo para Destinations
const destinationSchema = new mongoose.Schema({
  id: Number,
  name: String,
  description: String,
  location: String,
  image_url: String,
  created_at: String,
  updated_at: String,
  latitude: Number,
  longitude: Number,
});

const Destination = mongoose.model("Destination", destinationSchema);

// Rotas
app.get("/api/destinations", async (req, res) => {
  try {
    const destinations = await Destination.find({});
    res.json(destinations);
  } catch (error) {
    console.error("Erro ao buscar destinos:", error);
    res
      .status(500)
      .json({ message: "Erro ao buscar destinos", error: error.message });
  }
});

app.get("/api/attractions", async (req, res) => {
  const { destination_id } = req.query;

  try {
    if (!destination_id) {
      return res.status(400).json({ message: "destination_id é obrigatório" });
    }

    // Converta destination_id para um número
    const destinationIdNum = parseInt(destination_id, 10);

    // Verifique se a conversão foi bem-sucedida
    if (isNaN(destinationIdNum)) {
      return res
        .status(400)
        .json({ message: "destination_id deve ser um número válido" });
    }

    // Encontrar as atrações com base no destination_id
    const attractions = await Attraction.find({
      destination_id: destinationIdNum,
    });

    res.json(attractions);
  } catch (error) {
    console.error("Erro ao buscar atrações:", error);
    res
      .status(500)
      .json({ message: "Erro ao buscar atrações", error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
