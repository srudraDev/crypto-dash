import { useState, useEffect } from 'react';
import '../App.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
const apiKey = import.meta.env.VITE_API_KEY;

const DataChart = ({ symbol, market }) => {
    const [histData, setHistData] = useState(null);

    const getHistData = async () => {
        const url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=USD&e=${market}&api_key=${apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log("Historical Data:", data.Data);
            setHistData(cleanData(data.Data.Data));
        } catch (error) {
            console.error("Error fetching historical data:", error);
        }
    }
    useEffect(() => {
        getHistData();
    }, []);

    const cleanData = (data) => {
        let filteredData = [];
        let countDays = 0;
        for (const item of data) {
            let accurateDay = new Date();
            accurateDay.setDate(accurateDay.getDate() - countDays);
            filteredData.push({
                "time": accurateDay.toLocaleDateString("en-US"),
                "open": item.open,
            });
            countDays++;
        }
        return filteredData.reverse();
    };

    const ToolTipContent = ({ active, payload, label }) => {
        if (active) {
            return (
                <div className="custom-tooltip">
                    <p className="label"><b>Date: </b>{`${label}`}</p>
                    <p className="intro"><b>Open: </b>{`$${payload[0].value.toLocaleString()}`}</p>
                </div>
            );
        }
        return null;
    };
    return (
                <> 
            <h2>30-Day Historical Price Data</h2>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className='chart-container'>
                    {histData ?
                        <LineChart width={600} height={300} data={histData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <Line type="monotone" dataKey="open" stroke="red" />
                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                            <XAxis dataKey="time" />
                            <YAxis dataKey='open'/>
                            <Tooltip content={ToolTipContent}  />
                        </LineChart>
                    : null}
                </div>
            </div>
        </>
    );
};

export default DataChart;