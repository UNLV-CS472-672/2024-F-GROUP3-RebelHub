import { useState, useEffect } from "react";
import api from "./api";

// Returns a list of hubs that the current user is moderating / owning
const fetchHubs = async () => {
  // Fetch hubs from api
  try {
    const response = await api.get("/api/hubs/modding/");
    const response2 = await api.get("/api/hubs/owned/");
    // Combine hubs that the user owns and the user is a moderator of. 
    // Note: A user cannot be both an owner and a moderator of the same hub
    return[...response.data, ...response2.data];
  } catch (error) {
    console.error("Error fetching modded hubs: ", error);
    return [];
  } 
}

// Returns a list of IDs of hubs that the current user is moderating / owning
const fetchHubsIDs = async () => {
  // Fetch hubs from api
  try {
    const hubs = await fetchHubs();
    return hubs.map(hub => hub.id);
  } catch (error) {
    console.error("Error fetching modded hubs' IDs: ", error);
    return [];
  }
}

/// Returns a boolean representing if the current user has mod/owner privileges when viewing an event/post/etc...
const checkHubPrivileges = async (hub_id) => {
  const hubsModding = await fetchHubsIDs();
  return hubsModding.includes(hub_id);
}

// Returns a boolean representing if the current user is the author of an event/post/etc...
const checkAuthorPrivileges = async (author) => {
  try {
    const response = await api.get("/api/users/currentUser");
    return(response.data.id == author);
  } catch (error) {
    console.log("Error retrieving current user: ", error);
  }
}

export {fetchHubsIDs, fetchHubs, checkHubPrivileges, checkAuthorPrivileges};