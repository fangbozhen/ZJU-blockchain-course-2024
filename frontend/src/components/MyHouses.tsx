import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Button, Input } from "@mui/material";
import { useEffect, useState } from "react";
import type { House } from "./HouseBox";
import HouseImg from '../assets/house-1.jpeg';
import { web3, buyMyRoomContract } from "../utils/contracts";
import { Check } from "@mui/icons-material";


export default function MyHouses({ setCurPage }: { setCurPage: (page: string) => void }) {
    const [account, setAccount] = useState('');
    const [myHouses, setMyHouses] = useState<House[]>([])

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
        alert("Please connect to MetaMask")
        setCurPage("UserInfo");
      }

      initCheckAccounts();
    }, [])

    useEffect(() => {
      const getMyHouses = async () => {
        let houseList = [
          {
            id: 1,
            name: "House 1",
            description: "This is a house",
            image: HouseImg,
            price: 100000,
            isListed: false
          },
          {
            id: 2,
            name: "House 2",
            description: "This is another house with long description. This is another house with long description. This is another house with long description. This is another house with long description.",
            image: HouseImg,
            price: 200000,
            isListed: true
          }
        ];
        setMyHouses(houseList); 
        console.log(account);
        if (account === '') {
          return
        }
        const houseData = await buyMyRoomContract.methods.getUserHouses(account).call()
        console.log(houseData);
        houseList = houseData.map((house: any) => {
          return {
            id: house.id,
            name: house.name,
            description: house.description,
            image: HouseImg,
            price: house.price,
            isListed: house.isListed
          }
        }); 
        setMyHouses(houseList);
      }

      getMyHouses();
    }, [account])

    const [editRowId, setEditRowId] = useState(-1);
    const [editableHouse, setEditableHouse] = useState<House | null>(null);

    async function onClickSave() {
      if (editableHouse && editableHouse !== myHouses.find((house) => house.id === editableHouse.id)) {
        try {
          await buyMyRoomContract.methods.updateHouseInfo(editableHouse.id, editableHouse.name, editableHouse.description, editableHouse.price, editableHouse.isListed).send({from: account})
          const newHouses = myHouses.map((house) => {
            if (house.id === editableHouse.id) {
              return editableHouse
            }
            return house
          });
          setMyHouses(newHouses)
        } catch (e : any) {
          alert(e.message)
        }
        
        
      }
      setEditRowId(-1)
      setEditableHouse(null)
    }

    return (
      <TableContainer>
        <Table sx={{ minWidth:650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Desciption</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>IsListed</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {myHouses.map((house) => (
              <TableRow key={house.id}>
                <TableCell>
                  {editRowId === house.id ? (
                    <Input value={editableHouse?.name || ''} onChange={(e) => setEditableHouse(editableHouse ? {...editableHouse, name: e.target.value} : null)}/>
                  ) : (
                    house.name
                  )}
                </TableCell>
                <TableCell>
                  {editRowId === house.id ? (
                    <Input value={editableHouse?.description || ''} onChange={(e) => setEditableHouse(editableHouse ? {...editableHouse, description: e.target.value} : null)}/>
                  ) : (
                    house.description
                  )}
                </TableCell>
                <TableCell>
                  {editRowId === house.id ? (
                    <Input value={editableHouse?.price || 0} onChange={(e) => setEditableHouse(editableHouse ? {...editableHouse, price: Number(e.target.value)} : null)}/>
                  ) : (
                    house.price
                  )}
                </TableCell>
                <TableCell>
                  {editRowId === house.id ? (
                    <Checkbox checked={editableHouse?.isListed || false} onChange={(e) => setEditableHouse(editableHouse ? {...editableHouse, isListed: e.target.checked} : null)}/>
                  ) : (
                    house.isListed ? <Check/> : ''
                  )}
                </TableCell>
                <TableCell>
                  {editRowId === house.id ? (
                    <>
                    <Button onClick={onClickSave}>Save</Button>
                    <Button onClick={() => {
                      setEditRowId(-1)
                      setEditableHouse(null)
                    } }>Cancel</Button>
                    </>
                  ) : (
                    <Button onClick={() => {
                      setEditRowId(house.id)
                      setEditableHouse(house)
                    }}>Edit</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
}