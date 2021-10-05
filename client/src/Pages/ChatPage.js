import React, {useEffect, useState} from 'react';
import {io} from 'socket.io-client';

let socket;

function ChatPage({
  location: {
    state: {name, room},
  },
  history,
}) {
  const [typing, setTyping] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const END_POINT = 'https://desolate-basin-86208.herokuapp.com';
  useEffect(
    function () {
      socket = io(END_POINT);
      socket.emit('details', {name, room});
      return function () {
        socket.disconnect();
      };
    },
    [END_POINT, name, room]
  );
  useEffect(
    function () {
      if (message.length > 0) {
        socket.emit('typing', {name, room, message: name + ' is typing ...'});
      } else {
        socket.emit('typing', {name, room, message: ''});
      }
    },
    [message.length]
  );
  useEffect(function () {
    socket.on('typing', function ({message}) {
      setTyping(message);
    });
  }, []);
  useEffect(function () {
    socket.on('details', function ({name, room, condition}) {
      if (condition) {
        socket.emit('welcome', {message: 'Welcome', room, name});
      } else {
        alert('Please Take another name!');
        history.push('/');
      }
    });
  }, []);
  useEffect(
    function () {
      socket.on('join user', function ({name, message}) {
        setMessages([...messages, {name, message}]);
      });
    },
    [messages]
  );
  useEffect(
    function () {
      socket.on('welcome', function ({message, name}) {
        setMessages([...messages, {name, message}]);
      });
    },
    [messages]
  );
  useEffect(
    function () {
      socket.on('message', function ({name, message}) {
        setMessages([...messages, {name, message}]);
      });
    },
    [messages]
  );
  useEffect(
    function () {
      socket.on('left user', function ({name, message}) {
        setMessages([...messages, {name, message}]);
      });
    },
    [messages]
  );
  function onMessageChange(e) {
    setMessage(e.target.value);
  }
  function onHandleChange(e) {
    e.preventDefault();
    socket.emit('message', {name, room, message});
    setMessage('');
  }
  return (
    <div className="container d-flex justify-content-center my-3">
      <div className="card shadow">
        <form onSubmit={onHandleChange}>
          <div className="card-header text-center text-secondary">
            <h5 className="card-title">Let's Chat!</h5>
          </div>
          <div
            className="card-body"
            style={{height: '500px', overflowY: 'scroll'}}
          >
            {messages.length > 0 &&
              messages.map(function (item) {
                return item.name === name ? (
                  <div className="d-flex justify-content-end">
                    <div className="bg-primary m-2 p-2 text-white rounded shadow">
                      <blockquote class="blockquote">
                        <p class="mb-0 text-white">{item.message}</p>
                        <footer class="blockquote-footer text-dark">You</footer>
                      </blockquote>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex justify-content-start">
                    <div className="bg-primary m-2 p-2 text-white rounded shadow">
                      <blockquote class="blockquote">
                        <p class="mb-0 text-white">{item.message}</p>
                        <footer class="blockquote-footer text-dark">
                          {item.name}
                        </footer>
                      </blockquote>
                    </div>
                  </div>
                );
              })}
            <div className="bg-white text-secondary mt-2 text-center">
              {typing.length > 0 && typing}
            </div>
          </div>
          <div className="card-footer">
            <div className="input-group">
              <input
                className="form-control"
                required
                onChange={onMessageChange}
                value={message}
                type="text"
                placeholder="Type Message ..."
              />
              <div className="input-group-append">
                <button className="btn btn-primary" type="submit">
                  Send
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatPage;
