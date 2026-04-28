import  { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Select, MenuItem, Typography, Box, CircularProgress, Alert, 
  Snackbar, TextField, Tabs, Tab, Card, Grid,
  FormControl,
  InputLabel
} from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import {  PieChart } from '@mui/x-charts/PieChart';
import { LineChart,  } from '@mui/x-charts';
 
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
        department: s.department
      };
    });
  };

  const processedData = getChartData();
 const [selectedDept, setSelectedDept] = useState('All');

 const departments = ['All', ...new Set(staff.map(s => s.department))];

 const filteredData = processedData.filter(item => 
  selectedDept === 'All' ? true : item.department === selectedDept
);

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
  
         <Box 
  sx={{ 
    display: 'flex', 
    flexDirection: { xs: 'column', sm: 'row' }, // Stacks on mobile, row on desktop
    justifyContent: 'space-between', 
    alignItems: 'center', 
    gap: 2, 
    mb: 3, 
    p: 2, 
    bgcolor: '#f8f9fa', 
    borderRadius: 2, 
    border: '1px solid #e0e0e0' 
  }}
>
  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#444' }}>
    Attendance Records
  </Typography>

  <Box 
    sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' }, 
      gap: 2, 
      width: { xs: '100%', sm: 'auto' } 
    }}
  >
    <TextField
      label="Select Date"
      type="date"
      size="small"
      value={selectedDate}
      onChange={(e) => setSelectedDate(e.target.value)}
      InputLabelProps={{ shrink: true }}
      sx={{ 
        width: { xs: '100%', sm: 180 },
        '& .MuiOutlinedInput-root': { bgcolor: 'white' } 
      }}
    />

    <FormControl 
      size="small" 
      sx={{ 
        minWidth: { xs: '100%', sm: 220 },
        '& .MuiOutlinedInput-root': { bgcolor: 'white' }
      }}
    >
      <InputLabel>Filter by Department</InputLabel>
      <Select
        value={selectedDept}
        label="Filter by Department"
        onChange={(e) => setSelectedDept(e.target.value)}
      >
        {departments.map(dept => (
          <MenuItem key={dept} value={dept}>{dept}</MenuItem>
        ))}
      </Select>
    </FormControl>
  </Box>
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
                {staff
  .filter(member => selectedDept === 'All' || member.department === selectedDept)
  .map((member) => {
    const record = attendanceData.find(a => a.staffId === member.id && a.date === selectedDate);
    const currentStatus = record?.status || 'Pending';

    // Status colors for better visual feedback
    const getStatusColor = (status) => {
      switch (status) {
        case 'Present': return '#e8f5e9'; // Light Green
        case 'Absent': return '#ffebee';  // Light Red
        case 'Late': return '#fff3e0';    // Light Orange
        default: return 'transparent';
      }
    };

    return (
      <TableRow 
        key={member.id}
        sx={{ 
          transition: '0.3s',
          '&:hover': { bgcolor: '#f5f5f5' } // Highlight on hover
        }}
      >
        <TableCell sx={{ fontWeight: 500 }}>{member.employeeId}</TableCell>
        <TableCell>{member.name}</TableCell>
        <TableCell>
          <Box sx={{ 
            display: 'inline-block', 
            px: 1.5, py: 0.5, 
            borderRadius: 1, 
            bgcolor: '#eeeeee', 
            fontSize: '0.75rem' 
          }}>
            {member.department}
          </Box>
        </TableCell>
        <TableCell>
          <Select
            size="small"
            value={currentStatus}
            onChange={(e) => handleStatusChange(member, e.target.value)}
            fullWidth
            sx={{ 
              bgcolor: getStatusColor(currentStatus),
              borderRadius: 2,
              '& .MuiSelect-select': { py: 1 }
            }}
          >
            <MenuItem value="Pending">🕒 Pending</MenuItem>
            <MenuItem value="Present">✅ Present</MenuItem>
            <MenuItem value="Absent">❌ Absent</MenuItem>
            <MenuItem value="Late">⚠️ Late</MenuItem>
          </Select>
        </TableCell>
      </TableRow>
    );
  })
}

              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

   
{tabValue === 1 && (
  <Box >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Attendance Analytics
      </Typography>
      
        <FormControl sx={{ minWidth: 220 }} size="small">
          <InputLabel>Filter by Department</InputLabel>
          <Select
            value={selectedDept}
            label="Filter by Department"
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            {departments.map(dept => (
              <MenuItem key={dept} value={dept}>{dept}</MenuItem>
            ))}
          </Select>
        </FormControl>
    </Box>
      <Grid container spacing={2} mt={2}>
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
      dataset={filteredData}
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
   <Grid container spacing={2} mt={2}>
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
  dataset={filteredData}
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
  <Grid container spacing={2} mt={2}>
     <Grid item xs={12}>
        <Card sx={{ p: 2, boxShadow: 3 }}>
          <Typography variant="subtitle2" gutterBottom align="center">Total Distribution (Pie)</Typography>
          <PieChart
            series={[{
              data: [
                { id: 0, value: filteredData.reduce((acc, curr) => acc + curr.present, 0), label: 'Present', color: '#4caf50' },
                { id: 1, value: filteredData.reduce((acc, curr) => acc + curr.absent, 0), label: 'Absent', color: '#f44336' },
                { id: 2, value: filteredData.reduce((acc, curr) => acc + curr.late, 0), label: 'Late', color: '#ff9800' },
              ],
              innerRadius: 50,
              paddingAngle: 2,
            }]}
              width={600}
    height={300}
          />
        </Card>
      </Grid>
  </Grid>
  <Grid container spacing={2} mt={2}>
       <Grid item xs={12}>
        <Card sx={{ p: 2, boxShadow: 3 }}>
          <Typography variant="subtitle2" gutterBottom align="center">Attendance Trend (Area)</Typography>
          <LineChart
            dataset={filteredData}
            xAxis={[{ scaleType: 'band', dataKey: 'name' }]}
            series={[{ dataKey: 'present', label: 'Present', area: true, color: '#0288d1' }]}
            height={300}
            width={600}
          />
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
