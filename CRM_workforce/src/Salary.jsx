import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, CircularProgress, Button, Menu, MenuItem
} from '@mui/material';
import { Payments, Download, ExpandMore } from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'

const STAFF_API = 'https://69ebaf0897482ad5c527fdb2.mockapi.io/staff';
const ATTENDANCE_API = 'https://69ebaf0897482ad5c527fdb2.mockapi.io/attendance';

const SalaryModule = () => {
  const [loading, setLoading] = useState(true);
  const [salaryData, setSalaryData] = useState([]);
  
   
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => { calculateSalaries(); }, []);

  const calculateSalaries = async () => {
    try {
      setLoading(true);
      const [staffRes, attRes] = await Promise.all([
        axios.get(STAFF_API),
        axios.get(ATTENDANCE_API)
      ]);

      const computed = staffRes.data.map(member => {
        const history = attRes.data.filter(a => a.staffId === member.id);
        const presentCount = history.filter(a => a.status === 'Present').length;
        const absentCount = history.filter(a => a.status === 'Absent').length;
        const lateCount = history.filter(a => a.status === 'Late').length;

        const base = parseFloat(member.baseSalary) || 0;
        const perDayPay = base / 30;
        const earnedSalary = (presentCount * perDayPay) + (lateCount * (perDayPay * 0.5));
        const finalNet = earnedSalary + (parseFloat(member.allowances) || 0) - (parseFloat(member.deductions) || 0);

        return { ...member, present: presentCount, absent: absentCount, late: lateCount, netSalary: finalNet.toFixed(2) };
      });
      setSalaryData(computed);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

 

const downloadPDF = (row) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text("SALARY SLIP", 105, 20, { align: "center" });
  
  doc.setFontSize(12);
  doc.text(`Employee Name: ${row.name}`, 20, 40);
  doc.text(`Employee ID: ${row.employeeId}`, 20, 50);
  doc.text(`Department: ${row.department}`, 20, 60);

   autoTable(doc, {
    startY: 70,
    head: [['Description', 'Details']],
    body: [
      ['Present Days', row.present],
      ['Absent Days', row.absent],
      ['Late Days', row.late],
      ['Base Salary', `Rs. ${row.baseSalary}`],
      ['Allowances', `Rs. ${row.allowances || 0}`],
      ['Deductions', `Rs. ${row.deductions || 0}`],
      ['Total Net Payable', `Rs. ${row.netSalary}`],
    ],
    theme: 'striped',
    headStyles: { fillColor: [46, 125, 50] } 
  });

  doc.save(`SalarySlip_${row.name}.pdf`);
};


  const downloadCSV = (row) => {
    const headers = "Name,EmpID,Present,Absent,Late,NetSalary\n";
    const data = `${row.name},${row.employeeId},${row.present},${row.absent},${row.late},${row.netSalary}`;
    const blob = new Blob([headers + data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SalarySlip_${row.name}.csv`;
    a.click();
  };

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  if (loading) return <Box display="flex" justifyContent="center" m={5}><CircularProgress /></Box>;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#2e7d32', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Payments fontSize="large" /> Payroll Management
      </Typography>

      <TableContainer component={Paper} elevation={4}>
        <Table>
          <TableHead sx={{ bgcolor: '#2e7d32' }}>
            <TableRow>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Staff Details</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="center">Attendance</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="center">Net Payable</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }} align="center">Download Slip</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salaryData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{row.name}</Typography>
                  <Typography variant="caption" color="textSecondary">{row.department} | ID: {row.employeeId}</Typography>
                </TableCell>
                <TableCell align="center">{row.present}P / {row.absent}A / {row.late}L</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', color: 'primary.main' }}>₹{row.netSalary}</TableCell>
                <TableCell align="center">
                  <Button 
                    variant="contained" 
                    size="small" 
                    startIcon={<Download />} 
                    endIcon={<ExpandMore />}
                    onClick={(e) => handleMenuOpen(e, row)}
                  >
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => { downloadPDF(selectedRow); setAnchorEl(null); }}>PDF Format</MenuItem>
        <MenuItem onClick={() => { downloadCSV(selectedRow); setAnchorEl(null); }}>CSV Format</MenuItem>
        <MenuItem onClick={() => { window.print(); setAnchorEl(null); }}>Print View</MenuItem>
      </Menu>
    </Box>
  );
};

export default SalaryModule;
