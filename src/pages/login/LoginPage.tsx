import { Modal, Nav } from 'react-bootstrap';
import * as yup from 'yup';
import './LoginPage.css';
import { useAuth } from 'src/providers/AuthProvider/AuthProvider';
import AuthForm, { LoginForm } from 'src/components/Form/AuthForm';

const LoginPage = () => {
  const { login, loading } = useAuth();
  const initialValues: LoginForm = {
    email: '',
    password: '',
  };

  const validationSchema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().required(),
  });

  const handleSubmit = (values: LoginForm) => {
    login(values.email, values.password);
  };

  return (
    <div className="login-wrapper">
      <Modal show centered backdrop={false}>
        <Modal.Header>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AuthForm
            formType="login"
            initialValues={initialValues}
            validationSchema={validationSchema}
            handleSubmit={handleSubmit}
            loading={loading}
          ></AuthForm>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          Not a member?
          <Nav.Link className="register-link" href="/register">
            Register
          </Nav.Link>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LoginPage;
