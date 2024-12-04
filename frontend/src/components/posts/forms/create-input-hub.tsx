"use client";

import { FC, useEffect, useState } from "react";
import styles from "./create-input.module.css";
import { getJoinedHubsUrl } from "@/utils/url-segments";
import api from "@/utils/api";
import { Hub } from "@/utils/posts/definitions";
import { useFormContext } from "react-hook-form";

// Creates a list of hubs in a dropdown menu based on the user's subscribed hubs.
// It will instead display a message if there are no hubs found.
const HubInput: FC = () => {
    const [hubs, setHubs] = useState<Hub[]>([]);
    const [loading, setLoading] = useState(true);
    const [defaultHub, setDefaultHub] = useState(false);
    const { register } = useFormContext();

    useEffect(() => {
        const getHubs = async () => {
            try {
                console.log("Getting hubs for user");
                const response = await api.get(getJoinedHubsUrl());

                if(response.status == 200) {
                    console.log("Got hubs list");
                    setHubs(response.data);

                    if (localStorage.getItem("hubId") != null && (response.data.map((hub: Hub) => hub.id)).includes(parseInt(localStorage.getItem("hubId"))) ) {
                        setDefaultHub(true);
                    }

                    setLoading(false);
                }
                
            } catch (error) {
                console.log("Error getting hubs " + error);
            }
        };

        getHubs();
    }, []);

    return (
        <div className={styles.createInputContainer}>
            <div>
                <h2>
                    Hub to Post
                </h2>
            </div>
            <div>
                {hubs.length > 0 ? (
                    <>
                        <label htmlFor="hub_id">Choose a hub for your post: </label>
                        {!loading && defaultHub &&
                            <select {...register("hub_id")} id="hub_id" name="hub_id" defaultValue={localStorage.getItem("hubId")}>
                            {
                                hubs.map((hub) => (
                                    <option key={hub.id} value={hub.id}>{hub.name}</option>
                                ))
                            }
                            </select>
                        }
                        {!loading && !defaultHub &&
                            <select {...register("hub_id")} id="hub_id" name="hub_id">
                            {
                                hubs.map((hub) => (
                                    <option key={hub.id} value={hub.id}>{hub.name}</option>
                                ))
                            }
                            </select>
                        }
                    </>
                ) : (
                    <p>You are not a member in any hub. You cannot make a post.</p>
                )
                }
            </div>
        </div>
    );
}

export default HubInput;
