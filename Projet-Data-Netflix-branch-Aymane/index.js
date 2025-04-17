import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import deathRoutes from './routes/deathRoutes.js';
import cors from 'cors';


const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/deaths', deathRoutes);


if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
      console.log("✅ Connexion à MongoDB réussie !");

      
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();
      console.log("📦 Collections trouvées :");
      collections.forEach(collection => {
        console.log(`- ${collection.name}`);
      });

      console.log("📂 Collection utilisée par le modèle 'Death':", mongoose.model('Death').collection.name);
      const firstDocs = await mongoose.model('Death').find().limit(3).lean();
if (firstDocs.length === 0) {
  console.log("❌ Aucun document trouvé dans la collection Death_cause");
} else {
  console.log("📄 Premiers documents de la collection :");
  firstDocs.forEach((doc, i) => {
    console.log(`\n🧾 Document ${i + 1}:`);
    console.table({
      Country: doc["Country/Territory"],
      Year: doc.Year,
      Diabetes: doc["Diabetes Mellitus"],
      TotalKeys: Object.keys(doc).length
    });
  });
}
app.listen(5000, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:5000`);
});
    })
    .catch(err => console.error("❌ Erreur de connexion MongoDB :", err));
}



export default app;
