import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, Box, CssBaseline, Divider, Drawer, IconButton, 
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, 
  Toolbar, Typography, useMediaQuery 
} from '@mui/material';
import {
  Menu as MenuIcon,
  People as StaffIcon,
  EventNote as AttendanceIcon,
  Payments as SalaryIcon,
  Assignment as WorkIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Custom breakpoint: returns true if screen is narrower than 990px
  const isTabletOrMobile = useMediaQuery('(max-width:990px)');

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
              <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
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
          <IconButton 
            color="inherit" 
            edge="start" 
            onClick={handleDrawerToggle} 
          
            sx={{ mr: 2, display: isTabletOrMobile ? 'block' : 'none' }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Box 
        component="nav" 
        sx={{ width: isTabletOrMobile ? 0 : drawerWidth, flexShrink: 0 }}
      >
       
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}  
          sx={{ 
            display: isTabletOrMobile ? 'block' : 'none',
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } 
          }}
        >
          {drawerContent}
        </Drawer>
      
        <Drawer
          variant="permanent"
          sx={{ 
            display: isTabletOrMobile ? 'none' : 'block',
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } 
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
         
          width: isTabletOrMobile ? '100%' : `calc(100% - ${drawerWidth}px)` 
        }}
      >
        <Toolbar />  
        <Outlet /> 
      </Box>
    </Box>
  );
};

export default MainLayout;
