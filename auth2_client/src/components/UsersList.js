import React, { Component } from "react";
import axios from "axios";

const UserList = ({ users }) => {
  return (
    <div className="userlist">
      {users &&
        users.map(user => (
          <div className="user" key={user.id}>
            <p>{user.username}</p>
          </div>
        ))}
    </div>
  );
};

export default UserList;
