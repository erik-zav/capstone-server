import { MongoClient } from 'mongodb';


//environment variable storing monboDB connection string
const uri = process.env.MONGO_DB_URI;
const client = new MongoClient(uri);



//fetch all professors from DB
async function getAllProfessors() {
  try {
    await client.connect();
    const database = client.db('chatbotDB');
    const professors = database.collection('Professors');
    
    //an abrieviated set of items
    const projection = { FNAME: 1, LNAME: 1, HOMEDEPTlong: 1, _id: 0 };
    
    const cursor = professors.find({}, { projection });
    const results = await cursor.toArray();
    
    if (results.length > 0) {
      console.log('Found professors:', results);
      return results;
    } else {
      console.log('No professors found.');
      return [];
    }
  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    await client.close();
  }
}

//get professors by department name
async function getProfessorsByDepartment(deptName) {
  try {
    await client.connect();
    const database = client.db('chatbotDB');
    const professors = database.collection('Professors');
    

    const projection = { FNAME: 1, LNAME: 1, HOMEDEPTlong: 1, _id: 0 };
    
    const cursor = professors.find({ HOMEDEPTlong: deptName }, { projection });
    const results = await cursor.toArray();
    
    if (results.length > 0) {
      console.log(`Found professors in the ${deptName} department:`, results);
      return results;
    } else {
      console.log(`No professors found in the ${deptName} department.`);
      return [];
    }
  } catch (error) {
    console.error('Error occurred:', error);
  } finally {
    await client.close();
  }
}


export { getAllProfessors, getProfessorsByDepartment };