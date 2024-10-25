import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import HouseBox from './HouseBox';
import { House } from './HouseBox';
import HouseImg from '../assets/house-1.jpeg';
import { useEffect, useState } from 'react';
import { get } from 'https';
import { buyMyRoomContract } from '../utils/contracts';

const initialHouseInfoList : House[] = [
  {
    id: 1,
    name: "House 1",
    description: "This is a house",
    image: HouseImg,
    price: 100000,
    owner: "John Doe"
  },
  {
    id: 2,
    name: "House 2",
    description: "This is another house with long description. This is another house with long description. This is another house with long description. This is another house with long description.",
    image: HouseImg,
    price: 200000,
    owner: "Jane Doe"
  },
  {
    id: 3,
    name: "House 3",
    description: "This is a house",
    image: HouseImg,
    price: 300000,
    owner: "John Doe"
  },
  {
    id: 4,
    name: "House 4",
    description: "This is another house with long description. This is another house with long description. This is another house with long description. This is another house with long description.",
    image: HouseImg,
    price: 400000,
    owner: "Jane Doe"
  },
  {
    id: 5,
    name: "House 5",
    description: "This is a house",
    image: HouseImg,
    price: 500000,
    owner: "John Doe"
  },
  {
    id: 6,
    name: "House 6",
    description: "This is another house with long description. This is another house with long description. This is another house with long description. This is another house with long description.",
    image: HouseImg,
    price: 600000,
    owner: "Jane Doe"
  }
]


export default function DisplayHouse() {

    const [HouseInfoList, setHouseInfoList] = useState<House[]>(initialHouseInfoList);

    useEffect(() => {
      const getListedHouses = async () => {
        if (buyMyRoomContract) {
          const houseData = await buyMyRoomContract.methods.getAllListedHouses().call();
          console.log(houseData);
          const houseInfoList = houseData.map((house: any) => {
            return {
              id: house.id,
              name: house.name,
              description: house.description,
              image: HouseImg,
              price: house.price,
              owner: house.owner
            }
          }
          );
          setHouseInfoList(houseInfoList);
        }
      }

      getListedHouses();
    }

    , [])


    return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {HouseInfoList.map((house) => (
            <Grid key={house.id} size={6}>
              <HouseBox  {...house} />
            </Grid>
          )
          )}
        </Grid>
      </Box>
      
    )


}