import  { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Select, MenuItem, Typography, Box, CircularProgress, Alert, 
  Snackbar, TextField, Tabs, Tab, Card, Grid
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

const STAFF_API = 'https://69ebaf0897482ad5c527fdb2.mockapi.io/staff';
const ATTENDANCE_API = 'https://69ebaf0897482ad5c527fdb2.mockapi.io/attendance';

const Attendance = () => {
  const [tabValue, setTabValue] = useState(0);  
  const [staff, setStaff] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [staffRes, attendanceRes] = await Promise.all([
        axios.get(STAFF_API),
        axios.get(ATTENDANCE_API)
      ]);
      setStaff(staffRes.data);
      setAttendanceData(attendanceRes.data);
    } catch (err) {
      showToast("Error fetching data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (member, newStatus) => {
    try {
      const existingEntry = attendanceData.find(
        (att) => att.staffId === member.id && att.date === selectedDate
      );

      const payload = { 
        staffId: member.id, 
        name: member.name, 
        department: member.department,
        date: selectedDate, 
        status: newStatus 
      };

      if (existingEntry) {
        await axios.put(`${ATTENDANCE_API}/${existingEntry.id}`, payload);
        showToast(`Updated ${member.name} to ${newStatus}`, "info");
      } else {
        await axios.post(ATTENDANCE_API, payload);
        showToast(`Marked ${newStatus} for ${member.name}`, "success");
      }

      const updatedAtt = await axios.get(ATTENDANCE_API);
      setAttendanceData(updatedAtt.data);
    } catch (err) {
      showToast("Failed to save attendance", "error");
    }
  };

  const showToast = (message, severity) => {
    setToast({ open: true, message, severity });
  };

  
  const getChartData = () => {
    return staff.map(s => {
      const personalAttendance = attendanceData.filter(att => att.staffId === s.id);
      return {
        name: s.name,
        present: personalAttendance.filter(a => a.status === 'Present').length,
        absent: personalAttendance.filter(a => a.status === 'Absent').length,
        late: personalAttendance.filter(a => a.status === 'Late').length,
      };
    });
  };

  const processedData = getChartData();

  if (loading) return <Box display="flex" justifyContent="center" m={5}><CircularProgress /></Box>;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Attendance Management
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)}>
          <Tab label="Mark Attendance" />
          <Tab label="Attendance Charts" />
        </Tabs>
      </Box>

       
      {tabValue === 0 && (
        <Box>
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <TextField
              label="Date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ width: 200 }}
            />
          </Box>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell>Employee ID</TableCell>
                  <TableCell>Staff Name</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Status ({selectedDate})</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {staff.map((member) => {
                  const record = attendanceData.find(a => a.staffId === member.id && a.date === selectedDate);
                  const currentStatus = record?.status || 'Pending';
                  return (
                    <TableRow key={member.id}>
                      <TableCell>{member.employeeId}</TableCell>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>{member.department}</TableCell>
                      <TableCell>
                        <Select
                          size="small"
                          value={currentStatus}
                          onChange={(e) => handleStatusChange(member, e.target.value)}
                          fullWidth
                        >
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="Present">Present</MenuItem>
                          <MenuItem value="Absent">Absent</MenuItem>
                          <MenuItem value="Late">Late</MenuItem>
                        </Select>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

   
      {tabValue === 1 && (
       <Box sx={{ width: '100%', mt: 2 }}>
  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
    Staff-wise Attendance Summary
  </Typography>
  
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <Card 
        sx={{ 
          p: 2, 
          width: '100%', 
          minHeight: '70vh', 
          display: 'flex', 
          flexDirection: 'column',
          boxShadow: 3 
        }}
      >
        <Box sx={{ width: '100%', flexGrow: 1 }}>
           <BarChart
      dataset={processedData}
      xAxis={[{ scaleType: 'band', dataKey: 'name' }]}
      series={[
        { dataKey: 'present', label: 'Present', color: '#4caf50' },
        { dataKey: 'absent', label: 'Absent', color: '#f44336' },
        { dataKey: 'late', label: 'Late', color: '#ff9800' },
      ]}
      width={600}
      height={300}
    />
        </Box>
      </Card>
    </Grid>
  </Grid>
   <Grid container spacing={2}>
    <Grid item xs={12}>
      <Card 
        sx={{ 
          p: 2, 
          width: '100%', 
          minHeight: '70vh', 
          display: 'flex', 
          flexDirection: 'column',
          boxShadow: 3 
        }}
      >
        <Box sx={{ width: '100%', flexGrow: 1 }}>
    <BarChart
  dataset={processedData}
  xAxis={[{ scaleType: 'band', dataKey: 'name' }]}
  series={[
    { dataKey: 'present', label: 'Present', stack: 'total' },
    { dataKey: 'absent', label: 'Absent', stack: 'total' },
    { dataKey: 'late', label: 'Late', stack: 'total' },
  ]}
  width={600}
  height={300}
/>
        </Box>
      </Card>
    </Grid>
  </Grid>
</Box>

      )}

      <Snackbar open={toast.open} autoHideDuration={3000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.severity} variant="filled">{toast.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default Attendance;
