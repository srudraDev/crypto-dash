import { useState, useEffect } from 'react';
import './App.css';
import green from '../assets/market-up.png';
import red from '../assets/market-down.png';
function App() {
    const [cryptoList, setCryptoList] = useState([]);
    const api_key = import.meta.env.VITE_API_KEY;
    const [fullList, setFullList] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const image_url = "https://www.cryptocompare.com";

    useEffect(() => {
        fetchCoins();
    }, []);

    const fetchCoins = async () => {
        const url = `https://min-api.cryptocompare.com/data/top/totalvolfull?limit=50&tsym=USDD&api_key=${api_key}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            setCryptoList(data.Data);
            setFullList(data.Data);
        } catch (error) {
            console.error("Error:", error);
        }
    };
    const searchItems = searchValue => {
        setSearchInput(searchValue);
        if (searchValue !== "" && cryptoList) {
            const filteredData = cryptoList.filter(item => {
                return (item.CoinInfo.FullName + " " + item.CoinInfo.Name).toLowerCase().toLowerCase().includes(searchValue.toLowerCase());
            });
            setCryptoList(filteredData);
        } else {
            setCryptoList(fullList);
        }
    };

    return (
        <>
        <div className="nyse-moving-ticker">
            <div className="crypto-ticker">
                {cryptoList.map((coin, index) => (
                    <a style={{ color: 'white' }}href={`https://www.cryptocompare.com${coin.CoinInfo.Url}`} >
                        <span className="abbreviated-name" key={coin.CoinInfo.Id}>
                            <b>{coin.CoinInfo.Name}:</b> {coin.DISPLAY ? coin.DISPLAY.USDD.PRICE.substring(4) + ' ' : 'N/A '}
                            {coin.DISPLAY ? <img className="moving" src={coin.DISPLAY.USDD.CHANGEPCT24HOUR > 0 ? green : red} alt="market change"></img> : null}
                        </span>
                    </a>
                ))}
            </div>
            </div>
            <div classnam="header">
                <h1>Crypto Board</h1>
                <img id='crypto-icon' src='/crypto-icon.png' alt='crypto-icon' />
            </div>
            <h2>Top Crypto Coins</h2>
            <p>See some of the most popular coins traded today!</p>
            <input type="text" id='search' placeholder="Search..." onChange={e => searchItems(e.target.value)} />
            <div className="cryptos-list">
                {cryptoList ? cryptoList.map((coin, index) => {
                    return (
                        <div className="crypto-item-container" key={index}>
                            <div className="crypto-row">
                                <div className="crypto">
                                    <img className="crypto-image" src={`${image_url}${coin.CoinInfo.ImageUrl}`} alt={coin.CoinInfo.FullName} />
                                    <h3>{coin.CoinInfo.FullName} ({coin.CoinInfo.Name})</h3>
                                </div>
                                <div className="crypto-data">
                                    {coin.DISPLAY ? 
                                    <>
                                        <p className="crypto-price"><b>Price: </b>${coin.DISPLAY.USDD.PRICE.substring(4)}</p>
                                        <p className="crypto-mc">Market Cap: ${coin.DISPLAY.USDD.MKTCAP.substring(4)}</p>
                                        <p className="crypto-volume">24h Volume: ${coin.DISPLAY.USDD.TOTALVOLUME24H.replace(`${coin.CoinInfo.Name}`,"")}</p>
                                        <h5>Percent Change: 
                                            <p className={coin.DISPLAY.USDD.CHANGEPCT24HOUR > 0 ? "crypto-green" : "crypto-red"}>
                                                {Math.round(coin.DISPLAY.USDD.CHANGEPCT24HOUR * 100) / 100}%
                                            </p>
                                        </h5>
                                    </>
                                    :
                                        <p>Pricing data not found</p>
                                    }
                                </div>
                            </div>
                        </div>
                    )
                }
                ) : 
                    <p>Loading...</p>
                }
            </div>
        </>
    )
};

export default App