"use client"
import React, { useState, useEffect } from 'react';

interface UserData {
  _id: string;
  username: string;
  password: string;
  role?: boolean;
}

function Home() {
  const [data, setData] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<{ username: string } | null>(null);
  const [masterPassword, setMasterPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    fetch('/api/username')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleUpdateRole = (username: string) => {
    setSelectedUser({ username });
  };

  const handleMasterPasswordSubmit = async (username: string) => {
    if (masterPassword === 'geneva') {
      try {
        const response = await fetch(`/api/updaterole?username=${username}`, {
          method: 'POST',
        });
        if (response.ok) {
          const updatedData = data.map(item =>
            item.username === username ? { ...item, role: true } : item
          );
          setData(updatedData);
          setMasterPassword('');
          setSelectedUser(null);
        } else {
          console.error('Failed to update role:', response.statusText);
        }
      } catch (error) {
        console.error('Error updating role:', error);
      }
    } else {
      alert('Incorrect master password');
    }
  };

  const handleCreateAdmin = async () => {
    if (newUsername.trim() === '' || newPassword.trim() === '') {
      alert('Username and password cannot be empty');
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: newUsername, password: newPassword }),
      });
      if (response.ok) {
        setData([...data, { _id: '', username: newUsername, password: newPassword, role: false }]);
        setNewUsername('');
        setNewPassword('');
      } else {
        console.error('Failed to create admin:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating admin:', error);
    }
  };

  return (
    <div>
      <h1>List of Admin Data</h1>
      <div>
        <label>
          New Admin Username:
          <input
            type="text"
            value={newUsername}
            onChange={e => setNewUsername(e.target.value)}
            style={{ color: 'black', padding: '5px', borderRadius: '3px', border: '1px solid #ccc', outline: 'none' }}
          />
        </label>
        <label>
          New Admin Password:
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            style={{ color: 'black', padding: '5px', borderRadius: '3px', border: '1px solid #ccc', outline: 'none' }}
          />
        </label>
        <button onClick={handleCreateAdmin}>Create Admin</button>
      </div>
      {data.length > 0 ? (
        <ul>
          {data.map((item, index) => (
            <li key={index}>
              Username: {item.username}, Role: {item.role !== undefined ? item.role.toString() : 'Not specified'}
              <button
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  marginLeft: '10px',
                }}
                onClick={() => handleUpdateRole(item.username)}
              >
                Update {item.username}'s role to admin
              </button>
              {selectedUser && selectedUser.username === item.username && (
                <div>
                  <input
                    type="password"
                    placeholder="Enter master password"
                    style={{ color: 'black' }}
                    value={masterPassword}
                    onChange={e => setMasterPassword(e.target.value)}
                  />
                  <button onClick={() => handleMasterPasswordSubmit(item.username)}>Submit</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No data found</p>
      )}
    </div>
  );
}

export default Home;
