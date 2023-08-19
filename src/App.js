import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const url = "https://express-mongodb-gamma.vercel.app";

const App = () => {
  const [listsItems, setListsItems] = useState([]);
  const [list, setList] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(url + "/createList", {
        name: list,
      });

      if (response.status === 201) {
        console.log("success create list");
        // Update the lists state to include the newly added list
        setListsItems([...listsItems, { _id: response.data._id, name: list }]);
        // Clear the input field after adding the list
        setList("");
      } else {
        console.error("failed to create list");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggle = async (clickedList) => {
    try {
      const updateList = listsItems.map((list) =>
        list._id === clickedList._id
          ? { ...list, checked: !list.checked }
          : list
      );

      setListsItems(updateList);

      await axios.put(url + `/updateList/${clickedList._id}`, {
        checked: !clickedList.checked,
      });

    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (event, listId) => {
    event.stopPropagation();
    try {
      await axios.delete(url + `/deleteList/${listId}`);
      setListsItems(listsItems.filter((list) => list._id !== listId));
      console.log("success delete list");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    axios
      .get(url + "/List")
      .then((respone) => {
        setListsItems(respone.data);
      })
      .catch((error) => {
        console.error("error to create list, please write something ", error);
      });
  }, []);

  return (
    <div className="wrapper">
      <div className="todo">
  <h1>my todo list</h1>
  <ul id="myUl" className={listsItems.length === 0 ? "skeleton-con" : ""}>
    {listsItems.length === 0 ? (
      // Render skeleton items
      <>
        <li className="skeleton"></li>
        <li className="skeleton"></li>
        <li className="skeleton"></li>
        <li className="skeleton"></li>
      </>
    ) : (
      // Render actual todo items
      listsItems.map((list) => (
        <li
          key={list._id}
          className={`${list.checked ? "checked" : ""}`}
          onClick={() => handleToggle(list)}
        >
          {list.name}
          <span
            className="close"
            onClick={(event) => handleDelete(event, list._id)}
          >
            X
          </span>
        </li>
      ))
    )}
  </ul>
</div>

      <form className="submit" onSubmit={handleSubmit}>
        <input
          type="text"
          id="input"
          placeholder="tambahkan..."
          value={list}
          onChange={(event) => setList(event.target.value)}
        ></input>
        <button className="btn" id="addBtn">
          Add
        </button>
      </form>
    </div>
  );
};

export default App;
