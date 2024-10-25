import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Button, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { buyMyRoomContract, web3 } from '../utils/contracts';

export type House = {
  id: number; 
  name: string;
  description: string;
  image: string;
  price: number;
  owner?: string;
  isListed?: boolean;
}

async function onBuyHouse(id: number, account: string) {
  console.log('Buy house:', id)
  if (account == '') {
    alert('Please connect to MetaMask')
    return
  }
  try {
    await buyMyRoomContract.methods.buyHouse(id).send({
      from: account,
    });
    alert('Buy house success')
  } catch (error: any) {
    alert(error.message)
  }
}

export default function HouseBox(houseInfo : House) {
    const [account, setAccount] = useState('');

    useEffect(() => {
      const initCheckAccounts = async () => {
        // @ts-ignore
        const {ethereum} = window;
        if (Boolean(ethereum && ethereum.isMetaMask)) {
            // 尝试获取连接的用户账户
            const accounts = await web3.eth.getAccounts()
            if(accounts && accounts.length) {
                setAccount(accounts[0])
                return 
            }
        }
        
      }

      initCheckAccounts();
    }, [])

    return (
      <Card>
        <CardMedia
          sx={{ height: 200 }}
          image={ houseInfo.image }
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            { houseInfo.name }
          </Typography>
          <Typography variant="body2" color="text.secondary">
            { houseInfo.description }
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Price: { houseInfo.price }
          </Typography>
          <CardActions>
            <Button size="small" onClick={() => {onBuyHouse(houseInfo.id, account)}}>Buy</Button>
          </CardActions>
        </CardContent>
      </Card>
    )
}