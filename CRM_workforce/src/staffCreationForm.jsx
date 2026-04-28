import { useState, useEffect } from 'react';
import { 
  Stepper, Step, StepLabel, Button, Box, TextField, Grid, 
  Typography, MenuItem, CircularProgress 
} from '@mui/material';
import axios from 'axios';

const MOCK_API_URL = 'https://69ebaf0897482ad5c527fdb2.mockapi.io/staff';

const StaffForm = ({ editData, onSuccess, onCancel }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", employeeId: "", role: "", department: "", joiningDate: "",
    fatherName: "", motherName: "", spouse: "", emergencyContactName: "", emergencyPhone: "", relationship: "",
    experienceType: "Fresher", prevCompany: "", years: "", prevRole: "", skills: "",
    baseSalary: "", allowances: "", deductions: "", address: "", notes: ""
  });

  useEffect(() => {
    if (editData) setFormData(editData);
  }, [editData]);

  const handleChange = (e) => {
    if(activeStep === 1 && !formData.employeeId){
        if(!editData){
      setFormData(prev => ({
        ...prev, 
        employeeId: `EMP-${staffs.length + 1}`
      }));
    }
    }
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
     if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };
  const validate = () => {
  let tempErrors = {};

   if (activeStep === 0) {
    if (!formData.name.trim()) tempErrors.name = "Full name is required";
    
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email format is invalid";
    }

    if (!formData.phone) {
      tempErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      tempErrors.phone = "Enter a valid 10-digit phone number";
    }

    // if (!formData.employeeId) tempErrors.employeeId = "Employee ID is required";
    if (!formData.role) tempErrors.role = "Job role is required";
    if (!formData.department) tempErrors.department = "Please select a department";
    if (!formData.joiningDate) tempErrors.joiningDate = "Joining date is required";
  }

   
  if (activeStep === 1) {
    if (!formData.fatherName.trim()) tempErrors.fatherName = "Father's name is required";
    if (!formData.motherName.trim()) tempErrors.motherName = "Mother's name is required";
     if (!formData.emergencyContactName.trim()) tempErrors.emergencyContactName = "Emergency contact name is required";
    
    if (!formData.emergencyPhone) {
      tempErrors.emergencyPhone = "Emergency phone is required";
    } else if (!/^\d{10}$/.test(formData.emergencyPhone)) {
      tempErrors.emergencyPhone = "Enter a valid 10-digit number";
    }
    
    if (!formData.relationship) tempErrors.relationship = "Specify relationship (e.g., Brother, Wife)";
    if (!formData.address.trim()) tempErrors.address = "Residential address is required";
  }

   if (activeStep === 2) {
     if (formData.experienceType === 'Experienced') {
      if (!formData.prevCompany) tempErrors.prevCompany = "Previous company is required";
      if (!formData.years) tempErrors.years = "Years of experience is required";
      if (!formData.prevRole) tempErrors.prevRole = "Previous role is required";
    }
    
    if (!formData.skills.trim()) tempErrors.skills = "Please list at least one skill";

     if (!formData.baseSalary) {
      tempErrors.baseSalary = "Base salary is required";
    } else if (Number(formData.baseSalary) <= 0) {
      tempErrors.baseSalary = "Salary must be greater than 0";
    }

    if (!formData.allowances) tempErrors.allowances = "Enter 0 if none";
    if (!formData.deductions) tempErrors.deductions = "Enter 0 if none";
    if (!formData.notes) tempErrors.notes = "Notes is required";
    
   }

  setErrors(tempErrors);
 const validate = () => {
  let tempErrors = {};

   if (activeStep === 0) {
    if (!formData.name.trim()) tempErrors.name = "Full name is required";
    
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email format is invalid";
    }

    if (!formData.phone) {
      tempErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      tempErrors.phone = "Enter a valid 10-digit phone number";
    }

    // if (!formData.employeeId) tempErrors.employeeId = "Employee ID is required";
    if (!formData.role) tempErrors.role = "Job role is required";
    if (!formData.department) tempErrors.department = "Please select a department";
    if (!formData.joiningDate) tempErrors.joiningDate = "Joining date is required";
  }

   if (activeStep === 1) {
    if (!formData.fatherName.trim()) tempErrors.fatherName = "Father's name is required";
    if (!formData.motherName.trim()) tempErrors.motherName = "Mother's name is required";
     if (!formData.emergencyContactName.trim()) tempErrors.emergencyContactName = "Emergency contact name is required";
    
    if (!formData.emergencyPhone) {
      tempErrors.emergencyPhone = "Emergency phone is required";
    } else if (!/^\d{10}$/.test(formData.emergencyPhone)) {
      tempErrors.emergencyPhone = "Enter a valid 10-digit number";
    }
    
    if (!formData.relationship) tempErrors.relationship = "Specify relationship (e.g., Brother, Wife)";
    if (!formData.address.trim()) tempErrors.address = "Residential address is required";
  }

   if (activeStep === 2) {
     if (formData.experienceType === 'Experienced') {
      if (!formData.prevCompany) tempErrors.prevCompany = "Previous company is required";
      if (!formData.years) tempErrors.years = "Years of experience is required";
      if (!formData.prevRole) tempErrors.prevRole = "Previous role is required";
    }
    
    if (!formData.skills.trim()) tempErrors.skills = "Please list at least one skill";

     if (!formData.baseSalary) {
      tempErrors.baseSalary = "Base salary is required";
    } else if (Number(formData.baseSalary) <= 0) {
      tempErrors.baseSalary = "Salary must be greater than 0";
    }

    if (!formData.allowances) tempErrors.allowances = "Enter 0 if none";
    if (!formData.deductions) tempErrors.deductions = "Enter 0 if none";
    
   }

  setErrors(tempErrors);
  
  return Object.keys(tempErrors).length === 0;
};
  return Object.keys(tempErrors).length === 0;
};


  const handleNext = () => {
    if (validate()) setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setErrors({});  
    setActiveStep((prev) => prev - 1);
  };
const MOCK_API_URL = 'https://69ebaf0897482ad5c527fdb2.mockapi.io/staff';
  const [staffs, setStaffs] = useState([]);
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
  const handleSubmit = async () => {

    if (validate()) {
      setLoading(true);
      try {
        if (editData) await axios.put(`${MOCK_API_URL}/${editData.id || editData?.employeeId}`, formData);
        else await axios.post(MOCK_API_URL, formData);
        onSuccess();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const steps = ['Work Info', 'Family & Contact', 'Salary & Skills'];
 
  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h5" gutterBottom align="center">Staff Details</Typography>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map(label => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
      </Stepper>

       
      {activeStep === 0 && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Full Name" name="name" value={formData.name} onChange={handleChange} 
              error={!!errors.name} helperText={errors.name} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Email" name="email" value={formData.email} onChange={handleChange} 
              error={!!errors.email} helperText={errors.email} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Phone" error={!!errors.phone} name="phone" value={formData.phone} onChange={handleChange} helperText={errors.phone} />
          </Grid>
          {/* <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Employee ID" name="employeeId" value={formData.employeeId} onChange={handleChange} 
              error={!!errors.employeeId} helperText={errors.employeeId} />
          </Grid> */}
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Role" error={!!errors.role} name="role" value={formData.role} onChange={handleChange} helperText={errors.role} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select fullWidth label="Department" name="department" value={formData.department} onChange={handleChange}
              error={!!errors.department} helperText={errors.department}>
              <MenuItem value="IT">IT</MenuItem>
              <MenuItem value="HR">HR</MenuItem>
              <MenuItem value="Finance">Finance</MenuItem>
              <MenuItem value="Sales">Sales</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth type="date" label="Joining Date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} InputLabelProps={{ shrink: true }} /></Grid>
        </Grid>
      )}

      
      {activeStep === 1 && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Father's Name" name="fatherName" value={formData.fatherName} onChange={handleChange} 
              error={!!errors.fatherName} helperText={errors.fatherName} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth error={!!errors.motherName} label="Mother's Name" name="motherName" value={formData.motherName} onChange={handleChange} helperText={errors.motherName} />
          </Grid>
          {/* <Grid item xs={12} sm={4}>
            <TextField fullWidth error={!!errors.spouse}  label="Spouse" name="spouse" value={formData.spouse} onChange={handleChange} helperText={errors.spouse} />
          </Grid> */}
          <Grid item xs={12} sm={4}>
            <TextField fullWidth error={!!errors.emergencyContactName} label="Emergency Contact Name" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} helperText={errors.emergencyContactName} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Emergency Phone" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} 
              error={!!errors.emergencyPhone} helperText={errors.emergencyPhone} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth error={!!errors.relationship} label="Relationship" name="relationship" value={formData.relationship} onChange={handleChange} helperText={errors.relationship} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth multiline rows={2} label="Address" name="address" value={formData.address} onChange={handleChange} 
              error={!!errors.address} helperText={errors.address} />
          </Grid>
        </Grid>
      )}

       {activeStep === 2 && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField select fullWidth label="Experience Type" name="experienceType" value={formData.experienceType} onChange={handleChange}>
              <MenuItem value="Fresher">Fresher</MenuItem>
              <MenuItem value="Experienced">Experienced</MenuItem>
            </TextField>
          </Grid>
          {formData.experienceType === 'Experienced' && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Prev Company" name="prevCompany" value={formData.prevCompany} onChange={handleChange} 
                  error={!!errors.prevCompany} helperText={errors.prevCompany} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Years" name="years" value={formData.years} onChange={handleChange} 
                  error={!!errors.years} helperText={errors.years} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Previous Role" name="prevRole" value={formData.prevRole} onChange={handleChange} 
                  error={!!errors.prevRole} helperText={errors.prevRole} />
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <TextField fullWidth label="Skills (Comma separated)" name="skills" value={formData.skills} onChange={handleChange} 
              error={!!errors.skills} helperText={errors.skills} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth type="number" label="Base Salary" name="baseSalary" value={formData.baseSalary} onChange={handleChange} 
              error={!!errors.baseSalary} helperText={errors.baseSalary} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth type="number" label="Allowances" name="allowances" value={formData.allowances} onChange={handleChange} 
              error={!!errors.allowances} helperText={errors.allowances} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth type="number" label="Deductions" name="deductions" value={formData.deductions} onChange={handleChange} 
              error={!!errors.deductions} helperText={errors.deductions} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth multiline rows={2} label="Notes" name="notes" value={formData.notes} onChange={handleChange} 
              error={!!errors.notes} helperText={errors.notes} />
            </Grid>
        </Grid>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button variant="outlined" onClick={onCancel}>Cancel</Button>
        <Box>
          {activeStep !== 0 && <Button onClick={handleBack} sx={{ mr: 1 }}>Back</Button>}
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" color="success" onClick={handleSubmit} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Submit'}
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext}>Next</Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default StaffForm;