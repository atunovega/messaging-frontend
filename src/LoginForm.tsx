import { Form, Input, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PUBLIC_ROUTES } from './Routes';
import { startTransition } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const { Title } = Typography;

const LoginForm = () => {
  const navigate = useNavigate();
  const onFinish = async (values: { username: string, password: string }) => {
    const result = await axios({
      method: "POST",
      data: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: false,
      url: import.meta.env.VITE_API_URL_BASE + import.meta.env.VITE_API_URL_AUTH_PATH,
    });
    if (result.data.status == "error") {
      toast.error(result.data.message)
    }
    if (result.data?.status == "success") {
      toast.success("WELCOME" + " " + result.data.username)
      localStorage.setItem("token", result.data.token);
      localStorage.setItem("username", result.data.username);
      navigate("/chat-window")
    }
  };

  const goToRegistration = () => {
    startTransition(() => {
      navigate("/" + PUBLIC_ROUTES.REGISTER)
    })
  }

  return (
    <div className="login-form-container">
      <Title level={2}>Login</Title>
      <Form
        name="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
          <Button type="link" onClick={goToRegistration}>
            sign up
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginForm;
