import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

export function Header() {
  async function logout() {
    await fetch("/logout");
  }

  return (
    <AppBar
      component="header"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, m: "6px" }}>
          Welcome to Emoji Place! 🚀
        </Typography>
        <Button variant="text" sx={{ px: 0 }} onClick={logout}>
          <LogoutIcon />
        </Button>
      </Toolbar>
    </AppBar>
  );
}
