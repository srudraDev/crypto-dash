import '../App.css';
import { useState, useEffect } from 'react';

const SideNav = () => { 
    const [scamArticles, setScamArticles] = useState([]);

    const fetchScamNews = async () => {
        const url = `https://min-api.cryptocompare.com/data/v2/news/?lang=EN`;
        const response = await fetch(url);
        const data = await response.json();
        
        const scamKeywords = ["scam", "scams", "money laundering", "laundering", "fraud", "hack", "rug pull", "exit scam", "ponzi", "exploit"];
        const blacklist = ["interview", "interviews", "video", "videos"];

        const filteredArticles = data.Data.filter(article => 
            scamKeywords.some(keyword => article.title.toLowerCase().includes(keyword) ||
                article.body.toLowerCase().includes(keyword)
            ) && !blacklist.some(term => article.url.toLowerCase().includes(term))

        ).map(article => ({
            title: article.title,
            url: article.url,
            source: article.source,
        }));
        return filteredArticles;
    };
    useEffect(() => {
        fetchScamNews().then(setScamArticles);
    }, []);

    return (
        <div className="sidenav">
            <h1>Beware!</h1>
            <p>Here are some coins and platforms that have been involved in 
                recent <b>crypto-related scams:</b>
            </p>
            <ul>
                {scamArticles.length > 0 ? (
                    scamArticles.map((article, index) => (
                        <li key={index}>
                            <a href={article.url} target="_blank" rel="noopener noreferrer">
                                {article.title}
                            </a>
                        </li>
                    ))
                ) : (
                    <li>Loading scam reports...</li>
                )}
            </ul>
        </div>
    );
};

export default SideNav;