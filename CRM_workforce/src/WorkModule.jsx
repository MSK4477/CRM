import  { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, Button, TextField, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Dialog, DialogTitle, 
  DialogContent, DialogActions, MenuItem, Chip, CircularProgress, IconButton,Grid , Select
} from '@mui/material';
import { AssignmentTurnedIn, AddTask, DeleteSweep } from '@mui/icons-material';

const STAFF_API = 'https://69ebaf0897482ad5c527fdb2.mockapi.io/staff';
const TASKS_API = 'https://64c086d50d8e251fd112278b.mockapi.io/task';

const WorkModule = () => {
  const [staff, setStaff] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

   
  const [newTask, setNewTask] = useState({
    staffId: '',
    taskTitle: '',
    description: '',
    deadline: '',
    status: 'Pending'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [staffRes, tasksRes] = await Promise.all([
        axios.get(STAFF_API),
        axios.get(TASKS_API)
      ]);
      setStaff(staffRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      console.error("Error fetching work data", err);
    } finally {
      setLoading(false);
    }
  };
 
  const handleAssignTask = async () => {
    const selectedStaff = staff.find(s => s.id === newTask.staffId);
    const payload = { ...newTask, staffName: selectedStaff?.name };
    await axios.post(TASKS_API, payload);
    setOpen(false);
    setNewTask({ staffId: '', taskTitle: '', description: '', deadline: '', status: 'Pending' });
    fetchData();
  };

  const handleStatusUpdate = async (id, newStatus) => {
    await axios.put(`${TASKS_API}/${id}`, { status: newStatus });
    fetchData();
  };

  const handleDeleteTask = async (id) => {
    if(window.confirm("Delete this task?")) {
      await axios.delete(`${TASKS_API}/${id}`);
      fetchData();
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" m={5}><CircularProgress /></Box>;

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#673ab7', display: 'flex', alignItems: 'center', gap: 1 }}>
          <AssignmentTurnedIn fontSize="large" /> Task Management
        </Typography>
        <Button variant="contained" startIcon={<AddTask />} onClick={() => setOpen(true)} sx={{ bgcolor: '#673ab7' }}>
          Assign New Work
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>Staff Name</TableCell>
              <TableCell>Task Title</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id} hover>
                <TableCell sx={{ fontWeight: 'bold' }}>{task.staffName}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{task.taskTitle}</Typography>
                  <Typography variant="caption" color="textSecondary">{task.description}</Typography>
                </TableCell>
                <TableCell>{task.deadline}</TableCell>
                <TableCell>
                  <Chip 
                    label={task.status} 
                    size="small" 
                    color={task.status === 'Completed' ? 'success' : task.status === 'In Progress' ? 'warning' : 'default'} 
                  />
                </TableCell>
                <TableCell align="center">
                  <Select
                    size="small"
                    value={task.status}
                    onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
                    sx={{ mr: 1, minWidth: 110 }}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                  </Select>
                  <IconButton color="error" onClick={() => handleDeleteTask(task.id)}>
                    <DeleteSweep />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

       <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Assign Work to Staff</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Select Staff"
                value={newTask.staffId}
                onChange={(e) => setNewTask({ ...newTask, staffId: e.target.value })}
              >
                {staff.map((s) => (
                  <MenuItem key={s.id} value={s.id}>{s.name} ({s.department})</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth label="Task Title" 
                onChange={(e) => setNewTask({ ...newTask, taskTitle: e.target.value })} 
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth multiline rows={3} label="Description" 
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} 
              />
            </Grid>
            <Grid item xs={12}>
              <TextField 
                fullWidth type="date" label="Deadline" InputLabelProps={{ shrink: true }} 
                onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })} 
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAssignTask} disabled={!newTask.staffId || !newTask.taskTitle}>
            Assign Task
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkModule;
