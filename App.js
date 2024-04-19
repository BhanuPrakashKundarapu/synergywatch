const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcj = require("bcryptjs");
const url = require("./config/Key");
const multer = require("multer");
const modelData = require("./models/User");
const videoData = require("./models/Video");
const passport = require("./middleware/Passport");
const savedData = require("./models/Saved");

mongoose
  .connect(url.URI)
  .then(() => {
    console.log("database is connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/reg", async (req, res) => {
  const {
    UserName,
    FirstName,
    LastName,
    PhoneNumber,
    Email,
    Dob,
    Password,
    ConfirmPassword,
  } = req.body;
  console.log(Password,ConfirmPassword)
  try {
    const emi = await modelData.findOne({ email: Email });
    // console.log(if(emi))
    if (emi) {
      console.log("data is already exist");
      res.json({ status: 400 });
    } else {
      if (Password == ConfirmPassword) {
        const reg = new modelData({
          UserName: UserName,
          firstname: FirstName,
          lastName: LastName,
          phoneNumber: PhoneNumber,
          email: Email,
          dob: Dob,
          password: Password,
        });

        bcj.genSalt(10, (err, salt) => {
          bcj.hash(reg.password, salt, async (err, hash) => {
            if (err) {
              throw err;
            }
            reg.password = hash;
            const rs = await reg.save();
            res.json({ status: 200 });
          });
        });
        // const saved=await reg.save();
      } else {
        res.json({ status: 500 });
      }
    }
  } catch (error) {
    res.status(400);
  }
});

app.post("/log", async (req, res) => {
  const { Email, Password } = req.body;
  console.log(Email, Password);
  const data = await modelData.findOne({ email: Email });
  if (!data) {
    return res.json({status:400,message:"user not found"});
  }
  bcj.compare(Password, data.password).then((yes) => {
    if (yes) {
      // res.send(data);
      const payload = {
        user: {
          id: data.id
        },
      };
      console.log(payload);
      jwt.sign(payload, "GGSQHGYDQq", { expiresIn: 3600000 }, (err, token) => {
        if (err) {
          throw err;
        }

        return res.json({ status: 200, token: token });
      });
    } else {
      res.json({status:400,message:"password not matched"})
    }
  });
});

app.get("/details", passport, async (req, res) => {
  try {
    const data = await modelData.findById({ _id: req.user.id });
    res.json({ data });
  } catch (error) {
    res.send(error);
  }
});

app.post("/video", async (req, res) => {
  try {
    
  
  const {
    Video_Url,
    Video_title,
    description,
    views_count,
    date,
    channel_logo_url,
    channel_name,
    subscribers,
    category,
    bucketlist,
    liked,
    thumbnail,
    live,
  } = req.body;
  console.log(
    Video_Url,
    Video_title,
    description,
    views_count,
    date,
    channel_logo_url,
    channel_name,
    subscribers,
    category,
    bucketlist,
    liked,
    thumbnail,
    live)
  const createVid = new videoData({
    video_url: Video_Url,
    video_title: Video_title,
    description: description,
    views_count: views_count,
    published_date: date,
    channel_logo: channel_logo_url,
    channel_name: channel_name,
    subscribers: subscribers,
    category: category,
    bucketlist: bucketlist,
    liked: liked,
    thumbnail: thumbnail,
    live: live,
    saved: false,
  });
  const df = await createVid.save();
  res.json({status:200,message:"video Posted" });

} catch (error) {
    res.json({status:400,message:"Something went wrong"})
}
});
app.get("/get-video",async (req, res) => {
  try {
    const data = await videoData.find();
    if (data) {
      res.json({ data });
    } else {
      res.json({ status: 400, message: "no video found" });
    }
  } catch (error) {
    res.json({ error });
  }
});

app.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { oldpassword, confirmpassword, newpassword } = req.body;

  try {
    const found = await modelData.findOne({ _id: id });
    if (!found) {
      return res.status(400).json({ status: 400, message: "User not found" });
    }

    if (oldpassword !== confirmpassword) {
      return res.status(400).json({ status: 400, message: "Passwords do not match" });
    }

    const passwordMatch = await bcj.compare(oldpassword, found.password);
    if (!passwordMatch) {
      return res.status(400).json({ status: 400, message: "Incorrect password" });
    }

    const salt = await bcj.genSalt(10);
    const hash = await bcj.hash(newpassword, salt);

    const updatedUser = await modelData.findByIdAndUpdate(
      { _id: id },
      { password: hash },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({ status: 200, data: updatedUser });
  } catch (error) {
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
});


app.post("/saved", async (req, res) => {
  try {
    const {
      email,
      _id,
      video_url,
      video_title,
      description,
      views_count,
      published_date,
      channel_logo,
      channel_name,
      subscribers,
      category,
      bucketlist,
      liked,
      thumbnail,
      live,
    } = req.body;
    // console.log(email,video_url,video_title,description,views_count,published_date,channel_logo,channel_name,subscribers,category,bucketlist,liked,thumbnail,live)
    const dy = await savedData.find({ email: email });
    
      
        console.log(req.body);
        const sent = new savedData({
          Userid: email,
          videoid: _id,
          video_url: video_url,
          video_title: video_title,
          description: description,
          views_count: views_count,
          published_date: published_date,
          channel_logo: channel_logo,
          channel_name: channel_name,
          subscribers: subscribers,
          category: category,
          bucketlist: bucketlist,
          liked: liked,
          thumbnail: thumbnail,
          live: live,
          saved: true,
        });
        const data = await sent.save();
        res.json({ status: 200, data });
  } catch (error) {
    console.log(error);
  }
});

app.get("/save-tab", passport, async (req, res) => {
  try {
    const data = await savedData.find({ Userid: req.user.id });
    console.log(data);
    res.json({ data: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.delete("/delete-save/:id", async (req, res) => {
  // const {email}=req.body;
  console.log(req.params.id)
  const del=await savedData.findByIdAndDelete({_id:req.params.id});
  if(del){
    res.json({status:200,message:"deleted"})
  }else{
    res.json({status:400,message:"something went wrong"})
  }
});

app.listen(url.port, () => {
  console.log(`server is running on http://localhost:${url.port}`);
});
