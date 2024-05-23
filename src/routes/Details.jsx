import '../App.css';
import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Details = () => {
    let params = useParams();
    let symbol = params.id;
    const apiKey = "$%7BapiKey%7D";
    const priceURL = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=USD&api_key=${apiKey}`;
    const detailURL = `https://min-api.cryptocompare.com/data/all/coinlist?fsym=${symbol}&api_key=${apiKey}`;
    const imageURL = "https://www.cryptocompare.com";
    const [priceData, setPriceData] = useState([]);
    const [detailData, setDetailData] = useState([]);
    const [lastRefresh, setLastRefresh] = useState(null);

    const fetchDetails = async (id) => {
        try {
            const priceResponse = await fetch(priceURL);
            const detailResponse = await fetch(detailURL);
            const priceData = await priceResponse.json();
            const detailData = await detailResponse.json();
            setPriceData(priceData);
            setDetailData(detailData);
            setLastRefresh(new Date());

            if (id === "refresh") {
                alert("Data refreshed!");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    useEffect(() => {
        fetchDetails("default");
    }, []);

    function formatDescription(rawDescription) {
        rawDescription = rawDescription.replace(/&#39;/g, "'");
        const headingKeywords = ["What", "What's", "Who", "How", "Why"];
        
        // Add space after sentence-ending punctuation if not present
        let spaced = rawDescription.replace(/([a-z0-9])([.?!])([A-Z])/g, "$1$2 $3");

        // Split into sentences/blocks using the newly inserted spaces
        spaced = spaced.replace(/([?!.])(\s?)([A-Z])/g, (match, punct, space, char) => {
            return punct + "\n" + char;
        });
        const blocks = spaced.split(/\n/);
        console.debug(blocks);

        // Group blocks into paragraphs/headings
        const elements = [];
        let currentParagraph = "";

        blocks.forEach((block, index) => {
            const headingMatch = headingKeywords.find(keyword => block.startsWith(keyword));

            if (headingMatch) {
                if(currentParagraph.length > 0) {
                    elements.push(<p key={`para-${index}`}>{currentParagraph}</p>);
                    currentParagraph = "";
                }
                elements.push(<h2 key={`heading-${index}`}>{block.trim()}</h2>);
            } else {
                if (currentParagraph.length > 0) {
                    currentParagraph += " " + block.trim();
                } else
                    currentParagraph = block.trim();
            }
        });
        if (currentParagraph.length > 0) {
            const cutoff = currentParagraph.indexOf("Blockchain data provided by:")
            elements.push(<p key={`para-final`}>{currentParagraph.substring(0, cutoff)}</p>);
            elements.push(<p key={`para-final-source`}>{currentParagraph.substring(cutoff)}</p>);
        }

        return elements;
    }

    return (
        <>
            <button id="home">
                <Link style={{ color: "white" }} to="/">
                    Home
                </Link>
            </button>
            { detailData.Data === undefined || priceData.DISPLAY === undefined ? <p>Loading...</p> :
                <>
                    <div className="header">
                        <h1>{detailData.Data[symbol].FullName}</h1>
                        <img className="coin-detail-image"src={imageURL + detailData.Data[symbol].ImageUrl} alt={detailData.Data[symbol].FullName} />
                    </div>
                    <p>{formatDescription(detailData.Data[symbol].Description)}</p>
                    <div className="links">
                        <button className="learn-more">
                            <a href={detailData.Data[symbol].AssetWebsiteUrl} style={{color: "whitesmoke"}}>
                                Learn More
                            </a>
                        </button>
                         <button 
                            id="refresh"
                            onClick={(e) => {
                                const id = e.target.id;
                                fetchDetails(id);
                            }}
                        >
                            Refresh
                        </button>
                    </div>
                    <div id="table-div">
                    <h2>Details</h2>
                    <table id="detail-table">
                        <thead>
                            <tr>
                                <th>Attribute</th>
                                <th>Data</th>
                            </tr>
                        </thead>

                        <tbody>

                            <tr>
                                <td>Monetary Symbol</td>
                                <td>{detailData.Data[symbol].Symbol}</td>
                            </tr>

                            <tr>
                                <td>Price</td>
                                <td>{priceData.DISPLAY ? priceData.DISPLAY[symbol].USD.PRICE : "N/A"}</td>
                            </tr>

                            <tr>
                                <td>Market Cap</td>
                                <td>{priceData.DISPLAY ? priceData.DISPLAY[symbol].USD.MKTCAP : "N/A"}</td>
                            </tr>

                            <tr>
                                <td>Volume</td>
                                <td>{priceData.DISPLAY ? priceData.DISPLAY[symbol].USD.TOTALVOLUME24H : "N/A"}</td>
                            </tr>

                            <tr>
                                <td>Percent Change</td>
                                <td>{priceData.DISPLAY ? priceData.DISPLAY[symbol].USD.CHANGEPCT24HOUR : "N/A"}</td>
                            </tr>

                            <tr>
                                <td>24-Hour High Price</td>
                                <td>{priceData.DISPLAY ? priceData.DISPLAY[symbol].USD.HIGH24HOUR : "N/A"}</td>
                            </tr>

                            <tr>
                                <td>24-Hour Low Price</td>
                                <td>{priceData.DISPLAY ? priceData.DISPLAY[symbol].USD.LOW24HOUR : "N/A"}</td>
                            </tr>

                            <tr>
                                <td>Today"s Open Price</td>
                                <td>{priceData.DISPLAY ? priceData.DISPLAY[symbol].USD.OPEN24HOUR : "N/A"}</td>
                            </tr>

                            <tr>
                                <td>Supply</td>
                                <td>{priceData.DISPLAY ? priceData.DISPLAY[symbol].USD.SUPPLY : "N/A"}</td>
                            </tr>

                            <tr>
                                <td>Market Cap</td>
                                <td>{priceData.DISPLAY ? priceData.DISPLAY[symbol].USD.MKTCAP : "N/A"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                </>

            }
        </>
    );
};

export default Details;