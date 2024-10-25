import { Box, Button, Input, Stack, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import WalletIcon from '@mui/icons-material/Wallet';
import { useEffect, useState } from "react";
import { web3, myERC20Contract } from "../utils/contracts";

const GanacheTestChainId = '0x539' // Ganache默认的ChainId = 0x539 = Hex(1337)
const GanacheTestChainName = 'Ganache Test Chain'
const GanacheTestChainRpcUrl = 'http://127.0.0.1:8545'

function WalletInfo({ account, accountBalance, setAccountBalance, havePool, totalSupply, ethTotalSupply }
  : { account: string, accountBalance: number, setAccountBalance: (balance: number) => void, havePool: boolean, totalSupply: number, ethTotalSupply: number }) {
  const [amount, setAmount] = useState(0);
  const [amountOutMin, setAmountOutMin] = useState(0);
  
  const onClickBuy = async () => {
    console.log('Buy MyERC:', amount)
    if (myERC20Contract) {
      try {
        const amountOut = await myERC20Contract.methods.mint(amountOutMin).send({
          from: account, 
          value: amount * 10 ** 16
        });
        console.log(amountOut)
        alert('Buy' + amountOut + 'MyERC success')
        setAmount(0)
      } catch (error: any) {
        alert(error.message)
      }
      
      const ab = await myERC20Contract.methods.balances(account).call()
      setAccountBalance(ab)
    }
  }

  

  return (
    <Box>
      <Typography variant="h6">Wallet Info</Typography>
      <Grid container spacing={2} display="flex" alignItems="center">
        <Grid size={6}>
          <Typography>Address:</Typography>
        </Grid>
        <Grid size={6}>
          <Typography>{account}</Typography>
        </Grid>
        <Grid size={6}>
          <Typography>Balance:</Typography>
        </Grid>
        <Grid size={6}>
          <Typography>{accountBalance} MyERC</Typography>
        </Grid>
        {havePool && 
          <>
            <Grid size={3}>
            <Typography>TotalSupply:</Typography>
            </Grid>
            <Grid size={3}>
              <Typography>{totalSupply} MyERC</Typography>
            </Grid>
            <Grid size={3}>
              <Typography>EthTotalSupply:</Typography>
            </Grid>
            <Grid size={3}>
              <Typography>{ethTotalSupply / (10 ** 18)} Eth</Typography>
            </Grid>
          </> 
        }
        <Grid size={2}>
          <Typography>Buy MyERC:</Typography>
        </Grid>
        <Grid size={4}>
          <TextField label="EthAmount (10^16)" value={amount} onChange={(e) => setAmount(Number(e.target.value))}/>
        </Grid>
        <Grid size={4}>
          <TextField label="AmountOutMin" value={amountOutMin} onChange={(e) => setAmountOutMin(Number(e.target.value))}/>
        </Grid>
        <Grid size={2}>
          <Button onClick={() => onClickBuy() } disabled={!havePool}>Buy</Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default function UserInfo() {
    const [isConnected, setIsConnected] = useState(false);
    const [havePool, setHavePool] = useState(false);

    const [account, setAccount] = useState('');
    const [accountBalance, setAccountBalance] = useState(0);

    const [totalSupply, setTotalSupply] = useState(0);
    const [ethTotalSupply, setEthTotalSupply] = useState(0);

    const getTotalSupply = async () => {
      if (myERC20Contract) {
        const ts = await myERC20Contract.methods.totalSupply().call()
        const ets = await myERC20Contract.methods.ethTotalSupply().call()
        setTotalSupply(ts)
        setEthTotalSupply(ets)
      } else {
        alert('Contract not exists.')
      }
    }

    useEffect(() => {
      const initCheckPool = async () => {
        if (myERC20Contract) {
          const pool = await myERC20Contract.methods.totalSupply().call()
          if (pool != 0) {
            console.log('Have pool')
            setHavePool(true)
            getTotalSupply()
          } else 
            setHavePool(false)
        }
      }
      initCheckPool()
    }, [])

    useEffect(() => {
      const initCheckAccounts = async () => {
        // @ts-ignore
        const {ethereum} = window;
        if (Boolean(ethereum && ethereum.isMetaMask)) {
            // 尝试获取连接的用户账户
            const accounts = await web3.eth.getAccounts()
            if(accounts && accounts.length) {
                setAccount(accounts[0])
                setIsConnected(true);
            }
        }
      }

      initCheckAccounts();
    }, [])

    useEffect(() => {
      const getAccountInfo = async () => {
          if (myERC20Contract) {
              const ab = await myERC20Contract.methods.balances(account).call()
              setAccountBalance(ab)
          } else {
              alert('Contract not exists.')
          }
      }

      if(account !== '') {
          getAccountInfo()
      }
  }, [account])

  

    const onClickConnectToWallet = async () =>{
      // @ts-ignore
      const {ethereum} = window;
      if (!ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      try {
        // 如果当前小狐狸不在本地链上，切换Metamask到本地测试链
        if (ethereum.chainId !== GanacheTestChainId) {
            const chain = {
                chainId: GanacheTestChainId, // Chain-ID
                chainName: GanacheTestChainName, // Chain-Name
                rpcUrls: [GanacheTestChainRpcUrl], // RPC-URL
            };

            try {
                // 尝试切换到本地网络
                await ethereum.request({method: "wallet_switchEthereumChain", params: [{chainId: chain.chainId}]})
            } catch (switchError: any) {
                // 如果本地网络没有添加到Metamask中，添加该网络
                if (switchError.code === 4902) {
                    await ethereum.request({ method: 'wallet_addEthereumChain', params: [chain]
                    });
                }
            }
        }

        // 小狐狸成功切换网络了，接下来让小狐狸请求用户的授权
        await ethereum.request({method: 'eth_requestAccounts'});
        // 获取小狐狸拿到的授权用户列表
        const accounts = await ethereum.request({method: 'eth_accounts'});
        // 如果用户存在，展示其account，否则显示错误信息
        setAccount(accounts[0] || 'Not able to get accounts');
    } catch (error: any) {
        alert(error.message)
    }

      setIsConnected(true);
    }

    const onClickCreatePool = async () => {
      if (myERC20Contract) {
        try {
          await myERC20Contract.methods.addLiquidity(20000).send({
            from: account,
            value: 10 * 10 ** 18
          });
          alert('Create MyERC20Pool success')
          setHavePool(true)
          getTotalSupply()
        } catch (error: any) {
          alert(error.message)
        }
      } else {
        alert('Contract not exists.')
      }
    }

    return (
      <Stack spacing={2}>
        <Typography variant="h4">User Info</Typography>
        <Box display="flex" alignItems="center">
          <WalletIcon />
          <Button onClick={onClickConnectToWallet}>Connect Wallet</Button>
          <Button onClick={onClickCreatePool} disabled={havePool}>Create MyERC20Pool(only contracts creater)</Button>
        </Box>
        {isConnected && <WalletInfo 
          account={account} accountBalance={accountBalance} setAccountBalance={setAccountBalance} havePool={havePool}
          totalSupply={totalSupply} ethTotalSupply={ethTotalSupply}/>}

      </Stack>
    )
}