import create from "zustand";
import Cookies from "js-cookie";
import { getPatterns } from "./service/patternService";

const initialPatternSearch = {
  text:"",
  filters: {
    language:[],
    genre:[],
    keys:4,
    rating:[0, 10],
    bpm: [0, 500]
  },
  page: 0,
  limit: 25
};

export const useStore = create((set) => ({
  user: {
    username: Cookies.get("username") || "",
    avatar: Cookies.get("avatar") || "",
  },
  isLoggedIn: !!Cookies.get("username"),
  globalAlert: {
    type: "info",
    message: "",
    show: false,
  },
  globalLoading: false,
  patternFilters: {
    genre: ["Video Game","Anime","Rock","Pop","Novelty","Hip Hop","Electronic","Metal","Unspecified","Other"],
    language: ["English","Chinese","Japanese","Korean","Instrumental","Unspecified","Other"]
    // language: ["English","Chinese","French","German","Italian","Japanese","Korean","Spanish","Swedish","Russian","Polish","Instrumental","Unspecified","Other"]
  },
  patternSearch: initialPatternSearch,
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
    const patterns = await getPatterns(initialPatternSearch);
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
  setPatterns: (patterns) => {
    set(() => ({
      patterns: patterns,
    }));
  },
  setPatternSearch: (newVal) => {
    set(() => ({
      patternSearch: newVal,
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
