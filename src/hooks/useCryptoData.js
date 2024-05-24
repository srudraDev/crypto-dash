import { useState, useEffect } from 'react';

const useCryptoData = (apiKey) => {
    const [coinMap, setCoinMap] = useState({});
    const [lastRefresh, setLastRefresh] = useState(null);
    const [news, setNews] = useState([]);


    useEffect(() => {
        fetchCoinDetails();
        fetchNews();
    }, []);

    const fetchCoinDetails = async () => {
        const url = `https://min-api.cryptocompare.com/data/all/coinlist?api_key=${apiKey}`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            setCoinMap(data.Data || {});
            setLastRefresh(new Date());
        } catch (err) {
            console.error("Error fetching coin details:", err);
        }
    };

    const fetchNews = async () => {
        const url = `https://min-api.cryptocompare.com/data/v2/news/?lang=EN&api_key=${apiKey}`;
        try {
            const res = await fetch(url);
            const data = await res.json();
            setNews(data.Data || []);
        } catch (err) {
            console.error("Error fetching news:", err);
        }
    };
    return { coinMap, news, lastRefresh, refreshCoins: fetchCoinDetails };
};

export default useCryptoData;