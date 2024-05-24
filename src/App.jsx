import { useState, useEffect } from 'react';
import './App.css';
import SideNav from './components/Sidebar.jsx';
import Ticker from './components/Ticker.jsx';
import Card from './components/Card.jsx';
import ProfitCalculator from './components/Calculator.jsx';

const NavBar = ({ activePage, setActivePage }) => (
    <nav className="navbar">
        <button onClick={() => setActivePage("home")}>Home</button>
        <button onClick={() => setActivePage("calculator")}>Profit Calculator</button>
        <button disabled>Coming Soon</button>
    </nav>
);

function App() {
    const [cryptoList, setCryptoList] = useState([]);
    const apiKey = import.meta.env.VITE_API_KEY;
    const [fullList, setFullList] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [lastRefresh, setLastRefresh] = useState(null);
    const [activePage, setActivePage] = useState("home");

    useEffect(() => {
        fetchCoins("default");
    }, []);

    const fetchCoins = async (id) => {
        const url = `https://min-api.cryptocompare.com/data/top/totalvolfull?limit=50&tsym=USD&api_key=${apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            setCryptoList(data.Data);
            setFullList(data.Data);
            setLastRefresh(new Date());
            if (id === "refresh") {
                alert("Data refreshed!");
            }
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
            <NavBar activePage={activePage} setActivePage={setActivePage} />
            <div className="page">
                {activePage === "home" && (
                    <>
                        <SideNav />
                        <div className = "content">
                            <>
                                <Ticker crypto={fullList} />
                                <div className="header">
                                    <h1>Crypto Dashboard</h1>
                                    <img id="crypto-icon" src="/crypto-dash/crypto-icon.png" alt="crypto-icon" />
                                </div>
                                <button 
                                    id="refresh"
                                    onClick={(e) => {
                                        const id = e.target.id;
                                        fetchCoins(id);
                                    }}
                                >
                                    Refresh
                                </button>
                                <p className="last-refresh">
                                    Last refreshed:{" "}
                                    {lastRefresh ? lastRefresh.toLocaleTimeString() : "Never"}
                                </p>
                                <h2>Top Crypto Coins</h2>
                                <p>See some of the most popular coins traded today!</p>
                                <input type="text" id="search" value={searchInput} placeholder="Search..." onChange={e => searchItems(e.target.value)} />
                                <div className="cryptos-list">
                                    {cryptoList ? cryptoList.map((coin, index) => {
                                        return (
                                            <Card key={coin.CoinInfo.Id} card={coin} />
                                        );
                                    }
                                    ) : 
                                        <p>Loading...</p>
                                    }
                                </div>
                            </>
                        </div>
                    </>
                )}
                {activePage === "calculator" && (
                    <div className = "content">
                        <ProfitCalculator />
                    </div>
                )}
            </div>
        </>
    );
};

export default App