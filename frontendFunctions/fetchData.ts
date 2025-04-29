export const getChapters = async (audioUrl: string) => {
  try {
    const response = await fetch("/api/chapters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audioUrl }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch chapters");
    }

    const data = await response.json();
    return data.chapters; // assume data is always array or throw in API itself
  } catch (error) {
    console.error("POST request failed", error);
    throw error; // rethrow to handle properly
  }
};

export const getEntities = async (audioUrl: string) => {
  try {
    const response = await fetch("/api/entities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audioUrl }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch entities");
    }

    const data = await response.json();
    return data.entities;
  } catch (error) {
    console.error("POST request failed", error);
    throw error;
  }
};

export const getSummary = async (audioUrl: string) => {
  try {
    const response = await fetch("/api/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audioUrl }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch summary");
    }

    const data = await response.json();
    return data.summary;
  } catch (error) {
    console.error("POST request failed", error);
    throw error;
  }
};
