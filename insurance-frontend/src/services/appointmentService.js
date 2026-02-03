import axios from '../api/axios'; // Use your existing axios instance

const bookAppointment = (bookingData) => {
    return axios.post('/appointments/book', bookingData);
};

const getAgentAvailability = (agentId) => {
    return axios.get(`/agent/${agentId}/availability`);
}

export default { bookAppointment, getAgentAvailability };