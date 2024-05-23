import '../App.css';
import red from '../assets/market-down.png';
import green from '../assets/market-up.png';

const Ticker = (props) => {
    const crypto = props.crypto;
    return (
         <div className="nyse-moving-ticker">
            <div className="crypto-ticker">
                {crypto.map((coin, index) => (
                    <a key={coin.CoinInfo.Id} style={{ color: 'white' }} href={`https://www.cryptocompare.com${coin.CoinInfo.Url}`} >
                        <span className="abbreviated-name" key={coin.CoinInfo.Id}>
                            <b>{coin.CoinInfo.Name}:</b> {coin.DISPLAY ? coin.DISPLAY.USD.PRICE + ' ' : 'N/A '}
                            {coin.DISPLAY ? <img className="moving" src={coin.DISPLAY.USD.CHANGEPCT24HOUR > 0 ? green : red} alt="market change"></img> : null}
                        </span>
                    </a>
                ))}
            </div>
        </div>
    );
}

export default Ticker;