import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, Button, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Dialog, DialogContent, 
  CircularProgress, FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';
import { Edit, Delete, Add, FilterList } from '@mui/icons-material';
import StaffCreationForm from './staffCreationForm';

const MOCK_API_URL = 'https://69ebaf0897482ad5c527fdb2.mockapi.io/staff';

const StaffPage = () => {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null); 
  const [selectedDept, setSelectedDept] = useState('All');  

  const fetchStaffs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(MOCK_API_URL);
      setStaffs(res.data);
    } catch (err) {
      console.error("Error fetching staff", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStaffs(); }, []);

  
  const departments = ['All', ...new Set(staffs.map(s => s.department))];
  const filteredStaffs = staffs.filter(s => 
    selectedDept === 'All' || s.department === selectedDept
  );

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      await axios.delete(`${MOCK_API_URL}/${id}`);
      fetchStaffs();
    }
  };

  const handleOpenForm = (staff = null) => {
    setSelectedStaff(staff);
    setOpen(true);
  };

  const handleCloseForm = () => {
    setOpen(false);
    setSelectedStaff(null);
    fetchStaffs(); 
  };

  return (
    <Box p={2}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' }, 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', md: 'center' }, 
        mb: 3, 
        gap: 2 
      }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Staff Management</Typography>
        
        <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', md: 'auto' } }}>
          {/* Department Filter UI */}
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Filter Department</InputLabel>
            <Select
              value={selectedDept}
              label="Filter Department"
              onChange={(e) => setSelectedDept(e.target.value)}
              startAdornment={<FilterList sx={{ mr: 1, color: 'action.active' }} />}
            >
              {departments.map(dept => (
                <MenuItem key={dept} value={dept}>{dept}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button 
            variant="contained" 
            startIcon={<Add />} 
            onClick={() => handleOpenForm()}
          >
            Add Staff
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Emp ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStaffs.length > 0 ? (
                filteredStaffs.map((s) => (
                  <TableRow key={s.id} sx={{ '&:hover': { bgcolor: '#fafafa' } }}>
                    <TableCell>{s.employeeId}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{s.name}</TableCell>
                    <TableCell>{s.role}</TableCell>
                    <TableCell>
                      <Box sx={{ 
                        display: 'inline-block', px: 1, py: 0.5, borderRadius: 1, 
                        bgcolor: '#e3f2fd', color: '#1976d2', fontSize: '0.75rem' 
                      }}>
                        {s.department}
                      </Box>
                    </TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" size="small" onClick={() => handleOpenForm(s)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton color="error" size="small" onClick={() => handleDelete(s.id)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    No staff found in this department.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

       <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogContent>
          <StaffCreationForm 
            editData={selectedStaff} 
            onSuccess={handleCloseForm} 
            onCancel={() => setOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default StaffPage;
