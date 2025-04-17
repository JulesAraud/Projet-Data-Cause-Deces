import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config(); 

const mongoURI = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
const collectionName = process.env.COLLECTION_NAME;

MongoClient.connect(mongoURI)
  .then(client => {
    console.log('✅ Connexion réussie à MongoDB Atlas !');
    
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    db.listCollections()
      .toArray()
      .then(collections => {
        console.log('📦 Collections trouvées :', collections);
        client.close();
      })
      .catch(err => {
        console.error('Erreur lors de la récupération des collections:', err);
      });
  })
  .catch(err => {
    console.error('Erreur de connexion à MongoDB:', err);
  });