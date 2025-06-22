// App.js
import React, { useState } from "react";

// Main App component
const App = () => {
  const [isTrackingEnabled, setTrackingEnabled] = useState(false);
  const [channels, setChannels] = useState([]);
  const [newChannel, setNewChannel] = useState("");

  // Handle enabling/disabling tracker
  const toggleTracking = () => {
    setTrackingEnabled(!isTrackingEnabled);
  };

  // Handle adding a channel
  const addChannel = () => {
    if (newChannel.trim() && !channels.includes(newChannel)) {
      setChannels([...channels, newChannel]);
      setNewChannel("");
    }
  };

  // Handle removing a channel
  const removeChannel = (channel) => {
    setChannels(channels.filter((ch) => ch !== channel));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>YouTube Tracker Settings</h1>

      {/* Tracker toggle */}
      <div style={styles.section}>
        <label style={styles.label}>
          <input
            type="checkbox"
            checked={isTrackingEnabled}
            onChange={toggleTracking}
          />
          Enable Tracker
        </label>
      </div>

      {/* Channel input */}
      <div style={styles.section}>
        <h2 style={styles.subHeader}>Add Channel to Whitelist</h2>
        <input
          type="text"
          value={newChannel}
          onChange={(e) => setNewChannel(e.target.value)}
          placeholder="Enter YouTube Channel"
          style={styles.input}
        />
        <button onClick={addChannel} style={styles.button}>
          Add Channel
        </button>
      </div>

      {/* Channel list */}
      <div style={styles.section}>
        <h3 style={styles.subHeader}>Whitelisted Channels</h3>
        <ul style={styles.channelList}>
          {channels.map((channel, index) => (
            <li key={index} style={styles.channelItem}>
              {channel}
              <button
                onClick={() => removeChannel(channel)}
                style={styles.removeButton}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Basic styles for the page
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  header: {
    fontSize: "24px",
    color: "#333",
  },
  section: {
    marginBottom: "20px",
  },
  label: {
    fontSize: "18px",
    color: "#555",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    marginRight: "10px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  subHeader: {
    fontSize: "20px",
    color: "#444",
  },
  channelList: {
    listStyle: "none",
    paddingLeft: 0,
  },
  channelItem: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  removeButton: {
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    padding: "5px 10px",
    cursor: "pointer",
  },
};

export default App;

