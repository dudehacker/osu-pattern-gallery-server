import { routes } from "./api";
import axios from "axios";

// Get pattern by id
const getPattern = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(routes.pattern + `/${id}`)
      .then((res) => resolve(res.data))
      .catch((error) => {
        console.error(error);
        reject(false);
      });
  });
};

// Get all patterns
const getPatterns = (query) => {
  console.log(query)
  return new Promise((resolve, reject) => {
    axios
      .post(routes.pattern+"/search", query.filters, {params: {
        page: query.page,
        limit: query.limit
      }})
      .then((res) => resolve(res.data))
      .catch((error) => {
        console.error(error);
        reject(false);
      });
  });
};

// Like a pattern
const changeLike = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .post(routes.pattern + `/${id}/like`)
      .then(async () => {
        const pattern = await getPattern(id);
        resolve(pattern);
      })
      .catch((error) => {
        console.error(error);
        reject(false);
      });
  });
};

// Dislike a pattern
const changeDislike = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .post(routes.pattern + `/${id}/dislike`)
      .then(async () => {
        const pattern = await getPattern(id);
        resolve(pattern);
      })
      .then(() => resolve(true))
      .catch(() => reject(false));
  });
};

export { changeLike, changeDislike, getPattern, getPatterns };
