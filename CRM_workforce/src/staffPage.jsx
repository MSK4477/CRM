import  { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, Button, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, IconButton, Dialog, DialogContent, CircularProgress 
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import StaffCreationForm from './staffCreationForm';

const MOCK_API_URL = 'https://69ebaf0897482ad5c527fdb2.mockapi.io/staff';

const StaffPage = () => {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null); 

 
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
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Staff Management</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => handleOpenForm()}
        >
          Add Staff
        </Button>
      </Box>

      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Emp ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staffs.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.employeeId}</TableCell>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.role}</TableCell>
                  <TableCell>{s.department}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleOpenForm(s)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(s.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
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
