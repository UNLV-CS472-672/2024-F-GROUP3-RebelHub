"use client";
import { useState, useEffect } from "react";
import styles from "./Clubs.module.css";
import api from "../../utils/api";
import { getFilterHubsUrl, getHubTagsUrl } from "@/utils/url-segments";
import ClubList from "./ClubList.js"
import HubTagButtons from "../FilterButtons/HubTagButtons.js";

const Clubs = () => {
    const [hubs, setHubs] = useState([]);
    const [tags, setTags] = useState([]);
    // Fetches hubs with club tag from API
    useEffect(() => {
        console.log("Fetching initial clubs...");
        const fetchInitialClubs = async () => {
            try {
                const response = await api.get(getFilterHubsUrl(['Club'], 'top'));
                setHubs(response.data);
                console.log(response.data);
                console.log("Successful fetch");
            } catch (error) { console.log("Error fetching clubs: ", error); }
        };
        fetchInitialClubs();
        const fetchHubTags = async () => {
            try {
                const response = await api.get(getHubTagsUrl());
                let names = response.data.map(hub_tag => hub_tag.name);
                names = names.filter(tag => tag !== 'Club');
                console.log(names);
                setTags(names);
            } catch (error) { console.log("Error fetching hub tags: ", error); }
        };
        fetchHubTags();
    }, []);

    return (
        <main className={styles.mainContent}>
            <header className={styles.header}>
                <h1 style={{ marginBottom: '2vh' }}>Clubs</h1>
                <HubTagButtons hubs={hubs} setHubs={setHubs} tags={tags} setTags={setTags}/>
            </header>
            <section className={styles.clubsContainer}>
                <ClubList hubs={hubs}/>
            </section>
        </main>
    );
};

export default Clubs;
