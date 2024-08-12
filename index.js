const express = require('express');
const URL = require('./models/url');
const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const { connectToMongoDb } = require('./connect');
const path = require('path');


const app = express();
const PORT = 8001;

connectToMongoDb('mongodb://127.0.0.1:27017/short-url')
  .then(() => console.log('MongoDb connected'))
  .catch((err) => console.log("there is an error"));

  app.set("view engine", "ejs");
  app.set('views',path.resolve("./views"));




app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get("/test",async(req,res) => {
    const allUrls = await URL.find({});
    return res.render('home' , {
        urls: allUrls,
    });
})
app.use('/url', urlRoute);
app.use("/",staticRoute);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    
    // Await the database query
    const entry = await URL.findOneAndUpdate(
        { shortId },
        { 
            $push: { 
                visitHistory: { timestamp: Date.now() } 
            }
        },
        { new: true } // Return the updated document
    );

    // Check if the entry exists
    if (!entry) {
        return res.status(404).json({ error: "Short URL not found" });
    }

    // Redirect to the stored URL
    res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT :${PORT}`));
