import express from 'express';
import Death from '../models/Death.js';
import dotenv from 'dotenv';

dotenv.config(); 

const router = express.Router();

// Route 1 : Top 10 pays avec le plus grand nombre de décès toutes causes confondues
router.get('/top-deaths-country', async (req, res) => {
  try {
    const pipeline = [
      {
        $project: {
          country: "$Country/Territory",
          deathsData: {
            $objectToArray: "$$ROOT"
          }
        }
      },
      {
        $addFields: {
          totalDeaths: {
            $reduce: {
              input: "$deathsData",
              initialValue: 0,
              in: {
                $add: [
                  "$$value",
                  {
                    $cond: [
                      {
                        $and: [
                          { $ne: ["$$this.k", "_id"] },
                          { $ne: ["$$this.k", "Country/Territory"] },
                          { $ne: ["$$this.k", "Code"] },
                          { $ne: ["$$this.k", "Year"] },
                          { $isNumber: "$$this.v" }
                        ]
                      },
                      "$$this.v",
                      0
                    ]
                  }
                ]
              }
            }
          }
        }
      },
      {
        $group: {
          _id: "$country",
          totalDeaths: { $sum: "$totalDeaths" }
        }
      },
      { $sort: { totalDeaths: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          country: "$_id",
          totalDeaths: 1
        }
      }
    ];

    const results = await Death.aggregate(pipeline);
    res.json(results);
  } catch (err) {
    console.error("Erreur d'agrégation MongoDB:", err);
    res.status(500).json({
      error: "Erreur serveur",
      details: err.message
    });
  }
});


// Route 2 : Évolution des décès dus au diabète
router.get('/diabetes-evolution', async (req, res) => {
  try {
    const data = await Death.aggregate([
      {
        $group: {
          _id: "$Year",
          totalDiabetesDeaths: { $sum: "$Diabetes Mellitus" } 
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 3. Quelles sont les 10 causes de mortalité les plus fréquentes au niveau mondial ?
router.get('/top-causes', async (req, res) => {
  try {
    const pipeline = [
      {
        $project: {
          causes: {
            $objectToArray: "$$ROOT"
          }
        }
      },
      {
        $unwind: "$causes"
      },
      {
        $match: {
          "causes.k": {
            $nin: ["_id", "Country/Territory", "Code", "Year"]
          }
        }
      },
      {
        $group: {
          _id: "$causes.k",
          totalDeaths: { $sum: "$causes.v" }
        }
      },
      { $sort: { totalDeaths: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          cause: "$_id",
          totalDeaths: 1
        }
      }
    ];

    const result = await Death.aggregate(pipeline);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cause de mortalité avec la plus forte augmentation/diminution entre 1990 et 2019
router.get('/cause-evolution', async (req, res) => {
  try {
    const data = await Death.aggregate([
      { $match: { Year: { $in: [1990, 2019] } } },
      {
        $project: {
          Year: 1,
          country: "$Country/Territory",
          fields: {
            $objectToArray: "$$ROOT"
          }
        }
      },
      { $unwind: "$fields" },
      {
        $match: {
          "fields.k": {
            $nin: ["_id", "Country/Territory", "Code", "Year"]
          }
        }
      },
      {
        $group: {
          _id: { cause: "$fields.k", year: "$Year" },
          total: { $sum: "$fields.v" }
        }
      },
      {
        $group: {
          _id: "$_id.cause",
          values: {
            $push: {
              year: "$_id.year",
              total: "$total"
            }
          }
        }
      },
      {
        $project: {
          cause: "$_id",
          diff: {
            $subtract: [
              { $arrayElemAt: ["$values.total", 1] }, 
              { $arrayElemAt: ["$values.total", 0] }  
            ]
          }
        }
      },
      { $sort: { diff: -1 } }
    ]);

    const topIncrease = data[0];
    const topDecrease = data[data.length - 1];

    res.json({
      causeWithMostIncrease: topIncrease,
      causeWithMostDecrease: topDecrease
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Pays les plus touchés par les maladies non transmissibles
router.get('/non-communicable', async (req, res) => {
  try {
    const nonCommunicableCauses = [
      "Cardiovascular Diseases",
      "Alzheimer's Disease and Other Dementias",
      "Diabetes Mellitus",
      "Neoplasms",
      "Chronic Kidney Disease",
      "Chronic Respiratory Diseases",
      "Digestive Diseases",
      "Parkinson's Disease",
      "Cirrhosis and Other Chronic Liver Diseases"
    ];

    const pipeline = [
      {
        $project: {
          country: "$Country/Territory",
          total: {
            $sum: nonCommunicableCauses.map(cause => ({
              $ifNull: [`$${cause}`, 0]
            }))
          }
        }
      },
      {
        $group: {
          _id: "$country",
          totalNonCommunicableDeaths: { $sum: "$total" }
        }
      },
      { $sort: { totalNonCommunicableDeaths: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          country: "$_id",
          totalNonCommunicableDeaths: 1
        }
      }
    ];

    const result = await Death.aggregate(pipeline);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
