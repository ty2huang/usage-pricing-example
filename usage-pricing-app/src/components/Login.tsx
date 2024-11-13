import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, TextField, Button, Typography, Container } from '@mui/material';
import { Credentials } from '../types';

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<Credentials>({ username: '', password: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (await login(credentials)) {
      navigate('/activity');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: 'background.paper'
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Username"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            autoComplete="off"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            autoComplete="new-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;