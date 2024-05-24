import axios from 'axios';
import React, { useState, useEffect } from 'react';

import styled from '@emotion/styled';

// Styled components for UI elements
const Table = styled.table(() => ({
  width: '100%',
  borderCollapse: 'collapse',

  th: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
    backgroundColor: '#f2f2f2',
    cursor: 'pointer',
  },

  td: {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
  },

  '.sort-icon': {
    verticalAlign: 'middle',
    marginLeft: '5px',
  },
}));

// Data for table columns
const columnFields = [
  { value: 'id', label: 'Id' },
  { value: 'name', label: 'Name', enableSearch: true },
  { value: 'email', label: 'Email', enableSearch: true },
  { value: 'username', label: 'Username' },
  { value: 'phone', label: 'Phone' },
  { value: 'website', label: 'Website' },
];

// Custom hook for managing user data
const useUserData = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [sortColumn, setSortColumn] = useState(columnFields[0].value);
  const [sortDirection, setSortDirection] = useState('asc');

  // Fetch user data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/v1/users');
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, []);

  // Filter and sort user data based on search criteria and sort options
  useEffect(() => {
    let filteredUsers = users.filter(
      user =>
        user.name.toLowerCase().includes(searchName.toLowerCase()) &&
        user.email.toLowerCase().includes(searchEmail.toLowerCase())
    );

    if (sortColumn) {
      filteredUsers.sort((a, b) => {
        const x = a[sortColumn];
        const y = b[sortColumn];
        if (x < y) return sortDirection === 'asc' ? -1 : 1;
        if (x > y) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredUsers(filteredUsers);
  }, [searchName, searchEmail, users, sortColumn, sortDirection]);

  // Handle search input change
  const handleOnSearch = event => {
    const { name, value } = event.target;

    if (name === 'name') {
      setSearchName(value);
    } else if (name === 'email') {
      setSearchEmail(value);
    } else {
      throw new Error('Unknown search element');
    }
  };

  // Handle column header click for sorting
  const handleSort = column => {
    if (sortColumn === column) {
      setSortDirection(prevDirection => (prevDirection === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return {
    users: filteredUsers,
    columnFields,
    handleOnSearch,
    handleSort,
    sortColumn,
    sortDirection,
  };
};

// Component for displaying user list table
const UserList = () => {
  const {
    users,
    columnFields,
    handleOnSearch,
    handleSort,
    sortColumn,
    sortDirection,
  } = useUserData();

  return (
    <div>
      <Table>
        <thead>
          <tr>
            {columnFields.map(field => (
              <th key={field.value}>
                <div onClick={() => handleSort(field.value)} style={{ paddingBottom: 8 }}>
                  {field.label}
                  {sortColumn === field.value && (
                    <span className={'sort-icon'}>{sortDirection === 'asc' ? '▲' : '▼'}</span>
                  )}
                </div>
                {field.enableSearch && (
                  <input
                    type={'text'}
                    placeholder={`Search by ${field.label}`}
                    name={field.value}
                    onChange={handleOnSearch}
                    style={{ padding: 6, width: 200 }}
                  />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              {columnFields.map(field => (
                <td key={field.value}>{user[field.value]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
      <div></div>
    </div>
  );
};

export default UserList;