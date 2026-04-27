import  { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, Box, CssBaseline, Divider, Drawer, IconButton, 
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, 
  Toolbar, Typography 
} from '@mui/material';
import {
  Menu as MenuIcon,
  People as StaffIcon,
  EventNote as AttendanceIcon,
  Payments as SalaryIcon,
  Receipt as SlipIcon,
  Assignment as WorkIcon,
  AccountCircle as ProfileIcon
} from '@mui/icons-material';

const drawerWidth = 240;

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Staff CRUD', icon: <StaffIcon />, path: '/staff' },
     { text: 'Attendance', icon: <AttendanceIcon />, path: '/attendance' },
    { text: 'Salary', icon: <SalaryIcon />, path: '/salary' },
     { text: 'Work Tasks', icon: <WorkIcon />, path: '/tasks' },
  ];

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawerContent = (
    <div>
      <Toolbar>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
          HRMS Portal
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              onClick={() => { navigate(item.path); setMobileOpen(false); }}
              selected={location.pathname === item.path}
            >
              <ListItemIcon color={location.pathname === item.path ? 'primary' : 'inherit'}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

       <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} // Better open performance on mobile.
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />  
        <Outlet /> 
      </Box>
    </Box>
  );
};

export default MainLayout;
