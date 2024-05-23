import "../App.css";
import { Link } from 'react-router-dom';

const Card = (props) => {
    const coin = props.card;
    const imageUrl = "https://www.cryptocompare.com";
    return (
        <>
            {coin.CoinInfo ? (
                    <div className="crypto-item-container" key={coin.CoinInfo.Id}>
                        <div className="crypto-row">
                            <div className="crypto">
                                <img className="crypto-image" src={`${imageUrl}${coin.CoinInfo.ImageUrl}`} alt={coin.CoinInfo.FullName} />
                                <h3>{coin.CoinInfo.FullName} ({coin.CoinInfo.Name})</h3>
                                    <Link to={"/details/" + coin.CoinInfo.Name}>
                                        <button className='button button-detail'>
                                            View Details 
                                        </button>
                                    </Link>
                            </div>
                            <div className="crypto-data">
                                {coin.DISPLAY ?
                                    <>
                                        <p className="crypto-price"><b>Price: </b>{coin.DISPLAY.USD.PRICE}</p>
                                        <p className="crypto-mc">Market Cap: {coin.DISPLAY.USD.MKTCAP}</p>
                                        <p className="crypto-volume">24h Volume: {coin.DISPLAY.USD.TOTALVOLUME24H.replace(`${coin.CoinInfo.Name}`, "")}</p>
                                        <h5>Percent Change:
                                            <p className={coin.DISPLAY.USD.CHANGEPCT24HOUR > 0 ? "crypto-green" : "crypto-red"}>
                                                {Math.round(coin.DISPLAY.USD.CHANGEPCT24HOUR * 100) / 100}%
                                            </p>
                                        </h5>
                                    </>
                                    :
                                    <p>Pricing data not found</p>
                                }
                            </div>
                        </div>
                    </div>
            ) : null }
        </>
    );
};

export default Card;