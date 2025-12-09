const generateToken = (department, count) => {
  const deptCode = department.substring(0, 3).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  const counter = count.toString().padStart(3, '0');
  return `${deptCode}-${timestamp}-${counter}`;
};

const formatPhoneNumber = (phone) => {
  return phone.replace(/\D/g, '');
};

const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getStartOfDay = () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return start;
};

const getEndOfDay = () => {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return end;
};

module.exports = {
  generateToken,
  formatPhoneNumber,
  calculateAge,
  formatTime,
  formatDate,
  getStartOfDay,
  getEndOfDay
};
