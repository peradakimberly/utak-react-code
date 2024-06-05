import { useState, useEffect } from 'react';
import './App.css';
import { db } from './firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

function App() {
  //initial values of new items added to menu
  const [itemCategory, setItemCategory] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemSize, setItemSize] = useState("");
  const [itemPrice, setItemPrice] = useState(0);
  const [itemStock, setItemStock] = useState(0);
  const [itemSold, setItemSold] = useState(0);

  //edit values of menu items
  const [editItemCategory, setEditItemCategory] = useState("");
  const [editItemName, setEditItemName] = useState("");
  const [editItemSize, setEditItemSize] = useState("");
  const [editItemPrice, setEditItemPrice] = useState(0);
  const [editItemStock, setEditItemStock] = useState(0);
  const [editItemSold, setEditItemSold] = useState(0);


  //Access menu database
  const [menu, setMenu] = useState([]);
  const menuCollectionRef = collection(db, "menu");

  const getMenu = async () => {
    const data = await getDocs(menuCollectionRef);
    setMenu(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }; 


  //Create menu
  const createMenu = async () => {
    if (!itemCategory || !itemName || !itemPrice || !itemSold || !itemStock){
      alert("Please fill in required fields");
      return;
    }
    if (itemCategory === "Beverage" && !itemSize){
      alert("Please fill in required fields");
      return;
    }
    await addDoc(menuCollectionRef, { 
      itemCategory: itemCategory,
      itemName: itemName,
      itemSize: itemSize,
      itemPrice: Number(itemPrice),
      itemStock: Number(itemStock),
      itemSold:Number(itemSold)
    })
    getMenu();
  };


  //Edit menu
  const [showModal, setShowModal] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  const openEditModal = (id) => {
    const menuItem = menu.find(item => item.id === id);
    if (menuItem) {
      setSelectedMenuItem(menuItem);
      setEditItemCategory(menuItem.itemCategory);
      setEditItemName(menuItem.itemName);
      setEditItemSize(menuItem.itemSize);
      setEditItemPrice(menuItem.itemPrice);
      setEditItemStock(menuItem.itemStock);
      setEditItemSold(menuItem.itemSold);
      setShowModal(true);
    }
  }
  const closeEditModal = () => {
    setShowModal(false);
  }

  const editMenu = async (id) => {
    const menuDoc = doc(db, "menu", id);
    if (!editItemCategory || !editItemName || !editItemPrice || !editItemSold || !editItemStock){
      alert("Please fill in required fields");
      return;
    }
    if (editItemCategory === "Beverage" && !editItemSize){
      alert("Please fill in required fields");
      return;
    }
    await updateDoc(menuDoc, {
      itemCategory: editItemCategory,
      itemName: editItemName,
      itemSize: editItemSize,
      itemPrice: Number(editItemPrice),
      itemStock: Number(editItemStock),
      itemSold: Number(editItemSold)
    });
    getMenu();
  }

  
  //Delete menu
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteMenuItemId, setDeleteMenuItemId] = useState(null);

  const openDeleteModal = (id) => {
    setDeleteMenuItemId(id);
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setDeleteMenuItemId(null);
    setShowDeleteModal(false);
  };
  const confirmDelete = async () => {
    if (deleteMenuItemId) {
      await deleteMenu(deleteMenuItemId);
      closeDeleteModal();
    }
  };

  const deleteMenu = async (id) => {
    const menuDoc = doc(db, "menu", id);
    await deleteDoc(menuDoc);
    getMenu();
  };
  

  //Total sales summary
  const totalSales = menu.reduce((total, menuItem) => {
    return total + (menuItem.itemPrice * menuItem.itemSold);
  }, 0);

  useEffect(() => {
    getMenu();
  }, []);


  return (
    <div className='body'>
      <h1>The Secret Garden Cafe</h1>
      <div className='container'>
        <div className='summary-add-container'>
          {/* Today's menu. Menu list */}
          <div className='summary-panel'>
            <h2>For today's menu</h2>
              <ul>
                {menu.map((menuItem) => (
                  <li key={menuItem.id}>{menuItem.itemName}</li>
                ))}
              </ul>
          </div>
          {/* Add new item to menu */}
          <div className='input-panel'>
            <h2>Add new item to menu </h2>
            <div className='add-field'>
              <div>
                <label htmlFor='category'>Category </label><br />
                <input
                  type='text'
                  id='category'
                  list='categories'
                  onChange={(event) => {
                    setItemCategory(event.target.value);
                  }} 
                />
                <datalist id='categories'>
                  <option value="Appetizer" />
                  <option value="Pasta" />
                  <option value="Sandwhich" />
                  <option value="Beverage" />
                </datalist> <br />
                <label>Name </label><br />
                <input
                  type='text'
                  onChange={(event) => {
                    setItemName(event.target.value);
                  }} 
                /> <br />
                <label htmlFor='size'>Size </label><br />
                <input
                  type='text'
                  id='size'
                  list='sizes'
                  onChange={(event) => {
                    setItemSize(event.target.value);
                  }} 
                  disabled={itemCategory !== "Beverage"}
                />
                <datalist id='sizes'>
                  <option value="Regular" />
                  <option value="Large" />
                </datalist> <br />
              </div>
              <div>
                <label>Price </label><br />
                <input 
                  type='number'
                  onChange={(event) => {
                    setItemPrice(event.target.value);
                  }}
                /> <br />
                <label>Stock </label><br />
                <input 
                  type='number'
                  onChange={(event) => {
                    setItemStock(event.target.value);
                  }}
                /> <br />
                <label>Sold </label><br />
                <input 
                  type='number'
                  onChange={(event) => {
                    setItemSold(event.target.value);
                  }}
                /> <br />
              </div>
            </div>
            <button className='add-button' onClick={createMenu}>Add to Menu</button>
          </div>
        </div>      
        {/* Menu panels or records */}
        <div className='menu-panel-container'>      
            {menu.map((menuItem) => (
              <div key={menuItem.id} className='menu-panel'>
                <div>
                  <p><b>Category:</b> {menuItem.itemCategory}</p>
                  <p><b>Name:</b> {menuItem.itemName}</p>
                  <p><b>Size:</b> {menuItem.itemSize}</p>
                  <p><b>Price:</b> ₱ {menuItem.itemPrice}</p>            
                  <p><b>Stock:</b> {menuItem.itemStock}</p>
                  <p><b>Sold:</b> {menuItem.itemSold}</p>
                </div>    
                <div className='right'>
                  <div className='sale'>
                    <h4>Total Sales: <br /> 
                      <h2>₱ {menuItem.itemPrice * menuItem.itemSold}</h2>
                    </h4>
                  </div>
                  <div className='right-buttons'>
                    <button className='edit' onClick={() => openEditModal(menuItem.id)}>Edit</button>
                    <button className='delete' onClick={() => openDeleteModal(menuItem.id)}>Delete</button>
                  </div>                                
                </div>                     
              </div>
            ))}      
        </div>
        {/* Sales summary report */}
        <div className='sales-summary-container'>
          <h2>Total Sales Summary</h2>
          <div className='sales-summary'>
            <div className='sold-list'>
              <ul>
              {menu.map((menuItem) => (
                <li key={menuItem.id} style={{ display: 'flex', alignItems: 'center' }}>
                  <div>
                    <b>{menuItem.itemName}</b>
                    {menuItem.itemSize && (
                      <>
                        {" "}
                        ({menuItem.itemSize})
                      </>
                    )}
                    <br />
                    ₱ {menuItem.itemPrice} x {menuItem.itemSold} pcs 
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <h3>₱ {menuItem.itemPrice * menuItem.itemSold}</h3>
                  </div>
                </li>
              ))}
              </ul>
            </div>
            <div className='sold-total'>
              <h2>Our Total Sales:</h2>
              <h1>₱ {totalSales}</h1>
            </div>
          </div>
        </div>
      </div>
      
      <div>       
        {/* Edit modal */}
        { showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Edit menu</h2>
            <label><b>Category</b></label>
            <input
              type="text"
              value={editItemCategory}
              onChange={(e) => setEditItemCategory(e.target.value)}
            />
            <label><b>Name</b></label>
            <input
              type="text"
              value={editItemName}
              onChange={(e) => setEditItemName(e.target.value)}
            />
            <label htmlFor='size'>Size </label><br />
            <input
              type='text'
              id='size'
              list='sizes'
              onChange={(event) => {
                setEditItemSize(event.target.value);
              }}
              value={editItemSize}
              disabled={editItemCategory !== "Beverage"}
            />
            <datalist id='sizes'>
              <option value="Regular" />
              <option value="Large" />
            </datalist> <br />
            <label><b>Price</b></label>
            <input
              type="number"
              value={editItemPrice}
              onChange={(e) => setEditItemPrice(e.target.value)}
            />     
            <label><b>Stock</b></label>
            <input
              type="number"
              value={editItemStock}
              onChange={(e) => setEditItemStock(e.target.value)}
            />
            <label><b>Sold</b></label>
            <input
              type="number"
              value={editItemSold}
              onChange={(e) => setEditItemSold(e.target.value)}
            />
            <div className='modal-button'>
              <button className='cancel' onClick={closeEditModal}>Cancel</button>
              <button className='save' onClick={() => { editMenu(selectedMenuItem.id); closeEditModal(); }}>Save Changes</button>
            </div>
            </div>
          </div>
        )}
      </div>

      <div>
        {/* Delete confirmation modal */}
        { showDeleteModal && (
          <div className='modal'>
            <div className='modal-content'>
              <h2>Confirm Deletion</h2>
              <p>Are you sure you want to delete this item from the menu?</p>
              <div className='modal-button'>
                <button className='cancel' onClick={closeDeleteModal}>No</button>
                <button className='delete' onClick={confirmDelete}>Yes</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
