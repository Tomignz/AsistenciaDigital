import { useState } from "react";

const TestButton = () => {
  const [clicked, setClicked] = useState(false);

  return (
    <div className="text-center p-4">
      <button
        onClick={() => setClicked(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Presioname
      </button>

      {clicked && <p>¡El botón funciona!</p>}
    </div>
  );
};

export default TestButton;
