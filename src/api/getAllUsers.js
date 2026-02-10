const getAllUsers = async (params) => {
    try {
        var urlServer = '';
        params ? urlServer = `${urlAPIServer}/${userModule}?${params}` : urlServer = `${urlAPIServer}/${userModule}`;

        const response = await fetch(urlServer);
    
        if(!response.ok) return {status: response.status};
        
        const data = await response.json();
    
        return {data, status: response.status};
    } catch (error) {
        console.log(error);

        return {status: 500}
    }
}