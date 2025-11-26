import { useToast } from '../components/ui/use-toast';

export function useHospitalActions() {
  const { toast } = useToast();

  const showSuccess = (title: string, description: string) => {
    toast({
      title,
      description,
      variant: "success",
    });
  };

  const showError = (title: string, description: string) => {
    toast({
      title,
      description,
      variant: "destructive",
    });
  };

  const showInfo = (title: string, description: string) => {
    toast({
      title,
      description,
      variant: "default",
    });
  };

  // Patient Actions
  const registerPatient = () => {
    showSuccess("Patient Registered", "New patient has been successfully registered in the system.");
  };

  const updatePatient = () => {
    showSuccess("Patient Updated", "Patient information has been successfully updated.");
  };

  const dischargePatient = (patientName: string) => {
    showSuccess("Patient Discharged", `${patientName} has been discharged successfully.`);
  };

  // Appointment Actions
  const scheduleAppointment = () => {
    showSuccess("Appointment Scheduled", "New appointment has been scheduled successfully.");
  };

  const confirmAppointment = () => {
    showSuccess("Appointment Confirmed", "Appointment has been confirmed.");
  };

  const cancelAppointment = () => {
    showInfo("Appointment Cancelled", "The appointment has been cancelled.");
  };

  const rescheduleAppointment = () => {
    showSuccess("Appointment Rescheduled", "Appointment has been rescheduled successfully.");
  };

  // Emergency Actions
  const registerEmergency = () => {
    showSuccess("Emergency Registered", "Emergency case has been registered. Priority triage assigned.");
  };

  const startTreatment = (patientName: string) => {
    showSuccess("Treatment Started", `Treatment for ${patientName} has been initiated.`);
  };

  const updateVitals = () => {
    showSuccess("Vitals Updated", "Patient vitals have been recorded successfully.");
  };

  // Surgery Actions
  const scheduleSurgery = () => {
    showSuccess("Surgery Scheduled", "Surgery has been scheduled successfully.");
  };

  const startPreOp = () => {
    showSuccess("Pre-Op Started", "Pre-operative procedures have been initiated.");
  };

  const moveToOR = () => {
    showSuccess("Moved to OR", "Patient has been moved to the operating room.");
  };

  const completeSurgery = () => {
    showSuccess("Surgery Completed", "Surgery has been completed successfully.");
  };

  // Lab Actions
  const orderTest = () => {
    showSuccess("Test Ordered", "Laboratory test has been ordered successfully.");
  };

  const collectSample = () => {
    showSuccess("Sample Collected", "Sample has been collected and sent to lab.");
  };

  const enterResults = () => {
    showSuccess("Results Entered", "Test results have been entered into the system.");
  };

  // Pharmacy Actions
  const addMedicine = () => {
    showSuccess("Medicine Added", "New medicine has been added to inventory.");
  };

  const reorderMedicine = (medicineName: string) => {
    showSuccess("Reorder Requested", `Reorder request for ${medicineName} has been submitted.`);
  };

  // Billing Actions
  const generateInvoice = () => {
    showSuccess("Invoice Generated", "Invoice has been generated successfully.");
  };

  const processPayment = () => {
    showSuccess("Payment Processed", "Payment has been processed successfully.");
  };

  const downloadInvoice = () => {
    showInfo("Downloading Invoice", "Invoice is being downloaded...");
  };

  // Blood Bank Actions
  const requestBlood = () => {
    showSuccess("Blood Requested", "Blood request has been submitted.");
  };

  const crossMatch = () => {
    showSuccess("Cross-Match Started", "Blood cross-matching process has been initiated.");
  };

  const issueBlood = () => {
    showSuccess("Blood Issued", "Blood units have been issued successfully.");
  };

  // Equipment Actions
  const scheduleMaintenance = () => {
    showSuccess("Maintenance Scheduled", "Equipment maintenance has been scheduled.");
  };

  const markOperational = () => {
    showSuccess("Equipment Operational", "Equipment has been marked as operational.");
  };

  // Radiology Actions
  const orderStudy = () => {
    showSuccess("Study Ordered", "Imaging study has been ordered.");
  };

  const startStudy = () => {
    showSuccess("Study Started", "Imaging study has been initiated.");
  };

  const addReport = () => {
    showSuccess("Report Added", "Radiology report has been added successfully.");
  };

  // Insurance Actions
  const submitClaim = () => {
    showSuccess("Claim Submitted", "Insurance claim has been submitted for review.");
  };

  const appealClaim = () => {
    showSuccess("Appeal Submitted", "Claim appeal has been submitted.");
  };

  // Staff Actions
  const addStaff = () => {
    showSuccess("Staff Added", "New staff member has been added successfully.");
  };

  const updateSchedule = () => {
    showSuccess("Schedule Updated", "Staff schedule has been updated.");
  };

  // Bed Actions
  const assignBed = () => {
    showSuccess("Bed Assigned", "Bed has been assigned to patient.");
  };

  const dischargeBed = () => {
    showSuccess("Bed Released", "Bed has been released and is now available.");
  };

  // Report Actions
  const exportReport = (reportType: string) => {
    showInfo("Exporting Report", `${reportType} is being exported...`);
  };

  const downloadReport = () => {
    showInfo("Downloading Report", "Report is being downloaded...");
  };

  return {
    showSuccess,
    showError,
    showInfo,
    registerPatient,
    updatePatient,
    dischargePatient,
    scheduleAppointment,
    confirmAppointment,
    cancelAppointment,
    rescheduleAppointment,
    registerEmergency,
    startTreatment,
    updateVitals,
    scheduleSurgery,
    startPreOp,
    moveToOR,
    completeSurgery,
    orderTest,
    collectSample,
    enterResults,
    addMedicine,
    reorderMedicine,
    generateInvoice,
    processPayment,
    downloadInvoice,
    requestBlood,
    crossMatch,
    issueBlood,
    scheduleMaintenance,
    markOperational,
    orderStudy,
    startStudy,
    addReport,
    submitClaim,
    appealClaim,
    addStaff,
    updateSchedule,
    assignBed,
    dischargeBed,
    exportReport,
    downloadReport,
  };
}
