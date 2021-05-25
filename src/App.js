import './App.css';

function App() {
  return (
    <div className="App">
      <h1>CRUD</h1>
      <div>
        <label>Name: </label>
        <input type="text" name="name" />
        <label>Email: </label>
        <input type="text" name="email" />
        <label>Password: </label>
        <input type="text" name="passw" />

        <button>Submit</button>
      </div>
      

    </div>
  );
}

export default App;
