import React, {useEffect, useState} from 'react';

function JoinPage({history}) {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  function onNameChange(e) {
    setName(e.target.value);
  }
  function onRoomChange(e) {
    setRoom(e.target.value);
  }
  function onHandleChange(e) {
    e.preventDefault();
    history.push('/chat', {name, room});
  }
  return (
    <div className="container d-flex justify-content-center mt-4">
      <form onSubmit={onHandleChange}>
        <div className="card shadow">
          <div className="card-header text-center text-secondary">
            <h5 className="card-title">Chat App!</h5>
          </div>
          <div className="card-body">
            <div className="form-group">
              <input
                className="form-control"
                placeholder="Your name"
                type="text"
                value={name}
                onChange={onNameChange}
                required
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                placeholder="Room name"
                type="text"
                value={room}
                onChange={onRoomChange}
                required
              />
            </div>
            <div className="form-group">
              <button
                className="btn btn-primary btn-block text-center"
                type="submit"
              >
                Enter to Room
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default JoinPage;
