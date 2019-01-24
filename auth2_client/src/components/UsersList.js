import React from 'react';

const UserList = ({ users }) => {
	console.log(users);
	return (
		<div className="userlist">
			{users.users &&
				users.users.map(user => (
					<div className="user" key={user.id}>
						<h4>{user.username}</h4>
						<p>{user.departments}</p>
					</div>
				))}
		</div>
	);
};

export default UserList;
