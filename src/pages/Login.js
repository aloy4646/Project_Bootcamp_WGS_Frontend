import React, { useState } from 'react';
import Box from '@mui/material/Box';
// import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

// Dummy Logo component
// const Logo = (props) => <div style={{ fontSize: 24, fontWeight: 'bold' }}>Logo</div>;

// Dummy bgGradient function
const bgGradient = ({ color, imgUrl }) => ({
  backgroundImage: `url(${imgUrl})`,
  backgroundColor: color,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});

export default function LoginView() {
  const theme = useTheme()

  const [showPassword, setShowPassword] = useState(false);

  const handleClick = () => {
    // Handle login logic here
    console.log('Logging in...');
  };

  const renderForm = (
    <>
      <Stack spacing={3}>
        <TextField name="email" label="Email address" />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? '🙈' : '👁️'}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Divider sx={{ my: 2 }} />

      {/* <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ my: 3 }}>
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack> */}

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        color="primary"
        onClick={handleClick}
      >
        Login
      </Button>
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      /> */}

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1, mt: -30 }}>
        <Card
          sx={{
            p: 5,
            width: '100%',
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Sign In</Typography>
          <Divider sx={{ my: 2 }} />

          {/* <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
            Don’t have an account?
            <Link variant="subtitle2" sx={{ ml: 0.5 }}>
              Get started
            </Link>
          </Typography>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              OR
            </Typography>
          </Divider> */}

          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
