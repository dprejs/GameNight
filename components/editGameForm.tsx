import React, { FC, useEffect, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import cssModule from "../styles/global.module.css";
import axios from 'axios';
import convert from 'xml-js';
import GameCard from './gameCard';
import { ExpandMoreRounded, CloseRounded, CasinoRounded } from '@mui/icons-material';
import { IconButton } from '@mui/material';


const EditForm: FC<any> = (props) => {
  const { game, handleClose, updateGameByIndex, removeGameById, addGameToList } = props;
  const [name, setName] = useState(game.name);
  const [minPlayers, setMinPlayers] = useState(game.min_players);
  const [maxPlayers, setMaxPlayers] = useState(game.max_players);
  const [bestPlayers, setBestPlayers] = useState(game.best_player_count);
  const [minPlaytime, setMinPlaytime] = useState(game.min_playtime);
  const [maxPlaytime, setMaxPlaytime] = useState(game.max_playtime);
  const [minAge, setMinAge] = useState(game.min_age);
  const [imgUrl, setImgUrl] = useState(game.image_url);
  const [customDesc, setCustomDesc] = useState(game.description);
  const [bggDesc, setBggDesc] = useState(game.bgg_description);
  const [type, setType] = useState("")
  const [gameTypes, setGameTypes] = useState(game.game_type);
  const [difficulty, setDifficulty] = useState(game.difficulty);
  const [bggId, setBggId] = useState(game.bgg_id);
  const [bggRating, setBggRating] = useState(game.bgg_rating);
  const [category, setCategory] = useState(game.category);
  const [isClassic, setIsClassic] = useState(game.is_classic);
  const [isCoop, setIsCoop] = useState(game.is_coop);
  const [isExpansion, setIsExpansion] = useState(game.is_expansion);
  const [isParty, setIsParty] = useState(game.is_party);
  const [searchInput, setSearchInput] = useState(game.name);
  const [searchLoading, setSearchLoading] = useState(false);
  const [exactSearch, setExactSearch] = useState(true);
  const [searchIds, setSearchIds] = useState([]);
  const [searchIndex, setSearchIndex] = useState(0);
  const [searchResults, setSearchResults] = useState([])
  const [moreSearchResults, setMoreSearchResults] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateResponse, setUpdateResponse] = useState("");
  const id = game.id;

  const formatGame = (rawGame) => {
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
      min_age: 0,
      best_players: "",
      bgg_rating: "",
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
      } else if (item.name === "poll-summary") {
        if (item.attributes.name === "suggested_numplayers") {
          item.elements.forEach((element) => {
            if (element.attributes.name === 'bestwith') {
              game.best_players = element.attributes.value
            }
          })
        }
      } else if (item.name === "statistics") {
        game.bgg_rating = item.elements[0].elements.find((elem) => elem.name === "average").attributes.value;
      }
    })
    return game;
  }

  const parseGameCards = (res, keep: boolean) => {
    const data = convert.xml2js(res.data).elements[0].elements
    let results = searchResults;
    if (keep) {
      results = [...results, ...data.map(formatGame)]
    } else {
      results = data.map(formatGame)
      const resultsDiv = document.getElementsByClassName("searchResults")
      resultsDiv[0].scrollTop = 0
    }
    setSearchLoading(false);
    setSearchResults(results);
  }

  const searchSubmit = (e) => {
    e.preventDefault();
    setSearchLoading(true);
    let exact = 0;
    if (exactSearch) {
      exact = 1;
    }
    axios.get(`https://www.boardgamegeek.com/xmlapi2/search?query=${searchInput}&type=boardgame,boardgameexpansion&exact=${exact}`)
      .then((res) => {
        let ids = {};
        convert.xml2js(res.data).elements[0].elements.forEach((element) => {
          ids[element.attributes.id] = true;
        })
        const idsArray = Object.keys(ids)
        setSearchIds(idsArray);
        if (idsArray.length > 20) {
          setMoreSearchResults(true)
          setSearchIndex(20)
        }
        axios.get(`https://www.boardgamegeek.com/xmlapi2/thing?id=${idsArray.slice(0, 20).toString()}&stats=1`)
          .then((res) => parseGameCards(res, false))
          .catch((err) => {
            console.log('error getting search details', err);
          })
      })
      .catch((err) => {
        console.log('error getting search results', err);
      });
  }

  const moreResults = (e) => {
    e.preventDefault();
    const newIndex = searchIndex + 20;
    if (newIndex >= searchIds.length) {
      setMoreSearchResults(false);
    }
    axios.get(`https://www.boardgamegeek.com/xmlapi2/thing?id=${searchIds.slice(searchIndex, newIndex).toString()}&stats=1`)
      .then((res) => parseGameCards(res, true))
      .then(() => {
        setSearchIndex(newIndex)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const saveGame = (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    const newGame = {
      id: game.id,
      name: name,
      description: customDesc,
      min_players: minPlayers,
      max_players: maxPlayers,
      min_playtime: minPlaytime,
      max_playtime: maxPlaytime,
      min_age: minAge,
      image_url: imgUrl,
      category: category,
      difficulty: difficulty,
      bgg_rating: bggRating,
      game_type: gameTypes,
      best_player_count: bestPlayers,
      is_classic: isClassic,
      is_coop: isCoop,
      is_party: isParty,
      is_expansion: isExpansion,
      bgg_id: bggId,
      bgg_description: bggDesc,
    }
    if (game.id) {
      axios.put('/api/library/updateGame', newGame)
        .then((res) => {
          setUpdateLoading(false)
          if (res.status === 200) {
            setUpdateResponse("sucess")
            updateGameByIndex(game.index, newGame);
          } else {
            setUpdateResponse("error")
            console.log("update failed", res.data);
          }
        })
        .catch((err) => {
          setUpdateLoading(false)
          setUpdateResponse("error")
          console.log("error updating game: ", err)
        })
    } else {
      axios.post('/api/library/addGame', newGame)
        .then((res) => {
          setUpdateLoading(false)
          if (res.status === 200) {
            setUpdateResponse('sucess')
            addGameToList(res.data);
            setTimeout(handleClose, 1000);
          } else {
            setUpdateResponse("error")
            console.log("update failed", res.data);
          }
        })
    }
  }

  const deleteGame = ((id) => {
    setUpdateLoading(true);
    axios.delete(`/api/library/removeGame?id=${id}`)
      .then((res) => {
        setUpdateLoading(false);
        if (res.status === 200) {
          setUpdateResponse('sucess')
          removeGameById(id);
          setTimeout(handleClose, 1000);
        } else {
          setUpdateResponse("error")
        }
      })
      .catch((err) => {
        setUpdateLoading(false)
        setUpdateResponse("error")
        console.log("error updating game: ", err)
      })
  })

  useEffect(() => {
    setUpdateResponse("");
  }, [props.game])

  return (
    <div className={cssModule.editGameModal}>
      <div className={cssModule.modalHeader}>
        <IconButton
          className='upperRight buttonHover'
          aria-label='close game search modal'
          onClick={handleClose}
          sx={{
            border: '1px solid black',
            borderRadius: '10px',
            padding: '2px',
            margin: '2px',
            backgroundColor: 'white',
            color: 'black'
          }}>
          <CloseRounded />
        </IconButton>
      </div>
      <div className={cssModule.modalBody}>
        <div className={cssModule.formColumn}>
          <div>
            <div className={cssModule.input}>
              <div>
                ID:  {id}
              </div>
              <div>
                BGG ID:  {bggId}
              </div>
            </div>
            <div className={cssModule.input}>
              Name
            </div>
            <input
              type='text'
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className={cssModule.formGroup}>
            <div className={cssModule.input}>
              <div>
                min players
              </div>
              <input
                type='number'
                className={cssModule.iS}
                value={minPlayers}
                onChange={e => setMinPlayers(Number(e.target.value))}
              />
            </div>
            <div className={cssModule.input}>
              <div>
                max players
              </div>
              <input
                type='number'
                className={cssModule.iS}
                value={maxPlayers}
                onChange={e => setMaxPlayers(Number(e.target.value))}
              />
            </div>
            <div className={cssModule.input}>
              <div>
                best players
              </div>
              <input
                type='text'
                value={bestPlayers}
                onChange={e => setBestPlayers(e.target.value)}
              />
            </div>
          </div>
          <div className={cssModule.formGroup}>
            <div className={cssModule.input}>
              <div>
                min playtime
              </div>
              <input
                type='number'
                className={cssModule.iS}
                value={minPlaytime}
                onChange={e => setMinPlaytime(Number(e.target.value))}
              />
            </div>
            <div className={cssModule.input}>
              <div>
                max playtime
              </div>
              <input
                type='number'
                className={cssModule.iS}
                value={maxPlaytime}
                onChange={e => setMaxPlaytime(Number(e.target.value))}
              />
            </div>
          </div>
          <div>
            <div className={cssModule.input}>
              <div>
                min age
              </div>
              <input
                type='number'
                className={cssModule.iS}
                value={minAge}
                onChange={e => setMinAge(Number(e.target.value))}
              />
            </div>
          </div>
          <div>
            <div className={cssModule.input}>
              <div>
                image url
              </div>
              <input
                type='text'
                value={imgUrl}
                onChange={e => setImgUrl(e.target.value)}
              />
            </div>
          </div>
          <div className={cssModule.input}>
            <div>
              custom description
            </div>
            <textarea
              value={customDesc}
              onChange={e => setCustomDesc(e.target.value)}
            />
          </div>
          <div className={cssModule.input}>
            <div>
              bgg description
            </div>
            <textarea
              value={bggDesc}
              onChange={e => setBggDesc(e.target.value)}
            />
          </div>
          <div>
            <div className={cssModule.input}>
              <div>
                game types:
              </div>
              <input
                type='text'
                value={type}
                onChange={e => setType(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setGameTypes([...gameTypes, type])
                    setType('')
                  }
                }}
              />
              <div className={cssModule.typeGroup}>
                {gameTypes && gameTypes.constructor === Array ? gameTypes.map((type, i) => {
                  return (
                    <div className={cssModule.typeCard}>
                      {type}
                      <button
                        onClick={() => {
                          setGameTypes([...gameTypes.slice(0, i), ...gameTypes.slice(i + 1)])
                        }}>
                        X
                      </button>
                    </div>
                  )
                }) : null}
              </div>
            </div>
            <div className={cssModule.input}>
              <div>
                Location:
              </div>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value={"Lighter"}>Lighter</option>
                <option value={"Standard"}>Standard</option>
                <option value={"Advanced"}>Advanced</option>
                <option value={"Classic"}>Classic</option>
                <option value={"Party"}>Party</option>
                <option value={"Co-Op"}>Co-Op</option>
                <option value={"2-Player"}>2-Player</option>
              </select>
            </div>
          </div>
          <div className={cssModule.input}>
            <div>
              Categories:
            </div>
            <div className={cssModule.formGroup}>
              <div>
                <div>
                  Classic?
                </div>
                <input
                  type='checkbox'
                  checked={isClassic}
                  onChange={e => setIsClassic(e.target.checked)}
                />
              </div>
              <div>
                <div>
                  Co-Op?
                </div>
                <input
                  type='checkbox'
                  checked={isCoop}
                  onChange={e => setIsCoop(e.target.checked)}
                />
              </div>
              <div>
                <div>
                  Party?
                </div>
                <input
                  type='checkbox'
                  checked={isParty}
                  onChange={e => setIsParty(e.target.checked)}
                />
              </div>
              <div>
                <div>
                  Expansion?
                </div>
                <input
                  type='checkbox'
                  checked={isExpansion}
                  onChange={e => setIsExpansion(e.target.checked)}
                />
              </div>
            </div>
          </div>
          <div>
            <div className={cssModule.input}>
              <div>
                difficulty:
              </div>
              <input
                type='text'
                className={cssModule.iS}
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
              />
            </div>
          </div>
          <div className={cssModule.input}>
            <div>
              BGG Rating:
            </div>
            <input
              type='text'
              className={cssModule.iS}
              value={bggRating}
              onChange={e => setBggRating(e.target.value)}
            />
          </div>
        </div>
        <div className={cssModule.divider} />
        <div>
          <GameCard
            game={{
              name: name,
              min_players: minPlayers,
              max_players: maxPlayers,
              best_players: bestPlayers,
              min_playtime: minPlaytime,
              max_playtime: maxPlaytime,
              min_age: minAge,
              image_url: imgUrl,
              description: customDesc,
              bgg_description: bggDesc,
              game_types: gameTypes,
              difficulty: difficulty,
              bgg_rating: bggRating,
              bgg_id: bggId,
              category: category,
              is_coop: isCoop,
              is_classic: isClassic,
              is_expansion: isExpansion,
              is_party: isParty,
            }}
          />
        </div>
        <div className={cssModule.divider} />
        <div className={cssModule.searchColumn}>
          <div className={cssModule.searchHeader}>
            <h2 className="search-header">
              <span >
                Search for Game
              </span>
              <span>
                <CasinoRounded />
              </span>
            </h2>
            <input
              type='text'
              value={searchInput}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  searchSubmit(e)
                }
              }}
              onChange={e => setSearchInput(e.target.value)}
            />
            <div className={cssModule.inputH}>
              <div>Exact Search?</div>
              <input
                type='checkbox'
                checked={exactSearch}
                onChange={e => setExactSearch(e.target.checked)}
              />
            </div>
            <Button onClick={searchSubmit} className='iconButton'>submit</Button>
          </div>
          <div className='searchResults'>
            {searchLoading ? <CircularProgress color='secondary' thickness={10} /> : null}
            {searchResults.map((game) => <GameCard
              key={game.id}
              game={game}
              isLibraryOwner={true}
              isBulkUpdate={true}
              mergeFunc={() => {
                setName(game.name);
                setMinPlayers(game.min_players);
                setMaxPlayers(game.max_players);
                setMinPlaytime(game.min_playtime);
                setMaxPlaytime(game.max_playtime);
                setMinAge(game.min_age);
                setImgUrl(game.image_url);
                setBggDesc(game.description);
                setBggId(game.id);
                setBestPlayers(game.best_players);
                setBggRating(game.bgg_rating);
              }}
            />)}
            {moreSearchResults ?
              <Button
                endIcon={<ExpandMoreRounded />}
                onClick={moreResults}
                color='inherit'
                className='iconButton'>
                More Results
              </Button> : null}
          </div>
        </div>
      </div>
      <div className={cssModule.modalFooter}>
        <Button
          className='iconButton'
          onClick={saveGame}
        >
          {game.id ? "save changes" : "add game"}
        </Button>
        {game.id ?
          <Button
            className='iconButton'
            onClick={() => deleteGame(game.id)}
          >
            delete game
          </Button>
          : null}
      </div>
      <div className={cssModule.updateRes}>
        {updateLoading ? <CircularProgress color='secondary' thickness={10} /> : null}
        {updateResponse.length && !updateLoading ?
          <div className={updateResponse === "sucess" ? cssModule.updateResGood : cssModule.updateResBad}>
            {updateResponse === "sucess" ? "Game Updated Sucessful" : "Error Updating Game"}
          </div>
          : null}
      </div>
    </div>
  )
}

EditForm.defaultProps = {
  game: {
    game_type: [],
    name: '',
    min_players: 0,
    max_players: 0,
    best_players: '',
    min_playtime: 0,
    max_playtime: 0,
    min_age: 0,
    image_url: '',
    description: '',
    bgg_description: '',
    difficulty: '',
    bgg_id: '',
    category: '',
    is_classic: false,
    is_coop: false,
    is_expansion: false,
    is_party: false,
  }
}

export default EditForm;