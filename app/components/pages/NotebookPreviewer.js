// components/NotebookViewer.js
import { useState, useEffect } from "react";

import dynamic from "next/dynamic";
const IpynbRenderer = dynamic(
  () => import("react-ipynb-renderer").then((mod) => mod.IpynbRenderer),
  {
    ssr: false,
  }
);
import "react-ipynb-renderer/dist/styles/monokai.css";

function NotebookPreviewer() {
  const [notebookData, setNotebookData] = useState(null);

  useEffect(() => {
    async function fetchNotebook() {
      try {
        const response = await fetch(
          "https://gateway.lighthouse.storage/ipfs/QmW6jCxt1MrBERjsKnGtYeyrKNcMTQCbnPqnYS53MFWFo2"
        );
        const data = await response.json();
        console.log(data);
        setNotebookData(data);
      } catch (error) {
        console.error("Error fetching notebook:", error);
      }
    }

    fetchNotebook();
  }, []);

  return (
    <div>
      {notebookData ? (
        <IpynbRenderer ipynb={notebookData} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default NotebookPreviewer;
