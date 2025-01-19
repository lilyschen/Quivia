export const createUser = async (userInfo, token) => {
    try {
        const response = await fetch("http://localhost:3000/create-user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ user: userInfo }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }

        return await response.json(); 
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};
