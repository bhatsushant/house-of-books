import React from 'react';
import axios from 'axios';

const Genres = () => {
    async function fetch() {
        try {
            const url = `http://localhost:4000/genres`;
            const data = await axios.get(url);
            console.log(data);
            // setBookDetailsData(data);
            // setLoading(false);
        } catch (e) {
            console.log(e);
        }
    }
    fetch();

    return <div></div>;
};

export default Genres;
