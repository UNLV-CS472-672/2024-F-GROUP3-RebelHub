"use client";
import { useState, useEffect } from "react";
import styles from "./Hubs.module.css";
import api from "../../utils/api.js";
import { getFilterHubsUrl, getHubTagsUrl } from "@/utils/url-segments";
import HubList from "./HubList.js"
import FilterHubButtons from "../FilterButtons/FilterHubButtons.js";

const Hubs = () => {
    const [hubs, setHubs] = useState([]);
    // Fetches hubs from api
    useEffect(() => {
        console.log("Fetching initial Hubs...");
        const fetchInitialHubs = async () => {
            try {
                const response = await api.get(getFilterHubsUrl(null, 'top'));
                setHubs(response.data);
                console.log(response.data);
                console.log("Successful fetch");
            } catch (error) { console.log("Error fetching hubs: ", error); }
        };
        fetchInitialHubs();
    }, []);

    return (
        <main>
            <header className={styles.header}>
                <h1 style={{ marginBottom: '2vh' }}>Hubs</h1>
                <FilterHubButtons hubs={hubs} setHubs={setHubs}/>
            </header>
            <section>
                <HubList hubs={hubs}/>
            </section>
        </main>
    );
};

export default Hubs;
