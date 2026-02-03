import axios from '../api/axios';

const getAvailability = async () => {
    const response = await axios.get('/agent/availability');
    return response.data;
};

const addAvailability = async (slotData) => {
    const response = await axios.post('/agent/availability', slotData);
    return response.data;
};

// ✅ NEW: Delete function
const deleteSlot = async (slotId) => {
    const response = await axios.delete(`/agent/availability/${slotId}`);
    return response.data;
};

export default { getAvailability, addAvailability, deleteSlot };    