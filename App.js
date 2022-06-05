import './App.css';

import { useEffect, useState } from 'react';
import contractABI from "./smartContract/uasMall.json";
import tokenABI from "./smartContract/token.json";
import {ethers} from "ethers";

function App() {
  const smartContractAddress = "0xc12639acf5ad001ce78774ae99704d5cb175ca87";
  const tokenContractAddress = "0xE00C7f2200aA3e4fe3240CEB13d29C346D493242";

  const [address, setAddress] = useState(null);

  const [brand, setBrand]=useState("");
  const [model, setModel]=useState("");
  const [size, setSize]=useState("");
  const [price, setPrice]=useState("");
  const [buy, setBuy]=useState("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setAddress(account);
      return true;
    } else {
      console.log("No authorized account found");
      return false;
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get Wallet!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setAddress(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const connectWalletButton = () => {
    return <button onClick={connectWallet}>connectWallet</button>;
  };


  const addStock = async () => {
    try {
      const { ethereum } = window;
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          smartContractAddress,
          contractABI.abi,
          signer
        );

        await contract.addShoe(brand, model, size, price);

        console.log("Stock Added");
      }
    }catch(error) {
      console.log(error);
    }
  }

  const buyShoe = async() => {
    try {
      const { ethereum } = window;
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          smartContractAddress,
          contractABI.abi,
          signer
        );
        const token = new ethers.Contract(
          tokenContractAddress,
          tokenABI.abi,
          signer
        )
        const allowance = await token.allowance(signer.getAddress(), smartContractAddress);
        const balance = await token.balanceOf(signer.getAddress());
        if(allowance < balance){
          await token.approve(smartContractAddress, balance);
        }

        await contract.buyShoe(buy);
      }
    }catch(error) {
      console.log(error);
    }
  }

  const fetchStocks = async() => {
    try {
      const { ethereum } = window;
      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          smartContractAddress,
          contractABI.abi,
          signer
        );

        const stocks = await contract.getAllStock();

       console.log(stocks.map((p) => ({
          brand: p[0].toString(),
          sold: p[5],
          buyer: p[6].toString()
        })));
      }
    }catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  })

  return (
    <div className="App">
      {!address && connectWalletButton()}
      
      <h1>Add Product</h1>

      <input name ="brand" placeholder = "insert brand" value={brand} onChange={(e) => setBrand(e.target.value)} /> 
      <input name = "model" placeholder = "insert model" value={model} onChange={(e) => setModel(e.target.value)} /> 
      <input name = "size" placeholder = "insert size" value={size}  onChange={(e) => setSize(e.target.value)} /> 
      <input name = "price" placeholder = "insert price" value={price}  onChange={(e) => setPrice(e.target.value)} /> 

      <button onClick={addStock}>
        addStock        
      </button>

      <button onClick={fetchStocks}>
        fetchStock
      </button>

      <input name ="buy" placeholder = "insert product id" value={buy} onChange={(e) => setBuy(e.target.value)} />

      <button onClick={buyShoe}>
        buyShoe
      </button>
      
    </div>

  );
}

export default App;
