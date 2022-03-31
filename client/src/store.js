import create from "zustand";
import Cookies from "js-cookie";
import { getPatterns } from "./service/patternService";

export const useStore = create((set) => ({
  user: {
    username: Cookies.get("username") || "",
    avatar: Cookies.get("avatar") || "",
  },
  isLoggedIn: !!Cookies.get("username"),
  globalAlert: {
    type: "",
    message: "",
    show: false,
  },
  globalLoading: false,
  patterns: [],
  patternUploadFields: [
    {
      name: "beatmapUrl",
      label: "Map Link",
      id: "beatmapUrl",
    },
    {
      name: "imageUrl",
      label: "Image Link",
      id: "imageUrl",
    },
    {
      name: "osuTimestamps",
      label: "Timestamps",
      id: "osuTimestamps",
    },
    {
      name: "description",
      label: "Description",
      id: "description",
      multiline: true,
      maxRows: 20,
    },
  ],
  fetchInitialPatterns: async () => {
    const patterns = await getPatterns();
    set(() => ({ patterns }));
  },
  setGlobalAlert: (type, message) => {
    set(() => ({
      globalAlert: {
        type,
        message,
        show: true,
      },
    }));
  },
  clearGlobalAlert: () => {
    set(() => ({
      globalAlert: {
        type: "",
        message: "",
        show: false,
      },
    }));
  },
  setGlobalLoading: () => {
    set(() => ({
      globalLoading: {
        show: true,
      },
    }));
  },
  clearGlobalLoading: () => {
    set(() => ({
      globalLoading: {
        show: false,
      },
    }));
  },
}));
