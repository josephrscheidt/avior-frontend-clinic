/*
* @author spapazov
* Date: 28/7/2019
* This is a factory for calculating the tf-idf for a text/document
* To be used for the purpose of ranking search results
* Rankings are based upon the classical version of the Vector Space Model
* href = https://en.wikipedia.org/wiki/Vector_space_model
*/

export class VectorSpaceFactory {

  constructor(){}

/*
* Breaks a string into an array of words (aka document)
*/
  createDocumentFromString(str:String){
    return str.split(" ");
  }

/*
* Calculates the term frequency (tf) of a given term in a document
* Term frequency is computed as:
* number of ocurrences of the term /length of document;
*/
  calculateTermFrequency(term: String, doc: String[]){
    if(doc.length == 0){
      return -1;
    }
    let numOccurences = 0;
    for (let i = 0; i < doc.length; i++){
      if (doc[i].toLowerCase() == term.toLowerCase()){
        numOccurences++;
      }
    }
    return (numOccurences * 1.0 / doc.length)
  }

  /*
  * Calculates the inverse document frequency (idf) of a term in a given document
  * idf = log(number of documents where the term appears / term frequency)
  */

  calculateInverseDocumentFrequency(term, frequInDoc, allDocs){
    let numDocs = 0;
    for (let i = 0; i< allDocs.length; i++){
      if (allDocs[i].title.toLowerCase().includes(term.toLowerCase())){
        numDocs++;
      }
    }
    if (numDocs == 0){
      return 0;
    }
    return Math.log(numDocs * 1.0 / frequInDoc);
  }

  /*
  * Creates a vector of the idf of the query term in a given document
  */

  createIdfModel(query: any[], doc: any[], allDocs: any[]){
    let model = [];
    for(let i = 0; i < query.length; i++){
      let freqInDoc = this.calculateTermFrequency(query[i], doc);
      model.push(this.calculateInverseDocumentFrequency(query[i], freqInDoc, allDocs));
    }
    return model;
  }

  /*
  * creates a vector of the tf-idf values for each query term
  * tf-idf = tf * idf
  */

  createVectorSpaceModel(query: String[], doc : String[], allDocs: any[]) {
    let termFrequencyModel = [];
    let vectorSpaceModel = []
    let idfModel = this.createIdfModel(query, doc, allDocs);
    for (let i = 0; i < query.length; i++){
      termFrequencyModel.push(this.calculateTermFrequency(query[i], doc));
    }
    for (let j = 0; j < idfModel.length; j++){
      vectorSpaceModel[j] = idfModel[j] * termFrequencyModel[j];
    }
    return vectorSpaceModel
  }

  /*                       
  * calculates the cosine similarity between two vectors computed as thier dot
  * product. The higher the cosine similarity of a given document the closer of
  * a match it is to the query.
  */
  calculateSimilarityIndex(query: any [], doc: any []){
    let similarityIndex = 0;
    for (let i = 0; i < query.length; i++){
      similarityIndex += (query[i] * doc[i]);
    }
    return similarityIndex;
  }
}
