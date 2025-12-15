import axios from "axios";

export const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  timeout: 10000,
});

tmdb.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem("TMDb-Key") || "";

  if (!apiKey) {
    return Promise.reject(
      new Error("TMDB API Key가 없습니다. 로그인 후 이용해 주세요.")
    );
  }

  config.params = {
    ...(config.params || {}),
    api_key: apiKey,
    language: "ko-KR",
  };
  return config;
});
