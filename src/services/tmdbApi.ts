import { tmdb } from "./tmdbClient";
import type { GenreResponse, MovieSummary, Paged } from "@/types/tmdb";

export const tmdbApi = {
  nowPlaying: (page = 1) => tmdb.get<Paged<MovieSummary>>("/movie/now_playing", { params: { page } }).then(r => r.data),
  popular: (page = 1) => tmdb.get<Paged<MovieSummary>>("/movie/popular", { params: { page } }).then(r => r.data),
  topRated: (page = 1) => tmdb.get<Paged<MovieSummary>>("/movie/top_rated", { params: { page } }).then(r => r.data),
  upcoming: (page = 1) => tmdb.get<Paged<MovieSummary>>("/movie/upcoming", { params: { page } }).then(r => r.data),

  // 검색(키워드)
  search: (query: string, page = 1) =>
    tmdb.get<Paged<MovieSummary>>("/search/movie", { params: { query, page, include_adult: false } }).then(r => r.data),

  genres: () => tmdb.get<GenreResponse>("/genre/movie/list").then(r => r.data),

  // 필터용(키워드 없이)
  discover: (params: Record<string, any>) =>
    tmdb.get<Paged<MovieSummary>>("/discover/movie", { params }).then(r => r.data),
};
