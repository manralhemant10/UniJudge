// Imports the Google Cloud client library
const language = require('@google-cloud/language');
  
// Instantiates a client
//enter application name
const pro = ''
//path for credentials file
const path = ''
const client = new language.LanguageServiceClient({projectId: pro, keyFilename: path});


async function quickstart() {
    
  
    // The text to analyze
    const text = `Property damage and environmental damage is a major issue in the world today, and especially in a place like FLorida which is prone to several natural disasters like hurricanes, storms and flooding. We propose a solution which collects environmental data wirelessly without external power from remote locations so we can assess damage and potential damage from natural and man made disasters beforehand. collects data (temperature, humidity, wind speed, pressure and other parameters if needed) using ad hoc mesh of sensing stations connected by LoRaWAN and powered off batteries. This data can be viewed on a dashboard and can be used to predict damage. 
    For the hardware, we used a rfm95 module, a MTK3333 GPS module, BME680, and an EPS32. The code for the hardware is a mixture of a lot of things including the lora mesh library from nootropicdesign. This allowed us to have a mesh network pretty easily. We did modify the code to suit our purposes but the base was an amazing help. 
We first wanted to use the Arduino Nano 33 BLE Sense but we didn't realize that it doesn't support LoRa until halfway through so we needed to change the sensors to use what I have on hand and to use an ESP32.`;
    const text2 = `A home automation device which records data that may indicate disasters and damage to homes Natural disasters (and manmade ones) are on the rise. often people have to evacuate in a hurry, and need information about their belongings and property which they leave behind, this data is valuable to users, emergency services and rescue ops 
    collects data from array of sensors which indicate disaster related damage 
    lots of wires, sensors, electronics and testing`;


    let document = {
      content: text,
      type: 'PLAIN_TEXT',
    };
  
    // Detects entities in the document
    let [result] = await client.analyzeEntities({document});

    let entities = result.entities;

    console.log('Entities:');
    // console.log(JSON.stringify(entities));
    entities.forEach(entity => {
        console.log(entity.name);
        console.log(` - Type: ${entity.type}, Salience: ${entity.salience}`);
        if (entity.metadata && entity.metadata.wikipedia_url) {
            console.log(` - Wikipedia URL: ${entity.metadata.wikipedia_url}`);
        }
    });

    document = {
        content: text2,
        type: 'PLAIN_TEXT',
      };
    
      // Detects entities in the document
      let [result2] = await client.analyzeEntities({document});
  
        entities = result2.entities;
  
      console.log('Entities:');
    //   console.log(JSON.stringify(entities));
      entities.forEach(entity => {
          console.log(entity.name);
          console.log(` - Type: ${entity.type}, Salience: ${entity.salience}`);
          if (entity.metadata && entity.metadata.wikipedia_url) {
              console.log(` - Wikipedia URL: ${entity.metadata.wikipedia_url}`);
          }
      });
  }


async function compareDescriptionSimilarity(d1, d2) {
    try {
        let document = {
            content: d1,
            type: 'PLAIN_TEXT',
          };
        let document2 =
          {
            content: d2,
            type: 'PLAIN_TEXT',
          };
    
        if(d1.split(" ").length <= 20 || d2.split(" ").length <= 20) return 0; //if too few tokens to process, skip

        // Classifies text in the document
        const [classification] = await client.classifyText({document});
        
        const [classification2] = await client.classifyText({document: document2});
    
        // console.log('Categories:');
        let match = null;
        classification.categories.forEach(category => {
            // console.log(`1Name: ${category.name}, Confidence: ${category.confidence}`);
            classification2.categories.forEach(category2 => {
                
            // console.log(`2Name: ${category2.name}, Confidence: ${category2.confidence}`);
                if(category.name == category2.name) {
                    match = {
                        confidence1: category.confidence,
                        confidence2: category2.confidence
                    };
                }
            });
        });

        //Calculate similarity percentage
        let similarity = match ? ((match.confidence1 + match.confidence2) / 2) : 0;
       
        return similarity;
    }
    catch(err) {
        // console.log(d2, d2.split(" "));
        console.log(err);
        return 0;
    }
   
}

    // The text to analyze
    // const text = `Property damage and environmental damage is a major issue in the world today, and especially in a place like FLorida which is prone to several natural disasters like hurricanes, storms and flooding. We propose a solution which collects environmental data wirelessly without external power from remote locations so we can assess damage and potential damage from natural and man made disasters beforehand. collects data (temperature, humidity, wind speed, pressure and other parameters if needed) using ad hoc mesh of sensing stations connected by LoRaWAN and powered off batteries. This data can be viewed on a dashboard and can be used to predict damage. 
    // For the hardware, we used a rfm95 module, a MTK3333 GPS module, BME680, and an EPS32. The code for the hardware is a mixture of a lot of things including the lora mesh library from nootropicdesign.`;
    const text = `The Cloud Natural Language API lets you extract entities from text, perform sentiment and syntactic analysis, and classify text into categories.`
    const text2 = `A home automation device which records data that may indicate disasters and damage to homes Natural disasters (and manmade ones) are on the rise. often people have to evacuate in a hurry, and need information about their belongings and property which they leave behind, this data is valuable to users, emergency services and rescue ops collects data from array of sensors which indicate disaster related damage lots of wires, sensors, electronics and testing`;

    // compareDescriptionSimilarity(text, text2);

module.exports = {
    quickstart,
    compareDescriptionSimilarity
}