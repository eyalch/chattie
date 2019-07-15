import React from 'react'
import styled from 'styled-components'

const StyledUsers = styled.div``
const StyledUser = styled.div<{ active: boolean }>`
  width: 100%;
  height: 64px;
  padding-left: ${p => (p.active ? 36 : 20)}px;
  padding-right: 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: #fff;
  transition: all 0.2s;

  :hover {
    background-color: #f4f5f5;
  }

  :not(:first-child) {
    border-top: 1px solid lightgrey;
  }

  .username {
    font-size: 18px;
    font-weight: ${p => (p.active ? 'bold' : 'normal')};
  }
`
const StyledNoUsers = styled.p`
  text-align: center;
  font-weight: bold;
  font-size: 18px;
`

interface Props {
  users: string[]
  activeUser: string
  onSelectUser(selectedUser: string): void
}

const Users = ({ users, activeUser, onSelectUser }: Props) => {
  return (
    <StyledUsers>
      {users.length > 0 ? (
        users.map(user => (
          <StyledUser
            key={user}
            active={user === activeUser}
            onClick={() => onSelectUser(user)}>
            <span className="username">{user}</span>
          </StyledUser>
        ))
      ) : (
        <StyledNoUsers>No active users</StyledNoUsers>
      )}
    </StyledUsers>
  )
}

export default Users
