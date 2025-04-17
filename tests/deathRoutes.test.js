// // tests/deathRoutes.test.js
// import request from 'supertest';
// import mongoose from 'mongoose';
// import app from '../index.js';
// import Death from '../models/Death.js';

// beforeAll(async () => {
//   await mongoose.connect(process.env.MONGO_URI);
//   await Death.deleteMany({});
//   await Death.insertMany([
//     {
//       "Country/Territory": "France",
//       "Year": 2020,
//       "Cardiovascular": 150000,
//       "Cancer": 100000
//     },
//     {
//       "Country/Territory": "USA",
//       "Year": 2020,
//       "Cardiovascular": 300000,
//       "Cancer": 200000
//     }
//   ]);
// });

// afterAll(async () => {
//   await mongoose.connection.dropDatabase();
//   await mongoose.disconnect();
// });

// describe('GET /api/deaths/top-deaths-country', () => {
//   it('devrait retourner les 10 pays avec le plus de décès', async () => {
//     const res = await request(app).get('/api/deaths/top-deaths-country');
    
//     expect(res.statusCode).toBe(200);
//     expect(res.body).toEqual(
//       expect.arrayContaining([
//         expect.objectContaining({
//           country: expect.any(String),
//           totalDeaths: expect.any(Number)
//         })
//       ])
//     );
//   });
// });
// tests/deathRoutes.test.js
describe('GET /api/deaths/diabetes-evolution', () => {
  beforeAll(async (done) => {
    try {
      // Insérer des données de test pour le diabète
      await Death.insertMany([
        {
          "Country/Territory": "France",
          "Year": 2020,
          "Diabetes Mellitus": 5000
        },
        {
          "Country/Territory": "USA",
          "Year": 2020,
          "Diabetes Mellitus": 10000
        },
        {
          "Country/Territory": "France",
          "Year": 2021,
          "Diabetes Mellitus": 5500
        },
        {
          "Country/Territory": "USA",
          "Year": 2021,
          "Diabetes Mellitus": 10500
        }
      ]);
      done(); // Appeler done une fois que l'insertion est terminée
    } catch (err) {
      done(err); // Si une erreur se produit, la passer à done
    }
  });

  it('devrait retourner l\'évolution des décès dus au diabète', async () => {
    const res = await request(app).get('/api/deaths/diabetes-evolution');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          _id: expect.any(Number), // L'année
          totalDiabetesDeaths: expect.any(Number) // Le total des décès
        })
      ])
    );
    // Optionnel : vérifier les valeurs de l'année et du total
    expect(res.body).toEqual([
      { _id: 2020, totalDiabetesDeaths: 15000 },
      { _id: 2021, totalDiabetesDeaths: 16000 }
    ]);
  });
});
