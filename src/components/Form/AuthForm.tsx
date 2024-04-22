import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import { useAuth } from 'src/providers/AuthProvider/AuthProvider';
export interface LoginForm {
  email: string;
  password: string;
}
export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
}
interface LoginFormProps {
  formType: 'login' | 'register';
  initialValues: LoginForm | RegisterForm;
  validationSchema: any;
  handleSubmit: (values: LoginForm | RegisterForm) => void;
  loading: boolean;
}

const AuthForm: React.FC<LoginFormProps> = ({ formType, initialValues, validationSchema, handleSubmit, loading }) => {
  const { error } = useAuth();
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {(formik) => (
        <Form id="authForm" onSubmit={formik.handleSubmit}>
          <Form.Label className="mt-2">Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            placeholder="Enter your email address"
          />
          {formik.errors.email && <div className="error-message">{formik.errors.email}</div>}
          <Form.Label className="mt-2">Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            placeholder="Enter your password"
          />
          {formik.errors.password && <div className="error-message">{formik.errors.password}</div>}
          {formType === 'register' && (
            <>
              <Form.Label className="mt-2">Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={(formik.values as RegisterForm).confirmPassword}
                onChange={formik.handleChange}
                placeholder="Confirm your password"
              />
              {(formik.errors as RegisterForm).confirmPassword && (
                <div className="error-message">{(formik.errors as RegisterForm).confirmPassword}</div>
              )}
            </>
          )}
          {error && <div className="mt-2 error-message">{error.message}</div>}

          <Button className="mt-4 w-100" type="submit" form="authForm" disabled={loading}>
            {formType === 'login' ? 'Login' : 'Register'}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default AuthForm;
