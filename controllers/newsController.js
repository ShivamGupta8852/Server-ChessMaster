import News from "../models/News.js";

const getNews = async (req,res) => {
    try {
        const news = await News.find();
        return res.status(201).json({
            message : news,
            success : true,
        });
        
    } catch (error) {
       return res.status(500).json({ message: 'Error retrieving news data' , success :false});
    }
}


export default getNews;