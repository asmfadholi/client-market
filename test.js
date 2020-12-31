import * as knnClassifier from '@tensorflow-models/knn-classifier'
const fs = require('fs').promises
const Tensorset = require('tensorset');

(async () => {
  // Create a classifier, add your examples
  const originalClassifier = knnClassifier.create()
  originalClassifier.addExample('', 'bis')

  // Stringify the dataset
  let dataset = Tensorset.stringify(originalClassifier.getClassifierDataset())

  // Save the dataset
  await fs.writeFile('./test.json', dataset)

  // Load the dataset
  dataset = await fs.readFile('./test.json')

  // Parse the dataset
  dataset = await Tensorset.parse(dataset)

  // Add to a new classifier
  const newClassifier = knnClassifier.create()
  newClassifier.setClassifierDataset(dataset)
})()
