import Addresses from './contract-addresses.json'
import MyERC20 from './abis/MyERC20.json';
import BuyMyRoom from './abis/BuyMyRoom.json';

const Web3 = require('web3');

// @ts-ignore
let web3 = new Web3(window.web3.currentProvider);

const beyMyRoomAddress = Addresses.buyMyRoom;
const buyMyRoomABI = BuyMyRoom.abi;

const myERC20Address = Addresses.myERC20;
const myERC20ABI = MyERC20.abi;

const myERC20Contract = new web3.eth.Contract(myERC20ABI, myERC20Address);
const buyMyRoomContract = new web3.eth.Contract(buyMyRoomABI, beyMyRoomAddress);

export { myERC20Contract, buyMyRoomContract, web3 };