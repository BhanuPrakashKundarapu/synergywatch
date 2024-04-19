const mongoose=require('mongoose');

const vidSchema=mongoose.Schema({
    
    video_url:{
        type:String
    },
    video_title:{
        type:String
    },
    description:{
        type:String
    },
    views_count:{
        type:String
    },
    published_date:{
        type:String
    },
    channel_logo:{
        type:String
    },
    channel_name:{
        type:String
    },
    subscribers:{
        type:String
    },
    category:{
        type:String
    },
    bucketlist:{
        type:Boolean
    },
    saved:{
        type:Boolean
    },
    liked:{
        type:String
    },
    thumbnail:{
        type:String
    },
    live:{
        type:Boolean
    }
})


const data=mongoose.model('videosDetails',vidSchema);
module.exports=data
