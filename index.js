import express from "express";
import bodyParser from "body-parser";
import mongoose, { mongo } from "mongoose";
import cors from "cors";


const app = express();
app.use(bodyParser.json());
app.use(cors());

const userSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String
  }
})

const itemsSchema = new mongoose.Schema({
  name:{type:String},
  price:{type:Number},
  desc:{type:String},
  index:{type:Number},
  redirect : {type:String},
  image : {type:String}
})

const itemsModel = mongoose.model('itemsCollection',itemsSchema)

const userModel= mongoose.model('usersCollection',userSchema);

const favouritesSchema = new mongoose.Schema({
  name:{
    type:String
  },
  price:{
    type:Number
  } ,
  username : {
    type:String
  } ,
  image :{
    type:String
  }
})

const favouritesModel = mongoose.model('favouritesCollection',favouritesSchema)

const cartSchema = new mongoose.Schema({
  name:{
    type:String
  },
  price:{
    type:Number
  } ,
  username : {
    type:String
  } ,
  image: {
    type:String
  }
})

const cartsModel = mongoose.model('cartsCollection',cartSchema)

app.post('/api/addToCart',async (req,res) => {
  console.log(req.body)
  let user = req.body.username
  let name = req.body.name
  let price = req.body.price
  let image = req.body.image
  res.json({message:"Cart Adding Initiates"})

  const addNewToCart = async() => {
    try{
      const newEntryCart = new cartsModel(
        {name:name, price:price , username:user , image:image})
      const result = await newEntryCart.save()
      console.log("Added To Cart Successfully")
      console.log(result)
    }catch(err){
      console.log(err)
    }
}
  addNewToCart()
})


app.post('/api/addToFavourites',async(req,res)=>{
  let user = req.body.username
  console.log(req.body)
  let name = req.body.name
  let price = req.body.price
  let image = req.body.image

  res.json({message:"Favourites Adding Initiates"})

  const addNewToFavourites = async() => {
      try{
        const newEntryFavourites = new favouritesModel(
          {name:name, price:price , username:user , image:image})
        const result = await newEntryFavourites.save()
        console.log("Added To Favourites Successfully")
        console.log(result)
      }catch(err){
        console.log(err)
      }
  }
  addNewToFavourites()
  
})

app.post('/api/getFavourites', async (req,res) => { 
  try{
    const username = req.body.username
    console.log("In Favourites")
    console.log(username)
    const favouritesData =  await favouritesModel.find({username : username})
    console.log(favouritesData)
    res.json(favouritesData)
    console.log("Data Sent")
  }
  catch(err){
    console.log(err)
  }
})

app.post('/api/getCart',async (req,res) => { 
  try{
    let username = req.body.username
    let cartData =  await cartsModel.find({username : username})
    res.json(cartData)
    console.log("Data Sent")
  }
  catch(err){
    console.log(err)
  }
})

app.get('/api/getFilteredData',async (req,res) => {
  const { category } = req.query
  console.log(category)
  try{
    const data =  await itemsModel.find({redirect:category})
    res.json(data)
    console.log(data)
    console.log("Data Sent")
  }
  catch(err){
    console.log(err)
  }

})

app.get('/api/items', async (req,res) => {
  const { category, upperValue, lowerValue } = req.query;
  console.log(category,upperValue,lowerValue)
  try {
    const items = await itemsModel.find({
      redirect : category,
      price: { $gte: lowerValue, $lte: upperValue },
    });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
})


app.post('/api/makeNewUserEntry',async (req, res) => {
  const formData = req.body;
  console.log(formData)
  let usename = formData.name
  let email = formData.email
  let password = formData.password
  console.log(usename + " " + email+" "+password)
  res.json({ message: 'Form data received successfully.' });


  const createNewUser = async () => {
    try {
      const newUserEntry = new userModel({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })
      const result = await newUserEntry.save()
      console.log("User Data Entered Successfully")
      console.log(result)
    } catch (err) {
      console.log(err)
    }
  }
  createNewUser();
});

app.get('/api/getAllUsers',async (req,res) =>{
  try{
    const usersData =  await userModel.find()
    console.log(usersData)
    res.json(usersData)
    console.log("Data Sent")
  }
  catch(err){
    console.log(err)
  }
})

app.get('/api/getItem',async (req,res) => {
  try{
    const itemData =  await itemsModel.find()
    res.json(itemData)
    console.log("Data Sent")
  }
  catch(err){
    console.log(err)
  }
})

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});


try {
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/AmeyBhatReactApp',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(error.message);
  }

