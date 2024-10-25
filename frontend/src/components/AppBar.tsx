import { Box, AppBar as MuiAppBar, Toolbar, Button, IconButton } from "@mui/material";
import WalletIcon from '@mui/icons-material/Wallet';

const pages = ['Houses', 'MyHouses']

interface AppBarProps {
  setCurPage: (page: string) => void;
}

export default function AppBar({ setCurPage }: AppBarProps) {
    return (
      <Box sx = {{ flexFlow: 1}}>
        <MuiAppBar position="static">
          <Toolbar>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                sx={{ my: 3, color: 'white', display: 'block' }}
                onClick={() => setCurPage(page)}
              >
                {page}
              </Button>
            ))}
          </Box>
            
            <IconButton color="inherit" onClick={() => setCurPage("UserInfo")}>
              <WalletIcon />
            </IconButton>      
          </Toolbar>
        </MuiAppBar>
      </Box>
    )
}