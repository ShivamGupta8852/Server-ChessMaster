import 'dotenv/config';
import News from '../models/News.js';
import cron from 'node-cron';
import axios from 'axios';

const fetchAndStoreNews = async () => {
  try {
    const GNEWS_API_URL = process.env.GNEWS_API_URL;
    const response = await axios.get(GNEWS_API_URL);
    const newsArticles = response.data.articles;
    console.log(newsArticles);
    newsArticles.forEach(async(article) => {
        const existingArticle = await News.findOne({ url: article.url });
        if(!existingArticle && article.image){
            const news = new News({
                title : article.title,
                description : article.description,
                image : article.image,
                url: article.url,
            })

            await news.save();
        }
    });
    console.log('News data fetched and stored successfully.');
  } catch (error) {
    console.log("Error in fetching news : ", error);
  }
}


const scheduleNewsUpdate = () => {
    cron.schedule('0 * * * *', fetchAndStoreNews);
  };
  
export { fetchAndStoreNews, scheduleNewsUpdate };