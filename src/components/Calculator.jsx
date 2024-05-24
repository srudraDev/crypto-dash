import { useState } from 'react';

const ProfitCalculator = () => {
    const [symbol, setSymbol] = useState('BTC');
    const [buyPrice, setBuyPrice] = useState('');
    const [amount, setAmount] = useState('');
    const [currentPrice, setCurrentPrice] = useState(null);
    const [error, setError] = useState('');
    const [calculationResults, setCalculationResults] = useState(null);

    const fetchCurrentPrice = async () => {
        try {
            const response = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${symbol.toUpperCase()}&tsyms=USD`);
            const data = await response.json();
            if (data.USD) {
                const price = data.USD;
                setCurrentPrice(price);
                
                // Calculate results only when button is clicked
                const buyPriceValue = parseFloat(buyPrice);
                const amountValue = parseFloat(amount);
                const totalBuy = buyPriceValue * amountValue;
                const totalCurrent = price * amountValue;
                const profit = totalCurrent - totalBuy;
                const percent = (profit / totalBuy) * 100;
                
                setCalculationResults({ totalBuy, totalCurrent, profit, percent });
                setError('');
            } else {
                throw new Error('Invalid coin symbol or no price found.');
            }
        } catch (err) {
            setError(err.message);
            setCurrentPrice(null);
            setCalculationResults(null);
        }
    };

    return (
        <div className="profit-calculator">
            <h2>Profit Calculator</h2>
            <input placeholder="Coin Symbol (e.g. BTC)" value={symbol} onChange={e => setSymbol(e.target.value)} />
            <input type="number" placeholder="Buy Price (USD)" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} />
            <input type="number" placeholder="Amount Owned" value={amount} onChange={e => setAmount(e.target.value)} />
            <button onClick={fetchCurrentPrice}>Calculate</button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {calculationResults && (
                <div className="results">
                    <p>Current Price: ${currentPrice.toFixed(2)}</p>
                    <p>Current Value: ${calculationResults.totalCurrent.toFixed(2)}</p>
                    <p style={{ color: calculationResults.profit >= 0 ? 'green' : 'red' }}>
                        Profit/Loss: ${calculationResults.profit.toFixed(2)} ({calculationResults.percent.toFixed(2)}%)
                    </p>
                    {calculationResults.profit > 0 && (
                        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                            {Array.from({ length: 100 }).map((_, i) => (
                                <div key={i} 
                                    style={{
                                        position: 'absolute',
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                        width: '10px',
                                        height: '10px',
                                        backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                                        borderRadius: '50%',
                                        animation: `fall ${1 + Math.random() * 2}s linear forwards`
                                    }}
                                />
                            ))}
                            <style>{`
                                @keyframes fall {
                                    0% { transform: translateY(-100px); opacity: 1; }
                                    100% { transform: translateY(100vh); opacity: 0; }
                                }
                            `}</style>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProfitCalculator;