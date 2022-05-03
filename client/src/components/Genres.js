import React, { useState, useEffect } from 'react';
import axios from 'axios';

async function Genres() {
    try {
        const url = `http://localhost:4000/genres`;
        const data = await axios.get(url);
        console.log(data);
        // setBookDetailsData(data);
        // setLoading(false);
    } catch (e) {
        console.log(e);
    }

    return <div></div>;
}

export default Genres;
