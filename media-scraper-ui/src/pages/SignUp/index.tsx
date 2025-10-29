import {
  Button,
  TextField,
  Link,
  Box,
  useTheme,
  CircularProgress,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import { SIGNUP_SAGA } from "../../store/sagas/userSaga";
import AuthLayout from "../../layouts/AuthLayout";
import {
  getGradientBackground,
  getGradientBackgroundHover,
} from "../../utils/styles";

const validationSchema = yup.object({
  name: yup
    .string()
    .min(4, "Name must be between 4 and 20 characters")
    .max(20, "Name must be between 4 and 20 characters")
    .required("Name is required"),
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
  rePassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
});

const SignUp = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loadingSignUp } = useAppSelector((state) => state.loading);

  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      password: "",
      rePassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch({
        type: SIGNUP_SAGA,
        payload: {
          name: values.name,
          username: values.username,
          password: values.password,
          rePassword: values.rePassword,
          navigate,
        },
      });
    },
  });

  return (
    <AuthLayout
      title="Join ScrapeMedia"
      subtitle="Create an account to start sharing"
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
          id="name"
          label="Full Name"
          name="name"
          autoComplete="name"
          autoFocus
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          autoComplete="username"
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
          autoComplete="new-password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          name="rePassword"
          label="Confirm Password"
          type="password"
          id="rePassword"
          autoComplete="new-password"
          value={formik.values.rePassword}
          onChange={formik.handleChange}
          error={formik.touched.rePassword && Boolean(formik.errors.rePassword)}
          helperText={formik.touched.rePassword && formik.errors.rePassword}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={loadingSignUp}
          startIcon={
            loadingSignUp ? <CircularProgress size={20} /> : <PersonAddIcon />
          }
          sx={{
            mt: 3,
            mb: 2,
            py: 1.5,
            ...getGradientBackground(theme),
            "&:hover": getGradientBackgroundHover(theme),
          }}
        >
          {loadingSignUp ? "Creating Account..." : "Sign Up"}
        </Button>

        <Box sx={{ textAlign: "center" }}>
          <Link
            component={RouterLink}
            to="/sign-in"
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
            Already have an account? Sign In
          </Link>
        </Box>
      </Box>
    </AuthLayout>
  );
};

export default SignUp;
