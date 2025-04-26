export const getChapters = async(audioUrl: string) => {

    try {
      const response = await fetch("/api/chapters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audioUrl }),
      });

      const result = await response.json();

    } catch (error) {
      console.error("POST request failed", error);
    }
  }

  export const getEntities = async(audioUrl: string) => {
    try {
        const response = await fetch("/api/entities", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ audioUrl }),
        });
  
        const result = await response.json();
  
      } catch (error) {
        console.error("POST request failed", error);
      }

  }

 export const getSummary = async(audioUrl: string) => {
    try {
        const response = await fetch("/api/summary", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ audioUrl }),
        });
  
        const result = await response.json();
  
      } catch (error) {
        console.error("POST request failed", error);
      }
 } 