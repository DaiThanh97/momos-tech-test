import {
  Button,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Box,
  useTheme,
  CircularProgress,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import { LOGIN_SAGA } from "../../store/sagas/userSaga";
import AuthLayout from "../../layouts/AuthLayout";
import {
  getGradientBackground,
  getGradientBackgroundHover,
} from "../../utils/styles";

const validationSchema = yup.object({
  username: yup
    .string()
    .min(4, "Username must be between 4 and 20 characters")
    .max(20, "Username must be between 4 and 20 characters")
    .matches(/^\S+$/, "Username must not have whitespace")
    .required("Username is required"),
  password: yup
    .string()
    .min(6, "Password must be between 6 and 18 characters")
    .max(18, "Password must be between 6 and 18 characters")
    .required("Password is required"),
});

const SignIn = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loadingLogin } = useAppSelector((state) => state.loading);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      remember: false,
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch({
        type: LOGIN_SAGA,
        payload: {
          username: values.username,
          password: values.password,
          navigate,
        },
      });
    },
  });

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to continue scraping media"
    >
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{ width: "100%" }}
      >
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={formik.values.username}
          onChange={formik.handleChange}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />

        <FormControlLabel
          control={
            <Checkbox
              name="remember"
              checked={formik.values.remember}
              onChange={formik.handleChange}
              sx={{
                color: theme.palette.primary.main,
                "&.Mui-checked": {
                  color: theme.palette.primary.main,
                },
              }}
            />
          }
          label="Remember me"
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loadingLogin}
          startIcon={
            loadingLogin ? <CircularProgress size={20} /> : <LoginIcon />
          }
          sx={{
            mt: 3,
            mb: 2,
            py: 1.5,
            ...getGradientBackground(theme),
            "&:hover": getGradientBackgroundHover(theme),
          }}
        >
          {loadingLogin ? "Signing In..." : "Sign In"}
        </Button>

        <Box sx={{ textAlign: "center" }}>
          <Link
            component={RouterLink}
            to="/sign-up"
            variant="body2"
            sx={{
              color: theme.palette.primary.main,
              textDecoration: "none",
              fontWeight: 600,
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            Don't have an account? Sign Up
          </Link>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default SignIn;
