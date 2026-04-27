import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Box, CircularProgress, Button, Dialog, 
  DialogTitle, DialogContent, List, ListItem, ListItemButton, 
  ListItemText, ListItemIcon, Divider, IconButton
} from '@mui/material';
import { 
  Payments, Download, PictureAsPdf, Description, 
  ChevronRight, ArrowBack, Close, GridView, ListAlt, Article 
} from '@mui/icons-material';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const STAFF_API = 'https://69ebaf0897482ad5c527fdb2.mockapi.io/staff';
const ATTENDANCE_API = 'https://69ebaf0897482ad5c527fdb2.mockapi.io/attendance';

const SalaryModule = () => {
  const [loading, setLoading] = useState(true);
  const [salaryData, setSalaryData] = useState([]);
  
  
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogStep, setDialogStep] = useState('format'); 
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

  const handleOpenDownload = (row) => {
    setSelectedRow(row);
    setDialogStep('format');
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedRow(null);
  };

  const downloadPDF = (row, style = 'classic') => {
    const doc = new jsPDF();
    let headerColor = [46, 125, 50];  
    let themeType = 'striped';

    if (style === 'modern') {
      headerColor = [25, 118, 210];
      doc.setFont("helvetica", "bold");
    } else if (style === 'minimal') {
      themeType = 'plain';
      headerColor = [50, 50, 50]; 
    }

    doc.setFontSize(18);
    doc.text(style === 'minimal' ? "PAYSLIP" : "SALARY SLIP", 105, 20, { align: "center" });
    
    doc.setFontSize(11);
    doc.text(`Employee Name: ${row.name}`, 20, 40);
    doc.text(`Employee ID: ${row.employeeId}`, 20, 48);
    doc.text(`Style Version: ${style.toUpperCase()}`, 20, 56);

    autoTable(doc, {
      startY: 65,
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
      theme: themeType,
      headStyles: { fillColor: headerColor } 
    });

    doc.save(`SalarySlip_${style}_${row.name}.pdf`);
    handleClose();
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
    handleClose();
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
                    onClick={() => handleOpenDownload(row)}
                  >
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

       
      <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
          {dialogStep === 'format' ? (
            'Choose Format'
          ) : (
            <Box display="flex" alignItems="center">
              <IconButton onClick={() => setDialogStep('format')} sx={{ mr: 1 }} size="small">
                <ArrowBack />
              </IconButton>
              PDF Layouts
            </Box>
          )}
          <IconButton onClick={handleClose} size="small"><Close /></IconButton>
        </DialogTitle>
        
        <DialogContent dividers sx={{ p: 0 }}>
          <List>
            {dialogStep === 'format' ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => setDialogStep('pdfStyles')}>
                    <ListItemIcon><PictureAsPdf color="error" /></ListItemIcon>
                    <ListItemText primary="Download as PDF" secondary="Choose from 3 different styles" />
                    <ChevronRight />
                  </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem disablePadding>
                  <ListItemButton onClick={() => downloadCSV(selectedRow)}>
                    <ListItemIcon><Description color="primary" /></ListItemIcon>
                    <ListItemText primary="Download as CSV" secondary="Excel Spreadsheet format" />
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => downloadPDF(selectedRow, 'classic')}>
                    <ListItemIcon><ListAlt color="success" /></ListItemIcon>
                    <ListItemText primary="Classic Green" secondary="Standard professional layout" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => downloadPDF(selectedRow, 'modern')}>
                    <ListItemIcon><GridView color="primary" /></ListItemIcon>
                    <ListItemText primary="Modern Blue" secondary="Clean corporate design" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => downloadPDF(selectedRow, 'minimal')}>
                    <ListItemIcon><Article color="action" /></ListItemIcon>
                    <ListItemText primary="Minimalist" secondary="Ink-friendly simple design" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SalaryModule;
