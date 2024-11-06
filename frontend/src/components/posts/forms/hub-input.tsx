"use client";

import { FC, useEffect, useState } from "react";
import styles from "../posts.module.css";
import { getHubsJoinedURL } from "@/utils/url-segments";
import api from "@/utils/api";
import { Hub } from "@/utils/posts/definitions";
import { useFormContext } from "react-hook-form";

// Creates a list of hubs in a dropdown menu based on the user's subscribed hubs.
// It will instead display a message if there are no hubs found.
const HubInput: FC = () => {
    const [hubs, setHubs] = useState<Hub[]>([]);
    const { register } = useFormContext();

    useEffect(() => {
        const getHubs = async () => {
            try {
                console.log("Getting hubs for user");
                const response = await api.get(getHubsJoinedURL());

                if(response.status == 200) {
                    console.log("Got hubs list");
                    setHubs(response.data);
                }
                
            } catch (error) {
                console.log("Error getting hubs " + error);
            }
        };

        getHubs();
    }, []);

    return (
        <div className={styles.createPostInputContainer}>
            <div>
                <h2>
                    Hub to Post
                </h2>
            </div>
            <div>
                {hubs.length > 0 ? (
                    <>
                        <label htmlFor="hub_id">Choose a hub for your post: </label>
                        <select {...register("hub_id")} id="hub_id" name="hub_id">
                            {
                                hubs.map((hub) => (
                                    <option key={hub.id} value={hub.id}>{hub.name}</option>
                                ))
                            }
                        </select>
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
