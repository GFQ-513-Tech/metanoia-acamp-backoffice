const registerCheckout = async (id) => {
    const urlServer = `${urlAPIServer}/${registerCheckoutEndpoint}/${id}`;

    const response = await fetch(urlServer, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if(!response.ok) return {status: response.status};
    
    const data = await response.json();
    
    return {data, status: response.status};
}