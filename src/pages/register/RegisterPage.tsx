import React from 'react';
import { Modal } from 'react-bootstrap';
import AuthForm, { LoginForm, RegisterForm } from 'src/components/Form/AuthForm';
import { useAuth } from 'src/providers/AuthProvider/AuthProvider';
import * as yup from 'yup';

const RegisterPage = () => {
  const { register } = useAuth();
  const initialValues: RegisterForm = {
    email: '',
    password: '',
    confirmPassword: '',
  };
  const validationSchema = yup.object({
    email: yup.string().email().required(),
    password: yup
      .string()
      .required()
      .min(8)
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: yup
      .string()
      .required()
      .nullable()
      .oneOf([yup.ref('password'), null], 'Passwords must match'),
  });

  const handleSubmit = (values: RegisterForm) => {
    register(values.email, values.password);
  };
  return (
    <div className="login-wrapper">
      <Modal show centered backdrop={false}>
        <Modal.Header>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AuthForm
            formType="register"
            initialValues={initialValues}
            validationSchema={validationSchema}
            handleSubmit={(values: RegisterForm | LoginForm) => handleSubmit(values as RegisterForm)}
            loading={false}
          ></AuthForm>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RegisterPage;
