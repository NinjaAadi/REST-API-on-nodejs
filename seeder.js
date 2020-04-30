const fs  = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({
  path: "./config/config.env"
});

//Brings the modal
const Bootcamp  = require('./models/Bootcamp');
const Courses = require('./models/courses');
const User = require('./models/User');
const Review = require('./models/Review');
//Connect to the database
mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useCreateIndex:true,
        useFindAndModify:false,
        useUnifiedTopology:true
});
//Read the file
const bootcamps = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8')
)
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);
const user = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, "utf-8")
);
//Import the data to the database

const importData = async () => {
    try {
        await Bootcamp.create(bootcamps); 
        await Courses.create(courses); 
        await User.create(user);
        await Review.create(reviews);
        console.log
        ("Data imported successfully..");
    } catch (error) {
            console.log(error);
    }  

}

//Delete the data to the database

const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();  
        await Courses.deleteMany(); 
        await User.deleteMany(); 
        await Review.deleteMany();
        console.log
        ("Data deleted successfully..");
    } catch (error) {
         console.log(error);
    }

}

if(process.argv[2]=='-i'){
    importData();
}
else if(process.argv[2]=='-d'){
    deleteData();
}