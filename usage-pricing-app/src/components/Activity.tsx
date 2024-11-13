import { useState } from 'react';
import { Button, Typography, Box } from '@mui/material';
import { Event } from '../types';
import { apiHost, useAuth } from '../contexts/AuthContext';

const Activity: React.FC = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const { token } = useAuth();

  const triggerEvent = async (): Promise<void> => {
    try {
      const response = await fetch(`${apiHost}:8000/event`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to send event');
      }
      
      const data = await response.json();
      setEvent(data);
    } catch (error) {
      console.error('Error sending event:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Activity Page
      </Typography>
      <Typography variant="h6" gutterBottom>
        Pay $10 / month for the first 45 events, and $0.30 for each additional event.
      </Typography>
      <Button variant="contained" onClick={triggerEvent}>
        Trigger Event
      </Button>
      <Box sx={{ mt: 2 }}>
        {event && (
          <Typography>
            Time of execution: {event.execution_time}<br/>
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Activity;