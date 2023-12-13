import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Row, Col, Input, Button, List, Avatar } from 'antd';
import "./ChatWindow.css"
import axios from 'axios';
import toast from 'react-hot-toast';
interface User {
  username: string;
}

const ChatWindow: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [users, setUsers] = useState([])

  const token = localStorage.getItem("token")
  const userName = localStorage.getItem("username")

  const fetchUser = async () => {
    try {
      const userList = await axios.get(import.meta.env.VITE_API_URL_BASE + "/users", { headers: { Authorization: `Bearer ${token}` } }); // Reemplaza con tu URL de API
      setUsers(userList.data?.users ?? []); // Actualiza el estado con los datos recibidos
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const fetchMessages = async (username: string) => {
    try {
      const messagesList = await axios.get(`${import.meta.env.VITE_API_URL_BASE}/messages/${username}`, { headers: { Authorization: `Bearer ${token}` } }); // Reemplaza con tu URL de API
      setMessages(messagesList.data?.messages ?? []); // Actualiza el estado con los datos recibidos
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {

    if (selectedUser?.username) {
      fetchMessages(selectedUser?.username)
      localStorage.setItem("selectedUser", selectedUser?.username)
    }
  }, [selectedUser])

  const fetchData = async () => {
    await fetchUser()
  };
  useEffect(() => {

    fetchData();

    // Establecer la conexión con el servidor WebSocket
    const socket = io(import.meta.env.VITE_API_URL_BASE, { auth: { token } });

    // Escuchar eventos desde el servidor
    socket.on('connect', () => {
      console.log('Conectado al servidor WebSocket');
    });

    //escuchamos nuevos mensajes dirijidos al usuario
    socket.on('new-message', (data: any) => {
      if (data.sender == localStorage.getItem("selectedUser")) {
        setMessages(messages => [...messages, { receiver: userName, message: data.message, sender: data.sender }] as never[]);
      }
      if (data.sender) {
        toast.success("You have a new message from" + data.sender)
      }
    });

    return () => {
      // Cerrar la conexión al desmontar el componente
      socket.disconnect();
    };
  }, []);



  const sendMessagePost = async (messageData: { message: string, receiver: string }) => {
    const result = await axios.post(import.meta.env.VITE_API_URL_BASE + "/send-message", messageData, { headers: { Authorization: `Bearer ${token}` } }); // Reemplaza con tu URL de API
    return result
  }

  const sendMessage = async () => {
    // Aquí puedes implementar la lógica para enviar mensajes al backend
    // Por ahora, se simula el envío de mensajes añadiendo un mensaje nuevo a la lista de mensajes
    const result = await sendMessagePost({ receiver: selectedUser?.username!, message: inputValue })
    if (result.data.status == "success") {
      setMessages(messages => [...messages, { receiver: selectedUser?.username!, message: inputValue, sender: userName }] as never[]);
      setInputValue('');
    }
  };

  return (
    <div className="chat-window-wrapper">
      <Row className="chat-window-container" gutter={[300, 300]}>
        <Col span={12}>
          <List
            dataSource={users}
            renderItem={(user: User) => (
              <List.Item
                className={selectedUser?.username === user.username ? 'user-list-item selected' : 'user-list-item'}
                onClick={() => setSelectedUser(user)}
              >
                <List.Item.Meta
                  avatar={<Avatar>{user?.username?.charAt(0)}</Avatar>}
                  title={user.username}
                />
              </List.Item>
            )}
          />
        </Col>
        <Col span={12}>
          {selectedUser ? (
            <div className="chat-container">
              <List
                className="message-list"
                itemLayout="horizontal"
                dataSource={messages}
                renderItem={(item: any) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar>{item.sender.charAt(0)}</Avatar>}
                      title={item.sender}
                      description={item.message}
                    />
                  </List.Item>
                )}
              />
              <div className="input-container">
                <Input
                  placeholder="Type your message..."
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                />
                <Button type="primary" onClick={sendMessage}>
                  Send
                </Button>
              </div>
            </div>
          ) : (
            <div className="no-user-selected">Select a user to start chatting</div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ChatWindow;

