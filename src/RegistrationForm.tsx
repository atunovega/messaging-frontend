import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface RegistrationFormProps {
  // handleRegistration: (username: string, password: string) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = () => {
  const registerPath = import.meta.env.VITE_API_URL_BASE + import.meta.env.VITE_API_URL_REGISTER_PATH
  const navigate = useNavigate();
  const onFinish = async (values: any) => {
    const result = await axios({
      method: "POST",
      data: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: false,
      url: registerPath,
    });
    if (result.data?.status == "success") {
      toast.success(result.data?.message)
      navigate("/login")
    } else {
      toast.error(result?.data?.message ?? "ERROR")
    }
  };

  return (
    <div className="registration-form-container">
      <Title level={2}>Register</Title>
      <Form
        name="registration-form"
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
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegistrationForm;
