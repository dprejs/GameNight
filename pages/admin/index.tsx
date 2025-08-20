import { FC, useEffect, useState } from "react";
import adminCSS from "./admin.module.css";
import axios from "axios";
import { Button, Modal } from "@mui/material";
import modalBoxStyle from "../../components/modalStyle";
import Box from "@mui/material/Box";
import convert from 'xml-js';
import GameCard from "../../components/gameCard";


const Admin: FC = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [gamesList, setGamesList] = useState([]);
  const [currentGame, setCurrentGame] = useState(0);
  const [searchIds, setSearchIds] = useState([]);
  const [moreSearchResults, setMoreSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchIndex, setSearchIndex] = useState(0);
  const [searchResults, setSearchResults] = useState([]);


  const bggSearch = async (search: string) => {
    const res = await axios.get(`https://www.boardgamegeek.com/xmlapi2/search?query=${search}&type=boardgame,boardgameexpansion&exact=0`)
    let ids = [];
    if (res.status === 429) {
      return [];
    } else {
      const jsonData = convert.xml2js(res.data);
      if (jsonData.elements[0].elements) {
        jsonData.elements[0].elements.forEach((element) => {
          ids.push(element.attributes.id);
        });
      } else {
        console.log("no elements: ", jsonData)
      }
      console.log(ids)
      return ids;
    }
  }

  const bggGetGame = async (id: string) => {
    console.log("getting item with id: ", id);
    const res = await axios.get(`https://www.boardgamegeek.com/xmlapi2/thing?id=${id}`)
    const resJSON = convert.xml2js(res.data).elements[0].elements[0];
    console.log(`item with id: ${id}---- \n`, resJSON)
    return resJSON;
  }
  const mergeData = (game, bggGame) => {
    let mergedGame = bggGame;
    mergedGame.image = bggGame.image_url;
    mergedGame.bggId = bggGame.id;
    mergedGame.id = game.id
    return mergedGame;
  }
  const formatRawSearch = (rawGame) => {
    let game = {
      id: rawGame.attributes.id,
      name: "",
      year_published: "",
      min_players: 0,
      max_players: 0,
      image_url: "/catan.png",
      min_playtime: 0,
      max_playtime: 0,
      description: "",
      min_age: 0
    }

    rawGame.elements.forEach((item) => {
      if (item.name === "name" && item.attributes.type === "primary") {
        game.name = item.attributes.value;
      } else if (item.name === "description") {
        game.description = item.elements[0].text;
      } else if (item.name === "yearpublished") {
        game.year_published = item.attributes.value;
      } else if (item.name === "minplayers") {
        game.min_players = item.attributes.value;
      } else if (item.name === "maxplayers") {
        game.max_players = item.attributes.value;
      } else if (item.name === "minplaytime") {
        game.min_playtime = item.attributes.value;
      } else if (item.name === "maxplaytime") {
        game.max_playtime = item.attributes.value;
      } else if (item.name === "image") {
        game.image_url = item.elements[0].text;
      } else if (item.name === "minage") {
        game.min_age = item.attributes.value;
      }
    })
    return game;
  }
  const formatGame = (id, bggId, game) => {
    console.log("format game input: ", game);
    return {
      id: id,
      bggId: bggId,
      image: game.elements.find((element) => element.name === "image").elements[0].text,
      thumbnail: game.elements.find((element) => element.name === "thumbnail").elements[0].text,
      yearPublished: game.elements.find((element) => element.name === "yearpublished").attributes.value,
      bggDescription: game.elements.find((element) => element.name === "description").elements[0].text,
    }
  }
  const parseGameCard = async (res, keep: boolean) => {
    const data = convert.xml2js(res.data).elements[0].elements
    let results = searchResults
    console.log("search results", data)
    if (keep) {
      results = [...results, ...data.map(formatRawSearch)]
      await setSearchResults([]);
      setSearchLoading(false);
    } else {
      results = data.map(formatRawSearch)
      // const resultsDiv = document.getElementsByClassName("searchResults")
      // resultsDiv[0].scrollTop = 0
    }
    setSearchResults(results);
  }
  const loadGame = async () => {
    if (gamesList.length < 1) {
      return
    }
    const game = gamesList[currentGame];
    console.log(game)
    const ids = await bggSearch(game.name);
    if (ids.length === 1) {
      console.log("one match")
      const formattedGame = formatGame(game.id, ids[0], await bggGetGame(ids[0]));
      axios.put("/../api/admin/gameImages", formattedGame);
      setCurrentGame(currentGame + 1);
    } else if (ids.length > 1) {
      if (ids.length > 10) {
        setMoreSearchResults(true);
        setSearchIndex(10);
        setSearchIds(ids);
      }
      const res = await axios.get(`https://www.boardgamegeek.com/xmlapi2/thing?id=${ids.slice(0, 10).toString()}`)
      parseGameCard(res, false);

    } else {
      console.log("no search results searching for: ", game.name);
      setCurrentGame(currentGame + 1);
    }
  }
  const submitCurrentGame = async (bggGame, game) => {
    console.log("submintting update")
    setCurrentGame(currentGame + 1);
    const res = await axios.put("/../api/admin/gameImages", mergeData(game, bggGame));
  }
  useEffect(() => {
    loadGame()
  }, [gamesList])
  const loadImages = async () => {
    handleOpen();
    console.log("getting games list....")
    const res = await axios.get("/../api/admin/gameImages");
    console.log(res.data)
    const games = res.data
    setGamesList(games);
  }
  useEffect(() => {
    loadGame()
  }, [currentGame])
  useEffect(() => {
    const selectedGame = gamesList[currentGame];
    console.log("selected game: ", selectedGame)
    console.log("search Results: ", searchResults);
    const matchIndex = searchResults.findIndex((game) => {
      return game.name === selectedGame.name;
    });
    if (matchIndex > 0) {
      const match = searchResults.splice(matchIndex, 1)[0];
      setSearchResults([match, ...searchResults])
      // searchResults.unshift(searchResults.splice(matchIndex, 1)[0]);
    }
  }, [searchResults])
  return (
    <div id={adminCSS.admin}>
      admin
      <button onClick={loadImages}>load images</button>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <div className={adminCSS.modal}>
          <div id={adminCSS.imageSelect}>
            <div>
              <h1>Current Game</h1>
              {gamesList.length ?
                <GameCard
                  key={gamesList[currentGame].id}
                  game={gamesList[currentGame]}
                  isLibraryOwner={false}
                />
                :
                "Games Loading ..."}
              <button onClick={() => {
                setCurrentGame(currentGame + 1);
              }}>
                Skip
              </button>
            </div>
            <div className={adminCSS.searchResults}>
              {searchResults.length ?
                searchResults.map((game) => {
                  return (
                    <GameCard
                      key={game.id}
                      game={game}
                      isLibraryOwner={true}
                      updateLibrary={() => { }}
                      updateList={() => { }}
                      mergeFunc={() => {
                        submitCurrentGame(game, gamesList[currentGame])
                      }}
                      isBulkUpdate={true}
                    />
                  )
                }) : null}
              {moreSearchResults ? <Button
                variant="outlined"
                onClick={(event) => {
                  event.preventDefault()
                  const newIndex = searchIndex + 10;
                  if (newIndex >= searchIds.length) {
                    setMoreSearchResults(false)
                  }
                  axios.get(`https://www.boardgamegeek.com/xmlapi2/thing?id=${searchIds.slice(searchIndex, newIndex).toString()}`)
                    .then((res) => parseGameCard(res, true))
                    .then(() => {
                      setSearchIndex(newIndex)
                    })
                    .catch((err) => {
                      console.log(err)
                    })
                }}
                color="inherit"
                className="iconButton"
              >
                More Results
              </Button> : null}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Admin;