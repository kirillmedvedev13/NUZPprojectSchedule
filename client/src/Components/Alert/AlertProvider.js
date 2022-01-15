import { useState, useMemo } from "react";
import { AlertContext } from "./AlertContext";

function AlertProvider(props) {
  const arrayMess = [];
  const [messages, setMessage] = useState([]);

  const setMessArray = (variant, message) => {
    arrayMess.push({ variant, message });
    console.log(messages);
    setMessage(arrayMess);
  };

  const deleteFirst = () => {
    arrayMess.shift();
    console.log(messages);
    setMessage(arrayMess);
  };

  const contextValue = useMemo(
    () => ({
      messages,
      setMessage,
      deleteFirst,
    }),
    [messages, setMessage, deleteFirst]
  );
  return (
    <AlertContext.Provider value={contextValue}>
      {props.children}
    </AlertContext.Provider>
  );
}
export default AlertProvider;
