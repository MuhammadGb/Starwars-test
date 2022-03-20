import React, { useEffect, useState, useCallback } from "react";
import logo from "./assets/images/logo.png";
import CharacterDetails from "./components/CharacterDetails";
import CrawlIntro from "./components/CrawlIntro";
import Loader from "./components/Loader";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useQuery } from "react-query";
import axios from "axios";

const URL = "https://swapi.dev/api/";

const http = axios.create({
  baseURL: URL,
  timeout: 50000,
});

const App = () => {
  const {
    data: movies,
    isLoading: isMoviesLoading,
    error: moviesError,
  } = useQuery(["movies"], () => getMovies(), {
    refetchOnWindowFocus: false,
  });

  const {
    data: characters,
    isLoading: isCharactersLoading,
    error: charactersError,
  } = useQuery(["characters"], () => getAllCharacters(), {
    refetchOnWindowFocus: false,
  });
  const [movieUrl, setMovieUrl] = useState("");
  const [movieChoice, setMovieChoice] = useState();
  const [movieCast, setMovieCast] = useState([]);

  const getMovies = async () => {
    try {
      const res = await http.get("films");
      return res.data.results;
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCharacters = (
    progress,
    url = "https://swapi.dev/api/people",
    characters = [],
  ) => {
    return new Promise(async (resolve, reject) => {
      const res = await axios.get(url).catch(reject);
      if (res.status !== 200)
        throw new Error(`${res.status}: ${res.statusText}`);
      const { data } = res;
      characters = characters.concat(data.results);
      if (data.next) {
        progress && progress(characters);
        getAllCharacters(progress, data.next, characters)
          .then(resolve)
          .catch(reject);
      } else {
        resolve(characters);
      }
    });
  };

  const onChange = (event, option) => {
    setMovieUrl(event.target.value);
  };

  const filterMovie = useCallback(
    (url) => {
      if (!movies) return;
      const currMovie = movies.find((movie) => movie.url === url);
      setMovieChoice(currMovie);
    },
    [movies],
  );

  const filterCharacters = useCallback(
    (movieUrl) => {
      if (!movieUrl) return;
      const newChar = characters.filter(
        (char) => !char.films.includes(movieUrl),
      );
      setMovieCast(newChar);
    },
    [characters],
  );

  useEffect(() => {
    filterMovie(movieUrl);
    filterCharacters(movieUrl);
  }, [movieUrl, filterCharacters, filterMovie]);

  if (isMoviesLoading || isCharactersLoading) return <Loader />;
  if (moviesError || charactersError) return <p>An error occured</p>;

  return (
    <div className="App">
      {!isMoviesLoading && !isCharactersLoading && (
        <Box sx={{ width: 221, backgroundColor: "black" }}>
          <FormControl
            sx={{ color: "yellow", backgroundColor: "black" }}
            fullWidth
          >
            <Select
              value={movieUrl}
              inputProps={{ "aria-label": "Without label" }}
              sx={{
                color: "yellow",
                backgroundColor: "black",
                border: "2px solid yellow",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "& .Mui-disabled .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
              onChange={onChange}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {movies.map((option, id) => {
                return (
                  <MenuItem
                    sx={{
                      color: "yellow",
                      backgroundColor: "black",
                      "&:focus": { color: "black", backgroundColor: "yellow" },
                      "&:hover": { color: "black", backgroundColor: "yellow" },
                    }}
                    key={id}
                    value={option.url}
                  >
                    {option.title}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>
      )}
      {movieChoice ? (
        <CrawlIntro
          title={movieChoice.title}
          text={movieChoice.opening_crawl}
        />
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={logo} alt="star wars" height="300px" />
        </Box>
      )}
      <CharacterDetails characters={movieCast} />
    </div>
  );
};

export default App;
