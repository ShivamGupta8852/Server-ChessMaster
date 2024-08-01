import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    image : {
        type : String,
        required : true,
    },
    url : {
        type : String,
        required : true,
    }
})

const News = mongoose.model('News', newsSchema);

export default News;