import { useState, useRef } from 'react';


const useSearch = (itemsList,itemFilterFun) => {
  const [initialLoad, setInitialLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const searchItemsRef = useRef();
  const [items, setItems] = useState(itemsList);
  const [searchItems, setSearchItems] = useState([]);

  const submitSearchItemHandler = async () => {

    setInitialLoad(true);
    setIsLoading(true);    
    const searchedItem = searchItemsRef.current.value;

    if(searchedItem.trim() === ""){
      setIsLoading(false);
      return ;
    }
    
    const filteredItem = await itemFilterFun(searchedItem)
    setSearchItems((state) => [...filteredItem]);
    setIsLoading(false);
  };

  const onLoadRestart = () => {
    setInitialLoad(false);
  }

  const addMembersHandler = (memberData) => {
    const filteredSearchMembers = searchItems.filter(
      (item) => item._id !== memberData._id
    );
    setItems((state) => [
      ...state,
      {
        _id: memberData._id,
        acronym: memberData.username
          .toUpperCase()
          .match(/\b(\w)/g)
          .slice(0, 2),
        color: memberData.color,
        name: memberData.username,
        status: "sent",
        statusColor: "yellow",
      },
    ]);
    setSearchItems([...filteredSearchMembers]);
  };

  const onDeleteMembersHandler = (id) => {
    setItems((state) => state.filter((item) => item._id !== id));
  };


  return {
    initialLoad,
    isLoading,
    items,
    searchItems,
    searchItemsRef,
    onLoadRestart,
    submitItem: submitSearchItemHandler,
    addItems: addMembersHandler,
    onDeleteItems: onDeleteMembersHandler
  }
}

export default useSearch;