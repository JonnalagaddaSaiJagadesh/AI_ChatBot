export const fetchQueryData = async (query) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/query/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
  
      const data = await response.json();
      return data.response;  // Returns the query result
    } catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  };
  